/**
 * @file ExtensionProductPage.tsx
 * @description Dedicated landing and overview page for the QFoundry VS Code Extension (v2.2.0).
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Download,
  ExternalLink,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Zap,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { CodeBlock } from '../components/CodeBlock';
import { QuantumCircuitSVG } from '../components/QuantumCircuitSVG';

export const ExtensionProductPage: React.FC = () => {
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('code --install-extension qfoundry-2.2.0.vsix --force');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Product Hero */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            v2.2.0 • Existing Project
          </span>
          <span className="text-xs font-mono text-slate-500">VS Code Extension</span>
          <span className="text-xs font-mono text-slate-500">• MIT License</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            QFoundry Extension
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Quantum development directly inside Visual Studio Code. Live circuit preview, 20+ gate hover docs, statevector debugger, and algorithm explorer.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] px-3 py-1.5 font-mono text-xs text-slate-700 dark:text-slate-300 shadow-sm">
            <span className="text-slate-400 select-none mr-2">$</span>
            <span>code --install-extension qfoundry-2.2.0.vsix</span>
            <button
              onClick={handleCopyInstall}
              className="ml-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Copy install command"
            >
              {copiedInstall ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <a
            href="https://github.com/Victorraj020/QFoundry"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-sm transition-opacity"
          >
            GitHub Repository
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Link
            to="/docs/ext-overview"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11131a] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors"
          >
            Read Documentation
          </Link>
        </div>
      </div>

      {/* Visual Feature Preview Box */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c0d12] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
            <Activity className="w-4 h-4 text-emerald-500" />
            Live Circuit Preview Panel • Automatic Keystroke Re-Render
          </div>
          <span className="text-[11px] font-mono text-slate-400">Ctrl+Shift+Q / Cmd+Shift+Q</span>
        </div>

        <QuantumCircuitSVG
          numQubits={3}
          gates={[
            { type: 'h', target: 0 },
            { type: 'cx', target: 1, control: 0 },
            { type: 'cx', target: 2, control: 1 },
            { type: 'rx', target: 0, param: 'π/2' },
            { type: 'measure', target: 0 },
            { type: 'measure', target: 1 },
            { type: 'measure', target: 2 },
          ]}
        />
      </div>

      {/* Feature Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Engineered for Modern Quantum Workflows
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              1. Two-Parser Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              TypeScript regex fast path renders circuit diagrams on every keystroke in &lt;15ms. Python deep path calculates exact DAG depth and entanglement properties in the background.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              2. Interactive Circuit Debugger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Step forward and backward gate-by-gate with timeline scrubbing. View real and imaginary amplitude components, Dirac state notation, and HSL phase disks mapped to an SVG color wheel.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              3. Circuit Optimizer (v2.0.0+)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automated static analysis passes cancel consecutive self-inverse pairs (H/H, X/X, CX/CX) and mutual-inverse pairs (T/T†, S/S†), merge rotations, and safely rewrite code in-place.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              4. Quantum Algorithm Explorer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Step-by-step educational execution engine for 9 foundational algorithms (Deutsch, Deutsch-Jozsa, Bernstein-Vazirani, Grover, Teleportation, Superdense Coding, QFT, Simon, Shor) with 3D Bloch sphere projections.
            </p>
          </div>
        </div>
      </div>

      {/* VS Code Commands Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Contributed Commands & Keybindings
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-[#11131a] border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="py-3 px-4">Command Identifier</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">macOS</th>
                <th className="py-3 px-4">Windows / Linux</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#0c0d12]">
              <tr>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">qforge.openCircuitPreview</td>
                <td className="py-3 px-4 text-slate-800 dark:text-slate-200">Open Circuit Preview</td>
                <td className="py-3 px-4"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">Cmd+Shift+Q</kbd></td>
                <td className="py-3 px-4"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">Ctrl+Shift+Q</kbd></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">qforge.openTimeline</td>
                <td className="py-3 px-4 text-slate-800 dark:text-slate-200">Open Circuit Timeline</td>
                <td className="py-3 px-4"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">Cmd+Shift+T</kbd></td>
                <td className="py-3 px-4"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">Ctrl+Shift+T</kbd></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">qforge.explainCircuit</td>
                <td className="py-3 px-4 text-slate-800 dark:text-slate-200">Explain Circuit</td>
                <td className="py-3 px-4"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">Cmd+Shift+E</kbd></td>
                <td className="py-3 px-4"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">Ctrl+Shift+E</kbd></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">qforge.openAlgorithmExplorer</td>
                <td className="py-3 px-4 text-slate-800 dark:text-slate-200">Open Algorithm Explorer</td>
                <td className="py-3 px-4"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">Cmd+Shift+A</kbd></td>
                <td className="py-3 px-4"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">Ctrl+Shift+A</kbd></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quantum Python Code Example */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Example Quantum Script with Instant Visualization
        </h2>
        <CodeBlock
          language="python"
          filename="test_circuit.py"
          code={`# Quantum circuit definition
import math

# Create a 2-qubit QuantumCircuit
qc = QuantumCircuit(2)

# Prepare superposition and entanglement
qc.h(0)
qc.cx(0, 1)

# Parameterized rotation
qc.ry(math.pi / 4, 0)

# Measure all qubits
qc.measure_all()
`}
        />
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Does QFoundry require Python installed to show circuit previews?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No. QFoundry uses a dual-engine architecture: the built-in TypeScript fast parser extracts circuit topology instantly without any Python dependency. A Python backend is only needed for advanced statevector simulation and transpiler DAG passes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] space-y-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              How does the extension communicate with the Python server?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Communication uses JSON-RPC 2.0 over standard I/O (stdin/stdout). This avoids opening local HTTP ports or triggering firewall warnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
