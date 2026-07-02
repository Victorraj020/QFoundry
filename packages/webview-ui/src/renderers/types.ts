/**
 * @file types.ts
 * @description Renderer plugin interface and layout types.
 *
 * Any circuit renderer (SVG, Canvas, WebGL) implements CircuitRenderer.
 * The CircuitCanvas component holds a renderer reference and calls render()
 * whenever the CircuitIR changes.
 */

import type { CircuitIR } from '@shared/CircuitIR';

export interface RendererLayout {
  readonly width: number;
  readonly height: number;
  readonly qubitLaneHeight: number;
  readonly stepWidth: number;
  readonly padding: { top: number; right: number; bottom: number; left: number };
}

export interface CircuitRenderer {
  readonly id: string;
  readonly displayName: string;
  render(ir: CircuitIR, container: HTMLElement, theme: RendererTheme): void;
  dispose(): void;
}

export interface RendererTheme {
  readonly background: string;
  readonly wire: string;
  readonly gateBackground: string;
  readonly gateBorder: string;
  readonly gateText: string;
  readonly controlDot: string;
  readonly measureColor: string;
  readonly fontFamily: string;
  readonly fontSize: number;
}

export const DEFAULT_THEME: RendererTheme = {
  background: 'transparent',
  wire: 'var(--vscode-foreground, #cccccc)',
  gateBackground: 'var(--vscode-button-background, #0e639c)',
  gateBorder: 'var(--vscode-button-hoverBackground, #1177bb)',
  gateText: 'var(--vscode-button-foreground, #ffffff)',
  controlDot: 'var(--vscode-foreground, #cccccc)',
  measureColor: 'var(--vscode-charts-green, #4ec9b0)',
  fontFamily: 'var(--vscode-editor-font-family, monospace)',
  fontSize: 13,
};
