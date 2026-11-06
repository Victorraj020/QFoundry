/**
 * @file CodeLensProvider.ts
 * @description Adds "▶ Visualize Circuit" and "⚡ Explain" inline lenses above QuantumCircuit definitions.
 *
 * CodeLenses appear as clickable text above code lines.
 * This provider detects QuantumCircuit constructor lines and places action lenses.
 */

import * as vscode from 'vscode';
import { detectCircuits } from '../parser/CircuitDetector';
import { Commands } from '../shared/constants';

export class CodeLensProvider implements vscode.CodeLensProvider {
  private readonly _onDidChangeCodeLenses = new vscode.EventEmitter<void>();
  readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    if (document.languageId !== 'python') {
      return [];
    }

    const source = document.getText();
    const circuits = detectCircuits(source);
    const lenses: vscode.CodeLens[] = [];

    for (const circuit of circuits) {
      const line = circuit.sourceRange.startLine - 1; // Convert to 0-indexed
      const range = new vscode.Range(line, 0, line, 0);

      lenses.push(
        new vscode.CodeLens(range, {
          title: '$(circuit-board) Visualize Circuit',
          command: Commands.OPEN_CIRCUIT_PREVIEW,
          tooltip: 'Open QForge Circuit Preview for this circuit',
        }),
        new vscode.CodeLens(range, {
          title: '$(lightbulb) Explain',
          command: Commands.EXPLAIN_CIRCUIT,
          tooltip: 'Analyze and explain this circuit with QForge',
        }),
        new vscode.CodeLens(range, {
          title: '$(list-ordered) Timeline',
          command: Commands.OPEN_TIMELINE,
          tooltip: 'Open step-by-step gate timeline',
        }),
      );
    }

    return lenses;
  }

  refresh(): void {
    this._onDidChangeCodeLenses.fire();
  }
}
