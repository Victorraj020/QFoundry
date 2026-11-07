/**
 * @file DocsPage.tsx
 * @description Stripe/Vercel-inspired 3-column documentation layout with URL routing.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { DOC_SECTIONS } from '../data/docsContent';
import { DocItem } from '../types';

export const DocsPage: React.FC = () => {
  const { docId } = useParams<{ docId?: string }>();
  const navigate = useNavigate();

  const allItems: DocItem[] = DOC_SECTIONS.flatMap((s) => s.items);
  const matchedItem = allItems.find((i) => i.id === docId) || allItems[0];
  const [activeItem, setActiveItem] = useState<DocItem>(matchedItem);

  useEffect(() => {
    if (docId) {
      const match = allItems.find((i) => i.id === docId);
      if (match) {
        setActiveItem(match);
      }
    } else {
      setActiveItem(allItems[0]);
    }
  }, [docId]);

  // Find previous and next item for pagination
  const currentIndex = allItems.findIndex((i) => i.id === activeItem.id);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDoc = (item: DocItem) => {
    setActiveItem(item);
    navigate(`/docs/${item.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Sidebar (Cols 1-3) */}
        <aside className="lg:col-span-3 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 space-y-6 text-sm">
          {/* Version Pill */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono font-medium text-slate-500">Documentation</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              v2.2.0 Core
            </span>
          </div>

          {/* Categorized Doc Sections */}
          <div className="space-y-6">
            {DOC_SECTIONS.map((section) => (
              <div key={section.id} className="space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-900 dark:text-slate-200 px-2">
                  {section.title}
                </h4>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = item.id === activeItem.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectDoc(item)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors text-left ${
                          isActive
                            ? 'bg-slate-100 dark:bg-slate-800/80 text-emerald-700 dark:text-emerald-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER COLUMN: Main Content (Cols 4-10) */}
        <main className="lg:col-span-7 space-y-8 min-w-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/docs" className="hover:underline">Docs</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{activeItem.category}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 dark:text-slate-100 font-medium truncate">
              {activeItem.title}
            </span>
          </div>

          {/* Render Markdown / Doc Content */}
          <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
            <RenderDocContent content={activeItem.content} />
          </div>

          {/* Bottom Pagination: Prev / Next */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            {prevItem ? (
              <button
                onClick={() => handleSelectDoc(prevItem)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <div className="text-left">
                  <span className="block text-[10px] uppercase font-mono text-slate-400">Previous</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{prevItem.title}</span>
                </div>
              </button>
            ) : (
              <div></div>
            )}

            {nextItem && (
              <button
                onClick={() => handleSelectDoc(nextItem)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-mono text-slate-400">Next</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{nextItem.title}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </main>

        {/* RIGHT COLUMN: Table of Contents (Cols 11-12) */}
        <aside className="hidden lg:block lg:col-span-2 sticky top-24 space-y-3 text-xs">
          <h4 className="font-mono uppercase tracking-wider font-semibold text-slate-900 dark:text-slate-200 text-[11px]">
            On This Page
          </h4>
          <div className="space-y-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
            {activeItem.toc.map((tocItem) => (
              <button
                key={tocItem.id}
                onClick={() => scrollToAnchor(tocItem.id)}
                className="block text-left text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors leading-relaxed"
              >
                {tocItem.title}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

// Simple Markdown / HTML renderer for documentation bodies
function RenderDocContent({ content }: { content: string }) {
  return (
    <div
      className="space-y-4 text-sm leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: formatMarkdownHtml(content),
      }}
    />
  );
}

function formatMarkdownHtml(raw: string): string {
  let html = raw;

  // Headings
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-8 mb-4">$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-6 mb-3">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold text-slate-900 dark:text-slate-100 mt-4 mb-2">$1</h3>');

  // Callouts
  html = html.replace(
    /> \[!NOTE\]\s*\n> (.*)/gim,
    '<div class="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-emerald-900 dark:text-emerald-200 my-4"><strong class="font-semibold block mb-1">Note</strong>$1</div>'
  );

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">$1</a>');

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="border-slate-200 dark:border-slate-800 my-6" />');

  // Code blocks ```...```
  html = html.replace(/```(typescript|javascript|python|bash|text)?\n([\s\S]*?)```/gim, (_, lang, code) => {
    return `<div class="rounded-xl overflow-hidden border border-slate-700/60 dark:border-slate-800 bg-[#0e1015] p-4 text-xs font-mono text-slate-200 my-4 shadow-sm overflow-x-auto"><pre class="m-0"><code>${escapeHtml(code.trim())}</code></pre></div>`;
  });

  // Inline code `...`
  html = html.replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-mono text-xs border border-slate-200 dark:border-slate-700/60">$1</code>');

  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li class="text-slate-600 dark:text-slate-400 ml-4 list-disc">$1</li>');

  // Tables
  html = html.replace(/\| (.*) \|/gim, (match) => {
    return `<div class="font-mono text-xs my-2">${match}</div>`;
  });

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
