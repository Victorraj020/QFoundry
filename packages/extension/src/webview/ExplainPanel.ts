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
import { Panels, Commands } from '../shared/constants';
import type { WebviewMessage } from '../shared/messages';

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

  protected override onMessageReceived(message: WebviewMessage): void {
    if (message.type === 'REQUEST_ANALYSIS') {
      vscode.commands.executeCommand(Commands.EXPLAIN_CIRCUIT);
    }
  }
}

