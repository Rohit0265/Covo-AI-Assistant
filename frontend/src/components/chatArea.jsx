import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/axios';

const ChatArea = ({
  activeConversationId,
  activeConversationTitle,
  onSelectConversation,
  onNewChat,
  onConversationCreated
}) => {
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Fetch messages when activeConversationId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversationId) {
        setMessages([]);
        return;
      }
      try {
        setFetchingMessages(true);
        const { data } = await api.get(`/api/chat/get-messages/${activeConversationId}`);
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setFetchingMessages(false);
      }
    };

    fetchMessages();
  }, [activeConversationId]);

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

    let convId = activeConversationId;

    // If no active conversation exists, create one first
    if (!convId) {
      try {
        const { data: newConv } = await api.get('/api/chat/create-conversation');
        if (newConv && newConv._id) {
          convId = newConv._id;
          // Notify parent to register this new conversation in the sidebar
          if (onConversationCreated) {
            onConversationCreated(newConv);
          } else if (onSelectConversation) {
            onSelectConversation(newConv._id);
          }
        }
      } catch (err) {
        console.error('Failed to create new conversation:', err);
      }
    }

    const optimisticUserMessage = {
      _id: `temp-${Date.now()}`,
      conversationId: convId,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);
    setInputPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      setLoading(true);
      const { data } = await api.post('/api/agent/chat', {
        prompt: text,
        conversationId: convId
      });

      const responseContent =
        data?.response ||
        (typeof data === 'string' ? data : "I'm CortexAI. How can I assist you further?");

      const assistantMessage = {
        _id: `resp-${Date.now()}`,
        conversationId: convId,
        role: 'assistant',
        content: responseContent,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Agent chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          _id: `err-${Date.now()}`,
          conversationId: convId,
          role: 'assistant',
          content: 'Sorry, I encountered an issue communicating with the AI agent. Please ensure backend services are active.',
          createdAt: new Date().toISOString()
        }
      ]);
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
                    <div className="bg-[#1a1b22] text-zinc-200 border border-zinc-800/80 px-5 py-4 rounded-2xl rounded-tl-xs text-sm max-w-[85%] leading-relaxed shadow-sm break-words whitespace-pre-wrap">
                      {msg.content}
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
        <div className="max-w-4xl mx-auto bg-[#181920] border border-zinc-800/80 rounded-2xl p-3 flex flex-col gap-2 shadow-2xl focus-within:border-zinc-700 transition-colors">
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
