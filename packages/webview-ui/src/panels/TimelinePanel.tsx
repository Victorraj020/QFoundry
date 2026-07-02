/**
 * @file TimelinePanel.tsx
 * @description React view for the Circuit Timeline panel.
 *
 * Groups gates by step and renders a vertical timeline of operations.
 */

import { useMemo } from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { useUIStore } from '../store/uiStateStore';
import { TimelineStep } from '../components/TimelineStep';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { GateOp } from '@shared/CircuitIR';

export function TimelinePanel(): JSX.Element {
  const circuit = useCircuitStore((s) => s.circuit);
  const { isLoading, loadingMessage, error } = useUIStore();

  const steps = useMemo(() => {
    if (!circuit) {
      return [];
    }
    const map = new Map<number, GateOp[]>();
    for (const gate of circuit.gates) {
      if (gate.name === 'barrier') {
        continue;
      }
      const existing = map.get(gate.step) ?? [];
      existing.push(gate);
      map.set(gate.step, existing);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [circuit]);

  if (isLoading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  if (error) {
    return <div className="panel-error" role="alert"><p>{error}</p></div>;
  }

  if (!circuit || steps.length === 0) {
    return (
      <div className="panel-empty">
        <div className="panel-empty-icon">📋</div>
        <h2>No Gates to Show</h2>
        <p>Add gates to your <code>QuantumCircuit</code> to see the timeline.</p>
      </div>
    );
  }

  return (
    <div className="timeline-panel">
      <header className="panel-header">
        <h1 className="panel-title">
          Circuit Timeline — <span className="panel-circuit-name">{circuit.variableName}</span>
        </h1>
        <p className="panel-subtitle">{steps.length} step{steps.length !== 1 ? 's' : ''}</p>
      </header>

      <main className="timeline-steps">
        {steps.map(([step, gates], index) => (
          <TimelineStep
            key={step}
            step={step}
            gates={gates}
            isLast={index === steps.length - 1}
          />
        ))}
      </main>
    </div>
  );
}
