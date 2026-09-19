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
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                className="bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-md rounded-full p-2.5 text-white transition-transform transform scale-95 group-hover:scale-100 cursor-pointer"
                title="Copy URL"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onOpen(); }}
                className="bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-md rounded-full p-2.5 text-white transition-transform transform scale-95 group-hover:scale-100 cursor-pointer"
                title="View Fullscreen"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7" />
                </svg>
              </button>
              <a
                href={src}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-md rounded-full p-2.5 text-white transition-transform transform scale-95 group-hover:scale-100 cursor-pointer"
                title="Download"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
           </div>
        )}
      </div>
    </div>
  );
};

export default ImageBlock;
