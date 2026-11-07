/**
 * @file HomePage.tsx
 * @description Main landing experience for the QFoundry developer ecosystem.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Package,
  Cpu,
  ArrowRight,
  Zap,
  CheckCircle2,
  FlaskConical,
  Linkedin,
  ExternalLink,
  Sparkles,
  Globe,
  Mail,
} from 'lucide-react';
import { QuantumCircuitSVG } from '../components/QuantumCircuitSVG';

export const HomePage: React.FC = () => {
  const [activeHeroTab, setActiveHeroTab] = useState<'bell' | 'ghz' | 'superposition'>('bell');

  const heroGates =
    activeHeroTab === 'bell'
      ? [
          { type: 'h', target: 0 },
          { type: 'cx', target: 1, control: 0 },
          { type: 'measure', target: 0 },
          { type: 'measure', target: 1 },
        ]
      : activeHeroTab === 'ghz'
      ? [
          { type: 'h', target: 0 },
          { type: 'cx', target: 1, control: 0 },
          { type: 'cx', target: 2, control: 1 },
          { type: 'measure', target: 0 },
          { type: 'measure', target: 1 },
          { type: 'measure', target: 2 },
        ]
      : [
          { type: 'h', target: 0 },
          { type: 'rz', target: 0, param: 'π/4' },
          { type: 'measure', target: 0 },
        ];

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] text-xs text-slate-600 dark:text-slate-300 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium">QFoundry Developer Ecosystem</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">qfoundry v0.1.0 on npm</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-mono text-slate-500">v2.2.0 Core</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Engineering tools for exploring the next generation of computing.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            QFoundry is an independent developer ecosystem focused on quantum computing, developer tools and research-driven software.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              const el = document.getElementById('products-overview');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-sm hover:opacity-90 shadow-md transition-all"
          >
            Explore Projects
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/docs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] text-slate-800 dark:text-slate-200 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all"
          >
            Documentation
          </Link>

          <Link
            to="/playground"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/50 shadow-sm transition-all"
          >
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Launch Quantum Playground
          </Link>
        </div>

        {/* Hero Technical Visual: Interactive Quantum Circuit Diagram */}
        <div className="pt-8 max-w-3xl mx-auto">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] p-5 shadow-xl text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                  Live Quantum Circuit Diagram
                </span>
              </div>

              {/* Interactive Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-mono">
                <button
                  onClick={() => setActiveHeroTab('bell')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeHeroTab === 'bell'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Bell State
                </button>
                <button
                  onClick={() => setActiveHeroTab('ghz')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeHeroTab === 'ghz'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  3-Qubit GHZ
                </button>
                <button
                  onClick={() => setActiveHeroTab('superposition')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeHeroTab === 'superposition'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Phase Shift
                </button>
              </div>
            </div>

            <QuantumCircuitSVG
              numQubits={activeHeroTab === 'ghz' ? 3 : activeHeroTab === 'bell' ? 2 : 1}
              gates={heroGates}
              className="py-2"
            />

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-400">
              <span>Interactive SVG Engine • Zero Canvas Overhead</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">State Normalized: ||ψ|| = 1.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT OVERVIEW SECTION */}
      <section id="products-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Three Core Projects. One Unified Platform.
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Bridging IDE developer tooling, lightweight in-memory quantum simulation, and privacy-preserving intelligent systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* PRODUCT 1: QFoundry Extension */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  v2.2.0 • VS Code Marketplace
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  QFoundry Extension
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Quantum development directly inside VS Code
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Live quantum circuit preview, keystroke debounced SVG rendering, 20+ gate hover documentation, statevector debugging with HSL phase disks, and a 9-algorithm interactive explorer.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-time Python circuit AST parser</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Topological gate cancellation & optimizer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>JSON-RPC 2.0 stdio language bridge</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                to="/products/extension"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Explore Extension Overview
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://marketplace.visualstudio.com/items?itemName=victorraj020.qfoundry-qiskit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Marketplace ↗</span>
              </a>
            </div>
          </div>

          {/* PRODUCT 2: QFoundry npm */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  v0.1.0 • Published on npm
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  QFoundry npm
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Quantum simulation for JS &amp; TS
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Lightweight, zero-dependency quantum circuit builder and statevector simulation engine. Runs natively in Node.js and web browsers with complete TypeScript typing.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Exact complex statevector arithmetic</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Multi-shot sampling with seeds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Integrated CLI runner &amp; ASCII printer</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                to="/products/npm"
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                Explore npm Package
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://www.npmjs.com/package/qfoundry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>npm i qfoundry</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* PRODUCT 3: Vic */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  v0.3.0 • PyPI
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Vic (vic-nlp)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  The AI-Powered Computer Interface
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                A library built for Natural Language Creation and No-Code AI. Control your computer, generate functional software, and train AI models using simple English.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>AI No-Code Studio (AutoML with zero coding)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Visual Dashboard: Peek Assistant &amp; AI Training</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Generates clean, editable Python applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>100% Local &amp; Private execution on your PC</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                to="/products/vicnlp"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Explore Vic on PyPI
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[10px] font-mono text-slate-400">pip install vic-nlp</span>
            </div>
          </div>
        </div>
      </section>

      {/* MONOREPO ARCHITECTURE CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c0d12] p-8 sm:p-10 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
              Contract-First Monorepo
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Decoupled, High-Performance Architecture
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every component in QFoundry communicates through strongly-typed contracts, ensuring that UI responsiveness is completely decoupled from intensive matrix computations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Two-Parser Strategy
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Instant UI updates via regex AST extraction on the main thread, while deep quantum DAG passes run in background workers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                JSON-RPC 2.0 over Stdio
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Zero HTTP socket binding. Communicates via standard I/O channels mirroring the Language Server Protocol.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Zero-Flash Theming
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Adaptive CSS variable binding directly reading editor host variables for instantaneous dark/light transition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPED & MANAGED BY VICTOR RAJ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#0d0f16] dark:via-[#090a0f] dark:to-[#11131d] p-8 sm:p-10 shadow-sm">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Bio & Badges */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/50 text-xs font-mono text-blue-700 dark:text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Lead Architect &amp; Maintainer</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Developed and managed by Victor Raj
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Software engineer and quantum developer. Architected and implemented the entire QFoundry ecosystem end-to-end — spanning native TypeScript simulation algorithms, developer tooling extensions, and automated NLP interfaces.
                </p>
              </div>

              {/* Shipped Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#11131a]/80 backdrop-blur-xs">
                  <Package className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">qfoundry on npm (v0.1.0)</div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Pure TypeScript statevector simulation &amp; circuit API.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#11131a]/80 backdrop-blur-xs">
                  <Code2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">VS Code Extension (v2.2.0)</div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Published on Marketplace: victorraj020.qfoundry-qiskit</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#11131a]/80 backdrop-blur-xs">
                  <Cpu className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Vic on PyPI (v0.3.0)</div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Natural language computer interface &amp; local AutoML studio.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#11131a]/80 backdrop-blur-xs">
                  <Globe className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Developer Portal &amp; Docs</div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Full ecosystem documentation, playground &amp; web terminal.</p>
                  </div>
                </div>
              </div>

              {/* Profile links */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="https://www.linkedin.com/in/victor-raj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077b5] hover:bg-[#006097] text-white font-medium text-xs shadow-sm transition-all"
                >
                  <Linkedin className="w-4 h-4 fill-current" />
                  Connect on LinkedIn
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <a
                  href="https://github.com/Victorraj020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-xs shadow-xs transition-all"
                >
                  <svg width="14" height="14" className="fill-current shrink-0" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub @Victorraj020
                </a>

                <a
                  href="https://marketplace.visualstudio.com/items?itemName=victorraj020.qfoundry-qiskit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-xs shadow-xs transition-all"
                >
                  <Code2 className="w-3.5 h-3.5 text-blue-500" />
                  VS Code Marketplace
                </a>

                <a
                  href="https://www.npmjs.com/package/qfoundry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-xs shadow-xs transition-all"
                >
                  <Package className="w-3.5 h-3.5 text-red-500" />
                  npm package
                </a>

                <a
                  href="mailto:victorraj020@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-xs shadow-xs transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  victorraj020@gmail.com
                </a>
              </div>
            </div>

            {/* Right Column: Visual Bio / Interactive Credential Card */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src="/victor-raj.png"
                      alt="Victor Raj"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md ring-2 ring-emerald-500/20"
                      onError={(e) => {
                        e.currentTarget.src = 'https://github.com/Victorraj020.png';
                      }}
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#11131a]"
                      title="Active Maintainer"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Victor Raj
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Quantum Software Engineer
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Active Maintainer</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 font-mono text-[11px]">
                    <span className="text-slate-400">LinkedIn Profile</span>
                    <a
                      href="https://www.linkedin.com/in/victor-raj/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      /in/victor-raj ↗
                    </a>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 font-mono text-[11px]">
                    <span className="text-slate-400">GitHub</span>
                    <a
                      href="https://github.com/Victorraj020"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 dark:text-slate-300 hover:underline"
                    >
                      Victorraj020 ↗
                    </a>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 font-mono text-[11px]">
                    <span className="text-slate-400">VS Code Extension</span>
                    <a
                      href="https://marketplace.visualstudio.com/items?itemName=victorraj020.qfoundry-qiskit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      qfoundry-qiskit ↗
                    </a>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 font-mono text-[11px]">
                    <span className="text-slate-400">npm Published</span>
                    <a
                      href="https://www.npmjs.com/package/qfoundry"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      qfoundry@0.1.0 ↗
                    </a>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 font-mono text-[11px]">
                    <span className="text-slate-400">PyPI Published</span>
                    <a
                      href="https://pypi.org/project/vic-nlp/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      vic-nlp@0.3.0 ↗
                    </a>
                  </div>
                  <div className="flex items-center justify-between py-1 font-mono text-[11px]">
                    <span className="text-slate-400">Email</span>
                    <a
                      href="mailto:victorraj020@gmail.com"
                      className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Mail className="w-3 h-3 text-slate-400" />
                      victorraj020@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESEARCH & OPEN SOURCE CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
          <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
          <span>Research-Driven Computing</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white max-w-xl mx-auto">
          Built for Researchers, Students, and Quantum Engineers.
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          From studying phase kickback in Deutsch&apos;s algorithm to benchmarking hybrid quantum-classical machine learning pipelines, QFoundry delivers open, auditable tooling.
        </p>

        <div className="pt-2 flex items-center justify-center gap-4">
          <Link
            to="/research"
            className="text-xs font-semibold text-slate-900 dark:text-white hover:underline flex items-center gap-1.5"
          >
            Read Technical Research Reports
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

