/**
 * @file App.tsx
 * @description Root application router and layout for the QFoundry website.
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { ExtensionProductPage } from './pages/ExtensionProductPage';
import { NpmProductPage } from './pages/NpmProductPage';
import { VicNlpProductPage } from './pages/VicNlpProductPage';
import { DocsPage } from './pages/DocsPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { TerminalPage } from './pages/TerminalPage';
import { ResearchPage } from './pages/ResearchPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function MainLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Sync dark class on root document
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090a0f] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      <ScrollToTop />

      {/* Sticky Header Navigation */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/extension" element={<ExtensionProductPage />} />
          <Route path="/products/npm" element={<NpmProductPage />} />
          <Route path="/products/vicnlp" element={<VicNlpProductPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/docs/:docId" element={<DocsPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/terminal" element={<TerminalPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Technical Footer */}
      <Footer />
    </div>
  );
}

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
};

export default App;
