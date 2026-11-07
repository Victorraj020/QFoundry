/**
 * @file docsContent.ts
 * @description Comprehensive, in-depth documentation content across the QFoundry ecosystem.
 */

import { DocSection } from '../types';

export const DOC_SECTIONS: DocSection[] = [
  // -------------------------------------------------------------------------
  // SECTION: QFOUNDRY NPM — GETTING STARTED
  // -------------------------------------------------------------------------
  {
    id: 'npm-get-started',
    title: 'NPM: Getting Started',
    items: [
      {
        id: 'npm-quickstart',
        title: 'Introduction & Quick Start',
        category: 'Getting Started',
        badge: 'Core',
        toc: [
          { id: 'intro', title: 'What is QFoundry npm?' },
          { id: 'requirements', title: 'Requirements & Installation' },
          { id: 'first-circuit', title: 'Your First Quantum Circuit' },
          { id: 'running-code', title: 'Executing the Simulation' },
        ],
        content: `
# QFoundry npm — Introduction & Quick Start

**QFoundry npm** is a lightweight, zero-dependency quantum circuit construction and statevector simulation library designed for modern JavaScript and TypeScript environments. It runs natively in both Node.js runtimes and web browsers.

> [!NOTE]
> QFoundry npm is currently in active alpha development (\`v0.1.0-alpha.1\`). It provides statevector simulation for circuits up to 16 qubits with exact complex amplitude calculations.

---

<h2 id="intro">What is QFoundry npm?</h2>

While traditional quantum computing frameworks require extensive Python ecosystems, web developers and educators often require instant, client-side quantum simulation without requiring a Python runtime or local server process.

QFoundry npm fills this gap by offering:
- **Zero Runtime Dependencies**: Pure TypeScript implementation compiled to ESM and CommonJS.
- **Fluent API**: Chainable \`QuantumCircuit\` builder mirroring modern quantum development conventions.
- **Exact Statevector Evolution**: Rigorous complex amplitude matrix multiplications in $2^N$-dimensional Hilbert space.
- **Multi-shot Sampling**: Realistic measurement sampling with customizable shot counts and deterministic random seeds.
- **Terminal CLI**: Run, initialize, and benchmark quantum circuits directly from your terminal.

---

<h2 id="requirements">Requirements & Installation</h2>

QFoundry npm requires **Node.js v18.0.0** or later.

Install the package via your preferred package manager:

\`\`\`bash
# Using npm
npm install qfoundry

# Using pnpm
pnpm add qfoundry

# Using yarn
yarn add qfoundry
\`\`\`

---

<h2 id="first-circuit">Your First Quantum Circuit</h2>

Let's build a canonical Bell State ($|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$), which entangles two qubits such that measuring one immediately determines the state of the other:

\`\`\`typescript
import { QuantumCircuit, Simulator } from 'qfoundry';

// 1. Initialize a 2-qubit circuit (qubits start in |00>)
const circuit = new QuantumCircuit(2);

// 2. Put qubit 0 into equal superposition: (|0> + |1>) / √2
circuit.h(0);

// 3. Entangle qubit 0 and qubit 1 via CNOT (CX)
circuit.cx(0, 1);

// 4. Measure both qubits
circuit.measureAll();

// 5. Inspect the ASCII diagram
console.log(circuit.toAscii());
\`\`\`

---

<h2 id="running-code">Executing the Simulation</h2>

Execute the circuit using the built-in statevector simulator:

\`\`\`typescript
// Simulate with 1024 measurement shots
const result = Simulator.simulate(circuit, { shots: 1024 });

console.log('Execution Time:', result.executionTimeMs, 'ms');
console.log('Theoretical Probabilities:', result.probabilities);
// Output: { '00': 0.5, '11': 0.5 }

console.log('Sampled Measurement Counts:', result.counts);
// Output: { '00': 514, '11': 510 }
\`\`\`
`,
      },
      {
        id: 'npm-fundamentals',
        title: 'Quantum Fundamentals',
        category: 'Getting Started',
        toc: [
          { id: 'qubits', title: 'Qubits & Quantum States' },
          { id: 'superposition', title: 'Complex Amplitudes & Superposition' },
          { id: 'entanglement', title: 'Entanglement & Multi-Qubit States' },
          { id: 'measurement', title: 'Wavefunction Collapse & Born Rule' },
        ],
        content: `
# Quantum Fundamentals

Understanding quantum computing requires shifting from classical binary logic ($0$ or $1$) to probability amplitudes in linear algebra.

---

<h2 id="qubits">Qubits & Quantum States</h2>

In classical computing, a bit is strictly $0$ or $1$. A quantum bit (**qubit**) exists as a linear combination (superposition) of the two orthonormal basis states $|0\\rangle$ and $|1\\rangle$:

$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$$

where $\\alpha, \\beta \\in \\mathbb{C}$ are **complex probability amplitudes**.

The state must satisfy the normalization constraint:
$$|\\alpha|^2 + |\\beta|^2 = 1$$

---

<h2 id="superposition">Complex Amplitudes & Superposition</h2>

When a Hadamard gate ($H$) acts on the ground state $|0\\rangle$, it produces an equal superposition:

$$H|0\\rangle = |+\\rangle = \\frac{1}{\\sqrt{2}}|0\\rangle + \\frac{1}{\\sqrt{2}}|1\\rangle$$

In QFoundry, each amplitude is represented by the \`Complex\` class:

\`\`\`typescript
import { Complex } from 'qfoundry';

const amp = new Complex(1 / Math.SQRT2, 0);
console.log('Probability:', amp.magnitudeSquared()); // 0.5
console.log('Phase (radians):', amp.phase());        // 0.0
\`\`\`

---

<h2 id="entanglement">Entanglement & Multi-Qubit States</h2>

For an $N$-qubit system, the composite state vector exists in a $2^N$-dimensional Hilbert space formed by tensor products:

$$|\\psi\\rangle = \\sum_{x \\in \\{0,1\\}^N} \\alpha_x |x\\rangle$$

When qubits become entangled, the state cannot be factored into independent product states of individual qubits:

$$|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle) \\neq |\\psi_A\\rangle \\otimes |\\psi_B\\rangle$$

---

<h2 id="measurement">Wavefunction Collapse & Born Rule</h2>

According to the Born rule, measuring state $|\\psi\\rangle$ in the computational basis collapses the wavefunction into state $|x\\rangle$ with probability:

$$P(x) = |\\langle x | \\psi \\rangle|^2 = |\\alpha_x|^2$$
`,
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION: CIRCUIT DEVELOPMENT & GATES
  // -------------------------------------------------------------------------
  {
    id: 'npm-circuit-dev',
    title: 'NPM: Circuit Development',
    items: [
      {
        id: 'npm-gates',
        title: 'Quantum Gates Reference',
        category: 'Circuit Development',
        badge: 'Reference',
        toc: [
          { id: 'single-qubit', title: 'Single-Qubit Gates' },
          { id: 'rotations', title: 'Parameterized Rotations' },
          { id: 'controlled', title: 'Controlled Multi-Qubit Gates' },
          { id: 'three-qubit', title: 'Toffoli / CCX Gate' },
        ],
        content: `
# Quantum Gates Reference

Quantum gates are unitary operators represented as complex matrices where $U^\\dagger U = I$. Every operation preserves the total probability of the quantum state.

---

<h2 id="single-qubit">Single-Qubit Gates</h2>

| Gate | Name | Matrix Representation | QFoundry Method |
| :--- | :--- | :--- | :--- |
| **H** | Hadamard | $\\frac{1}{\\sqrt{2}}\\begin{pmatrix}1 & 1\\\\1 & -1\\end{pmatrix}$ | \`qc.h(q)\` |
| **X** | Pauli-X (NOT) | $\\begin{pmatrix}0 & 1\\\\1 & 0\\end{pmatrix}$ | \`qc.x(q)\` |
| **Y** | Pauli-Y | $\\begin{pmatrix}0 & -i\\\\i & 0\\end{pmatrix}$ | \`qc.y(q)\` |
| **Z** | Pauli-Z (Phase Flip) | $\\begin{pmatrix}1 & 0\\\\0 & -1\\end{pmatrix}$ | \`qc.z(q)\` |
| **S** | Phase ($\\sqrt{Z}$) | $\\begin{pmatrix}1 & 0\\\\0 & i\\end{pmatrix}$ | \`qc.s(q)\` |
| **T** | $\\pi/8$ Gate ($\\sqrt{S}$) | $\\begin{pmatrix}1 & 0\\\\0 & e^{i\\pi/4}\\end{pmatrix}$ | \`qc.t(q)\` |

---

<h2 id="rotations">Parameterized Rotations</h2>

Rotations rotate the state vector around the corresponding axis of the Bloch sphere by angle $\\theta$:

\`\`\`typescript
const qc = new QuantumCircuit(1);

// Rotate π/3 radians around X axis
qc.rx(0, Math.PI / 3);

// Rotate π/2 radians around Y axis
qc.ry(0, Math.PI / 2);

// Phase shift by λ
qc.p(0, Math.PI / 4);
\`\`\`

---

<h2 id="controlled">Controlled Multi-Qubit Gates</h2>

- **CX / CNOT (\`qc.cx(control, target)\`)**: Inverts the target qubit if and only if the control qubit is $|1\\rangle$.
- **CZ (\`qc.cz(control, target)\`)**: Applies a Pauli-Z phase flip if both qubits are in state $|1\\rangle$.
- **SWAP (\`qc.swap(q1, q2)\`)**: Exchanges the states of two qubits.

---

<h2 id="three-qubit">Toffoli / CCX Gate</h2>

The Controlled-Controlled-NOT gate (\`qc.ccx(control1, control2, target)\`) flips the target qubit if both controls are $|1\\rangle$. It is a universal reversible gate essential for arithmetic, quantum oracles, and error correction.
`,
      },
      {
        id: 'npm-simulation',
        title: 'Simulation & Sampling Engine',
        category: 'Circuit Development',
        toc: [
          { id: 'statevector', title: 'Statevector Calculation' },
          { id: 'sampling', title: 'Multi-Shot Sampling' },
          { id: 'random-seeds', title: 'Deterministic Random Seeds' },
          { id: 'depth', title: 'Depth & Parallelism Analysis' },
        ],
        content: `
# Simulation & Sampling Engine

QFoundry uses an in-memory statevector engine that tracks exact complex amplitudes across all $2^N$ basis states.

---

<h2 id="statevector">Statevector Calculation</h2>

To simulate without stochastic measurement collapse, call \`Simulator.simulate(circuit)\`:

\`\`\`typescript
import { QuantumCircuit, Simulator } from 'qfoundry';

const qc = new QuantumCircuit(3);
qc.h(0);
qc.cx(0, 1);
qc.cx(1, 2); // GHZ state: (|000> + |111>) / √2

const result = Simulator.simulate(qc);

result.stateVector.forEach((entry) => {
  if (entry.probability > 0.001) {
    console.log(\`|\${entry.basisState}>: amp=\${entry.amplitude.toString()}, prob=\${entry.probability}\`);
  }
});
\`\`\`

---

<h2 id="sampling">Multi-Shot Sampling</h2>

When \`shots\` is specified, the simulator generates empirical measurement frequencies according to the exact cumulative distribution:

\`\`\`typescript
const result = Simulator.simulate(qc, { shots: 2048 });
console.log('Sample counts:', result.counts);
// Example: { '000': 1019, '111': 1029 }
\`\`\`

---

<h2 id="random-seeds">Deterministic Random Seeds</h2>

For reproducible unit tests and academic benchmarking, pass an integer seed:

\`\`\`typescript
const resA = Simulator.simulate(qc, { shots: 1000, seed: 42 });
const resB = Simulator.simulate(qc, { shots: 1000, seed: 42 });

// resA.counts is guaranteed to equal resB.counts exactly!
\`\`\`
`,
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION: CLI & TOOLING
  // -------------------------------------------------------------------------
  {
    id: 'npm-cli-section',
    title: 'NPM: CLI & Tools',
    items: [
      {
        id: 'npm-cli',
        title: 'CLI Command Reference',
        category: 'CLI & Tools',
        badge: 'CLI',
        toc: [
          { id: 'overview', title: 'CLI Overview' },
          { id: 'commands', title: 'Command Reference' },
          { id: 'benchmark-cmd', title: 'Benchmarking Command' },
        ],
        content: `
# QFoundry CLI Command Reference

The QFoundry package includes a command-line interface (\`qfoundry\`) for scaffolding quantum projects, running circuit files, and testing local simulation speed.

---

<h2 id="overview">CLI Overview</h2>

Run directly with \`npx\` or install globally:

\`\`\`bash
# Run without installation
npx qfoundry --help

# Or install globally
npm install -g qfoundry
\`\`\`

---

<h2 id="commands">Command Reference</h2>

### \`qfoundry init <project-name>\`
Creates a new directory with a pre-configured TypeScript quantum environment and sample Bell state script.

### \`qfoundry simulate\`
Runs an immediate in-terminal statevector simulation and outputs ASCII circuit wires and probability tables.

### \`qfoundry gates\`
Lists all supported quantum gates, their matrix sizes, and parameter signatures.

### \`qfoundry benchmark\`
Measures statevector execution time across $N = 2$ to $N = 12$ qubits.

---

<h2 id="benchmark-cmd">Benchmarking Output</h2>

\`\`\`text
  ◆ QFoundry CLI v0.1.0-alpha.1
  High-performance quantum simulation for JavaScript & TypeScript

Benchmarking Quantum Simulator statevector scaling (1 to 12 qubits):
  Qubits:  2 | Dim:     4 | Depth:  2 | Time: 0.73ms
  Qubits:  4 | Dim:    16 | Depth:  4 | Time: 2.15ms
  Qubits:  6 | Dim:    64 | Depth:  6 | Time: 1.45ms
  Qubits:  8 | Dim:   256 | Depth:  8 | Time: 2.32ms
  Qubits: 10 | Dim:  1024 | Depth: 10 | Time: 6.11ms
  Qubits: 12 | Dim:  4096 | Depth: 12 | Time: 35.59ms
\`\`\`
`,
      },
      {
        id: 'npm-api',
        title: 'API Reference',
        category: 'CLI & Tools',
        badge: 'API',
        toc: [
          { id: 'circuit-class', title: 'QuantumCircuit Class' },
          { id: 'simulator-class', title: 'Simulator Class' },
          { id: 'complex-class', title: 'Complex Class' },
        ],
        content: `
# API Reference

Complete TypeScript interface definitions for core QFoundry classes.

---

<h2 id="circuit-class">QuantumCircuit Class</h2>

\`\`\`typescript
export class QuantumCircuit {
  readonly numQubits: number;

  constructor(numQubits: number);

  // Single-Qubit Gates
  h(qubit: number): this;
  x(qubit: number): this;
  y(qubit: number): this;
  z(qubit: number): this;
  s(qubit: number): this;
  sdg(qubit: number): this;
  t(qubit: number): this;
  tdg(qubit: number): this;

  // Parameterized Rotations
  rx(qubit: number, theta: number): this;
  ry(qubit: number, theta: number): this;
  rz(qubit: number, phi: number): this;
  p(qubit: number, lambda: number): this;
  u(qubit: number, theta: number, phi: number, lambda: number): this;

  // Multi-Qubit Gates
  cx(control: number, target: number): this;
  cnot(control: number, target: number): this;
  cz(control: number, target: number): this;
  swap(q1: number, q2: number): this;
  ccx(control1: number, control2: number, target: number): this;
  toffoli(control1: number, control2: number, target: number): this;

  // Measurements & Inspection
  measure(qubit: number): this;
  measureAll(): this;
  getOperations(): readonly GateOperation[];
  getDepth(): number;
  toAscii(): string;
}
\`\`\`

---

<h2 id="simulator-class">Simulator Class</h2>

\`\`\`typescript
export interface SimulationOptions {
  shots?: number;
  seed?: number;
}

export interface SimulationResult {
  numQubits: number;
  shots: number;
  counts: Record<string, number>;
  probabilities: Record<string, number>;
  stateVector: StateVectorEntry[];
  executionTimeMs: number;
  circuitDepth: number;
}

export class Simulator {
  static simulate(circuit: QuantumCircuit, options?: SimulationOptions): SimulationResult;
}
\`\`\`
`,
      },
      {
        id: 'npm-examples',
        title: 'Algorithms & Examples',
        category: 'CLI & Tools',
        toc: [
          { id: 'bell', title: 'Bell State' },
          { id: 'ghz', title: 'GHZ Entangled State' },
          { id: 'deutsch', title: 'Deutsch Algorithm' },
          { id: 'grover', title: 'Grover Search' },
        ],
        content: `
# Quantum Algorithm Examples

Ready-to-run quantum algorithm implementations using QFoundry.

---

<h2 id="bell">1. Bell State ($|\\Phi^+\\rangle$)</h2>

\`\`\`typescript
const qc = new QuantumCircuit(2);
qc.h(0);
qc.cx(0, 1);
qc.measureAll();
\`\`\`

---

<h2 id="ghz">2. GHZ 3-Qubit Entanglement</h2>

$$|GHZ\\rangle = \\frac{|000\\rangle + |111\\rangle}{\\sqrt{2}}$$

\`\`\`typescript
const qc = new QuantumCircuit(3);
qc.h(0);
qc.cx(0, 1);
qc.cx(1, 2);
qc.measureAll();
\`\`\`

---

<h2 id="deutsch">3. Deutsch Algorithm</h2>

Evaluates whether a black-box boolean function $f: \\{0, 1\\} \\to \\{0, 1\\}$ is constant or balanced in a single quantum query:

\`\`\`typescript
const qc = new QuantumCircuit(2);
// Prepare |01>
qc.x(1);

// Superposition |+->
qc.h(0);
qc.h(1);

// Oracle query (e.g. balanced function f(x) = x)
qc.cx(0, 1);

// Interference on query qubit
qc.h(0);
qc.measure(0);

// Measuring q[0] = 0 -> Constant, q[0] = 1 -> Balanced
\`\`\`
`,
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION: VS CODE EXTENSION
  // -------------------------------------------------------------------------
  {
    id: 'ext-section',
    title: 'VS Code Extension',
    items: [
      {
        id: 'ext-overview',
        title: 'Extension Overview & Installation',
        category: 'VS Code Extension',
        badge: 'v2.2.0',
        toc: [
          { id: 'overview', title: 'Overview' },
          { id: 'features', title: 'Key Features' },
          { id: 'installation', title: 'Installation' },
          { id: 'commands', title: 'VS Code Commands & Shortcuts' },
        ],
        content: `
# QFoundry VS Code Extension (v2.2.0)

The **QFoundry VS Code Extension** is a production-grade developer tool for Visual Studio Code that integrates interactive quantum circuit visualization, live debugging, AST-based optimization, and an algorithm learning environment directly into your code editor.

---

<h2 id="overview">Overview</h2>

- **Publisher**: \`victorraj020\`
- **Extension ID**: \`qfoundry\`
- **Current Version**: \`2.2.0\`
- **License**: MIT

---

<h2 id="features">Key Features</h2>

1. **Live Circuit Preview**: Real-time SVG rendering of your circuit beside your code as you type. Debounced on keystroke.
2. **Rich Hover Documentation**: Instant math intuition, matrix equations, and physical realizations for 20+ gates.
3. **Interactive Debugger**: Step forward, backward, play, and scrub through gate sequences. Real-time Dirac notation and HSL phase disks.
4. **Quantum Circuit Optimizer**: Topological gate cancellation for self-inverse pairs (H/H, X/X) and rotation merging in-place.
5. **Algorithm Explorer**: Interactive exploration of 9 core quantum algorithms with 3D Bloch sphere projections and mathematical derivations.

---

<h2 id="installation">Installation</h2>

Install via the VS Code Marketplace or from the packaged VSIX:

\`\`\`bash
# Install directly from terminal
code --install-extension qfoundry-2.2.0.vsix --force
\`\`\`

Prerequisites:
- Visual Studio Code v1.85.0+
- Python 3.9+ (optional; fallback parser operates without Python)

---

<h2 id="commands">VS Code Commands & Shortcuts</h2>

| Command | Title | Default Shortcut (Mac / Linux) |
| :--- | :--- | :--- |
| \`qforge.openCircuitPreview\` | Open Circuit Preview | \`Cmd+Shift+Q\` / \`Ctrl+Shift+Q\` |
| \`qforge.openTimeline\` | Open Circuit Timeline | \`Cmd+Shift+T\` / \`Ctrl+Shift+T\` |
| \`qforge.explainCircuit\` | Explain Circuit Details | \`Cmd+Shift+E\` / \`Ctrl+Shift+E\` |
| \`qforge.openAlgorithmExplorer\` | Open Algorithm Explorer | \`Cmd+Shift+A\` / \`Ctrl+Shift+A\` |
| \`qforge.runSimulation\` | Run Quantum Simulation | Palette |
`,
      },
      {
        id: 'ext-architecture',
        title: 'Two-Parser Architecture & IPC',
        category: 'VS Code Extension',
        toc: [
          { id: 'two-parser', title: 'The Two-Parser Strategy' },
          { id: 'json-rpc', title: 'JSON-RPC 2.0 over Stdio' },
          { id: 'theming', title: 'Native Zero-Flash Theming' },
        ],
        content: `
# Architecture & Technical Design

The QFoundry extension is engineered around high responsiveness, offline safety, and seamless IDE integration.

---

<h2 id="two-parser">The Two-Parser Strategy</h2>

To achieve instant typing responsiveness without UI lockups:
- **TypeScript Fast Path**: A lightweight regex abstract parser scans code on every keystroke, rendering the circuit structure in under 15ms.
- **Python Deep Path**: A background JSON-RPC server analyzes quantum AST and DAG models to compute matrix depths, entanglement properties, and transpiler suggestions.
- **Graceful Fallback**: If Python is not installed in the active virtual environment, the extension continues operating via static AST analysis without crashing.

---

<h2 id="json-rpc">JSON-RPC 2.0 over Stdio</h2>

Rather than launching local HTTP web servers (which cause firewall prompts and port collisions), the extension communicates with the Python backend via **JSON-RPC 2.0 over standard I/O (stdin/stdout)**, mirroring the Language Server Protocol (LSP).

---

<h2 id="theming">Native Zero-Flash Theming</h2>

The webview UI reads VS Code's system CSS custom variables (\`--vscode-*\`) directly. Switching between Light, Dark, and High Contrast themes is instant with zero flash of unstyled content.
`,
      },
      {
        id: 'ext-optimizer',
        title: 'Quantum Circuit Optimizer',
        category: 'VS Code Extension',
        toc: [
          { id: 'cancellation', title: 'Topological Gate Cancellation' },
          { id: 'rotation-merge', title: 'Rotation Merging' },
          { id: 'pi-formatter', title: 'Fractions-of-Pi Formatter' },
        ],
        content: `
# Quantum Circuit Optimizer (v2.0.0+)

The optimizer provides static analysis passes that simplify and reduce quantum circuit gate count directly in the active editor.

---

<h2 id="cancellation">Topological Gate Cancellation</h2>

Identifies and cancels consecutive self-inverse and mutual-inverse gate pairs:
- **Self-inverse**: $H \\cdot H = I$, $X \\cdot X = I$, $CX \\cdot CX = I$
- **Mutual-inverse**: $T \\cdot T^\\dagger = I$, $S \\cdot S^\\dagger = I$

The pass checks commute relations past disjoint qubits to identify cancellations even across non-adjacent code lines.

---

<h2 id="rotation-merge">Rotation Merging</h2>

Recursively merges consecutive rotations on identical qubits:
$$R_z(\\theta_1) \\cdot R_z(\\theta_2) = R_z(\\theta_1 + \\theta_2)$$

---

<h2 id="pi-formatter">Fractions-of-Pi Formatter</h2>

Automatically converts messy floating-point numbers into clean algebraic representations (e.g. \`1.570796\` $\\to$ \`math.pi / 2\`).
`,
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECTION: VICNLP
  // -------------------------------------------------------------------------
  {
    id: 'vic-section',
    title: 'Vic — AI Computer Interface',
    items: [
      {
        id: 'vic-pipeline',
        title: 'Vic Overview & Architecture',
        category: 'Vic (vic-nlp)',
        badge: 'PyPI v0.3.0',
        toc: [
          { id: 'overview', title: 'Package Overview' },
          { id: 'features', title: 'Key Features' },
          { id: 'installation', title: 'Installation' },
          { id: 'dashboard', title: 'The Visual Dashboard' },
          { id: 'making', title: 'Making & Modifying' },
        ],
        content: `
# Vic — The AI-Powered Computer Interface (v0.3.0)

**Vic** (\`vic-nlp\` on PyPI) is an open-source Python library built for **Natural Language Creation and No-Code AI**. It allows anyone to control their computer, generate functional software, and train AI models using simple English instructions.

- **PyPI Package**: [\`vic-nlp\`](https://pypi.org/project/vic-nlp/)
- **Latest Release**: \`v0.3.0\` (Apr 23, 2026)
- **Maintainer**: \`victorraj020\`
- **Author**: Vic Development Team
- **Requirements**: Python >= 3.7

---

<h2 id="overview">Package Overview</h2>

Vic unifies system automation, code generation, and automated machine learning (AutoML) into a single developer interface that works entirely locally on your machine without cloud lock-in.

---

<h2 id="features">Key Features</h2>

- **🤖 AI No-Code Studio**: Train, evaluate, and export AI models (AutoML) with zero coding.
- **🚀 Zero Code Interface**: Control your system or build applications by describing them in natural English.
- **🎨 Visual Dashboard**: Multi-tab desktop interface featuring the Peek Assistant and AI Training workflows.
- **🛠️ Editable Apps**: Generates clean, readable Python code that you can inspect, modify, and run anywhere.
- **🧠 Smarter Engine**: Auto-corrects typos and provides intelligent command suggestions.
- **🔒 Local & Private**: All AI training and commands execute locally on your PC.

---

<h2 id="installation">Installation</h2>

Install the recommended system dependencies and the \`vic-nlp\` package via \`pip\`:

\`\`\`bash
# Install dependencies (recommended)
pip install psutil requests

# Install Vic
pip install vic-nlp
\`\`\`

---

<h2 id="dashboard">The Visual Dashboard (Highly Recommended)</h2>

Launch the graphical dashboard to access both the Peek Assistant and the AI Training Studio:

\`\`\`bash
vic --gui
\`\`\`

The dashboard provides a multi-tab desktop view:
1. **Peek Assistant**: Rapidly issue natural language desktop tasks, diagnostic queries, and software generation requests.
2. **AI Training**: Step-by-step AutoML studio for dataset import, feature encoding, hyperparameter search, and model export.

---

<h2 id="making">Making & Modifying: Clean Code Generation</h2>

Vic is designed to help you learn. When you ask Vic to generate software (e.g., \`vic "make a calculator"\`), it outputs a clean, standalone file such as \`calculator_app.py\`.

- In the Dashboard, click **"Modify in Editor"** to open the generated file in your preferred editor.
- Generated code is heavily commented with clear variable names and standard library bindings (\`tkinter\`, \`turtle\`, \`psutil\`).
`,
      },
      {
        id: 'vic-cli',
        title: 'CLI Reference & Interactive Mode',
        category: 'Vic (vic-nlp)',
        toc: [
          { id: 'cli-quick', title: 'Quick Terminal Commands' },
          { id: 'interactive', title: 'Interactive Mode (vic -i)' },
          { id: 'examples', title: 'Example Commands' },
        ],
        content: `
# Vic CLI Reference & Interactive Mode

Vic provides rich command-line utilities for running instructions directly from your shell or launching an interactive prompt session.

---

<h2 id="cli-quick">Quick Terminal Commands</h2>

Run one-off instructions directly from your terminal:

\`\`\`bash
# Launch desktop utilities
vic "open calculator"
vic "open notepad"

# Generate complete Python applications
vic "make a snake game"
vic "make a calculator"

# Search Vic documentation
vic "search for vic library documentation"

# Run system queries
vic "what is my ip address"
\`\`\`

---

<h2 id="interactive">Interactive Mode (vic -i)</h2>

For conversational sessions where consecutive commands build upon previous context, launch the interactive REPL:

\`\`\`bash
vic -i
\`\`\`

Session example:
\`\`\`
$ vic -i
vic> open calculator
[Vic] Launching Calculator... Done.

vic> what is my ip address
[Vic] Local IP: 192.168.1.104
[Vic] External IP: 154.21.32.11

vic> make a snake game
[Vic] Generated snake_game.py (62 lines). Run with 'python snake_game.py'.
\`\`\`

---

<h2 id="examples">Common Command Patterns</h2>

| Intent | Command Example | Action |
| :--- | :--- | :--- |
| **App Launch** | \`vic "open calculator"\` | Launches native desktop calculator |
| **System Info** | \`vic "what is my ip address"\` | Queries local interface & public IP via requests |
| **Code Generation** | \`vic "make a calculator"\` | Generates Tkinter \`calculator_app.py\` |
| **Game Generation** | \`vic "make a snake game"\` | Generates Turtle-based \`snake_game.py\` |
| **GUI Dashboard** | \`vic --gui\` | Launches full graphical desktop interface |
| **Interactive REPL**| \`vic -i\` | Starts interactive prompt session |
`,
      },
      {
        id: 'vic-privacy',
        title: 'Local & Private Architecture',
        category: 'Vic (vic-nlp)',
        toc: [
          { id: 'local-model', title: 'Local Execution Model' },
          { id: 'dependencies', title: 'Dependencies & Auditability' },
          { id: 'no-lockin', title: 'Zero Vendor Lock-In' },
        ],
        content: `
# Local & Private Architecture

Vic is built from the ground up to respect developer privacy and operate on secure, air-gapped workstations.

---

<h2 id="local-model">Local Execution Model</h2>

Modern developer assistants frequently route sensitive codebases and workspace telemetry through third-party cloud servers. Vic guarantees:
- **Zero Cloud Telemetry**: Commands and source code are never uploaded to remote servers.
- **Local Model Execution**: AI training and evaluation run entirely on your local CPU or GPU.
- **Offline Reliability**: Use Vic in air-gapped environments without requiring an active internet connection.

---

<h2 id="dependencies">Dependencies & Auditability</h2>

Vic relies on battle-tested, open Python packages:
- \`psutil\`: Cross-platform process and system utilization monitoring.
- \`requests\`: Clean HTTP query handling when explicitly requested (e.g. IP lookup).
- Standard Library: Uses \`socket\`, \`os\`, \`subprocess\`, and \`tkinter\` for maximum portability across macOS, Windows, and Linux.

---

<h2 id="no-lockin">Zero Vendor Lock-In</h2>

Every piece of software created with Vic is pure, standard Python code. You can edit, test, package, and deploy generated scripts using standard Python tooling without any proprietary runtime dependency.
`,
      },
    ],
  },
];

