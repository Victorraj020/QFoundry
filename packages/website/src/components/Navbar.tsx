/**
 * @file Navbar.tsx
 * @description Global responsive navigation bar with Products dropdown, theme toggle, and search trigger.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Code2,
  Package,
  Cpu,
  Linkedin,
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  isDark,
  onToggleTheme,
}) => {
  const location = useLocation();
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setProductsOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isCurrent = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isProductActive = location.pathname.startsWith('/products');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#090a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-sm transition-transform group-hover:scale-105">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18" />
                <path d="M3 12h18" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base tracking-tight text-slate-900 dark:text-white">
                QFoundry
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Ecosystem
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isCurrent('/')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </Link>

            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isProductActive
                    ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/60 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Products
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
              </button>

              {productsOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50">
                  <Link
                    to="/products/extension"
                    className="block p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium text-sm text-slate-900 dark:text-slate-100">
                        <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        QFoundry Extension
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                        v2.2.0 • Existing
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
                      Quantum development & visualization directly inside Visual Studio Code.
                    </p>
                  </Link>

                  <Link
                    to="/products/npm"
                    className="block p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium text-sm text-slate-900 dark:text-slate-100">
                        <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        QFoundry npm
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                        v0.1.0 • npm
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
                      High-performance quantum circuit simulation library for JS & TS.
                    </p>
                  </Link>

                  <Link
                    to="/products/vicnlp"
                    className="block p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium text-sm text-slate-900 dark:text-slate-100">
                        <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Vic (vic-nlp)
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold">
                        v0.3.0 • PyPI
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
                      AI-powered computer interface, visual dashboard &amp; AutoML studio.
                    </p>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/docs"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isCurrent('/docs')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Documentation
            </Link>

            <Link
              to="/playground"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isCurrent('/playground')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Playground
            </Link>

            <Link
              to="/terminal"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isCurrent('/terminal')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Terminal
            </Link>

            <Link
              to="/research"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isCurrent('/research')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Research
            </Link>
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-2.5">
          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-500 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/50 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search docs...</span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500">
              ⌘K
            </kbd>
          </button>

          {/* LinkedIn Profile */}
          <a
            href="https://www.linkedin.com/in/victor-raj/"
            target="_blank"
            rel="noopener noreferrer"
            title="Victor Raj (Lead Developer & Maintainer) on LinkedIn"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Victor Raj</span>
          </a>

          {/* GitHub Link */}
          <a
            href="https://github.com/Victorraj020/QFoundry"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg width="16" height="16" className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090a0f] px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-500 bg-slate-50 dark:bg-slate-900"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              Search documentation...
            </span>
            <kbd className="font-mono text-[10px] px-1 rounded bg-slate-200 dark:bg-slate-800">⌘K</kbd>
          </button>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Home
            </Link>
            <div className="px-3 pt-2 text-xs font-mono uppercase text-slate-400">Products</div>
            <Link
              to="/products/extension"
              className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>QFoundry Extension</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">v2.2.0</span>
            </Link>
            <Link
              to="/products/npm"
              className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>QFoundry npm</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">v0.1.0</span>
            </Link>
            <Link
              to="/products/vicnlp"
              className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Vic (vic-nlp)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">v0.3.0</span>
            </Link>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
              <a
                href="https://www.linkedin.com/in/victor-raj/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-blue-600 dark:text-blue-400"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span>Victor Raj (Maintainer)</span>
                </div>
                <span className="text-[10px] font-mono">LinkedIn ↗</span>
              </a>
              <Link
                to="/docs"
                className="block px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
              >
                Documentation
              </Link>
              <Link
                to="/playground"
                className="block px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
              >
                Quantum Playground
              </Link>
              <Link
                to="/terminal"
                className="block px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
              >
                Interactive Terminal
              </Link>
              <Link
                to="/research"
                className="block px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
              >
                Research & Benchmarks
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
