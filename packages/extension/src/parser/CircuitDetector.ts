/**
 * @file CircuitDetector.ts
 * @description Detects QuantumCircuit instantiations in Python source text.
 *
 * This is the TypeScript-side fast parser. It runs synchronously on raw text
 * without invoking Python. It handles ~80% of common Qiskit patterns instantly.
 *
 * Limitations (by design):
 *  - Cannot resolve dynamic qubit counts (e.g., n = get_n(); QuantumCircuit(n))
 *  - Cannot handle circuits created inside functions and returned
 *  - Cannot evaluate Python expressions
 *
 * For these cases, the Python AST extractor is the authoritative source.
 */

import type { SourceRange } from '../shared/CircuitIR';

export interface DetectedCircuit {
  /** Variable name the circuit is assigned to. */
  readonly variableName: string;

  /** Number of qubits. -1 if could not be statically determined. */
  readonly qubits: number;

  /** Number of classical bits. 0 if not specified. */
  readonly classicalBits: number;

  /** Source range of the QuantumCircuit(...) constructor call. */
  readonly sourceRange: SourceRange;
}

/**
 * Regex patterns covering the most common QuantumCircuit construction patterns.
 *
 * Matches:
 *   qc = QuantumCircuit(2)
 *   qc = QuantumCircuit(2, 2)
 *   circuit = QuantumCircuit(num_qubits)
 *   qc = QuantumCircuit(QuantumRegister(3), ClassicalRegister(3))
 */
const QUANTUM_CIRCUIT_PATTERN = /^[ \t]*(\w+)\s*=\s*QuantumCircuit\s*\(([^)]*)\)/gm;

/**
 * Detects all QuantumCircuit instantiations in the given source text.
 * Returns an array ordered by line number of first appearance.
 */
export function detectCircuits(source: string): DetectedCircuit[] {
  const results: DetectedCircuit[] = [];

  let match: RegExpExecArray | null;
  // Reset lastIndex before each use of a global regex.
  QUANTUM_CIRCUIT_PATTERN.lastIndex = 0;

  while ((match = QUANTUM_CIRCUIT_PATTERN.exec(source)) !== null) {
    const variableName = match[1];
    const argsString = match[2].trim();

    // Calculate 1-indexed line number of the match start.
    const charIndex = match.index;
    const startLine = source.substring(0, charIndex).split('\n').length;

    // Find the end line (same as start for single-line constructors).
    const matchText = match[0];
    const endLine = startLine + matchText.split('\n').length - 1;

    const { qubits, classicalBits } = parseConstructorArgs(argsString);

    results.push({
      variableName,
      qubits,
      classicalBits,
      sourceRange: { startLine, endLine },
    });
  }

  return results;
}

/**
 * Parses the arguments of a QuantumCircuit(...) constructor call.
 * Handles: QuantumCircuit(2), QuantumCircuit(2, 2), QuantumCircuit(n)
 * Returns qubits=-1 for dynamic/unparseable values.
 */
function parseConstructorArgs(argsString: string): {
  qubits: number;
  classicalBits: number;
} {
  if (!argsString) {
    return { qubits: -1, classicalBits: 0 };
  }

  // Split on commas, but only top-level (not inside nested parens).
  const args = splitTopLevelArgs(argsString);

  const firstArg = args[0]?.trim() ?? '';
  const secondArg = args[1]?.trim() ?? '';

  const qubits = parseIntArg(firstArg);
  const classicalBits = secondArg ? parseIntArg(secondArg) : 0;

  return { qubits, classicalBits };
}

function parseIntArg(arg: string): number {
  const n = parseInt(arg, 10);
  return isNaN(n) ? -1 : n;
}

/**
 * Splits a comma-separated argument list respecting nested parentheses.
 * Example: "QuantumRegister(3), ClassicalRegister(3)" → ["QuantumRegister(3)", "ClassicalRegister(3)"]
 */
function splitTopLevelArgs(args: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '(') {
      depth++;
    } else if (args[i] === ')') {
      depth--;
    } else if (args[i] === ',' && depth === 0) {
      result.push(args.slice(start, i));
      start = i + 1;
    }
  }

  result.push(args.slice(start));
  return result;
}
