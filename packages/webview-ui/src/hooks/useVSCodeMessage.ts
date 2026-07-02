/**
 * @file useVSCodeMessage.ts
 * @description React hook that bridges VS Code's postMessage API into React state.
 *
 * Usage:
 *   const message = useVSCodeMessage();
 *   // 'message' is always the latest ExtensionMessage received from the host.
 */

import { useEffect, useState } from 'react';
import type { ExtensionMessage } from '@shared/messages';
import { isExtensionMessage } from '@shared/messages';

// Acquire the VS Code API handle once (singleton — calling more than once throws).
declare function acquireVsCodeApi(): {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
};

let _vscode: ReturnType<typeof acquireVsCodeApi> | null = null;

export function getVSCodeAPI(): ReturnType<typeof acquireVsCodeApi> {
  if (!_vscode) {
    // In development (Vite dev server), acquireVsCodeApi is not available.
    // Provide a no-op stub so the component renders without crashing.
    if (typeof acquireVsCodeApi === 'undefined') {
      _vscode = {
        postMessage: (msg) => console.warn('[QForge Dev] postMessage:', msg),
        getState: () => ({}),
        setState: () => {},
      };
    } else {
      _vscode = acquireVsCodeApi();
    }
  }
  return _vscode;
}

/**
 * Returns the latest message received from the VS Code extension host.
 * Returns null until the first message arrives.
 */
export function useVSCodeMessage(): ExtensionMessage | null {
  const [message, setMessage] = useState<ExtensionMessage | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent): void => {
      const data: unknown = event.data;
      if (isExtensionMessage(data)) {
        setMessage(data);
      }
    };

    window.addEventListener('message', handler);

    // Signal to the extension host that the panel is ready to receive messages.
    getVSCodeAPI().postMessage({ type: 'PANEL_READY', payload: { panelId: getPanelId() } });

    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);

  return message;
}

/**
 * Sends a message from the webview to the extension host.
 */
export function postMessageToExtension(message: unknown): void {
  getVSCodeAPI().postMessage(message);
}

/**
 * Reads the panel ID injected by PanelBase into the HTML meta tag.
 */
function getPanelId(): string {
  const meta = document.querySelector('meta[name="qforge-panel-id"]');
  return meta?.getAttribute('content') ?? 'unknown';
}
