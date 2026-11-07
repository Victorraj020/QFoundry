/**
 * @file NpmProductPage.tsx
 * @description Dedicated landing and overview page for the QFoundry npm package (v0.1.0-alpha).
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ExternalLink,
  Zap,
  Cpu,
  Layers,
  Terminal,
  Play,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Linkedin,
} from 'lucide-react';
import { CodeBlock } from '../components/CodeBlock';

export const NpmProductPage: React.FC = () => {
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('npm install qfoundry');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Product Hero */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            v0.1.0 • Published on npm
          </span>
          <span className="text-xs font-mono text-slate-500">JavaScript &amp; TypeScript</span>
          <span className="text-xs font-mono text-slate-500">• Zero Dependencies</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            QFoundry npm
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Quantum circuit simulation for JavaScript and TypeScript developers. Pure linear algebra engine with zero runtime dependencies.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] px-3 py-1.5 font-mono text-xs text-slate-700 dark:text-slate-300 shadow-sm">
            <span className="text-slate-400 select-none mr-2">$</span>
            <span>npm install qfoundry</span>
            <button
              onClick={handleCopyInstall}
              className="ml-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Copy install command"
            >
              {copiedInstall ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <a
            href="https://www.npmjs.com/package/qfoundry"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
          >
            <span>View on npm</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Link
            to="/playground"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Open Interactive Playground
          </Link>

          <Link
            to="/docs/npm-quickstart"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors"
          >
            API Documentation
          </Link>
        </div>

        {/* Package Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c0d12]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Package</span>
            <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white mt-0.5">qfoundry</div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Registry</span>
            <a
              href="https://www.npmjs.com/package/qfoundry"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 hover:underline flex items-center gap-1"
            >
              v0.1.0 on npm ↗
            </a>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Runtime</span>
            <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white mt-0.5">Node &amp; Browser</div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Developed &amp; Managed by</span>
            <a
              href="https://www.linkedin.com/in/victor-raj/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5 hover:underline flex items-center gap-1"
            >
              <Linkedin className="w-3.5 h-3.5" />
              Victor Raj ↗
            </a>
          </div>
        </div>
      </div>

      {/* Why QFoundry npm? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Why Use QFoundry npm?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Zero Dependencies
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No Python runtime, no WebAssembly bloat, no external packages. Pure TypeScript compiled for Node.js and modern browsers.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Vectorized State Evolution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Executes in $O(2^N)$ space by bit-mask permuting amplitude pairs rather than building $2^N \times 2^N$ matrices.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Bundled Developer CLI
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Comes with the <code className="text-[11px] font-mono">qfoundry</code> CLI for project scaffolding, instant in-terminal circuit simulation, and benchmarking.
            </p>
          </div>
        </div>
      </div>

      {/* Code Quickstart */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quick Start: Entangled Bell State
          </h2>
          <span className="text-xs font-mono text-slate-400">TypeScript & JavaScript Ready</span>
        </div>

        <CodeBlock
          tabs={[
            {
              label: 'TypeScript',
              language: 'typescript',
              code: `import { QuantumCircuit, Simulator } from 'qfoundry';

// 1. Initialize a 2-qubit circuit
const circuit = new QuantumCircuit(2);

// 2. Apply gates
circuit.h(0);          // Hadamard on qubit 0
circuit.cx(0, 1);      // CNOT: control=0, target=1
circuit.measureAll();  // Add measurement operations

// 3. Simulate with 1024 shots
const result = Simulator.simulate(circuit, { shots: 1024 });

console.log('Execution time:', result.executionTimeMs, 'ms');
console.log('Probabilities:', result.probabilities); // { '00': 0.5, '11': 0.5 }
console.log('Sampled counts:', result.counts);
`,
            },
            {
              label: 'JavaScript (CommonJS)',
              language: 'javascript',
              code: `const { QuantumCircuit, Simulator } = require('qfoundry');

const circuit = new QuantumCircuit(2);
circuit.h(0).cx(0, 1).measureAll();

const result = Simulator.simulate(circuit, { shots: 1024 });
console.log(result.counts);
console.log(circuit.toAscii());
`,
            },
          ]}
        />
      </div>

      {/* Supported Gates Matrix */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Supported Quantum Gates
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          {[
            { name: 'Hadamard', symbol: 'H', method: 'qc.h(q)' },
            { name: 'Pauli-X (NOT)', symbol: 'X', method: 'qc.x(q)' },
            { name: 'Pauli-Y', symbol: 'Y', method: 'qc.y(q)' },
            { name: 'Pauli-Z', symbol: 'Z', method: 'qc.z(q)' },
            { name: 'Phase Gate', symbol: 'S', method: 'qc.s(q)' },
            { name: 'π/8 Gate', symbol: 'T', method: 'qc.t(q)' },
            { name: 'Rotation X', symbol: 'Rx(θ)', method: 'qc.rx(q, θ)' },
            { name: 'Rotation Y', symbol: 'Ry(θ)', method: 'qc.ry(q, θ)' },
            { name: 'Rotation Z', symbol: 'Rz(λ)', method: 'qc.rz(q, λ)' },
            { name: 'Arbitrary Phase', symbol: 'P(λ)', method: 'qc.p(q, λ)' },
            { name: 'Controlled-NOT', symbol: 'CX', method: 'qc.cx(c, t)' },
            { name: 'Controlled-Z', symbol: 'CZ', method: 'qc.cz(c, t)' },
            { name: 'SWAP', symbol: 'SWAP', method: 'qc.swap(q1, q2)' },
            { name: 'Toffoli', symbol: 'CCX', method: 'qc.ccx(c1, c2, t)' },
            { name: 'Universal U', symbol: 'U(θ,φ,λ)', method: 'qc.u(q, θ, φ, λ)' },
            { name: 'Measurement', symbol: 'M', method: 'qc.measure(q)' },
          ].map((gate) => (
            <div
              key={gate.symbol}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 dark:text-slate-100">{gate.symbol}</span>
                <span className="text-[10px] text-slate-400">{gate.name}</span>
              </div>
              <code className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                {gate.method}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

