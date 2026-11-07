/**
 * @file SearchModal.tsx
 * @description Cmd+K documentation and ecosystem search modal.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, FileText, Terminal, Layers } from 'lucide-react';

export interface SearchItem {
  id: string;
  title: string;
  category: string;
  snippet: string;
  path: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Products
  { id: 'p-ext', title: 'QFoundry VS Code Extension', category: 'Product', snippet: 'Real-time quantum circuit visualization, debugging and optimization inside VS Code.', path: '/products/extension' },
  { id: 'p-npm', title: 'QFoundry npm Library', category: 'Product', snippet: 'Quantum circuit simulation for JavaScript and TypeScript developers.', path: '/products/npm' },
  { id: 'p-vic', title: 'Vic — AI Computer Interface', category: 'Product', snippet: 'No-code AI studio, AutoML, and natural language desktop creation (v0.3.0 on PyPI).', path: '/products/vicnlp' },
  
  // Interactive Tools
  { id: 't-play', title: 'Quantum Playground', category: 'Tool', snippet: 'Interactive 3-panel quantum IDE: Code Editor, Circuit Visualizer, and Statevector Simulation.', path: '/playground' },
  { id: 't-term', title: 'Interactive CLI Terminal', category: 'Tool', snippet: 'Browser-based demonstration and real-simulation quantum CLI runner.', path: '/terminal' },
  { id: 't-res', title: 'Research & Benchmarks', category: 'Research', snippet: 'Statevector scaling, numerical accuracy, and hybrid quantum-classical machine learning.', path: '/research' },

  // NPM Documentation
  { id: 'd-quick', title: 'Quick Start & Installation', category: 'QFoundry npm', snippet: 'Install via npm install qfoundry and run your first 2-qubit Bell state circuit.', path: '/docs/npm-quickstart' },
  { id: 'd-fund', title: 'Quantum Fundamentals', category: 'QFoundry npm', snippet: 'Qubits, Dirac notation, complex amplitudes, superposition, and entanglement.', path: '/docs/npm-fundamentals' },
  { id: 'd-gates', title: 'Gate Reference & Unitary Operations', category: 'QFoundry npm', snippet: 'H, X, Y, Z, S, T, CX, CZ, CCX (Toffoli), Rx, Ry, Rz, U and SWAP gates.', path: '/docs/npm-gates' },
  { id: 'd-sim', title: 'Statevector Simulation & Sampling', category: 'QFoundry npm', snippet: 'Exact statevector simulation, probability calculation, and multi-shot measurement sampling.', path: '/docs/npm-simulation' },
  { id: 'd-cli', title: 'QFoundry CLI Guide', category: 'QFoundry npm', snippet: 'Commands: qfoundry init, qfoundry run, qfoundry simulate, qfoundry benchmark.', path: '/docs/npm-cli' },
  { id: 'd-api', title: 'API Reference: QuantumCircuit & Simulator', category: 'QFoundry npm', snippet: 'Complete TypeScript interface reference for QuantumCircuit, Simulator, and Complex math.', path: '/docs/npm-api' },
  { id: 'd-algo', title: 'Quantum Algorithms & Examples', category: 'QFoundry npm', snippet: 'Bell State, GHZ State, Deutsch Algorithm, Grover Search, and Quantum Teleportation.', path: '/docs/npm-examples' },

  // Extension Documentation
  { id: 'd-ext-overview', title: 'Extension Overview & Installation', category: 'VS Code Extension', snippet: 'v2.2.0 installation, requirements, and VS Code marketplace setup.', path: '/docs/ext-overview' },
  { id: 'd-ext-arch', title: 'Two-Parser Architecture & JSON-RPC', category: 'VS Code Extension', snippet: 'TypeScript regex fast-path and Python deep AST analysis over stdio IPC.', path: '/docs/ext-architecture' },
  { id: 'd-ext-opt', title: 'Quantum Circuit Optimizer', category: 'VS Code Extension', snippet: 'Topological gate cancellation and rotation merging directly in your editor.', path: '/docs/ext-optimizer' },
  { id: 'd-ext-algo', title: 'Quantum Algorithm Explorer', category: 'VS Code Extension', snippet: '9 core algorithms, 3D Bloch sphere, animated circuit playback, and mathematical derivations.', path: '/docs/ext-algorithms' },

  // Vic (vic-nlp) Documentation
  { id: 'd-vic-arch', title: 'Vic Overview & Architecture', category: 'Vic (vic-nlp)', snippet: 'AI No-Code Studio (AutoML), Visual Dashboard, and Editable Python Apps.', path: '/docs/vic-pipeline' },
  { id: 'd-vic-cli', title: 'Vic CLI Reference & Interactive Mode', category: 'Vic (vic-nlp)', snippet: 'vic --gui, vic "make a snake game", vic -i, and terminal workflows.', path: '/docs/vic-cli' },
  { id: 'd-vic-local', title: 'Vic Local & Private Architecture', category: 'Vic (vic-nlp)', snippet: '100% on-device AI training and system commands without cloud data leakage.', path: '/docs/vic-privacy' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filtered = SEARCH_ITEMS.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.snippet.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          navigate(filtered[selectedIndex].path);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filtered, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#11131a] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search documentation, products, guides, and APIs..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-start justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800/70'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-400">
                      {item.category === 'Product' ? (
                        <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : item.category === 'Tool' ? (
                        <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                          {item.title}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {item.snippet}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-[#0c0d12] border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[10px]">↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[10px]">↵</kbd> select</span>
            <span><kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[10px]">ESC</kbd> dismiss</span>
          </div>
          <span>QFoundry Ecosystem</span>
        </div>
      </div>
    </div>
  );
};
