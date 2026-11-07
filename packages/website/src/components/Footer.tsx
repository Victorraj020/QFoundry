/**
 * @file Footer.tsx
 * @description Technical footer inspired by Vercel and Stripe.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#07080b] py-16 text-sm text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                </svg>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white tracking-tight text-base">
                QFoundry
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              An independent developer ecosystem focused on quantum computing, developer tools and research-driven software.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational • v2.2.0 Core</span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <div className="text-xs text-slate-700 dark:text-slate-300">
                Developed and managed by{' '}
                <a
                  href="https://www.linkedin.com/in/victor-raj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 inline-flex items-center gap-1"
                >
                  Victor Raj
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    LinkedIn ↗
                  </span>
                </a>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Quantum computing systems, TypeScript libraries, and AI tooling.
              </p>
            </div>
          </div>

          {/* Column: Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-900 dark:text-slate-200">
              Products
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products/extension" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  VS Code Extension
                </Link>
              </li>
              <li>
                <Link to="/products/npm" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  QFoundry npm (Library)
                </Link>
              </li>
              <li>
                <Link to="/products/vicnlp" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Vic (vic-nlp) Interface
                </Link>
              </li>
              <li>
                <Link to="/playground" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Quantum Playground
                </Link>
              </li>
              <li>
                <Link to="/terminal" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Interactive Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Documentation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-900 dark:text-slate-200">
              Documentation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/docs/npm-quickstart" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  npm Quick Start
                </Link>
              </li>
              <li>
                <Link to="/docs/npm-fundamentals" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Quantum Fundamentals
                </Link>
              </li>
              <li>
                <Link to="/docs/npm-gates" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Gate Operations Reference
                </Link>
              </li>
              <li>
                <Link to="/docs/ext-overview" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  VS Code Extension Setup
                </Link>
              </li>
              <li>
                <Link to="/docs/vic-pipeline" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Vic Overview &amp; Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Research & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-900 dark:text-slate-200">
              Research & Community
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/research" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Simulation Architecture
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Statevector Benchmarks
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Hybrid QML Methodology
                </Link>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/victor-raj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Victor Raj (LinkedIn) ↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Victorraj020/QFoundry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  GitHub Repository ↗
                </a>
              </li>
              <li>
                <a
                  href="mailto:victorraj020@gmail.com"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Contact Maintainer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span>Developed and managed by</span>
            <a
              href="https://www.linkedin.com/in/victor-raj/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 flex items-center gap-1"
            >
              Victor Raj
              <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono">LinkedIn ↗</span>
            </a>
            <span className="text-slate-400">•</span>
            <a href="mailto:victorraj020@gmail.com" className="hover:underline">victorraj020@gmail.com</a>
          </div>
          <div className="font-mono text-[11px]">
            MIT License • Open Source Developer Ecosystem
          </div>
        </div>
      </div>
    </footer>
  );
};
