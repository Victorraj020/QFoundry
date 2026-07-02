/**
 * @file CircuitIR.ts
 * @description Canonical Intermediate Representation for quantum circuits.
 *
 * This is the lingua franca of QForge. Every module — the TypeScript parser,
 * the Python backend, and the webview renderer — speaks this format.
 *
 * RULES:
 *  - No imports from VS Code, DOM, or any runtime environment.
 *  - Pure TypeScript types and interfaces only.
 *  - Treat this file as a protocol specification.
 */

// ---------------------------------------------------------------------------
// Core IR types
// ---------------------------------------------------------------------------

/**
 * A single gate operation within a quantum circuit.
 * Represents one logical operation at a specific step in the circuit timeline.
 */
export interface GateOp {
  /** Stable unique ID for React reconciliation and debugging. */
  readonly id: string;

  /** Canonical lowercase gate name. Examples: "h", "cx", "measure", "reset". */
  readonly name: string;

  /** Indices of the qubits this gate acts on. Multi-qubit gates list all targets. */
  readonly qubits: readonly number[];

  /** Gate parameters (rotation angles etc.). Empty array for parameter-free gates. */
  readonly params: readonly number[];

  /**
   * Timeline column index. Gates on different qubits with no data dependency
   * share the same step — enabling parallel gate rendering.
   * The TypeScript parser approximates this; the Python backend computes it
   * precisely using Qiskit's DAGCircuit.
   */
  readonly step: number;

  /** Line number in the source file where this gate call appears (1-indexed). */
  readonly sourceLine: number;

  /** Classical bit index this gate is conditioned on. Undefined if unconditional. */
  readonly conditionalOn?: number;
}

/**
 * Source location range within a Python file.
 */
export interface SourceRange {
  readonly startLine: number;
  readonly endLine: number;
}

/**
 * The canonical intermediate representation for a single quantum circuit.
 * Produced by both the TypeScript parser (fast, shallow) and the Python
 * backend (accurate, deep). Consumers must not rely on which produced it.
 */
export interface CircuitIR {
  /** Stable UUID. Changes only when the circuit variable is re-assigned. */
  readonly id: string;

  /** Absolute path to the source file. */
  readonly filePath: string;

  /** The Python variable name (e.g., "qc"). */
  readonly variableName: string;

  /** Total number of quantum registers / qubits. */
  readonly qubits: number;

  /** Total number of classical bits. */
  readonly classicalBits: number;

  /** Ordered list of gate operations. */
  readonly gates: readonly GateOp[];

  /** Source location of the QuantumCircuit(...) constructor call. */
  readonly sourceRange: SourceRange;

  /**
   * When true, this IR was produced by the TypeScript parser and may have
   * approximate `step` values. A subsequent Python analysis will replace it.
   */
  readonly isApproximate: boolean;
}
