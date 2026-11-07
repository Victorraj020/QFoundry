/**
 * @file types.ts
 * @description Types and interfaces for the QFoundry quantum simulation library.
 */

import { Complex } from './complex';

export type GateType =
  | 'h'
  | 'x'
  | 'y'
  | 'z'
  | 's'
  | 't'
  | 'sdg'
  | 'tdg'
  | 'rx'
  | 'ry'
  | 'rz'
  | 'p'
  | 'u'
  | 'cx'
  | 'cy'
  | 'cz'
  | 'swap'
  | 'ccx'
  | 'measure';

export interface GateOperation {
  id: string;
  type: GateType;
  targets: number[];
  controls?: number[];
  params?: number[];
}

export interface SimulationOptions {
  shots?: number;
  seed?: number;
}

export interface StateVectorEntry {
  basisState: string;
  index: number;
  amplitude: Complex;
  probability: number;
  phase: number;
}

export interface SimulationResult {
  numQubits: number;
  shots: number;
  counts: Record<string, number>;
  probabilities: Record<string, number>;
  stateVector: StateVectorEntry[];
  executionTimeMs: number;
  circuitDepth: number;
}

