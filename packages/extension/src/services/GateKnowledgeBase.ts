/**
 * @file GateKnowledgeBase.ts
 * @description Static registry of quantum gate documentation.
 *
 * This is the built-in implementation of the GateKnowledgeProvider plugin interface.
 * Documentation is bundled with the extension — offline, instant, no API key.
 *
 * Phase 3+: Additional providers (remote API, community plugins) can be registered
 * alongside this one in the plugin registry.
 */

import type { GateDoc } from '../shared/GateDoc';
import type { GateKnowledgeProvider } from '../shared/plugins';

const GATE_REGISTRY: Record<string, GateDoc> = {
  h: {
    name: 'h',
    displayName: 'Hadamard Gate (H)',
    summary: 'Creates an equal superposition of |0⟩ and |1⟩.',
    mathIntuition:
      'The H gate rotates the Bloch sphere 180° around the X+Z axis. ' +
      'Applied to |0⟩, it produces (|0⟩ + |1⟩)/√2. ' +
      'Applied to |1⟩, it produces (|0⟩ − |1⟩)/√2. ' +
      'Applying H twice returns the qubit to its original state.',
    matrixLatex:
      '\\frac{1}{\\sqrt{2}}\\begin{pmatrix}1 & 1\\\\1 & -1\\end{pmatrix}',
    useCases: [
      'Starting quantum algorithms — puts qubits into superposition',
      'One half of a Bell State circuit (H + CX)',
      "Quantum Fourier Transform building block",
      'Grover\'s algorithm oracle inversion',
    ],
    examples: [
      {
        label: 'Superposition',
        code: 'qc = QuantumCircuit(1)\nqc.h(0)',
        explanation: 'Qubit 0 enters equal superposition. Measuring gives 0 or 1 with 50% probability each.',
      },
    ],
    seeAlso: ['cx', 'x'],
    isParameterized: false,
    qubitCount: 1,
  },

  x: {
    name: 'x',
    displayName: 'Pauli-X Gate (NOT)',
    summary: 'Flips a qubit from |0⟩ to |1⟩ (or vice versa). The quantum NOT gate.',
    mathIntuition:
      'Rotates 180° around the X axis of the Bloch sphere. ' +
      'Equivalent to a classical NOT gate on the computational basis.',
    matrixLatex: '\\begin{pmatrix}0 & 1\\\\1 & 0\\end{pmatrix}',
    useCases: [
      'State initialisation — prepare |1⟩ from default |0⟩',
      'Bit-flip error in quantum error correction',
      'Control qubit initialisation',
    ],
    examples: [
      {
        label: 'Bit flip',
        code: 'qc = QuantumCircuit(1)\nqc.x(0)  # |0⟩ → |1⟩',
        explanation: 'Qubit 0 is flipped to |1⟩.',
      },
    ],
    seeAlso: ['y', 'z', 'h'],
    isParameterized: false,
    qubitCount: 1,
  },

  y: {
    name: 'y',
    displayName: 'Pauli-Y Gate',
    summary: 'Rotates 180° around the Y axis. Combines bit-flip and phase-flip.',
    matrixLatex: '\\begin{pmatrix}0 & -i\\\\i & 0\\end{pmatrix}',
    useCases: ['Quantum error correction (Y-type errors)', 'Building rotation gates'],
    isParameterized: false,
    qubitCount: 1,
  },

  z: {
    name: 'z',
    displayName: 'Pauli-Z Gate (Phase Flip)',
    summary: 'Flips the phase of |1⟩ without changing the measurement basis probability.',
    matrixLatex: '\\begin{pmatrix}1 & 0\\\\0 & -1\\end{pmatrix}',
    mathIntuition:
      'Leaves |0⟩ unchanged and maps |1⟩ → −|1⟩. ' +
      'Has no observable effect on a qubit in the computational basis alone, ' +
      'but affects interference when combined with superposition.',
    useCases: [
      'Phase kickback in quantum algorithms',
      'Oracle implementation in Grover\'s search',
    ],
    seeAlso: ['s', 't', 'p'],
    isParameterized: false,
    qubitCount: 1,
  },

  s: {
    name: 's',
    displayName: 'S Gate (Phase Gate, √Z)',
    summary: 'Applies a π/2 phase shift. The square root of the Z gate.',
    matrixLatex: '\\begin{pmatrix}1 & 0\\\\0 & i\\end{pmatrix}',
    seeAlso: ['z', 't', 'sdg'],
    isParameterized: false,
    qubitCount: 1,
  },

  t: {
    name: 't',
    displayName: 'T Gate (π/8 Gate, ⁴√Z)',
    summary: 'Applies a π/4 phase shift. Essential for universal quantum computation.',
    mathIntuition:
      'The T gate is the most expensive gate on fault-tolerant hardware. ' +
      'Clifford+T is a universal gate set. Reducing T-count is a key optimisation target.',
    matrixLatex:
      '\\begin{pmatrix}1 & 0\\\\0 & e^{i\\pi/4}\\end{pmatrix}',
    useCases: ['Universal quantum computation (Clifford+T)', 'Toffoli gate decomposition'],
    seeAlso: ['s', 'tdg'],
    isParameterized: false,
    qubitCount: 1,
  },

  sdg: {
    name: 'sdg',
    displayName: 'S† Gate (Inverse S)',
    summary: 'Applies a −π/2 phase shift. The conjugate transpose of the S gate.',
    matrixLatex: '\\begin{pmatrix}1 & 0\\\\0 & -i\\end{pmatrix}',
    seeAlso: ['s'],
    isParameterized: false,
    qubitCount: 1,
  },

  tdg: {
    name: 'tdg',
    displayName: 'T† Gate (Inverse T)',
    summary: 'Applies a −π/4 phase shift. The conjugate transpose of the T gate.',
    matrixLatex:
      '\\begin{pmatrix}1 & 0\\\\0 & e^{-i\\pi/4}\\end{pmatrix}',
    seeAlso: ['t'],
    isParameterized: false,
    qubitCount: 1,
  },

  cx: {
    name: 'cx',
    displayName: 'CNOT Gate (Controlled-X)',
    summary: 'Flips the target qubit if and only if the control qubit is |1⟩.',
    mathIntuition:
      'The CNOT gate is the two-qubit workhorse of quantum computing. ' +
      'Combined with a Hadamard gate, it creates entanglement. ' +
      'It is the primary gate for creating Bell states.',
    useCases: [
      'Creating entanglement (H + CX = Bell state)',
      'Quantum teleportation',
      'Reversible classical computation',
    ],
    examples: [
      {
        label: 'Bell State',
        code: 'qc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)',
        explanation: 'Creates the maximally entangled Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2.',
      },
    ],
    seeAlso: ['h', 'cz', 'ccx'],
    isParameterized: false,
    qubitCount: 2,
  },

  cz: {
    name: 'cz',
    displayName: 'CZ Gate (Controlled-Z)',
    summary: 'Applies a Z gate to the target qubit if the control is |1⟩.',
    mathIntuition: 'Symmetric — either qubit can be the control or target.',
    seeAlso: ['cx', 'cp'],
    isParameterized: false,
    qubitCount: 2,
  },

  swap: {
    name: 'swap',
    displayName: 'SWAP Gate',
    summary: 'Swaps the quantum states of two qubits.',
    mathIntuition: 'Equivalent to three CNOT gates: CX(a,b) CX(b,a) CX(a,b).',
    useCases: [
      'Qubit routing on real hardware with limited connectivity',
      'Quantum sorting algorithms',
    ],
    seeAlso: ['cx'],
    isParameterized: false,
    qubitCount: 2,
  },

  ccx: {
    name: 'ccx',
    displayName: 'Toffoli Gate (CCX)',
    summary: 'Flips the target qubit if BOTH control qubits are |1⟩.',
    mathIntuition:
      'The Toffoli gate is universal for reversible classical computation. ' +
      'It can simulate a NAND gate, making it computationally universal.',
    useCases: [
      'Reversible arithmetic circuits',
      'Grover oracle construction',
      'Quantum error correction',
    ],
    seeAlso: ['cx'],
    isParameterized: false,
    qubitCount: 3,
  },

  rx: {
    name: 'rx',
    displayName: 'Rx Gate (X-axis Rotation)',
    summary: 'Rotates the qubit state around the X axis of the Bloch sphere by angle θ.',
    matrixLatex:
      '\\begin{pmatrix}\\cos(\\theta/2) & -i\\sin(\\theta/2)\\\\-i\\sin(\\theta/2) & \\cos(\\theta/2)\\end{pmatrix}',
    useCases: ['Variational Quantum Eigensolvers (VQE)', 'Parametric quantum circuits', 'QAOA'],
    seeAlso: ['ry', 'rz', 'u'],
    isParameterized: true,
    qubitCount: 1,
  },

  ry: {
    name: 'ry',
    displayName: 'Ry Gate (Y-axis Rotation)',
    summary: 'Rotates the qubit state around the Y axis of the Bloch sphere by angle θ.',
    matrixLatex:
      '\\begin{pmatrix}\\cos(\\theta/2) & -\\sin(\\theta/2)\\\\\\sin(\\theta/2) & \\cos(\\theta/2)\\end{pmatrix}',
    useCases: ['State preparation', 'VQE ansatz circuits'],
    seeAlso: ['rx', 'rz'],
    isParameterized: true,
    qubitCount: 1,
  },

  rz: {
    name: 'rz',
    displayName: 'Rz Gate (Z-axis Rotation)',
    summary: 'Rotates the qubit phase around the Z axis by angle θ.',
    useCases: ['Phase accumulation', 'Efficient hardware implementation (virtual Z gates)'],
    seeAlso: ['rx', 'ry', 'p'],
    isParameterized: true,
    qubitCount: 1,
  },

  measure: {
    name: 'measure',
    displayName: 'Measurement',
    summary: 'Collapses the quantum state and records the result as a classical bit.',
    mathIntuition:
      'Measurement irreversibly projects the qubit into |0⟩ or |1⟩. ' +
      'The probability of each outcome is given by the Born rule: P(0) = |α|², P(1) = |β|². ' +
      'After measurement, the superposition is destroyed.',
    useCases: [
      'Reading circuit output',
      'Mid-circuit measurement for quantum error correction',
      'Teleportation protocol',
    ],
    seeAlso: ['reset'],
    isParameterized: false,
    qubitCount: 1,
  },

  reset: {
    name: 'reset',
    displayName: 'Reset',
    summary: 'Resets a qubit to |0⟩ regardless of its current state.',
    mathIntuition: 'Non-unitary operation. Discards all quantum information in the qubit.',
    useCases: ['Qubit reuse in mid-circuit', 'State preparation after measurement'],
    isParameterized: false,
    qubitCount: 1,
  },

  barrier: {
    name: 'barrier',
    displayName: 'Barrier',
    summary: 'A visual/logical separator. Prevents gate optimisation across the boundary.',
    mathIntuition:
      'Not a physical gate. Tells Qiskit transpiler: "do not reorder or cancel gates across this point."',
    useCases: [
      'Separating circuit sections visually',
      'Protecting circuit structure from transpiler optimisations',
    ],
    isParameterized: false,
    qubitCount: 0,
  },

  p: {
    name: 'p',
    displayName: 'Phase Gate (P)',
    summary: 'Applies a phase shift of e^(iλ) to the |1⟩ state.',
    matrixLatex: '\\begin{pmatrix}1 & 0\\\\0 & e^{i\\lambda}\\end{pmatrix}',
    seeAlso: ['rz', 's', 't'],
    isParameterized: true,
    qubitCount: 1,
  },
};

export class GateKnowledgeBase implements GateKnowledgeProvider {
  readonly id = 'builtin';
  readonly displayName = 'QForge Built-in Gate Library';
  readonly priority = 0;

  supports(gateName: string): boolean {
    return gateName.toLowerCase() in GATE_REGISTRY;
  }

  getDoc(gateName: string): GateDoc | undefined {
    return GATE_REGISTRY[gateName.toLowerCase()];
  }

  /**
   * Returns all documented gate names. Used for completion and search.
   */
  getAllGateNames(): string[] {
    return Object.keys(GATE_REGISTRY);
  }
}
