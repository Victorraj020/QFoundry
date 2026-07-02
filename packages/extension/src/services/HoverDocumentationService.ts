/**
 * @file HoverDocumentationService.ts
 * @description Resolves gate documentation for a given gate name.
 *
 * Acts as a broker between registered GateKnowledgeProviders.
 * Iterates providers in priority order and returns the first match.
 * Falls back gracefully when a gate is unknown.
 */

import type { GateDoc } from '../shared/GateDoc';
import type { GateKnowledgeProvider } from '../shared/plugins';
import type { GateKnowledgeBase } from './GateKnowledgeBase';

export class HoverDocumentationService {
  private readonly providers: GateKnowledgeProvider[];

  constructor(builtinKnowledge: GateKnowledgeBase) {
    // Built-in provider registered at startup.
    // Future: PluginRegistry adds providers here dynamically.
    this.providers = [builtinKnowledge];
  }

  /**
   * Registers an additional GateKnowledgeProvider (plugin extension point).
   * Providers are sorted by priority descending.
   */
  registerProvider(provider: GateKnowledgeProvider): void {
    this.providers.push(provider);
    this.providers.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Returns documentation for a gate name, or undefined if no provider knows it.
   */
  getDoc(gateName: string): GateDoc | undefined {
    const normalized = gateName.toLowerCase();
    for (const provider of this.providers) {
      if (provider.supports(normalized)) {
        return provider.getDoc(normalized);
      }
    }
    return undefined;
  }

  /**
   * Returns true if any registered provider documents the given gate.
   */
  isKnownGate(gateName: string): boolean {
    return this.providers.some((p) => p.supports(gateName.toLowerCase()));
  }
}
