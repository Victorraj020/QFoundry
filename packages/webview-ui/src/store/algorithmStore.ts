/**
 * @file algorithmStore.ts
 * @description Zustand state store for the Quantum Algorithm Explorer.
 */

import { create } from 'zustand';
import type { CircuitIR } from '@shared/CircuitIR';
import type {
  AlgorithmMetadata,
  StepExplanation,
  AlgorithmSimulationPayload,
} from '@shared/messages';
import type { DebugStep, ExecutionResult } from '@shared/plugins';

export type LearningMode = 'guided' | 'interactive' | 'advanced';

interface AlgorithmState {
  catalog: readonly AlgorithmMetadata[];
  selectedAlgorithmId: string;
  selectedAlgorithm: AlgorithmMetadata | null;
  activeMode: LearningMode;
  circuit: CircuitIR | null;
  steps: readonly StepExplanation[];
  statevectorSteps: readonly DebugStep[];
  simulationResult: ExecutionResult | null;
  currentStepIndex: number;
  isPlaying: boolean;
  playSpeedMs: number;
  parameters: Record<string, unknown>;
  baselineResult: AlgorithmSimulationPayload | null;
  isComparisonMode: boolean;
  selectedBlochQubit: number;
  searchQuery: string;
  selectedCategory: string;

  setCatalog: (catalog: readonly AlgorithmMetadata[]) => void;
  selectAlgorithm: (id: string) => void;
  setAlgorithmData: (payload: AlgorithmSimulationPayload) => void;
  setActiveMode: (mode: LearningMode) => void;
  setCurrentStepIndex: (index: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaySpeedMs: (ms: number) => void;
  setParameter: (key: string, value: unknown) => void;
  setParameters: (params: Record<string, unknown>) => void;
  toggleComparisonMode: () => void;
  setSelectedBlochQubit: (qubit: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  reset: () => void;
}

export const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  catalog: [],
  selectedAlgorithmId: 'deutsch',
  selectedAlgorithm: null,
  activeMode: 'interactive',
  circuit: null,
  steps: [],
  statevectorSteps: [],
  simulationResult: null,
  currentStepIndex: 0,
  isPlaying: false,
  playSpeedMs: 1000,
  parameters: {},
  baselineResult: null,
  isComparisonMode: false,
  selectedBlochQubit: 0,
  searchQuery: '',
  selectedCategory: 'All',

  setCatalog: (catalog) => {
    const currentId = get().selectedAlgorithmId || catalog[0]?.id || 'deutsch';
    const found = catalog.find((a) => a.id === currentId) ?? catalog[0] ?? null;
    const defaultParams: Record<string, unknown> = {};
    if (found?.parameters) {
      for (const p of found.parameters) {
        defaultParams[p.id] = p.default;
      }
    }
    set({
      catalog,
      selectedAlgorithmId: found?.id ?? currentId,
      selectedAlgorithm: found,
      parameters: defaultParams,
    });
  },

  selectAlgorithm: (id) => {
    const found = get().catalog.find((a) => a.id === id) ?? null;
    const defaultParams: Record<string, unknown> = {};
    if (found?.parameters) {
      for (const p of found.parameters) {
        defaultParams[p.id] = p.default;
      }
    }
    set({
      selectedAlgorithmId: id,
      selectedAlgorithm: found,
      parameters: defaultParams,
      currentStepIndex: 0,
      isPlaying: false,
      baselineResult: null,
      isComparisonMode: false,
      selectedBlochQubit: 0,
    });
  },

  setAlgorithmData: (payload) => {
    const state = get();
    // If baselineResult is null, save the first execution as baseline
    const baseline = state.baselineResult ?? payload;
    set({
      circuit: payload.circuit,
      steps: payload.steps,
      selectedAlgorithm: payload.metadata,
      statevectorSteps: payload.statevectorSteps,
      simulationResult: payload.simulation,
      baselineResult: baseline,
    });
  },

  setActiveMode: (mode) => set({ activeMode: mode }),

  setCurrentStepIndex: (index) => {
    const total = get().circuit?.gates.length ?? get().steps.length;
    const maxIdx = Math.max(0, total);
    const clamped = Math.max(0, Math.min(index, maxIdx));
    set({ currentStepIndex: clamped });
  },

  stepForward: () => {
    const total = get().circuit?.gates.length ?? get().steps.length;
    const maxIdx = Math.max(0, total);
    const curr = get().currentStepIndex;
    if (curr < maxIdx) {
      set({ currentStepIndex: curr + 1 });
    }
  },

  stepBackward: () => {
    const curr = get().currentStepIndex;
    if (curr > 0) {
      set({ currentStepIndex: curr - 1 });
    }
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlaySpeedMs: (playSpeedMs) => set({ playSpeedMs }),

  setParameter: (key, value) =>
    set((state) => ({
      parameters: { ...state.parameters, [key]: value },
    })),

  setParameters: (parameters) => set({ parameters }),

  toggleComparisonMode: () =>
    set((state) => ({ isComparisonMode: !state.isComparisonMode })),

  setSelectedBlochQubit: (selectedBlochQubit) => set({ selectedBlochQubit }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => {
    const { catalog, selectedAlgorithmId, searchQuery } = get();
    // Check if current selected algorithm matches the new category
    const current = catalog.find((a) => a.id === selectedAlgorithmId);
    const matchesCat = selectedCategory === 'All' || current?.category === selectedCategory;

    let nextAlgoId = selectedAlgorithmId;
    if (!matchesCat) {
      // Pick the first algorithm in the newly selected category
      const filtered = catalog.filter((a) => {
        const catOk = selectedCategory === 'All' || a.category === selectedCategory;
        const searchOk =
          searchQuery.trim() === '' ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
        return catOk && searchOk;
      });
      if (filtered[0]) {
        nextAlgoId = filtered[0].id;
      }
    }

    if (nextAlgoId !== selectedAlgorithmId) {
      get().selectAlgorithm(nextAlgoId);
    }
    set({ selectedCategory });
  },

  reset: () =>
    set({
      currentStepIndex: 0,
      isPlaying: false,
      isComparisonMode: false,
    }),
}));

