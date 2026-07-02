/**
 * @file circuitStore.ts
 * @description Zustand store for circuit data.
 *
 * Single slice for CircuitIR and AnalysisResult.
 * Store contains state only — no side effects, no async operations.
 */

import { create } from 'zustand';
import type { CircuitIR } from '@shared/CircuitIR';
import type { AnalysisResult } from '@shared/AnalysisResult';

interface CircuitState {
  circuit: CircuitIR | null;
  analysis: AnalysisResult | null;
  setCircuit(circuit: CircuitIR): void;
  setAnalysis(analysis: AnalysisResult): void;
  reset(): void;
}

export const useCircuitStore = create<CircuitState>((set) => ({
  circuit: null,
  analysis: null,

  setCircuit: (circuit) => set({ circuit }),

  setAnalysis: (analysis) =>
    set((state) => ({
      analysis,
      // Analysis always includes the most up-to-date circuit IR
      circuit: analysis.circuit ?? state.circuit,
    })),

  reset: () => set({ circuit: null, analysis: null }),
}));
