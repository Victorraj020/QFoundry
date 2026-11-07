/**
 * @file circuit.ts
 * @description Fluent QuantumCircuit builder interface.
 */

import { GateOperation, GateType } from './types';

export class QuantumCircuit {
  private operations: GateOperation[] = [];

  constructor(public readonly numQubits: number) {
    if (numQubits < 1 || numQubits > 16) {
      throw new Error(`Invalid qubit count: ${numQubits}. Supported range is 1-16.`);
    }
  }

  private addOp(
    type: GateType,
    targets: number[],
    controls?: number[],
    params?: number[]
  ): this {
    for (const q of [...targets, ...(controls || [])]) {
      if (q < 0 || q >= this.numQubits) {
        throw new Error(`Qubit index ${q} is out of bounds for ${this.numQubits}-qubit circuit.`);
      }
    }
    const id = `op_${this.operations.length}_${type}`;
    this.operations.push({ id, type, targets, controls, params });
    return this;
  }

  h(qubit: number): this {
    return this.addOp('h', [qubit]);
  }

  x(qubit: number): this {
    return this.addOp('x', [qubit]);
  }

  y(qubit: number): this {
    return this.addOp('y', [qubit]);
  }

  z(qubit: number): this {
    return this.addOp('z', [qubit]);
  }

  s(qubit: number): this {
    return this.addOp('s', [qubit]);
  }

  sdg(qubit: number): this {
    return this.addOp('sdg', [qubit]);
  }

  t(qubit: number): this {
    return this.addOp('t', [qubit]);
  }

  tdg(qubit: number): this {
    return this.addOp('tdg', [qubit]);
  }

  rx(qubit: number, theta: number): this {
    return this.addOp('rx', [qubit], undefined, [theta]);
  }

  ry(qubit: number, theta: number): this {
    return this.addOp('ry', [qubit], undefined, [theta]);
  }

  rz(qubit: number, phi: number): this {
    return this.addOp('rz', [qubit], undefined, [phi]);
  }

  p(qubit: number, lambda: number): this {
    return this.addOp('p', [qubit], undefined, [lambda]);
  }

  u(qubit: number, theta: number, phi: number, lambda: number): this {
    return this.addOp('u', [qubit], undefined, [theta, phi, lambda]);
  }

  cx(control: number, target: number): this {
    return this.addOp('cx', [target], [control]);
  }

  cnot(control: number, target: number): this {
    return this.cx(control, target);
  }

  cy(control: number, target: number): this {
    return this.addOp('cy', [target], [control]);
  }

  cz(control: number, target: number): this {
    return this.addOp('cz', [target], [control]);
  }

  swap(q1: number, q2: number): this {
    return this.addOp('swap', [q1, q2]);
  }

  ccx(control1: number, control2: number, target: number): this {
    return this.addOp('ccx', [target], [control1, control2]);
  }

  toffoli(control1: number, control2: number, target: number): this {
    return this.ccx(control1, control2, target);
  }

  measure(qubit: number): this {
    return this.addOp('measure', [qubit]);
  }

  measureAll(): this {
    for (let q = 0; q < this.numQubits; q++) {
      this.measure(q);
    }
    return this;
  }

  getOperations(): readonly GateOperation[] {
    return [...this.operations];
  }

  getDepth(): number {
    const qubitDepths = new Array(this.numQubits).fill(0);
    for (const op of this.operations) {
      const affected = [...op.targets, ...(op.controls || [])];
      const maxCurrent = Math.max(...affected.map((q) => qubitDepths[q]));
      const next = maxCurrent + 1;
      for (const q of affected) {
        qubitDepths[q] = next;
      }
    }
    return Math.max(...qubitDepths, 0);
  }

  toAscii(): string {
    const lines = Array.from({ length: this.numQubits }, (_, i) => `q_${i}: ─`);
    for (const op of this.operations) {
      if (op.type === 'measure') {
        const q = op.targets[0];
        for (let i = 0; i < this.numQubits; i++) {
          lines[i] += i === q ? '─[M]─' : '─────';
        }
      } else if (op.controls && op.controls.length === 1 && op.type === 'cx') {
        const c = op.controls[0];
        const t = op.targets[0];
        const minQ = Math.min(c, t);
        const maxQ = Math.max(c, t);
        for (let i = 0; i < this.numQubits; i++) {
          if (i === c) lines[i] += '──●──';
          else if (i === t) lines[i] += '──⊕──';
          else if (i > minQ && i < maxQ) lines[i] += '──│──';
          else lines[i] += '─────';
        }
      } else if (op.controls && op.controls.length === 2 && op.type === 'ccx') {
        const [c1, c2] = op.controls;
        const t = op.targets[0];
        const all = [c1, c2, t];
        const minQ = Math.min(...all);
        const maxQ = Math.max(...all);
        for (let i = 0; i < this.numQubits; i++) {
          if (i === c1 || i === c2) lines[i] += '──●──';
          else if (i === t) lines[i] += '──⊕──';
          else if (i > minQ && i < maxQ) lines[i] += '──│──';
          else lines[i] += '─────';
        }
      } else {
        const name = op.type.toUpperCase();
        const tag = name.length === 1 ? `─[${name}]─` : `[${name}]`;
        const pad = '─'.repeat(tag.length);
        const t = op.targets[0];
        for (let i = 0; i < this.numQubits; i++) {
          lines[i] += i === t ? tag : pad;
        }
      }
    }
    return lines.join('\n');
  }
}

