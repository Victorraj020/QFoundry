/**
 * @file DocumentChangeListener.ts
 * @description Listens to document changes and triggers re-parsing on a debounced schedule.
 *
 * When the user types, this listener waits for a pause (default: 300ms) then:
 *  1. Runs the TypeScript parser (fast, inline)
 *  2. Broadcasts the new CircuitIR to all visible panels
 *
 * Deep Python analysis is NOT triggered here — it's triggered explicitly by
 * the "Explain Circuit" command. This keeps live preview instant and lean.
 */

import * as vscode from 'vscode';
import type { CircuitAnalysisService } from '../services/CircuitAnalysisService';
import type { WebviewMessageService } from '../services/WebviewMessageService';
import { ConfigKeys, DEFAULT_DEBOUNCE_MS } from '../shared/constants';

export class DocumentChangeListener implements vscode.Disposable {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly disposables: vscode.Disposable[] = [];

  constructor(
    private readonly circuitAnalysis: CircuitAnalysisService,
    private readonly webviewMessages: WebviewMessageService,
    private readonly outputChannel: vscode.OutputChannel,
  ) {
    // Listen to document changes
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId !== 'python') {
          return;
        }
        this.scheduleReparse(event.document);
      }),
    );

    // Also re-parse when the active editor changes
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor?.document.languageId === 'python') {
          this.scheduleReparse(editor.document);
        }
      }),
    );
  }

  private scheduleReparse(document: vscode.TextDocument): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }

    const debounceMs = vscode.workspace
      .getConfiguration()
      .get<number>(ConfigKeys.DEBOUNCE_MS, DEFAULT_DEBOUNCE_MS);

    this.debounceTimer = setTimeout(() => {
      this.reparse(document).catch((err) => {
        this.outputChannel.appendLine(`[QForge] Reparse error: ${String(err)}`);
      });
    }, debounceMs);
  }

  private async reparse(document: vscode.TextDocument): Promise<void> {
    const ir = await this.circuitAnalysis.parseDocument(document);
    if (ir) {
      this.webviewMessages.sendCircuitUpdated(ir);
    }
  }

  dispose(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    for (const d of this.disposables) {
      d.dispose();
    }
  }
}
