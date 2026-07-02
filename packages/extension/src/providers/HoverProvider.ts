/**
 * @file HoverProvider.ts
 * @description VS Code hover provider for quantum gate documentation.
 *
 * When the user hovers over `qc.h(0)`, this provider detects the gate name,
 * fetches its documentation from HoverDocumentationService, and returns
 * a formatted MarkdownString shown in the VS Code hover popup.
 *
 * Runs entirely in TypeScript — no Python round-trip required.
 */

import * as vscode from 'vscode';
import type { HoverDocumentationService } from '../services/HoverDocumentationService';
import type { GateDoc } from '../shared/GateDoc';

/**
 * Matches `qc.h(`, `circuit.cx(`, `qc.rx(pi/2,` etc.
 * Captures: [1] gate name
 */
const GATE_HOVER_PATTERN = /\b\w+\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;

export class HoverProvider implements vscode.HoverProvider {
  constructor(private readonly hoverDocs: HoverDocumentationService) {}

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.Hover | undefined {
    const line = document.lineAt(position).text;
    const match = GATE_HOVER_PATTERN.exec(line);
    if (!match) {
      return undefined;
    }

    const gateName = match[1].toLowerCase();

    // Confirm cursor is actually on the gate name portion
    const gateStart = line.indexOf(match[1], match.index);
    const gateEnd = gateStart + match[1].length;
    if (position.character < gateStart || position.character > gateEnd) {
      return undefined;
    }

    const doc = this.hoverDocs.getDoc(gateName);
    if (!doc) {
      return undefined;
    }

    return new vscode.Hover(
      this.buildMarkdown(doc),
      new vscode.Range(position.line, gateStart, position.line, gateEnd),
    );
  }

  private buildMarkdown(doc: GateDoc): vscode.MarkdownString {
    const md = new vscode.MarkdownString('', true);
    md.isTrusted = true;
    md.supportHtml = false;

    // Header
    md.appendMarkdown(`### $(circuit-board) ${doc.displayName}\n\n`);
    md.appendMarkdown(`${doc.summary}\n\n`);

    // Math intuition
    if (doc.mathIntuition) {
      md.appendMarkdown(`**How it works**\n\n${doc.mathIntuition}\n\n`);
    }

    // Use cases
    if (doc.useCases && doc.useCases.length > 0) {
      md.appendMarkdown(`**Use cases**\n\n`);
      for (const uc of doc.useCases) {
        md.appendMarkdown(`- ${uc}\n`);
      }
      md.appendMarkdown('\n');
    }

    // Example
    if (doc.examples && doc.examples.length > 0) {
      const ex = doc.examples[0];
      md.appendMarkdown(`**Example** — ${ex.label}\n\n`);
      md.appendCodeblock(ex.code, 'python');
      md.appendMarkdown(`\n_${ex.explanation}_\n\n`);
    }

    // See also
    if (doc.seeAlso && doc.seeAlso.length > 0) {
      md.appendMarkdown(`**See also:** ${doc.seeAlso.join(', ')}\n`);
    }

    return md;
  }
}
