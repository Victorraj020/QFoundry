/**
 * @file PanelBase.ts
 * @description Abstract base class for all QForge webview panels.
 *
 * Handles:
 *  - VS Code WebviewPanel creation with correct CSP policy
 *  - Loading the built webview-ui HTML
 *  - Reveal-if-exists / create-if-not pattern
 *  - Implementing the WebviewPanel interface for WebviewMessageService
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import type { WebviewPanel } from '../services/WebviewMessageService';
import type { ExtensionMessage } from '../shared/messages';
import type { WebviewMessage } from '../shared/messages';
import type { PanelId } from '../shared/constants';

export abstract class PanelBase implements WebviewPanel, vscode.Disposable {
  protected panel: vscode.WebviewPanel | null = null;
  protected readonly disposables: vscode.Disposable[] = [];

  abstract readonly panelId: PanelId;
  protected abstract readonly viewTitle: string;
  protected abstract readonly viewColumn: vscode.ViewColumn;

  constructor(
    protected readonly context: vscode.ExtensionContext,
    protected readonly outputChannel: vscode.OutputChannel,
  ) {}

  show(): void {
    if (this.panel) {
      this.panel.reveal(this.viewColumn);
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      this.panelId,
      this.viewTitle,
      this.viewColumn,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this.context.extensionPath, 'webview-dist')),
        ],
        retainContextWhenHidden: true,
      },
    );

    this.panel.webview.html = this.buildHtml(this.panel.webview);

    this.panel.webview.onDidReceiveMessage(
      (message: WebviewMessage) => this.onMessageReceived(message),
      null,
      this.disposables,
    );

    this.panel.onDidDispose(
      () => {
        this.panel = null;
      },
      null,
      this.disposables,
    );
  }

  sendMessage(message: ExtensionMessage): void {
    this.panel?.webview.postMessage(message);
  }

  isVisible(): boolean {
    return this.panel?.visible ?? false;
  }

  dispose(): void {
    this.panel?.dispose();
    for (const d of this.disposables) {
      d.dispose();
    }
  }

  /**
   * Override in subclasses to handle messages from the webview.
   */
  protected onMessageReceived(_message: WebviewMessage): void {
    // Default: no-op. Subclasses override as needed.
  }

  private buildHtml(webview: vscode.Webview): string {
    const distPath = path.join(this.context.extensionPath, 'webview-dist');

    // Read the Vite-built index.html
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      return this.buildFallbackHtml();
    }

    let html = fs.readFileSync(indexPath, 'utf-8');

    // Replace asset paths with VS Code webview URIs
    const assetBase = webview.asWebviewUri(vscode.Uri.file(distPath)).toString();
    html = html.replace(/(src|href)="\.?\//g, `$1="${assetBase}/`);

    // Inject panel ID for the React app to know which panel it's in
    const nonce = generateNonce();
    html = html.replace(
      '<head>',
      `<head>\n<meta name="qforge-panel-id" content="${this.panelId}">\n` +
      `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; ` +
      `img-src ${webview.cspSource} data:; ` +
      `style-src ${webview.cspSource} 'unsafe-inline'; ` +
      `script-src 'nonce-${nonce}' ${webview.cspSource};">`,
    );

    return html;
  }

  private buildFallbackHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>QForge</title>
  <style>
    body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); }
  </style>
</head>
<body>
  <h2>QForge — Building...</h2>
  <p>Run <code>npm run build:webview</code> to build the UI, then reload VS Code.</p>
</body>
</html>`;
  }
}

function generateNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
