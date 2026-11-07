/**
 * @file PlaygroundPage.tsx
 * @description Interactive 3-Panel Quantum Playground: Code Editor, Circuit Visualizer, and Simulation Results.
 */

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Info, Sparkles, Terminal, Activity, Layers } from 'lucide-react';
import { QuantumCircuit, Simulator, SimulationResult } from 'qfoundry';
import { QuantumCircuitSVG, GateVisual } from '../components/QuantumCircuitSVG';

interface Preset {
  id: string;
  name: string;
  qubits: number;
  description: string;
  code: string;
  builder: (qc: QuantumCircuit) => void;
  visualGates: GateVisual[];
}

const PRESETS: Preset[] = [
  {
    id: 'bell',
    name: 'Bell State (|Φ⁺⟩)',
    qubits: 2,
    description: 'Maximally entangled 2-qubit state: (|00⟩ + |11⟩) / √2',
    code: `// Canonical Bell State (|Φ⁺⟩)
const qc = new QuantumCircuit(2);

// Put qubit 0 into superposition
qc.h(0);

// Entangle qubit 0 and qubit 1
qc.cx(0, 1);

// Measure both qubits
qc.measureAll();

const result = Simulator.simulate(qc, { shots: 1024 });
`,
    builder: (qc) => {
      qc.h(0);
      qc.cx(0, 1);
      qc.measureAll();
    },
    visualGates: [
      { type: 'h', target: 0 },
      { type: 'cx', target: 1, control: 0 },
      { type: 'measure', target: 0 },
      { type: 'measure', target: 1 },
    ],
  },
  {
    id: 'ghz',
    name: 'GHZ State (3 Qubits)',
    qubits: 3,
    description: '3-qubit maximally entangled Greenberger–Horne–Zeilinger state: (|000⟩ + |111⟩) / √2',
    code: `// 3-Qubit GHZ State (|000⟩ + |111⟩) / √2
const qc = new QuantumCircuit(3);

qc.h(0);
qc.cx(0, 1);
qc.cx(1, 2);
qc.measureAll();

const result = Simulator.simulate(qc, { shots: 1024 });
`,
    builder: (qc) => {
      qc.h(0);
      qc.cx(0, 1);
      qc.cx(1, 2);
      qc.measureAll();
    },
    visualGates: [
      { type: 'h', target: 0 },
      { type: 'cx', target: 1, control: 0 },
      { type: 'cx', target: 2, control: 1 },
      { type: 'measure', target: 0 },
      { type: 'measure', target: 1 },
      { type: 'measure', target: 2 },
    ],
  },
  {
    id: 'superposition',
    name: 'Equal Superposition (Single Qubit)',
    qubits: 1,
    description: 'Single Hadamard gate preparing state |+⟩ with 50/50 probability.',
    code: `// Equal Superposition |+⟩
const qc = new QuantumCircuit(1);

// Apply Hadamard gate
qc.h(0);
qc.measure(0);

const result = Simulator.simulate(qc, { shots: 1024 });
`,
    builder: (qc) => {
      qc.h(0);
      qc.measure(0);
    },
    visualGates: [
      { type: 'h', target: 0 },
      { type: 'measure', target: 0 },
    ],
  },
  {
    id: 'grover',
    name: "Grover's Search (2 Qubits)",
    qubits: 2,
    description: 'Searches an unsorted database of 4 items for target state |11⟩ in a single iteration.',
    code: `// Grover Search Algorithm (N=4, Target |11⟩)
const qc = new QuantumCircuit(2);

// 1. Equal superposition of all 4 states
qc.h(0);
qc.h(1);

// 2. Phase Oracle marking |11⟩ (Controlled-Z)
qc.cz(0, 1);

// 3. Grover Diffusion Operator
qc.h(0);
qc.h(1);
qc.x(0);
qc.x(1);
qc.cz(0, 1);
qc.x(0);
qc.x(1);
qc.h(0);
qc.h(1);

qc.measureAll();
const result = Simulator.simulate(qc, { shots: 1024 });
`,
    builder: (qc) => {
      qc.h(0);
      qc.h(1);
      qc.cz(0, 1);
      qc.h(0);
      qc.h(1);
      qc.x(0);
      qc.x(1);
      qc.cz(0, 1);
      qc.x(0);
      qc.x(1);
      qc.h(0);
      qc.h(1);
      qc.measureAll();
    },
    visualGates: [
      { type: 'h', target: 0 },
      { type: 'h', target: 1 },
      { type: 'cz', target: 1, control: 0 },
      { type: 'h', target: 0 },
      { type: 'h', target: 1 },
      { type: 'x', target: 0 },
      { type: 'x', target: 1 },
      { type: 'cz', target: 1, control: 0 },
      { type: 'x', target: 0 },
      { type: 'x', target: 1 },
      { type: 'h', target: 0 },
      { type: 'h', target: 1 },
      { type: 'measure', target: 0 },
      { type: 'measure', target: 1 },
    ],
  },
  {
    id: 'teleportation',
    name: 'Quantum Teleportation Protocol',
    qubits: 3,
    description: 'Transfers unknown quantum state from Alice to Bob using an EPR pair and classical communication.',
    code: `// Quantum Teleportation Protocol
const qc = new QuantumCircuit(3);

// Prepare arbitrary state on qubit 0 (Alice)
qc.h(0);
qc.rz(0, Math.PI / 4);

// Create shared Bell pair between Alice (q1) and Bob (q2)
qc.h(1);
qc.cx(1, 2);

// Alice Bell-state measurement on q0 and q1
qc.cx(0, 1);
qc.h(0);
qc.measure(0);
qc.measure(1);

// Bob conditionally corrects q2 based on measurement
qc.cx(1, 2);
qc.cz(0, 2);
qc.measure(2);

const result = Simulator.simulate(qc, { shots: 1024 });
`,
    builder: (qc) => {
      qc.h(0);
      qc.rz(0, Math.PI / 4);
      qc.h(1);
      qc.cx(1, 2);
      qc.cx(0, 1);
      qc.h(0);
      qc.measure(0);
      qc.measure(1);
      qc.cx(1, 2);
      qc.cz(0, 2);
      qc.measure(2);
    },
    visualGates: [
      { type: 'h', target: 0 },
      { type: 'rz', target: 0, param: 'π/4' },
      { type: 'h', target: 1 },
      { type: 'cx', target: 2, control: 1 },
      { type: 'cx', target: 1, control: 0 },
      { type: 'h', target: 0 },
      { type: 'measure', target: 0 },
      { type: 'measure', target: 1 },
      { type: 'cx', target: 2, control: 1 },
      { type: 'cz', target: 2, control: 0 },
      { type: 'measure', target: 2 },
    ],
  },
];

export const PlaygroundPage: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState('bell');
  const [language, setLanguage] = useState<'typescript' | 'javascript'>('typescript');
  const [editableCode, setEditableCode] = useState(PRESETS[0].code);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'statevector'>('results');

  const currentPreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  const runSimulation = () => {
    try {
      const qc = new QuantumCircuit(currentPreset.qubits);
      currentPreset.builder(qc);
      const res = Simulator.simulate(qc, { shots: 1024 });
      setSimulationResult(res);
    } catch (e) {
      console.error('Simulation error:', e);
    }
  };

  useEffect(() => {
    setEditableCode(currentPreset.code);
    runSimulation();
  }, [selectedPresetId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setEditableCode(currentPreset.code);
    runSimulation();
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)]">
      {/* Top Header & Presets Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Quantum Playground
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
              Live Engine v0.1.0
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build, visualize, and simulate quantum circuits in real time using the QFoundry in-memory simulation engine.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500 font-medium">Algorithm Preset:</label>
          <select
            value={selectedPresetId}
            onChange={(e) => setSelectedPresetId(e.target.value)}
            className="text-xs font-medium bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={runSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Simulation</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* PANEL 1: Code Editor (Cols 1-4) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] shadow-sm overflow-hidden flex flex-col h-[680px]">
          {/* Header */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#161822] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Code Editor
              </span>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex bg-slate-200 dark:bg-slate-800 rounded-md p-0.5 text-[11px]">
                <button
                  onClick={() => setLanguage('typescript')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    language === 'typescript'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  TS
                </button>
                <button
                  onClick={() => setLanguage('javascript')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    language === 'javascript'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  JS
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                title="Reset code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Textarea code editor */}
          <div className="flex-1 p-3 bg-[#0d0f15] font-mono text-xs text-slate-200 overflow-y-auto">
            <textarea
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              className="w-full h-full bg-transparent resize-none border-none outline-none leading-relaxed font-mono text-[12px] text-slate-100 placeholder-slate-500"
              spellCheck={false}
            />
          </div>

          {/* Editor status bar */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-[#141620] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>{currentPreset.qubits} Qubits Allocated</span>
            <span>qfoundry in-browser core</span>
          </div>
        </div>

        {/* PANEL 2: Quantum Circuit Visualizer (Cols 5-8) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] shadow-sm overflow-hidden flex flex-col h-[680px]">
          {/* Header */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#161822] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quantum Circuit Visualizer
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Depth: {simulationResult?.circuitDepth ?? 0}
            </span>
          </div>

          {/* Description banner */}
          <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/60 dark:border-slate-800/40 text-xs text-slate-500 dark:text-slate-400">
            {currentPreset.description}
          </div>

          {/* SVG Diagram Canvas */}
          <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-slate-50/30 dark:bg-[#0c0d12]">
            <QuantumCircuitSVG
              numQubits={currentPreset.qubits}
              gates={currentPreset.visualGates}
              className="w-full"
            />
          </div>

          {/* Gate Legend */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#141620] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-indigo-200 border border-indigo-400"></span> H
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> CX (CNOT)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-200 border border-amber-400"></span> CZ
              </span>
            </div>
            <span>Pure SVG Render</span>
          </div>
        </div>

        {/* PANEL 3: Simulation Results (Cols 9-12) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] shadow-sm overflow-hidden flex flex-col h-[680px]">
          {/* Header with tabs */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-[#161822] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Simulation Results
              </span>
            </div>

            <div className="flex bg-slate-200 dark:bg-slate-800 rounded-md p-0.5 text-[11px]">
              <button
                onClick={() => setActiveTab('results')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeTab === 'results'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Histogram
              </button>
              <button
                onClick={() => setActiveTab('statevector')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeTab === 'statevector'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                State Vector
              </button>
            </div>
          </div>

          {/* Metrics header */}
          {simulationResult && (
            <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800 text-center py-2 bg-white dark:bg-[#11131a]">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Shots</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {simulationResult.shots}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Exec Time</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  {simulationResult.executionTimeMs} ms
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">State Dim</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  2^{simulationResult.numQubits} = {1 << simulationResult.numQubits}
                </span>
              </div>
            </div>
          )}

          {/* Results Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'results' && simulationResult ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Measurement Counts Histogram
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(simulationResult.counts).map(([state, count]) => {
                      const pct = ((count / simulationResult.shots) * 100).toFixed(1);
                      return (
                        <div key={state} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              |{state}⟩
                            </span>
                            <span className="text-slate-500">
                              {count} shots ({pct}%)
                            </span>
                          </div>
                          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Theoretical Dirac State
                  </h4>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0c0d12] border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto">
                    |ψ⟩ ={' '}
                    {Object.entries(simulationResult.probabilities)
                      .map(([basis, p]) => `${Math.sqrt(p).toFixed(3)}|${basis}⟩`)
                      .join(' + ')}
                  </div>
                </div>
              </div>
            ) : simulationResult ? (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Amplitude Matrix ($2^N$ Hilbert Space)
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                  {simulationResult.stateVector.map((entry) => (
                    <div
                      key={entry.index}
                      className="py-1.5 flex items-center justify-between text-slate-600 dark:text-slate-400"
                    >
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        |{entry.basisState}⟩
                      </span>
                      <span>{entry.amplitude.toString()}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {(entry.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Click &ldquo;Run Simulation&rdquo; to simulate.
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-[#141620] border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              Deterministic seeding supported
            </span>
            <span>Zero cloud dependencies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

