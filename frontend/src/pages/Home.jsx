import React, { useState, useEffect } from 'react';
import { googleProvider, auth } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import SideBar from '../components/sideBar';
import ChatArea from '../components/chatArea';
import Artifacts from '../components/artifacts';
import api from '../utils/axios';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const Home = () => {
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);

  const userData = useSelector((state) => state.user.userData);

  // Fetch all user conversations upon login / user load and load from localStorage
  const fetchConversations = async () => {
    // 1. Immediately load local stored conversations to prevent disappearing on refresh
    const localData = localStorage.getItem('cortex_conversations');
    const savedActiveId = localStorage.getItem('cortex_active_conv_id');
    let loadedFromLocal = false;

    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConversations(parsed);
          loadedFromLocal = true;
          if (savedActiveId && parsed.some((c) => (c._id || c.id) === savedActiveId)) {
            setActiveConversationId(savedActiveId);
          } else {
            setActiveConversationId(parsed[0]._id || parsed[0].id);
          }
        }
      } catch (e) {
        console.error('Error reading saved conversations from local storage:', e);
      }
    }

    if (!userData?._id && !userData?.id) return;

    try {
      setLoadingChats(true);
      const { data } = await api.get('/api/chat/get-conversations');
      if (Array.isArray(data) && data.length > 0) {
        setConversations((prev) => {
          const map = new Map();
          // Keep local first (to preserve messages)
          prev.forEach((c) => map.set(c._id || c.id, c));
          data.forEach((c) => {
            const id = c._id || c.id;
            const existing = map.get(id);
            map.set(id, {
              ...c,
              messages: existing?.messages && existing.messages.length > 0 ? existing.messages : (c.messages || [])
            });
          });
          const merged = Array.from(map.values());
          localStorage.setItem('cortex_conversations', JSON.stringify(merged));
          return merged;
        });

        if (!loadedFromLocal) {
          setActiveConversationId(data[0]._id || data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations from backend:', error);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userData?._id, userData?.id]);

  // Persist conversations to local storage whenever state changes
  useEffect(() => {
    if (conversations && conversations.length > 0) {
      localStorage.setItem('cortex_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Persist active conversation ID
  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('cortex_active_conv_id', activeConversationId);
    } else {
      localStorage.removeItem('cortex_active_conv_id');
    }
  }, [activeConversationId]);

  // Click New Chat: clears current active chat state without creating empty entry in sidebar
  const handleNewChat = () => {
    setActiveConversationId(null);
    localStorage.removeItem('cortex_active_conv_id');
  };

  // Called when a new conversation is created with its initial message
  const handleConversationCreated = (newConv) => {
    if (newConv && (newConv._id || newConv.id)) {
      const newId = newConv._id || newConv.id;
      setConversations((prev) => {
        const exists = prev.some((c) => (c._id || c.id) === newId);
        if (exists) return prev;
        const updated = [newConv, ...prev];
        localStorage.setItem('cortex_conversations', JSON.stringify(updated));
        return updated;
      });
      setActiveConversationId(newId);
      localStorage.setItem('cortex_active_conv_id', newId);
    }
  };

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post('/api/auth/login', { token });
      console.log('Login success:', data);
      if (data) {
        dispatch(setUserData(data));
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await handleLogin(token);
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignUp ? 'Signing up...' : 'Logging in...', { email, password });
  };

  const activeConv = conversations.find(
    (c) => (c._id || c.id) === activeConversationId
  );
  const activeConversationTitle = activeConv?.title || 'New Chat';

  return (
    <div className="flex flex-row h-screen w-screen bg-[#0d0e12] text-white overflow-hidden relative select-none">
      {/* Sidebar on the left */}
      <SideBar
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => setActiveConversationId(id)}
        conversations={conversations}
        setConversations={setConversations}
        onNewChat={handleNewChat}
        loading={loadingChats}
      />

      {/* Main Center & Right layout (ChatArea + Artifacts) */}
      <div className="flex-1 flex flex-row h-full overflow-hidden relative">
        <ChatArea
          activeConversationId={activeConversationId}
          setActiveConversationId={setActiveConversationId}
          activeConversationTitle={activeConversationTitle}
          onSelectConversation={(id) => setActiveConversationId(id)}
          onNewChat={handleNewChat}
          onConversationCreated={handleConversationCreated}
          conversations={conversations}
          setConversations={setConversations}
        />
        <Artifacts />
      </div>

      {/* Blurred Backdrop Modal when user is NOT logged in */}
      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-300 p-4">
          <div className="bg-zinc-900/90 p-8 rounded-2xl shadow-2xl border border-zinc-800/80 w-full max-w-md backdrop-blur-xl">
            {/* Header Text */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-zinc-100">
                {isSignUp ? 'Create an Account' : 'Welcome Back'}
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                {isSignUp
                  ? 'Sign up to get started with CortexAI'
                  : 'Please sign in to access your conversations'}
              </p>
            </div>

            {/* Continue with Google Option */}
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-zinc-800 text-zinc-200 font-medium py-2.5 px-4 border border-zinc-700 rounded-xl hover:bg-zinc-700/80 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2 bg-zinc-800/70 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 bg-zinc-800/70 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all text-sm cursor-pointer shadow-md"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center text-sm text-zinc-400">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-purple-400 font-semibold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-purple-400 font-semibold hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
