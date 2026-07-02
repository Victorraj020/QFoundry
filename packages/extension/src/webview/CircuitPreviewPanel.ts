/**
 * @file CircuitPreviewPanel.ts
 * @description The Circuit Preview webview panel.
 *
 * Shows the live SVG circuit diagram, updating in real time as the user types.
 */

import * as vscode from 'vscode';
import { PanelBase } from './PanelBase';
import type { WebviewMessageService } from '../services/WebviewMessageService';
import type { WebviewMessage } from '../shared/messages';
import { Panels } from '../shared/constants';

export class CircuitPreviewPanel extends PanelBase {
  readonly panelId = Panels.CIRCUIT_PREVIEW;
  protected readonly viewTitle = 'QForge — Circuit Preview';
  protected readonly viewColumn = vscode.ViewColumn.Beside;

  constructor(
    context: vscode.ExtensionContext,
    _webviewMessages: WebviewMessageService,
    outputChannel: vscode.OutputChannel,
  ) {
    super(context, outputChannel);
  }

  protected onMessageReceived(message: WebviewMessage): void {
    if (message.type === 'REQUEST_GATE_DOC') {
      // Gate doc request from the webview (e.g., user clicked a gate in the diagram)
      this.outputChannel.appendLine(`[QForge] Gate doc requested: ${message.payload.gateName}`);
    }
  }
}
