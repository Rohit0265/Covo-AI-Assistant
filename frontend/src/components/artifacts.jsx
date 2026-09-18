import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Artifacts = () => {
  const artifacts = useSelector((state) => state.message.artifacts);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('code'); // 'preview' or 'code'
  const [activeFile, setActiveFile] = useState(null);
  
  // Set the most recent artifact as active
  useEffect(() => {
    if (artifacts && artifacts.length > 0) {
      const artifact = artifacts[artifacts.length - 1];
      setActiveArtifact(artifact);
      setIsExpanded(true); // Auto-expand when a new artifact arrives
      if (artifact.files && artifact.files.length > 0) {
        setActiveFile(artifact.files[0].name);
      }
    } else {
      setActiveArtifact(null);
      setIsExpanded(false);
      setActiveFile(null);
    }
  }, [artifacts]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (!artifacts || artifacts.length === 0) {
    return (
      <div className={`hidden lg:flex transition-all duration-300 border-l border-zinc-800 flex-col overflow-hidden shrink-0 bg-[#0e0e11] text-zinc-300 ${isExpanded ? 'w-[400px]' : 'w-[50px] items-center'}`}>
        <button 
          onClick={toggleExpand} 
          className="p-3 mt-4 hover:bg-zinc-800/80 rounded-lg cursor-pointer transition text-zinc-400"
          title="Toggle Artifacts"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isExpanded ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
          </svg>
        </button>
      </div>
    );
  }

  const handleCopyCode = () => {
    if (!activeArtifact || !activeArtifact.files) return;
    
    // Combine all files into one for copying
    const combinedCode = activeArtifact.files.map(f => `/* --- ${f.name} --- */\n${f.content}\n`).join('\n');
    
    navigator.clipboard.writeText(combinedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getIframeSource = () => {
    if (!activeArtifact || !activeArtifact.files) return '';
    
    let html = '';
    let css = '';
    let js = '';

    activeArtifact.files.forEach(file => {
      if (file.name.endsWith('.html')) html = file.content;
      else if (file.name.endsWith('.css')) css = file.content;
      else if (file.name.endsWith('.js')) js = file.content;
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  };

  const currentFileContent = activeArtifact?.files?.find(f => f.name === activeFile)?.content || '';

  return (
    <div className={`hidden lg:flex transition-all duration-300 border-l border-zinc-800 flex-col overflow-hidden shrink-0 bg-[#16161e] text-zinc-300 ${isExpanded ? 'w-[450px] xl:w-[500px]' : 'w-[60px] items-center'}`}>
      
      {/* Sidebar Header / Toggle */}
      <div className={`p-4 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} shrink-0 bg-[#121218]`}>
        {isExpanded && activeArtifact ? (
          <div className="flex items-center gap-3 overflow-hidden pr-2">
            <button 
              onClick={toggleExpand} 
              className="p-1.5 hover:bg-zinc-800 rounded-md cursor-pointer transition text-zinc-400 hover:text-zinc-200 border border-zinc-700/50"
              title="Collapse"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
                <path d="M5 5v14" />
              </svg>
            </button>
            
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#252336] text-purple-400 shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
              </svg>
            </div>
            
            <h3 className="font-semibold text-zinc-100 text-[15px] truncate max-w-[120px]" title={activeArtifact.title}>
              {activeArtifact.title || 'generated code'}
            </h3>
            
            <button 
              onClick={handleCopyCode}
              className="p-1.5 hover:bg-zinc-800 rounded-md cursor-pointer transition text-zinc-400 hover:text-zinc-200"
              title="Copy Code"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
          </div>
        ) : (
          <button 
            onClick={toggleExpand} 
            className="p-1.5 hover:bg-zinc-800/80 rounded-md cursor-pointer transition text-zinc-400 hover:text-zinc-200"
            title="Expand Artifacts"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {isExpanded && activeArtifact && (
          <div className="flex items-center bg-[#1c1c24] rounded-lg p-1 border border-zinc-800/60 shrink-0">
            <button 
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer text-xs font-medium flex items-center gap-1.5 ${viewMode === 'code' ? 'bg-[#5f43f2] text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
              </svg>
              Code
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer text-xs font-medium flex items-center gap-1.5 ${viewMode === 'preview' ? 'bg-[#5f43f2] text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Preview
            </button>
          </div>
        )}
      </div>

      {isExpanded && activeArtifact && (
        <div className="flex flex-col flex-1 overflow-hidden">
          
          {/* File Tabs for Code Mode */}
          {viewMode === 'code' && (
            <div className="flex items-center gap-2 px-2 border-b border-zinc-800/80 bg-[#121218] overflow-x-auto no-scrollbar shrink-0">
              {activeArtifact.files?.map(file => {
                const isActive = activeFile === file.name;
                return (
                  <button
                    key={file.name}
                    onClick={() => setActiveFile(file.name)}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                      isActive 
                        ? 'text-[#8470ff] border-[#5f43f2]' 
                        : 'text-zinc-400 border-transparent hover:text-zinc-200'
                    }`}
                  >
                    {file.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Artifact Content (Preview or Code) */}
          <div className="flex-1 bg-[#1e1e24] overflow-hidden relative">
            {viewMode === 'preview' ? (
              <div className="w-full h-full bg-white">
                <iframe
                  title="artifact-preview"
                  srcDoc={getIframeSource()}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                />
              </div>
            ) : (
              <div className="w-full h-full overflow-auto p-4 text-xs font-mono text-zinc-300">
                <pre className="whitespace-pre-wrap break-all">{currentFileContent}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Artifacts;