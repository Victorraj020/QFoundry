# qfoundry

> High-performance quantum circuit simulation and CLI developer tooling for JavaScript and TypeScript.

[![npm version](https://img.shields.io/npm/v/qfoundry.svg?style=flat-square&color=22c55e)](https://www.npmjs.com/package/qfoundry)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg?style=flat-square)](#)

`qfoundry` is a lightweight, zero-dependency quantum circuit simulator designed for Node.js, browsers, and edge environments. It features a fluent circuit builder, full Clifford+T and parametric rotation gate libraries, exact statevector simulation, multi-shot measurement sampling, and a built-in CLI runner.

---

## ✨ Features

- **🚀 Exact Statevector Engine**: Simulates quantum states with double-precision complex amplitudes.
- **⚡ Zero External Dependencies**: Pure mathematical implementation — fast, auditable, and runs anywhere.
- **📐 Complete Gate Library**:
  - **Single-Qubit**: Hadamard ($H$), Pauli ($X, Y, Z$), Phase ($S, T, S^\dagger, T^\dagger$).
  - **Parametric Rotations**: $R_x(\theta)$, $R_y(\theta)$, $R_z(\lambda)$, Phase $P(\lambda)$, Arbitrary Euler $U(\theta, \phi, \lambda)$.
  - **Multi-Qubit**: $CX$ (CNOT), $CY$, $CZ$, $SWAP$, and $CCX$ (Toffoli).
- **📊 Multi-Shot Measurement**: Monte-Carlo measurement sampling, shot histogram generation, and expectation values.
- **📟 ASCII Circuit Visualizer**: Generate terminal-friendly ASCII diagrams directly from code via `qc.toAscii()`.
- **🛠️ Built-in CLI**: Scaffold projects, run benchmarks, and simulate circuits with `npx qfoundry`.
- **🔷 First-Class TypeScript**: Strict types, comprehensive IntelliSense, and auto-generated `.d.ts` definitions.

---

## 📦 Installation

\`\`\`bash
# Install as a project dependency
npm install qfoundry

# Or using pnpm / yarn
pnpm add qfoundry
yarn add qfoundry
\`\`\`

---

## 🚀 Quick Start

### Create a 2-Qubit Bell State ($|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$)

\`\`\`typescript
import { QuantumCircuit, Simulator } from 'qfoundry';

// 1. Initialize a 2-qubit register
const qc = new QuantumCircuit(2);

// 2. Build the circuit: H on q[0], CX with control 0, target 1
qc.h(0)
  .cx(0, 1)
  .measureAll();

// 3. Print the ASCII circuit diagram
console.log(qc.toAscii());
// Output:
// q_0: ──[H]───●───[M]──────
// q_1: ────────⊕────────[M]─

// 4. Run the statevector simulation (1024 shots)
const result = Simulator.simulate(qc, { shots: 1024 });

console.log('Probabilities:', result.probabilities);
// Output: { '00': 0.5, '11': 0.5 }

console.log('Measurement Counts:', result.counts);
// Output: { '00': 512, '11': 512 } (approx)

console.log(\`Execution Time: \${result.executionTimeMs.toFixed(2)}ms\`);
\`\`\`

---

## 🛠️ Command-Line Interface (CLI)

Run circuits and benchmarks directly from your terminal with `npx`:

\`\`\`bash
# 1. Run a quick Bell State simulation
npx qfoundry simulate

# 2. Inspect available quantum gates and unitaries
npx qfoundry gates

# 3. Run statevector performance scaling benchmark (2 to 12 qubits)
npx qfoundry benchmark

# 4. Scaffold a new quantum application template
npx qfoundry init my-quantum-app
\`\`\`

---

## 📖 API Reference

### `QuantumCircuit(numQubits: number)`

Fluent class for constructing quantum algorithms.

| Method | Parameters | Description |
| :--- | :--- | :--- |
| `h(target)` | `target: number` | Hadamard gate ($H$) |
| `x(target)` | `target: number` | Pauli-X (NOT) gate |
| `y(target)` | `target: number` | Pauli-Y gate |
| `z(target)` | `target: number` | Pauli-Z (phase flip) gate |
| `s(target)` | `target: number` | Phase gate ($S = \sqrt{Z}$) |
| `t(target)` | `target: number` | $\pi/8$ gate ($T = \sqrt{S}$) |
| `rx(target, theta)` | `target: number, theta: number` | Rotation around X-axis by $\theta$ radians |
| `ry(target, theta)` | `target: number, theta: number` | Rotation around Y-axis by $\theta$ radians |
| `rz(target, lambda)` | `target: number, lambda: number` | Rotation around Z-axis by $\lambda$ radians |
| `p(target, lambda)` | `target: number, lambda: number` | Phase shift by $\lambda$ radians |
| `u(target, theta, phi, lambda)` | `theta, phi, lambda: number` | Generic 3-parameter single-qubit unitary |
| `cx(control, target)` | `control, target: number` | Controlled-NOT (CNOT) gate |
| `cz(control, target)` | `control, target: number` | Controlled-Z gate |
| `swap(q1, q2)` | `q1, q2: number` | SWAP gate between two qubits |
| `ccx(c1, c2, target)` | `c1, c2, target: number` | Toffoli (Controlled-Controlled-NOT) gate |
| `measure(target)` | `target: number` | Add measurement operation to qubit |
| `measureAll()` | — | Measure all qubits in the register |
| `toAscii()` | — | Returns ASCII wire diagram string |
| `getDepth()` | — | Returns circuit gate depth |

### `Simulator.simulate(circuit, options?)`

Executes the statevector calculation.

```typescript
const result = Simulator.simulate(circuit, {
  shots: 1024,      // Number of measurement samples (default: 1024)
  seed: 42,         // Optional PRNG seed for deterministic measurement sampling
  recordHistory: false // Optional: record statevector after every gate
});
```

#### `SimulationResult` Properties:
- `probabilities`: Record mapping bitstrings (`'00'`, `'11'`) to exact theoretical probabilities ($|\alpha|^2$).
- `statevector`: Raw array of complex numbers for all $2^N$ basis states.
- `counts`: Observed measurement frequencies across the requested `shots`.
- `samples`: Array of individual bitstring outcomes in shot order.
- `executionTimeMs`: Simulation execution wall-clock time in milliseconds.

---

## 🔬 Algorithm Examples

### 3-Qubit GHZ State ($|GHZ\rangle = \frac{|000\rangle + |111\rangle}{\sqrt{2}}$)

```typescript
import { QuantumCircuit, Simulator } from 'qfoundry';

const qc = new QuantumCircuit(3);
qc.h(0)
  .cx(0, 1)
  .cx(1, 2)
  .measureAll();

const res = Simulator.simulate(qc);
console.log(res.probabilities);
// Output: { '000': 0.5, '111': 0.5 }
```

### 2-Qubit Grover Search (Target $|11\rangle$)

```typescript
import { QuantumCircuit, Simulator } from 'qfoundry';

const qc = new QuantumCircuit(2);

// Equal superposition
qc.h(0).h(1);

// Oracle marking |11> (Controlled-Z)
qc.cz(0, 1);

// Grover Diffusion operator
qc.h(0).h(1)
  .x(0).x(1)
  .cz(0, 1)
  .x(0).x(1)
  .h(0).h(1)
  .measureAll();

const res = Simulator.simulate(qc);
console.log(res.probabilities);
// Output: { '11': 1.0 } (Exact constructive interference)
```

---

## 🌐 QFoundry Developer Ecosystem

`qfoundry` is part of the **QFoundry Ecosystem**:
- **[QFoundry VS Code Extension](https://marketplace.visualstudio.com/)**: Quantum development directly inside VS Code with real-time circuit diagrams and statevector debugging.
- **[Vic (vic-nlp)](https://pypi.org/project/vic-nlp/)**: AI-Powered Computer Interface, AutoML studio, and natural language creation.

---

## 📄 License

MIT © [Victorraj](https://github.com/Victorraj020)

