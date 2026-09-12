import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../utils/axios';

// Helper to generate concise 3-4 word title from prompt
const generateTitle = (text) => {
  if (!text) return 'New Chat';

  let cleaned = text
    .trim()
    .replace(/^(can you|could you|please|help me|how do i|how to|why am i|build me a|create a|explain how|explain|what is|how does|i want to|can i|write a)\s+/i, '')
    .replace(/[^\w\s.-]/g, '');

  const words = cleaned.split(/\s+/).filter(Boolean);

  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'using', 'my', 'your', 'is', 'it', 'this', 'that', 'getting', 'works', 'how', 'why', 'what'
  ]);

  let filtered = words.filter((w) => !stopWords.has(w.toLowerCase()));
  if (filtered.length < 2) {
    filtered = words;
  }

  const chosen = filtered.slice(0, 4).map((w) => {
    if (w === w.toUpperCase() && w.length <= 5) return w;
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  });

  return chosen.join(' ') || 'New Chat';
};

const ChatArea = ({
  activeConversationId,
  setActiveConversationId,
  activeConversationTitle,
  onSelectConversation,
  onNewChat,
  onConversationCreated,
  conversations = [],
  setConversations
}) => {
  const [selectedMode, setSelectedMode] = useState('auto');
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const modeOptions = [
    {
      key: 'auto',
      label: 'Auto',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      key: 'chat',
      label: 'Chat',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      key: 'coding',
      label: 'Coding',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    },
    {
      key: 'pdf',
      label: 'PDF',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    },
    {
      key: 'ppt',
      label: 'PPT',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
    },
    {
      key: 'image',
      label: 'Image',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    },
    {
      key: 'search',
      label: 'Search',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      )
    }
  ];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load messages when activeConversationId changes
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    const currentConv = conversations?.find(
      (c) => (c._id || c.id) === activeConversationId
    );

    if (currentConv && Array.isArray(currentConv.messages) && currentConv.messages.length > 0) {
      setMessages(currentConv.messages);
      return;
    }

    const fetchMessages = async () => {
      try {
        setFetchingMessages(true);
        const { data } = await api.get(`/api/chat/get-messages/${activeConversationId}`);
        if (Array.isArray(data)) {
          setMessages(data);
          if (setConversations) {
            setConversations((prev) =>
              prev.map((c) =>
                (c._id || c.id) === activeConversationId ? { ...c, messages: data } : c
              )
            );
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setFetchingMessages(false);
      }
    };

    fetchMessages();
  }, [activeConversationId, conversations]);

  // Auto resize textarea
  const handleInputChange = (e) => {
    setInputPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  // Send message to agent
  const handleSendMessage = async (promptToSend) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || loading) return;

    setInputPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };

    let targetConvId = activeConversationId;

    if (!targetConvId) {
      // 1. DYNAMICALLY CREATE NEW CONVERSATION WITH FIRST MESSAGE
      targetConvId = `conv-${Date.now()}`;
      const generatedTitle = generateTitle(text);

      const newConversation = {
        _id: targetConvId,
        id: targetConvId,
        title: generatedTitle,
        messages: [userMessage],
        createdAt: new Date().toISOString()
      };

      setMessages([userMessage]);

      if (onConversationCreated) {
        onConversationCreated(newConversation);
      } else if (setConversations) {
        setConversations((prev) => [newConversation, ...prev]);
      }

      if (setActiveConversationId) {
        setActiveConversationId(targetConvId);
      }
    } else {
      // 2. APPEND TO EXISTING ACTIVE CONVERSATION
      setMessages((prev) => [...prev, userMessage]);

      if (setConversations) {
        setConversations((prev) =>
          prev.map((c) => {
            if ((c._id || c.id) === targetConvId) {
              const updatedMessages = [...(c.messages || []), userMessage];
              return { ...c, messages: updatedMessages };
            }
            return c;
          })
        );
      }
    }

    // 3. GENERATE ASSISTANT RESPONSE
    try {
      setLoading(true);
      let responseContent = '';

      try {
        const { data } = await api.post('/api/agent/chat', {
          prompt: text,
          conversationId: targetConvId,
          agent: selectedMode
        });
        responseContent =
          data?.response ||
          (typeof data === 'string' ? data : "I'm CortexAI. How can I assist you further?");
      } catch (err) {
        console.warn('Agent API unreachable or offline, using assistant response:', err);
        responseContent = `I have received your request for: "${text}". How can I help you further?`;
      }

      const assistantMessage = {
        _id: `resp-${Date.now()}`,
        conversationId: targetConvId,
        role: 'assistant',
        content: responseContent,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (setConversations) {
        setConversations((prev) =>
          prev.map((c) => {
            if ((c._id || c.id) === targetConvId) {
              const updatedMessages = [...(c.messages || []), assistantMessage];
              return { ...c, messages: updatedMessages };
            }
            return c;
          })
        );
      }
    } catch (error) {
      console.error('Agent chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestionPrompts = [
    { title: 'Explain quantum computing', desc: 'in simple and intuitive terms' },
    { title: 'Write a React component', desc: 'with clean hooks and Tailwind CSS' },
    { title: 'Analyze system architecture', desc: 'for a scalable AI microservice app' },
    { title: 'Brainstorm creative ideas', desc: 'for a new autonomous agent project' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0e0f14] text-zinc-100 overflow-hidden relative select-none">
      {/* Top Header Bar */}
      <div className="h-14 shrink-0 border-b border-zinc-800/80 px-6 flex items-center justify-between bg-[#111218]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-zinc-100 truncate max-w-xs sm:max-w-md">
            {activeConversationTitle || 'New Chat'}
          </span>
          <span className="bg-[#1b1c24] text-zinc-400 border border-zinc-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
            {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
          </span>
        </div>

        {onNewChat && (
          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800/70 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            <span>New Chat</span>
          </button>
        )}
      </div>

      {/* Main Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
        {fetchingMessages ? (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              <span>Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          /* Empty / Welcome State */
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12 px-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-600 flex items-center justify-center shadow-xl shadow-purple-950/40 mb-6">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              Welcome to CortexAI
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
              Your intelligent AI assistant powered by autonomous multi-agent systems. Ask questions, brainstorm solutions, or generate code.
            </p>

            {/* Quick Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestionPrompts.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(item.title)}
                  className="flex flex-col text-left p-3.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700 transition cursor-pointer group shadow-sm"
                >
                  <span className="text-xs font-semibold text-zinc-200 group-hover:text-purple-300 transition">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400 transition mt-0.5">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="max-w-4xl mx-auto space-y-6 w-full">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg._id || index}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {isUser ? (
                    /* User Message Pill */
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs text-sm max-w-[80%] sm:max-w-md shadow-md shadow-purple-950/20 break-words leading-relaxed">
                      {msg.content}
                    </div>
                  ) : (
                    /* Assistant Message Card */
                    <div className="bg-[#1a1b22] text-zinc-200 border border-zinc-800/80 px-5 py-4 rounded-2xl rounded-tl-xs text-sm max-w-[85%] leading-relaxed shadow-sm break-words">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match && !String(children).includes('\n');
                            return !isInline ? (
                              <div className="my-3 rounded-lg overflow-hidden border border-zinc-800 bg-[#0d0e12]">
                                <div className="bg-zinc-900/90 px-4 py-1.5 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                                  <span className="capitalize">{match ? match[1] : 'code'}</span>
                                </div>
                                <pre className="p-4 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed">
                                  <code>{children}</code>
                                </pre>
                              </div>
                            ) : (
                              <code className="bg-zinc-800/80 text-purple-300 px-1.5 py-0.5 rounded text-xs font-mono">
                                {children}
                              </code>
                            );
                          },
                          p({ children }) {
                            return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
                          },
                          ul({ children }) {
                            return <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>;
                          },
                          ol({ children }) {
                            return <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>;
                          },
                          a({ children, href }) {
                            return (
                              <a href={href} target="_blank" rel="noreferrer" className="text-purple-400 underline hover:text-purple-300">
                                {children}
                              </a>
                            );
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading / Generating indicator */}
            {loading && (
              <div className="flex justify-start w-full">
                <div className="bg-[#1a1b22] border border-zinc-800/80 px-4 py-3 rounded-2xl rounded-tl-xs flex items-center gap-2">
                  <span className="text-xs text-zinc-400">CortexAI is thinking</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Input Area */}
      <div className="shrink-0 px-4 pb-5 pt-2 bg-gradient-to-t from-[#0e0f14] via-[#0e0f14] to-transparent">
        <div className="max-w-4xl mx-auto bg-[#181920] border border-zinc-800/80 rounded-2xl p-3 flex flex-col gap-2.5 shadow-2xl focus-within:border-zinc-700 transition-colors">
          {/* Mode Pill Selectors Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar select-none">
            {modeOptions.map((item) => {
              const isSelected = selectedMode === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedMode(item.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-purple-950/40 border border-purple-400/30'
                      : 'bg-[#22232c]/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <textarea
            ref={textareaRef}
            value={inputPrompt}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask anything..."
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none resize-none min-h-[36px] max-h-36 leading-relaxed px-1"
          />

          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40">
            <div className="flex items-center gap-1 text-zinc-400">
              <button
                type="button"
                className="p-1.5 hover:text-zinc-200 hover:bg-zinc-800/80 rounded-lg transition cursor-pointer"
                title="Attach file"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              <button
                type="button"
                className="p-1.5 hover:text-zinc-200 hover:bg-zinc-800/80 rounded-lg transition cursor-pointer"
                title="Voice input"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputPrompt.trim() || loading}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                inputPrompt.trim() && !loading
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-purple-950/30 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <svg className="w-4 h-4 transform rotate-45 -translate-y-0.5 -translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
