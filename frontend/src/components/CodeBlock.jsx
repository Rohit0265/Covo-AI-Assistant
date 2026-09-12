import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LANGUAGE_MAP = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'React JSX',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'React TSX',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  py: 'Python',
  python: 'Python',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  'c++': 'C++',
  bash: 'Bash / Shell',
  sh: 'Shell',
  shell: 'Shell',
  sql: 'SQL',
  md: 'Markdown',
  markdown: 'Markdown',
  yml: 'YAML',
  yaml: 'YAML',
  xml: 'XML'
};

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const normalizedLang = (language || '').toLowerCase().trim();
  const displayLang = LANGUAGE_MAP[normalizedLang] || (normalizedLang ? normalizedLang.toUpperCase() : 'Code');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="my-4 rounded-xl border border-zinc-800 bg-[#0d0e12] overflow-hidden shadow-lg group">
      {/* Code Block Header */}
      <div className="bg-[#14151c] px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
          <span className="text-xs font-mono font-medium text-zinc-400">
            {displayLang}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 rounded-md bg-zinc-800/60 hover:bg-zinc-700/80 border border-zinc-700/50 transition cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-emerald-400">Copied!</span>
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
      </div>

      {/* Syntax Highlighted Area */}
      <div className="text-xs font-mono overflow-x-auto leading-relaxed">
        <SyntaxHighlighter
          language={normalizedLang || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'transparent',
            fontSize: '0.8125rem',
            lineHeight: '1.6',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          }}
          codeTagProps={{
            style: {
              fontFamily: 'inherit'
            }
          }}
        >
          {value ? value.replace(/\n$/, '') : ''}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;

