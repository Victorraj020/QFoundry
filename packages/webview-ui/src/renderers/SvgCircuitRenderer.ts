/**
 * @file SvgCircuitRenderer.ts
 * @description SVG-based quantum circuit diagram renderer.
 *
 * Renders a CircuitIR as a standard quantum circuit diagram:
 *  - Horizontal wires for each qubit
 *  - Gate boxes on the wires
 *  - Vertical connections for multi-qubit gates (CX, CZ, SWAP)
 *  - Control dots for controlled gates
 *  - Measurement symbols for measurement gates
 *
 * The renderer is pure SVG — no Canvas, no dependencies.
 * It reads VS Code CSS variables for theming (native look).
 */

import type { CircuitIR, GateOp } from '@shared/CircuitIR';
import type { CircuitRenderer, RendererTheme } from './types';
import { DEFAULT_THEME } from './types';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const PADDING = { top: 32, right: 32, bottom: 20, left: 20 };
const QUBIT_LABEL_WIDTH = 48;
const LANE_HEIGHT = 64;
const STEP_WIDTH = 72;
const GATE_BOX_SIZE = 36;
const GATE_RADIUS = 6;
const WIRE_Y_OFFSET = LANE_HEIGHT / 2;

// ---------------------------------------------------------------------------
// Gate display metadata
// ---------------------------------------------------------------------------

interface GateDisplayInfo {
  label: string;
  color?: string;
}

const GATE_DISPLAY: Record<string, GateDisplayInfo> = {
  h: { label: 'H', color: '#6366f1' },
  x: { label: 'X', color: '#ef4444' },
  y: { label: 'Y', color: '#f97316' },
  z: { label: 'Z', color: '#eab308' },
  s: { label: 'S', color: '#84cc16' },
  t: { label: 'T', color: '#22c55e' },
  sdg: { label: 'S†', color: '#84cc16' },
  tdg: { label: 'T†', color: '#22c55e' },
  sx: { label: '√X', color: '#a855f7' },
  cx: { label: 'CX', color: '#3b82f6' },
  cy: { label: 'CY', color: '#3b82f6' },
  cz: { label: 'CZ', color: '#3b82f6' },
  swap: { label: '×', color: '#06b6d4' },
  ccx: { label: 'TOF', color: '#8b5cf6' },
  rx: { label: 'Rx', color: '#ec4899' },
  ry: { label: 'Ry', color: '#f43f5e' },
  rz: { label: 'Rz', color: '#fb7185' },
  p: { label: 'P', color: '#fb923c' },
  u: { label: 'U', color: '#a78bfa' },
  measure: { label: 'M', color: '#10b981' },
  reset: { label: 'RST', color: '#6b7280' },
  barrier: { label: '|', color: '#4b5563' },
  id: { label: 'I', color: '#9ca3af' },
};

function gateDisplay(name: string): GateDisplayInfo {
  return GATE_DISPLAY[name.toLowerCase()] ?? { label: name.toUpperCase().slice(0, 3) };
}

// ---------------------------------------------------------------------------
// SVG helpers
// ---------------------------------------------------------------------------

function svgEl(tag: string, attrs: Record<string, string | number>): SVGElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, String(v));
  }
  return el;
}

function svgText(
  text: string,
  x: number,
  y: number,
  attrs: Record<string, string | number> = {},
): SVGElement {
  const el = svgEl('text', {
    x, y,
    'text-anchor': 'middle',
    'dominant-baseline': 'central',
    ...attrs,
  });
  el.textContent = text;
  return el;
}

// ---------------------------------------------------------------------------
// Renderer implementation
// ---------------------------------------------------------------------------

export class SvgCircuitRenderer implements CircuitRenderer {
  readonly id = 'svg';
  readonly displayName = 'SVG Circuit Renderer';


  render(ir: CircuitIR, container: HTMLElement, theme: RendererTheme = DEFAULT_THEME): void {
    // Clear previous render
    container.innerHTML = '';

    if (ir.qubits === 0 || ir.gates.length === 0) {
      this.renderEmpty(container, ir.qubits);
      return;
    }

    const maxStep = ir.gates.reduce((m, g) => Math.max(m, g.step), 0);
    const numSteps = maxStep + 1;

    const width = PADDING.left + QUBIT_LABEL_WIDTH + numSteps * STEP_WIDTH + PADDING.right;
    const height = PADDING.top + ir.qubits * LANE_HEIGHT + PADDING.bottom;

    const svg = svgEl('svg', {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      role: 'img',
      'aria-label': `Quantum circuit for ${ir.variableName} with ${ir.qubits} qubits`,
    }) as SVGSVGElement;


    const gateX = (step: number): number =>
      PADDING.left + QUBIT_LABEL_WIDTH + step * STEP_WIDTH + STEP_WIDTH / 2;

    const wireY = (qubitIdx: number): number =>
      PADDING.top + qubitIdx * LANE_HEIGHT + WIRE_Y_OFFSET;

    // --- Draw qubit labels and wires ---
    for (let q = 0; q < ir.qubits; q++) {
      const y = wireY(q);
      const wireEnd = PADDING.left + QUBIT_LABEL_WIDTH + numSteps * STEP_WIDTH;

      // Qubit label
      svg.appendChild(
        svgText(`q${q}`, PADDING.left + QUBIT_LABEL_WIDTH / 2, y, {
          fill: theme.wire,
          'font-family': theme.fontFamily,
          'font-size': theme.fontSize,
        }),
      );

      // Horizontal wire
      svg.appendChild(svgEl('line', {
        x1: PADDING.left + QUBIT_LABEL_WIDTH,
        y1: y,
        x2: wireEnd,
        y2: y,
        stroke: theme.wire,
        'stroke-width': 1.5,
        opacity: 0.7,
      }));
    }

    // --- Group gates by step for parallel column rendering ---
    const stepMap = new Map<number, GateOp[]>();
    for (const gate of ir.gates) {
      const existing = stepMap.get(gate.step) ?? [];
      existing.push(gate);
      stepMap.set(gate.step, existing);
    }

    // --- Draw gates ---
    for (const [step, gates] of stepMap) {
      const cx = gateX(step);

      for (const gate of gates) {
        const primaryQubit = gate.qubits[0] ?? 0;

        if (gate.name === 'barrier') {
          this.drawBarrier(svg, cx, ir.qubits, wireY, theme);
          continue;
        }

        if (gate.name === 'measure') {
          this.drawMeasure(svg, cx, wireY(primaryQubit), theme);
          continue;
        }

        // Multi-qubit gate: draw vertical connector first
        if (gate.qubits.length > 1) {
          const ys = gate.qubits.map(wireY);
          svg.appendChild(svgEl('line', {
            x1: cx, y1: Math.min(...ys),
            x2: cx, y2: Math.max(...ys),
            stroke: theme.wire,
            'stroke-width': 1.5,
          }));

          // Control dots for controlled gates (all but last qubit)
          if (['cx', 'cy', 'cz', 'cp', 'crx', 'cry', 'crz', 'ch', 'cu',
               'ccx', 'ccz', 'cswap'].includes(gate.name)) {
            const controlQubits = gate.qubits.slice(0, gate.qubits.length - 1);
            for (const cq of controlQubits) {
              svg.appendChild(svgEl('circle', {
                cx, cy: wireY(cq), r: 6,
                fill: theme.controlDot,
              }));
            }
            // Only draw the gate box on the target qubit
            const targetQubit = gate.qubits[gate.qubits.length - 1];
            if (gate.name === 'cx') {
              this.drawXTarget(svg, cx, wireY(targetQubit), theme);
            } else {
              this.drawGateBox(svg, cx, wireY(targetQubit), gate.name, theme);
            }
            continue;
          }

          // SWAP: draw X on both qubits
          if (gate.name === 'swap') {
            for (const q of gate.qubits) {
              this.drawSwapX(svg, cx, wireY(q), theme);
            }
            continue;
          }
        }

        // Standard single-qubit or multi-qubit gate box
        this.drawGateBox(svg, cx, wireY(primaryQubit), gate.name, theme);
      }
    }

    container.appendChild(svg);
  }

  dispose(): void { /* no-op — cleanup happens via container.innerHTML = '' on next render */ }

  // ---------------------------------------------------------------------------
  // Drawing primitives
  // ---------------------------------------------------------------------------

  private drawGateBox(
    svg: SVGSVGElement,
    cx: number,
    cy: number,
    gateName: string,
    theme: RendererTheme,
  ): void {
    const display = gateDisplay(gateName);
    const boxColor = display.color ?? theme.gateBackground;
    const half = GATE_BOX_SIZE / 2;

    svg.appendChild(svgEl('rect', {
      x: cx - half, y: cy - half,
      width: GATE_BOX_SIZE, height: GATE_BOX_SIZE,
      rx: GATE_RADIUS, ry: GATE_RADIUS,
      fill: boxColor,
      opacity: 0.9,
    }));

    svg.appendChild(svgText(display.label, cx, cy, {
      fill: theme.gateText,
      'font-family': theme.fontFamily,
      'font-size': theme.fontSize,
      'font-weight': '600',
    }));
  }

  private drawXTarget(svg: SVGSVGElement, cx: number, cy: number, theme: RendererTheme): void {
    const r = GATE_BOX_SIZE / 2;
    svg.appendChild(svgEl('circle', {
      cx, cy, r,
      fill: 'none',
      stroke: theme.wire,
      'stroke-width': 1.5,
    }));
    // Crosshair
    svg.appendChild(svgEl('line', { x1: cx - r, y1: cy, x2: cx + r, y2: cy, stroke: theme.wire, 'stroke-width': 1.5 }));
    svg.appendChild(svgEl('line', { x1: cx, y1: cy - r, x2: cx, y2: cy + r, stroke: theme.wire, 'stroke-width': 1.5 }));
  }

  private drawSwapX(svg: SVGSVGElement, cx: number, cy: number, theme: RendererTheme): void {
    const s = 8;
    svg.appendChild(svgEl('line', { x1: cx - s, y1: cy - s, x2: cx + s, y2: cy + s, stroke: theme.wire, 'stroke-width': 2 }));
    svg.appendChild(svgEl('line', { x1: cx + s, y1: cy - s, x2: cx - s, y2: cy + s, stroke: theme.wire, 'stroke-width': 2 }));
  }

  private drawMeasure(svg: SVGSVGElement, cx: number, cy: number, theme: RendererTheme): void {
    const half = GATE_BOX_SIZE / 2;
    svg.appendChild(svgEl('rect', {
      x: cx - half, y: cy - half,
      width: GATE_BOX_SIZE, height: GATE_BOX_SIZE,
      rx: GATE_RADIUS, ry: GATE_RADIUS,
      fill: theme.measureColor,
      opacity: 0.85,
    }));
    svg.appendChild(svgText('M', cx, cy, {
      fill: theme.gateText,
      'font-family': theme.fontFamily,
      'font-size': theme.fontSize,
      'font-weight': '700',
    }));
  }

  private drawBarrier(
    svg: SVGSVGElement,
    cx: number,
    numQubits: number,
    wireY: (q: number) => number,
    theme: RendererTheme,
  ): void {
    const top = wireY(0);
    const bottom = wireY(numQubits - 1);
    svg.appendChild(svgEl('line', {
      x1: cx, y1: top - 12,
      x2: cx, y2: bottom + 12,
      stroke: theme.wire,
      'stroke-width': 1,
      'stroke-dasharray': '4,3',
      opacity: 0.5,
    }));
  }

  private renderEmpty(container: HTMLElement, numQubits: number): void {
    const div = document.createElement('div');
    div.style.cssText = 'padding: 20px; opacity: 0.5; font-family: var(--vscode-font-family);';
    div.textContent = numQubits > 0
      ? `${numQubits}-qubit circuit detected — no gates found yet.`
      : 'No QuantumCircuit detected in the active file.';
    container.appendChild(div);
  }
}
