/**
 * @file runOptimization.ts
 * @description Command: qforge.applyOptimization
 *
 * Applies the optimized Python source code to the active document.
 */

import * as vscode from 'vscode';
import { Commands } from '../shared/constants';

export function registerRunOptimization(): vscode.Disposable {
  return vscode.commands.registerCommand(
    Commands.APPLY_OPTIMIZATION,
    async (payload: { optimizedSource: string }) => {
      let editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== 'python') {
        editor = vscode.window.visibleTextEditors.find(
          (e) => e.document.languageId === 'python',
        );
      }

      if (!editor) {
        vscode.window.showErrorMessage(
          'QFoundry: Open a Python file to apply optimizations.',
        );
        return;
      }

      const document = editor.document;
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length),
      );

      const success = await editor.edit((editBuilder) => {
        editBuilder.replace(fullRange, payload.optimizedSource);
      });

      if (success) {
        vscode.window.showInformationMessage('QFoundry: Circuit optimizations applied successfully!');
      } else {
        vscode.window.showErrorMessage('QFoundry: Failed to apply circuit optimizations.');
      }
    },
  );
}
