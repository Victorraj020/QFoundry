/**
 * @file DiagnosticProvider.ts
 * @description Surfaces circuit-level errors and warnings as VS Code diagnostics (red/yellow underlines).
 *
 * Phase 1: Reports basic structural issues (unknown gate names, qubit index out of range).
 * Phase 2+: Will surface Qiskit transpilation errors from the Python backend.
 */

import * as vscode from 'vscode';
import { EXTENSION_ID } from '../shared/constants';
import type { CircuitIR } from '../shared/CircuitIR';

export class DiagnosticProvider implements vscode.Disposable {
  private readonly collection: vscode.DiagnosticCollection;

  constructor() {
    this.collection = vscode.languages.createDiagnosticCollection(EXTENSION_ID);
  }

  /**
   * Validates the circuit IR and pushes diagnostics to VS Code.
   */
  update(document: vscode.TextDocument, ir: CircuitIR): void {
    const diagnostics: vscode.Diagnostic[] = [];

    for (const gate of ir.gates) {
      // Flag qubit indices that exceed the declared qubit count
      for (const qubitIndex of gate.qubits) {
        if (qubitIndex >= ir.qubits && ir.qubits > 0) {
          const line = gate.sourceLine - 1;
          const range = new vscode.Range(line, 0, line, document.lineAt(line).text.length);
          diagnostics.push(
            new vscode.Diagnostic(
              range,
              `Qubit index ${qubitIndex} is out of range for a ${ir.qubits}-qubit circuit.`,
              vscode.DiagnosticSeverity.Error,
            ),
          );
        }
      }
    }

    this.collection.set(document.uri, diagnostics);
  }

  clear(document: vscode.TextDocument): void {
    this.collection.delete(document.uri);
  }

  dispose(): void {
    this.collection.dispose();
  }
}
