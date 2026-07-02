/**
 * @file uiStateStore.ts
 * @description Zustand store for transient UI state (loading, error).
 *
 * Separated from circuitStore so loading/error state changes don't
 * cause unnecessary re-renders in circuit display components.
 */

import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  errorSuggestion: string | undefined;
  setLoading(loading: boolean, message?: string): void;
  setError(message: string, suggestion?: string): void;
  clearError(): void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  loadingMessage: '',
  error: null,
  errorSuggestion: undefined,

  setLoading: (loading, message = 'Loading…') =>
    set({ isLoading: loading, loadingMessage: message }),

  setError: (message, suggestion) =>
    set({ error: message, errorSuggestion: suggestion, isLoading: false }),

  clearError: () =>
    set({ error: null, errorSuggestion: undefined }),
}));
// TS cache trigger
