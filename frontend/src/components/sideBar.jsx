import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../utils/axios';
import logout from '../features/logout';
import { setUserData } from '../redux/userSlice';

const SideBar = ({
  activeConversationId,
  onSelectConversation,
  conversations = [],
  setConversations,
  onNewChat,
  loading = false
}) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleEditClick = (e, item) => {
    e.stopPropagation();
    setEditingId(item._id || item.id);
    setEditTitle(item.title || 'New Chat');
  };

  const handleSaveEdit = async (e, id) => {
    e.stopPropagation();
    if (editTitle.trim() === "") {
       setEditingId(null);
       return;
    }
    try {
      await api.post('/api/chat/update-conversation', { id, title: editTitle });
      setConversations(prev => prev.map(c => (c._id === id || c.id === id) ? { ...c, title: editTitle } : c));
      setEditingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      await api.delete(`/api/chat/delete-conversation/${id}`);
      setConversations(prev => prev.filter(c => (c._id !== id && c.id !== id)));
      if (activeConversationId === id && onNewChat) {
        onNewChat();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const displayName = userData?.name || userData?.displayName || userData?.username || 'Guest user';
  const avatarUrl = userData?.avatar;
  const initials = String(displayName)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';

  const handleLogout = async () => {
    await logout();
    dispatch(setUserData(null));
  };

  return (
    <aside className="h-screen w-[270px] shrink-0 border-r border-zinc-800/60 flex flex-col bg-[#111218] text-[#ececec] select-none">
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg border border-zinc-700/60 bg-zinc-800/80 text-white font-semibold">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </div>
          <span className="font-semibold text-base tracking-tight text-white">CortexAI</span>
          <span className="bg-[#20183b] text-[#a78bfa] border border-[#3b2a68] text-[10px] font-medium px-2 py-0.5 rounded-full">
            free
          </span>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/60 transition cursor-pointer"
          title="New Chat"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-4 py-3">
        <button
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium shadow-md shadow-purple-950/20 transition-all text-sm cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          <span>New Chat</span>
        </button>
      </div>

      {/* Recents Section */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <p className="px-2 py-2 text-[11px] font-semibold text-zinc-500 tracking-wider uppercase">RECENTS</p>
        <div className="space-y-1.5">
          {loading ? (
            <p className="px-2 py-2 text-xs text-zinc-500">Loading chats...</p>
          ) : conversations && conversations.length > 0 ? (
            conversations.map((item) => {
              const isSelected = activeConversationId === (item._id || item.id);
              return (
                <button
                  type="button"
                  key={item._id || item.id}
                  onClick={() => onSelectConversation && onSelectConversation(item._id || item.id)}
                  className={`group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-sm transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-800/90 border-zinc-700/80 text-white font-medium shadow-sm'
                      : 'bg-transparent border-transparent text-zinc-300 hover:bg-zinc-800/40 hover:text-white'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg border transition ${
                    isSelected ? 'bg-zinc-700/80 border-zinc-600 text-white' : 'bg-[#1b1c24] border-zinc-800/80 text-zinc-400 group-hover:text-zinc-200'
                  }`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  
                  {editingId === (item._id || item.id) ? (
                    <input
                      autoFocus
                      type="text"
                      className="min-w-0 flex-1 bg-zinc-800 text-white rounded px-2 py-1 outline-none border border-zinc-600"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(e, item._id || item.id);
                        if (e.key === 'Escape') {
                           setEditingId(null);
                           e.stopPropagation();
                        }
                      }}
                      onBlur={(e) => handleSaveEdit(e, item._id || item.id)}
                    />
                  ) : (
                    <span className="min-w-0 flex-1 truncate group-hover:pr-14">{item.title || 'New Chat'}</span>
                  )}
                  
                  {editingId !== (item._id || item.id) && (
                    <div className="absolute right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        onClick={(e) => handleEditClick(e, item)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700/60 rounded-md transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </div>
                      <div
                        onClick={(e) => handleDelete(e, item._id || item.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-700/60 rounded-md transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              );
            })
          ) : (
            <p className="px-2 py-2 text-xs text-zinc-500">No conversations yet</p>
          )}
        </div>
      </nav>

      {/* Footer / User Info & Logout */}
      <div className="border-t border-zinc-800/60 p-3 mt-auto">
        <div className="flex items-center justify-between p-1.5 rounded-xl transition hover:bg-zinc-800/40">
          <div className="flex items-center gap-3 min-w-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-10 h-10 rounded-xl object-cover border border-zinc-700/50"
              />
            ) : (
              <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 border border-zinc-700/50 text-sm font-semibold text-white">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-white">{displayName}</span>
              <span className="block truncate text-xs text-zinc-400">Free Plan</span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              className="p-1.5 text-amber-400 hover:bg-zinc-800 rounded-lg transition cursor-pointer"
              title="Coins"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 6v12M15 9.5a2.5 2.5 0 00-5 0c0 2 3 2.5 3 4.5a2.5 2.5 0 01-5 0" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition cursor-pointer"
              title="Log out"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
