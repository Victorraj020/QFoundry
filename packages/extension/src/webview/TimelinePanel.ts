/**
 * @file TimelinePanel.ts
 * @description The Circuit Timeline webview panel.
 *
 * Shows every gate operation as an ordered vertical sequence.
 * Useful for understanding circuit execution flow step-by-step.
 */

import * as vscode from 'vscode';
import { PanelBase } from './PanelBase';
import type { WebviewMessageService } from '../services/WebviewMessageService';
import { Panels } from '../shared/constants';

export class TimelinePanel extends PanelBase {
  readonly panelId = Panels.TIMELINE;
  protected readonly viewTitle = 'QFoundry — Circuit Timeline';
  protected readonly viewColumn = vscode.ViewColumn.Beside;

  constructor(
    context: vscode.ExtensionContext,
    _webviewMessages: WebviewMessageService,
    outputChannel: vscode.OutputChannel,
  ) {
    super(context, outputChannel);
  }
}
