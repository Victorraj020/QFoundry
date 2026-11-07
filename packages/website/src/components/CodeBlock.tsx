/**
 * @file CodeBlock.tsx
 * @description Editorial code block with JS/TS tabs and copy button.
 */

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeTab {
  label: string;
  language: string;
  code: string;
}

interface CodeBlockProps {
  tabs?: CodeTab[];
  code?: string;
  language?: string;
  filename?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  tabs,
  code = '',
  language = 'typescript',
  filename,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeCode = tabs ? tabs[activeTab]?.code || '' : code;
  const currentLanguage = tabs ? tabs[activeTab]?.language || language : language;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-xl overflow-hidden border border-slate-700/60 dark:border-slate-800 bg-[#0e1015] shadow-lg text-slate-100 font-mono text-sm ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#14171f] border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          {tabs ? (
            <div className="flex items-center gap-1">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(idx)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    activeTab === idx
                      ? 'bg-slate-700/80 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : filename ? (
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              {filename}
            </div>
          ) : (
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              {currentLanguage}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/40 hover:bg-slate-800 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
        <pre className="m-0 p-0">
          <code>
            {activeCode.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell pr-4 select-none text-slate-600 text-right w-8 text-xs">
                  {i + 1}
                </span>
                <span className="table-cell whitespace-pre">
                  {highlightSyntax(line, currentLanguage)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

// Lightweight, crisp syntax highlighting without external heavy parser
function highlightSyntax(line: string, lang: string): React.ReactNode {
  // Comments
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  // Token regex for common keywords
  const parts = line.split(/(\b(?:import|export|from|const|let|var|function|class|new|return|await|async|type|interface|for|while|if|else|def)\b|"[^"]*"|'[^']*'|`[^`]*`|\b\d+\b)/g);

  return parts.map((part, index) => {
    if (
      /^\b(import|export|from|const|let|var|function|class|new|return|await|async|type|interface|for|while|if|else|def)\b$/.test(
        part
      )
    ) {
      return (
        <span key={index} className="text-purple-400 font-medium">
          {part}
        </span>
      );
    }
    if (/^["'`].*["'`]$/.test(part)) {
      return (
        <span key={index} className="text-emerald-300">
          {part}
        </span>
      );
    }
    if (/^\b\d+\b$/.test(part)) {
      return (
        <span key={index} className="text-amber-300">
          {part}
        </span>
      );
    }
    return part;
  });
}

