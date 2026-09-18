import React, { useState } from 'react';

const ImageBlock = ({ src, alt, onOpen }) => {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [retryCount, setRetryCount] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(src);
  };

  const handleRetry = (e) => {
    e.stopPropagation();
    setStatus('loading');
    setRetryCount(c => c + 1);
  };

  // Add cache-busting parameter for retry
  const imgSrc = retryCount > 0 ? `${src}${src.includes('?') ? '&' : '?'}retry=${retryCount}` : src;

  return (
    <div className="relative my-4 flex flex-col w-full max-w-full rounded-2xl border border-zinc-800 bg-[#14151c] shadow-[0_2px_12px_rgba(0,0,0,0.15)] overflow-hidden">
      {/* Image Container */}
      <div 
        className="relative flex items-center justify-center w-full min-h-[250px] cursor-pointer group bg-[#12131a]"
        onClick={() => status === 'success' && onOpen()}
      >
        {status === 'loading' && (
           <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-3"></div>
              <span className="text-xs text-zinc-500 font-medium animate-pulse">Generating image...</span>
           </div>
        )}
        
        {status === 'error' && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-6 text-center">
              <svg className="w-8 h-8 mb-2 text-red-400/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="text-sm font-medium text-zinc-300 mb-1">Failed to load image</span>
              <button 
                onClick={handleRetry} 
                className="mt-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-lg text-zinc-200 transition cursor-pointer"
              >
                Retry
              </button>
           </div>
        )}
        
        <img
          src={imgSrc}
          alt={alt || 'Generated'}
          onLoad={() => setStatus('success')}
          onError={() => setStatus('error')}
          className={`w-full h-auto max-h-[500px] object-contain transition-all duration-500 ${status === 'success' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        />

        {status === 'success' && (
           <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-black/50 backdrop-blur-md rounded-full p-2.5 text-white/90 transform scale-95 group-hover:scale-100 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7" />
                </svg>
              </div>
           </div>
        )}
      </div>

      {/* Action Bar */}
      {status === 'success' && (
        <div className="flex items-center justify-between px-3 py-2.5 bg-zinc-900/50 border-t border-zinc-800/80">
          <div className="text-xs text-zinc-400 font-medium truncate max-w-[40%] pl-1">
            Generated Image
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition text-[11px] font-medium cursor-pointer"
              title="Copy Image URL"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy URL
            </button>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition text-[11px] font-medium cursor-pointer"
              title="Open Image"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Open
            </a>
            <a
              href={src}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition text-[11px] font-medium border border-zinc-700/50 cursor-pointer"
              title="Download Image"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
