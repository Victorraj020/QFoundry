/**
 * @file AlgorithmExplorerPanel.ts
 * @description Dedicated webview panel for the Quantum Algorithm Explorer.
 */

import * as vscode from 'vscode';
import { PanelBase } from './PanelBase';
import type { WebviewMessageService } from '../services/WebviewMessageService';
import type { PythonBridgeService } from '../services/PythonBridgeService';
import type {
  WebviewMessage,
  AlgorithmMetadata,
  AlgorithmSimulationPayload,
} from '../shared/messages';
import { Panels } from '../shared/constants';

export class AlgorithmExplorerPanel extends PanelBase {
  readonly panelId = Panels.ALGORITHM_EXPLORER;
  protected readonly viewTitle = 'QFoundry — Quantum Algorithm Explorer';
  protected readonly viewColumn = vscode.ViewColumn.Beside;

  constructor(
    context: vscode.ExtensionContext,
    _webviewMessages: WebviewMessageService,
    private readonly pythonBridge: PythonBridgeService,
    outputChannel: vscode.OutputChannel,
  ) {
    super(context, outputChannel);
  }

  protected onMessageReceived(message: WebviewMessage): void {
    if (message.type === 'PANEL_READY') {
      this.handleLoadCatalog().catch((err: Error) => {
        this.outputChannel.appendLine(`[QForge] Failed to load algorithm catalog: ${err.message}`);
      });
    } else if (message.type === 'REQUEST_ALGORITHM_CATALOG') {
      this.handleLoadCatalog().catch((err: Error) => {
        this.outputChannel.appendLine(`[QForge] Failed to load algorithm catalog: ${err.message}`);
      });
    } else if (message.type === 'REQUEST_SIMULATE_ALGORITHM') {
      this.handleSimulateAlgorithm(message.payload).catch((err: Error) => {
        this.outputChannel.appendLine(`[QForge] Failed to simulate algorithm: ${err.message}`);
      });
    }
  }

  private async handleLoadCatalog(): Promise<void> {
    try {
      const catalog = await this.pythonBridge.call<AlgorithmMetadata[]>('getAlgorithmCatalog');
      this.sendMessage({
        type: 'ALGORITHM_CATALOG',
        payload: catalog,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.sendMessage({
        type: 'ERROR',
        payload: {
          code: 'CATALOG_ERROR',
          message: `Failed to load quantum algorithms: ${msg}`,
        },
      });
    }
  }

  private async handleSimulateAlgorithm(payload: {
    algorithmId: string;
    parameters?: Record<string, unknown> | undefined;
    shots?: number | undefined;
    seed?: number | undefined;
  }): Promise<void> {
    this.sendMessage({
      type: 'LOADING',
      payload: { operation: `Simulating ${payload.algorithmId}...` },
    });
    try {
      const result = await this.pythonBridge.call<AlgorithmSimulationPayload>('simulateAlgorithm', {
        algorithmId: payload.algorithmId,
        parameters: payload.parameters || {},
        shots: payload.shots ?? 1024,
        seed: payload.seed,
      });
      this.sendMessage({
        type: 'ALGORITHM_DATA',
        payload: result,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.sendMessage({
        type: 'ERROR',
        payload: {
          code: 'SIMULATION_ERROR',
          message: `Algorithm simulation failed: ${msg}`,
        },
      });
    }
  }
}
