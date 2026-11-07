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
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">v2.2.0 Released</span>
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
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  v2.2.0 • Existing
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
              <span className="text-[10px] font-mono text-slate-400">v2.2.0</span>
            </div>
          </div>

          {/* PRODUCT 2: QFoundry npm */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  In Development
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  QFoundry npm
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Quantum simulation for JS & TS
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
                  <span>Integrated CLI runner & ASCII printer</span>
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
              <span className="text-[10px] font-mono text-slate-400">npm i qfoundry</span>
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

