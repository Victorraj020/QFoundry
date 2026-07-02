/**
 * @file TimelineStep.tsx
 * @description Single step card in the Circuit Timeline view.
 */

import type { GateOp } from '@shared/CircuitIR';

interface TimelineStepProps {
  step: number;
  gates: GateOp[];
  isLast: boolean;
}

export function TimelineStep({ step, gates, isLast }: TimelineStepProps): JSX.Element {
  return (
    <div className="timeline-step">
      <div className="timeline-step-header">
        <span className="timeline-step-number">Step {step + 1}</span>
      </div>
      <div className="timeline-step-gates">
        {gates.map((gate) => (
          <div key={gate.id} className="timeline-gate-chip">
            <span className="timeline-gate-name">{gate.name.toUpperCase()}</span>
            <span className="timeline-gate-qubits">q[{gate.qubits.join(', ')}]</span>
            {gate.params.length > 0 && (
              <span className="timeline-gate-params">
                ({gate.params.map((p) => p.toFixed(3)).join(', ')})
              </span>
            )}
          </div>
        ))}
      </div>
      {!isLast && <div className="timeline-connector">↓</div>}
    </div>
  );
}
