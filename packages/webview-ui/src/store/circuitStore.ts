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
import type { ExecutionResult, DebugResult } from '@shared/plugins';
import type { OptimizationResult } from '@shared/messages';

interface CircuitState {
  circuit: CircuitIR | null;
  analysis: AnalysisResult | null;
  simulationResult: ExecutionResult | null;
  isSimulating: boolean;
  debugResult: DebugResult | null;
  currentStepIndex: number;
  isPlayMode: boolean;
  optimizationResult: OptimizationResult | null;
  isOptimizing: boolean;
  setCircuit(circuit: CircuitIR): void;
  setAnalysis(analysis: AnalysisResult): void;
  setSimulationResult(result: ExecutionResult | null): void;
  setIsSimulating(simulating: boolean): void;
  setDebugResult(result: DebugResult | null): void;
  setCurrentStepIndex(index: number): void;
  setIsPlayMode(play: boolean): void;
  setOptimizationResult(result: OptimizationResult | null): void;
  setIsOptimizing(optimizing: boolean): void;
  reset(): void;
}

export const useCircuitStore = create<CircuitState>((set) => ({
  circuit: null,
  analysis: null,
  simulationResult: null,
  isSimulating: false,
  debugResult: null,
  currentStepIndex: 0,
  isPlayMode: false,
  optimizationResult: null,
  isOptimizing: false,

  setCircuit: (circuit) => set({ circuit }),

  setAnalysis: (analysis) =>
    set((state) => ({
      analysis,
      // Analysis always includes the most up-to-date circuit IR
      circuit: analysis.circuit ?? state.circuit,
    })),

  setSimulationResult: (simulationResult) => set({ simulationResult }),
  setIsSimulating: (isSimulating) => set({ isSimulating }),

  setDebugResult: (debugResult) => set({ debugResult, currentStepIndex: 0 }),
  setCurrentStepIndex: (currentStepIndex) => set({ currentStepIndex }),
  setIsPlayMode: (isPlayMode) => set({ isPlayMode }),

  setOptimizationResult: (optimizationResult) => set({ optimizationResult, isOptimizing: false }),
  setIsOptimizing: (isOptimizing) => set({ isOptimizing }),

  reset: () =>
    set({
      circuit: null,
      analysis: null,
      simulationResult: null,
      isSimulating: false,
      debugResult: null,
      currentStepIndex: 0,
      isPlayMode: false,
      optimizationResult: null,
      isOptimizing: false,
    }),
}));
