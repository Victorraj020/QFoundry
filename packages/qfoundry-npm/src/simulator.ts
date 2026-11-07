/**
 * @file simulator.ts
 * @description In-memory statevector quantum simulation engine.
 */

import { Complex } from './complex';
import { QuantumCircuit } from './circuit';
import { GATES, Matrix2x2 } from './gates';
import { GateOperation, SimulationOptions, SimulationResult, StateVectorEntry } from './types';

export class Simulator {
  /**
   * Run full statevector simulation on a QuantumCircuit.
   */
  static simulate(circuit: QuantumCircuit, options: SimulationOptions = {}): SimulationResult {
    const startTime = performance.now();
    const numQubits = circuit.numQubits;
    const dim = 1 << numQubits;
    const shots = options.shots ?? 1024;

    // Initialize state to |00...0>
    let state: Complex[] = Array.from({ length: dim }, (_, i) =>
      i === 0 ? Complex.one() : Complex.zero()
    );

    const ops = circuit.getOperations();

    for (const op of ops) {
      if (op.type === 'measure') {
        // Measurement in statevector evolution is treated as projection / sampling at the end
        continue;
      }
      state = this.applyOperation(state, numQubits, op);
    }

    // Compute probabilities and statevector entries
    const stateVector: StateVectorEntry[] = [];
    const probabilities: Record<string, number> = {};

    for (let i = 0; i < dim; i++) {
      const amp = state[i];
      const prob = amp.magnitudeSquared();
      const basisState = i.toString(2).padStart(numQubits, '0');
      const phase = amp.phase();

      if (prob > 1e-12) {
        probabilities[basisState] = Number(prob.toFixed(6));
      }

      stateVector.push({
        index: i,
        basisState,
        amplitude: amp,
        probability: prob,
        phase,
      });
    }

    // Sample measurement counts based on probability distribution
    const counts = this.sampleCounts(probabilities, shots, options.seed);
    const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

    return {
      numQubits,
      shots,
      counts,
      probabilities,
      stateVector,
      executionTimeMs,
      circuitDepth: circuit.getDepth(),
    };
  }

  private static applyOperation(
    state: Complex[],
    numQubits: number,
    op: GateOperation
  ): Complex[] {
    const dim = 1 << numQubits;
    const nextState = [...state];

    if (op.type === 'swap') {
      const [q1, q2] = op.targets;
      const shift1 = numQubits - 1 - q1;
      const shift2 = numQubits - 1 - q2;
      for (let i = 0; i < dim; i++) {
        const b1 = (i >> shift1) & 1;
        const b2 = (i >> shift2) & 1;
        if (b1 !== b2 && b1 === 0) {
          const j = i ^ (1 << shift1) ^ (1 << shift2);
          const tmp = nextState[i];
          nextState[i] = nextState[j];
          nextState[j] = tmp;
        }
      }
      return nextState;
    }

    // Matrix lookup for single qubit or controlled single qubit
    let u: Matrix2x2 | null = null;
    const params = op.params || [];

    switch (op.type) {
      case 'h':
        u = GATES.h();
        break;
      case 'x':
      case 'cx':
      case 'ccx':
        u = GATES.x();
        break;
      case 'y':
      case 'cy':
        u = GATES.y();
        break;
      case 'z':
      case 'cz':
        u = GATES.z();
        break;
      case 's':
        u = GATES.s();
        break;
      case 'sdg':
        u = GATES.sdg();
        break;
      case 't':
        u = GATES.t();
        break;
      case 'tdg':
        u = GATES.tdg();
        break;
      case 'rx':
        u = GATES.rx(params[0] ?? 0);
        break;
      case 'ry':
        u = GATES.ry(params[0] ?? 0);
        break;
      case 'rz':
        u = GATES.rz(params[0] ?? 0);
        break;
      case 'p':
        u = GATES.p(params[0] ?? 0);
        break;
      case 'u':
        u = GATES.u(params[0] ?? 0, params[1] ?? 0, params[2] ?? 0);
        break;
      default:
        return nextState;
    }

    const target = op.targets[0];
    const controls = op.controls || [];
    const targetShift = numQubits - 1 - target;
    const targetMask = 1 << targetShift;

    // Control masks
    const controlShifts = controls.map((c) => numQubits - 1 - c);

    for (let i = 0; i < dim; i++) {
      // Check if target bit is 0
      if ((i & targetMask) !== 0) continue;

      const j = i | targetMask;

      // Check all controls are 1
      let controlsSatisfied = true;
      for (const cs of controlShifts) {
        if (((i >> cs) & 1) !== 1) {
          controlsSatisfied = false;
          break;
        }
      }

      if (!controlsSatisfied) continue;

      const a = state[i];
      const b = state[j];

      // [a', b']^T = U * [a, b]^T
      const aPrime = u[0][0].multiply(a).add(u[0][1].multiply(b));
      const bPrime = u[1][0].multiply(a).add(u[1][1].multiply(b));

      nextState[i] = aPrime;
      nextState[j] = bPrime;
    }

    return nextState;
  }

  private static sampleCounts(
    probabilities: Record<string, number>,
    shots: number,
    seed?: number
  ): Record<string, number> {
    const counts: Record<string, number> = {};
    const entries = Object.entries(probabilities);
    if (entries.length === 0) return counts;

    // Pseudo-random number generator if seed provided, else Math.random
    let rng = Math.random;
    if (seed !== undefined) {
      let s = seed % 2147483647;
      if (s <= 0) s += 2147483646;
      rng = () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };
    }

    // Cumulative distribution
    const cumulative: { state: string; threshold: number }[] = [];
    let sum = 0;
    for (const [state, prob] of entries) {
      sum += prob;
      cumulative.push({ state, threshold: sum });
    }

    for (let k = 0; k < shots; k++) {
      const r = rng() * sum;
      let picked = entries[0][0];
      for (const item of cumulative) {
        if (r <= item.threshold) {
          picked = item.state;
          break;
        }
      }
      counts[picked] = (counts[picked] || 0) + 1;
    }

    return counts;
  }
}

