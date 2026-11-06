/**
 * @file messages.ts
 * @description Typed message protocol between the VS Code extension host and webview panels.
 *
 * RULES:
 *  - Every message type is a discriminated union literal — never a raw string.
 *  - Adding a new message type requires updating BOTH unions.
 *  - The TypeScript compiler will catch every unhandled message case.
 *  - No imports from VS Code or DOM. This file must be importable in the webview.
 */

import type { CircuitIR } from './CircuitIR';
import type { GateDoc } from './GateDoc';
import type { AnalysisResult } from './AnalysisResult';
import type { ExecutionResult, DebugResult, DebugStep } from './plugins';

export interface AlgorithmParameterOption {
  readonly label: string;
  readonly value: string | number;
}

export interface AlgorithmParameter {
  readonly id: string;
  readonly label: string;
  readonly type: 'select' | 'text' | 'number';
  readonly default: unknown;
  readonly options?: readonly AlgorithmParameterOption[];
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly description?: string;
}

export interface ClassicalVsQuantum {
  readonly classicalQueries: string | number;
  readonly quantumQueries: string | number;
  readonly classicalComplexity: string;
  readonly quantumComplexity: string;
  readonly explanation: string;
}

export interface AlgorithmMetadata {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readonly qubits: number;
  readonly shortDescription: string;
  readonly problemStatement: string;
  readonly importance: string;
  readonly coreConcept: string;
  readonly classicalVsQuantum: ClassicalVsQuantum;
  readonly mathFoundations: string;
  readonly prerequisites: readonly string[];
  readonly expectedOutput: string;
  readonly simulationComplexity: string;
  readonly parameters?: readonly AlgorithmParameter[];
}

export interface StepExplanation {
  readonly stepIndex: number;
  readonly title: string;
  readonly operation: string;
  readonly gateName: string;
  readonly targetQubits: readonly number[];
  readonly purpose: string;
  readonly mathTransform: string;
  readonly concept: string;
}

export interface AlgorithmSimulationPayload {
  readonly circuit: CircuitIR;
  readonly steps: readonly StepExplanation[];
  readonly metadata: AlgorithmMetadata;
  readonly statevectorSteps: readonly DebugStep[];
  readonly simulation: ExecutionResult;
}

export interface OptimizationResult {
  readonly originalDepth: number;
  readonly optimizedDepth: number;
  readonly originalGateCount: number;
  readonly optimizedGateCount: number;
  readonly suggestions: Array<{
    readonly type: 'CANCEL_INVERSE' | 'MERGE_ROTATIONS';
    readonly description: string;
    readonly qubits: number[];
    readonly lines: number[];
  }>;
  readonly optimizedSource: string;
}

// ---------------------------------------------------------------------------
// Extension Host → Webview messages
// ---------------------------------------------------------------------------

export type ExtensionMessage =
  | {
      readonly type: 'CIRCUIT_UPDATED';
      readonly payload: CircuitIR;
    }
  | {
      readonly type: 'SIMULATION_RESULT';
      readonly payload: ExecutionResult;
    }
  | {
      readonly type: 'ANALYSIS_RESULT';
      readonly payload: AnalysisResult;
    }
  | {
      readonly type: 'GATE_DOC';
      readonly payload: GateDoc;
    }
  | {
      readonly type: 'DEBUG_STATES_UPDATED';
      readonly payload: DebugResult;
    }
  | {
      readonly type: 'OPTIMIZATIONS_UPDATED';
      readonly payload: OptimizationResult;
    }
  | {
      readonly type: 'ALGORITHM_CATALOG';
      readonly payload: readonly AlgorithmMetadata[];
    }
  | {
      readonly type: 'ALGORITHM_DATA';
      readonly payload: AlgorithmSimulationPayload;
    }
  | {
      readonly type: 'ERROR';
      readonly payload: {
        readonly message: string;
        readonly code: string;
        readonly suggestion?: string | undefined;
      };
    }
  | {
      readonly type: 'LOADING';
      readonly payload: {
        readonly operation: string;
      };
    }
  | {
      readonly type: 'SERVER_STATUS';
      readonly payload: {
        readonly status: 'starting' | 'ready' | 'error' | 'stopped';
        readonly message?: string | undefined;
      };
    };

// ---------------------------------------------------------------------------
// Webview → Extension Host messages
// ---------------------------------------------------------------------------

export type WebviewMessage =
  | {
      readonly type: 'PANEL_READY';
      readonly payload: {
        readonly panelId: string;
      };
    }
  | {
      readonly type: 'REQUEST_ANALYSIS';
    }
  | {
      readonly type: 'REQUEST_GATE_DOC';
      readonly payload: {
        readonly gateName: string;
      };
    }
  | {
      readonly type: 'REQUEST_SIMULATOR_RUN';
      readonly payload: {
        readonly shots: number;
        readonly seed?: number | undefined;
      };
    }
  | {
      readonly type: 'REQUEST_DEBUG_STATES';
    }
  | {
      readonly type: 'REQUEST_OPTIMIZATIONS';
    }
  | {
      readonly type: 'APPLY_OPTIMIZED_CODE';
      readonly payload: {
        readonly optimizedSource: string;
      };
    }
  | {
      readonly type: 'REQUEST_ALGORITHM_CATALOG';
    }
  | {
      readonly type: 'REQUEST_SIMULATE_ALGORITHM';
      readonly payload: {
        readonly algorithmId: string;
        readonly parameters?: Record<string, unknown> | undefined;
        readonly shots?: number | undefined;
        readonly seed?: number | undefined;
      };
    };

// ---------------------------------------------------------------------------
// Type guard utilities
// ---------------------------------------------------------------------------

export function isExtensionMessage(value: unknown): value is ExtensionMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as Record<string, unknown>)['type'] === 'string'
  );
}
