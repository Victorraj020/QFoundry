/**
 * @file TerminalPage.tsx
 * @description Interactive developer CLI terminal with Mode A (Demonstration) and Mode B (Real Quantum Simulator).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Copy, Check, Trash2, Cpu, ArrowRight, ShieldCheck, Play } from 'lucide-react';
import { QuantumCircuit, Simulator } from 'qfoundry';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

export const TerminalPage: React.FC = () => {
  const [mode, setMode] = useState<'demo' | 'real'>('real');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: 'system',
      text: '◆ QFoundry Interactive Developer Shell [v0.1.0-alpha.1]',
    },
    {
      type: 'system',
      text: 'Type "help" for available commands, or click any chip below to execute.',
    },
    {
      type: 'output',
      text: 'Status: In-memory JavaScript/TypeScript Quantum Simulator connected.\n',
    },
  ]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const newLines: TerminalLine[] = [...lines, { type: 'input', text: trimmed }];

    if (trimmed === 'clear') {
      setLines([]);
      setInput('');
      return;
    }

    if (trimmed === 'help') {
      newLines.push({
        type: 'output',
        text: `Available Commands:
  simulate              Run a 2-qubit Bell State simulation and print ASCII circuit
  simulate ghz          Simulate a 3-qubit GHZ state (|000⟩ + |111⟩)
  simulate grover       Simulate 2-qubit Grover Search for target state |11⟩
  gates                 List all supported unitary gates & matrices
  benchmark             Run in-browser statevector scaling benchmark (2 to 10 qubits)
  init <project>        Simulate scaffolding a quantum TypeScript project
  vic --gui             Launch Vic AI Computer Interface Dashboard
  vic "..."             Run natural language command with Vic (e.g. vic "make a snake game")
  vic -i                Start Vic interactive REPL session
  clear                 Clear terminal output screen
  help                  Display this command reference`,
      });
    } else if (trimmed === 'gates') {
      newLines.push({
        type: 'output',
        text: `Supported Quantum Gates in QFoundry:
  • Single-Qubit:     H (Hadamard), X (NOT), Y, Z (Phase-flip), S, T, Sdg, Tdg
  • Rotations:        Rx(θ), Ry(θ), Rz(λ), P(λ), U(θ, φ, λ)
  • Two-Qubit:        CX (CNOT), CY, CZ, SWAP
  • Three-Qubit:      CCX (Toffoli)
  • Measurement:      measure(qubit), measureAll()`,
      });
    } else if (trimmed.startsWith('simulate ghz')) {
      // Real simulation of GHZ
      const qc = new QuantumCircuit(3);
      qc.h(0);
      qc.cx(0, 1);
      qc.cx(1, 2);
      qc.measureAll();
      const res = Simulator.simulate(qc, { shots: 1024 });

      newLines.push({
        type: 'output',
        text: `${qc.toAscii()}\n\nStatevector Probabilities:\n${JSON.stringify(res.probabilities, null, 2)}\n\nMeasurement Counts (1024 shots):\n${JSON.stringify(res.counts, null, 2)}`,
      });
      newLines.push({
        type: 'success',
        text: `✔ 3-Qubit GHZ Simulation completed in ${res.executionTimeMs}ms. State Dimension: 8`,
      });
    } else if (trimmed.startsWith('simulate grover')) {
      const qc = new QuantumCircuit(2);
      qc.h(0);
      qc.h(1);
      qc.cz(0, 1); // Oracle for |11>
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
      const res = Simulator.simulate(qc, { shots: 1024 });

      newLines.push({
        type: 'output',
        text: `${qc.toAscii()}\n\nResult Counts (100% target |11⟩):\n${JSON.stringify(res.counts, null, 2)}`,
      });
      newLines.push({
        type: 'success',
        text: `✔ Grover Search completed in ${res.executionTimeMs}ms. Target |11⟩ amplified with probability 1.0!`,
      });
    } else if (trimmed.startsWith('simulate') || trimmed === 'run') {
      const qc = new QuantumCircuit(2);
      qc.h(0);
      qc.cx(0, 1);
      qc.measureAll();
      const res = Simulator.simulate(qc, { shots: 1024 });

      newLines.push({
        type: 'output',
        text: `${qc.toAscii()}\n\nStatevector Probabilities:\n${JSON.stringify(res.probabilities, null, 2)}\n\nSampled Shots (1024 shots):\n${JSON.stringify(res.counts, null, 2)}`,
      });
      newLines.push({
        type: 'success',
        text: `✔ Bell State simulation completed in ${res.executionTimeMs}ms.`,
      });
    } else if (trimmed === 'benchmark') {
      let log = 'Benchmarking statevector scaling in browser JavaScript engine:\n';
      for (let n = 2; n <= 10; n += 2) {
        const qc = new QuantumCircuit(n);
        for (let i = 0; i < n; i++) qc.h(i);
        for (let i = 0; i < n - 1; i++) qc.cx(i, i + 1);
        const res = Simulator.simulate(qc, { shots: 512 });
        log += `  Qubits: ${n.toString().padStart(2)} | Dimension: ${(1 << n).toString().padStart(5)} | Depth: ${qc.getDepth().toString().padStart(2)} | Time: ${res.executionTimeMs.toFixed(2)}ms\n`;
      }
      newLines.push({ type: 'output', text: log });
      newLines.push({
        type: 'success',
        text: '✔ Statevector scaling benchmark completed successfully.',
      });
    } else if (trimmed.startsWith('init')) {
      const parts = trimmed.split(' ');
      const proj = parts[1] || 'my-quantum-app';
      newLines.push({
        type: 'output',
        text: `Creating project template in ./${proj}...\n  + package.json\n  + tsconfig.json\n  + src/index.ts (Bell State sample)\n  + README.md`,
      });
      newLines.push({
        type: 'success',
        text: `✔ Project "${proj}" initialized. Next steps:\n  cd ${proj} && npm install && npx qfoundry simulate`,
      });
    } else if (trimmed === 'vic --gui') {
      newLines.push({
        type: 'output',
        text: `[Vic v0.3.0] Starting Visual Dashboard...
  ✔ Peek Assistant initialized on local interface
  ✔ AI No-Code Studio (AutoML) engine ready
  ✔ Local model registry loaded (0 cloud connections)
Dashboard window opened in GUI mode. Press Ctrl+C in terminal to stop.`,
      });
      newLines.push({
        type: 'success',
        text: '✔ Visual Dashboard running. Click "Modify in Editor" inside GUI to edit apps.',
      });
    } else if (trimmed === 'vic -i') {
      newLines.push({
        type: 'output',
        text: `Vic — The AI-Powered Computer Interface (v0.3.0)
Type commands in plain English or 'exit' to quit.
vic> open calculator -> [Vic] Calculator launched
vic> what is my ip address -> [Vic] 192.168.1.104
vic> make a snake game -> [Vic] Generated snake_game.py (62 lines)`,
      });
    } else if (trimmed.startsWith('vic')) {
      const prompt = trimmed.replace(/^vic\s*/, '').replace(/^["']|["']$/g, '');
      if (prompt.includes('snake')) {
        newLines.push({
          type: 'output',
          text: `[Vic] Analyzing instruction: "${prompt}"
  • Identified task: Software generation (Game)
  • Target framework: Python turtle graphics
  • Writing file: snake_game.py (heavily commented)
  • Validating code syntax... OK`,
        });
        newLines.push({
          type: 'success',
          text: '✔ Successfully generated snake_game.py. Run with: python snake_game.py',
        });
      } else if (prompt.includes('calculator')) {
        newLines.push({
          type: 'output',
          text: `[Vic] Analyzing instruction: "${prompt}"
  • Identified action: Launch native desktop calculator
  • Executing subprocess: /usr/bin/calc or calc.exe... OK`,
        });
        newLines.push({
          type: 'success',
          text: '✔ Calculator launched successfully.',
        });
      } else if (prompt.includes('ip')) {
        newLines.push({
          type: 'output',
          text: `[Vic] System Network Diagnostics (via psutil & socket):
  • Local Hostname: victor-station.local
  • Local IPv4:     192.168.1.104
  • Subnet Mask:    255.255.255.0
  • Gateway:        192.168.1.1
  • Status:         Connected (1000 Mbps Full Duplex)`,
        });
      } else {
        newLines.push({
          type: 'output',
          text: `[Vic v0.3.0] Processed natural language instruction: "${prompt || 'help'}"
  • Engine: Vic Smarter Engine with typo correction
  • Mode: 100% Local execution (psutil / Python >= 3.7)
  • Generated code: clean_app.py (ready for inspection in editor)`,
        });
        newLines.push({
          type: 'success',
          text: '✔ Command executed locally with zero cloud data transmission.',
        });
      }
    } else {
      newLines.push({
        type: 'error',
        text: `Command not found: "${trimmed}". Type "help" for a list of valid commands.`,
      });
    }

    setLines(newLines);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const copyTerminalOutput = () => {
    const fullText = lines.map((l) => (l.type === 'input' ? `$ ${l.text}` : l.text)).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Interactive Terminal
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              Browser CLI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Execute real quantum circuits and inspect ASCII wires and complex state vectors directly in your browser.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <button
              onClick={() => setMode('real')}
              className={`px-3 py-1 rounded-md transition-colors ${
                mode === 'real'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Mode B: Real Simulation
            </button>
            <button
              onClick={() => setMode('demo')}
              className={`px-3 py-1 rounded-md transition-colors ${
                mode === 'demo'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Mode A: Demonstration
            </button>
          </div>
        </div>
      </div>

      {/* Quick Execution Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-mono text-slate-400">Quick run:</span>
        {[
          'simulate',
          'simulate ghz',
          'simulate grover',
          'gates',
          'benchmark',
          'vic --gui',
          'vic "make a snake game"',
          'vic "what is my ip address"',
          'help',
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Window */}
      <div className="rounded-xl overflow-hidden border border-slate-700/60 dark:border-slate-800 bg-[#0e1015] shadow-2xl flex flex-col h-[520px]">
        {/* Terminal Title Bar */}
        <div className="px-4 py-2.5 bg-[#141720] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="text-xs font-mono text-slate-400 ml-2">
              victor@qfoundry:~ ({mode === 'real' ? 'Real Simulator' : 'Demo Terminal'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyTerminalOutput}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setLines([])}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Clear terminal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div
          className="flex-1 p-4 overflow-y-auto font-mono text-[13px] leading-relaxed text-slate-200 space-y-2 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, idx) => {
            if (line.type === 'input') {
              return (
                <div key={idx} className="flex items-start gap-2 text-emerald-400 font-semibold">
                  <span className="text-slate-500 select-none">$</span>
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.type === 'system') {
              return (
                <div key={idx} className="text-slate-400 text-xs italic">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'success') {
              return (
                <div key={idx} className="text-emerald-400 whitespace-pre-wrap">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={idx} className="text-rose-400 whitespace-pre-wrap">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={idx} className="text-slate-300 whitespace-pre-wrap">
                {line.text}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Line */}
        <div className="px-4 py-3 bg-[#11131a] border-t border-slate-800/80 flex items-center gap-2">
          <span className="font-mono text-emerald-500 font-bold select-none">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (e.g. simulate, benchmark, gates)..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-[13px] text-white placeholder-slate-600 focus:ring-0"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

