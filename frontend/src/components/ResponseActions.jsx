import React, { useState } from 'react';

const ResponseActions = ({ content, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike' | null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy response:', err);
    }
  };

  const handleToggleFeedback = (type) => {
    setFeedback((prev) => (prev === type ? null : type));
  };

  return (
    <div className="flex items-center gap-1.5 pt-3 mt-2 border-t border-zinc-800/40 text-zinc-400 select-none">
      {/* Copy Action */}
      <button
        type="button"
        onClick={handleCopy}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
          copied
            ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-800/40'
            : 'hover:text-zinc-200 hover:bg-zinc-800/60'
        }`}
        title="Copy response text"
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Copied</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            <span>Copy</span>
          </>
        )}
      </button>

      {/* Regenerate Action */}
      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:text-zinc-200 hover:bg-zinc-800/60 transition cursor-pointer"
          title="Regenerate response"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          <span>Regenerate</span>
        </button>
      )}

      {/* Like Button */}
      <button
        type="button"
        onClick={() => handleToggleFeedback('like')}
        className={`p-1 rounded-lg transition cursor-pointer ${
          feedback === 'like'
            ? 'text-purple-400 bg-purple-950/40 border border-purple-800/50'
            : 'hover:text-zinc-200 hover:bg-zinc-800/60'
        }`}
        title="Good response"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={feedback === 'like' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
        </svg>
      </button>

      {/* Dislike Button */}
      <button
        type="button"
        onClick={() => handleToggleFeedback('dislike')}
        className={`p-1 rounded-lg transition cursor-pointer ${
          feedback === 'dislike'
            ? 'text-rose-400 bg-rose-950/40 border border-rose-800/50'
            : 'hover:text-zinc-200 hover:bg-zinc-800/60'
        }`}
        title="Bad response"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={feedback === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h3a2 2 0 012 2v7a2 2 0 01-2 2h-3" />
        </svg>
      </button>
    </div>
  );
};

export default ResponseActions;

