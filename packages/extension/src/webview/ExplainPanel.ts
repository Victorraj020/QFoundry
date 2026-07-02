/**
 * @file ExplainPanel.ts
 * @description The Explain Circuit webview panel.
 *
 * Displays the full structured analysis result from the Python backend:
 * circuit summary, depth, gate breakdown, entanglement info, and more.
 */

import * as vscode from 'vscode';
import { PanelBase } from './PanelBase';
import type { WebviewMessageService } from '../services/WebviewMessageService';
import { Panels } from '../shared/constants';

export class ExplainPanel extends PanelBase {
  readonly panelId = Panels.EXPLAIN;
  protected readonly viewTitle = 'QForge — Explain Circuit';
  protected readonly viewColumn = vscode.ViewColumn.Beside;

  constructor(
    context: vscode.ExtensionContext,
    _webviewMessages: WebviewMessageService,
    outputChannel: vscode.OutputChannel,
  ) {
    super(context, outputChannel);
  }
}
