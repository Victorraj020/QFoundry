/**
 * @file openAlgorithmExplorer.ts
 * @description Command: qforge.openAlgorithmExplorer
 *
 * Opens (or reveals) the Quantum Algorithm Explorer webview panel.
 * Available globally without requiring an open Python file.
 */

import * as vscode from 'vscode';
import type { QForgeContainer } from '../extension/container';
import { Commands } from '../shared/constants';

export function registerOpenAlgorithmExplorer(container: QForgeContainer): vscode.Disposable {
  return vscode.commands.registerCommand(Commands.OPEN_ALGORITHM_EXPLORER, () => {
    container.algorithmExplorerPanel.show();
  });
}

