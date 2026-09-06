import React from 'react';
import { useSelector } from 'react-redux';

const conversations = [
  'Build auth flow',
  'Firebase login issue',
  'React sidebar layout',
  'API error handling',
  'Dashboard polish',
  'Project ideas',
];

const sideBar = () => {
  const userData = useSelector((state) => state.user.userData);
  const displayName = userData?.name || userData?.displayName || 'Guest user';
  const email = userData?.email || 'Sign in to sync chats';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'G';

  return (
    <aside className="fixed lg:static inset-y-0 left-0 z-50 flex h-screen w-[270px] shrink-0 flex-col bg-[#171717] text-[#ececec]">
      <div className="flex h-14 items-center justify-between px-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Open sidebar menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Search chats"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m21 21-4.7-4.7M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/10 hover:text-white"
            aria-label="New chat"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-3 pb-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-white/10"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
            AI
          </span>
          <span>New conversation</span>
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        <p className="px-3 py-2 text-xs font-medium text-zinc-500">Conversations</p>
        <div className="space-y-1">
          {conversations.map((conversation, index) => (
            <button
              type="button"
              key={conversation}
              className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                index === 0 ? 'bg-white/10 text-white' : 'text-zinc-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="min-w-0 truncate">{conversation}</span>
              <span className="ml-2 hidden text-zinc-500 group-hover:block">...</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-2">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-white/10"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-white">{displayName}</span>
            <span className="block truncate text-xs text-zinc-400">{email}</span>
          </span>
          <svg className="h-4 w-4 shrink-0 text-zinc-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default sideBar
