/**
 * @file ComparisonViewer.tsx
 * @description Side-by-side comparison of baseline execution vs modified execution.
 */

import type { AlgorithmSimulationPayload } from '@shared/messages';

interface ComparisonViewerProps {
  baseline: AlgorithmSimulationPayload;
  current: AlgorithmSimulationPayload;
  onClose: () => void;
}

export function ComparisonViewer({
  baseline,
  current,
  onClose,
}: ComparisonViewerProps): JSX.Element {
  const baselineCounts = baseline.simulation?.counts ?? {};
  const currentCounts = current.simulation?.counts ?? {};

  const allStates = Array.from(
    new Set([...Object.keys(baselineCounts), ...Object.keys(currentCounts)])
  ).sort();

  const totalBaseline = Object.values(baselineCounts).reduce((a, b) => a + b, 0) || 1;
  const totalCurrent = Object.values(currentCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="comparison-modal-card">
      <div className="comp-card-header">
        <h4 className="comp-card-title">⚖️ Execution Comparison: Baseline vs Modified</h4>
        <button className="comp-close-btn" onClick={onClose} title="Close comparison view">
          ✕
        </button>
      </div>

      <div className="comp-tables-grid">
        {/* Baseline column */}
        <div className="comp-col baseline-col">
          <div className="comp-col-header">
            <strong>Baseline Execution</strong>
            <span className="comp-meta">{baseline.circuit.gates.length} gates · {baseline.circuit.qubits} qubits</span>
          </div>

          <div className="comp-distribution">
            {allStates.map((state) => {
              const count = baselineCounts[state] ?? 0;
              const pct = ((count / totalBaseline) * 100).toFixed(1);
              return (
                <div key={state} className="comp-dist-row">
                  <span className="comp-dist-state">|{state}⟩</span>
                  <div className="comp-bar-track">
                    <div className="comp-bar-fill baseline" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="comp-dist-val">{pct}% ({count})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current modified column */}
        <div className="comp-col current-col">
          <div className="comp-col-header">
            <strong>Current (Modified) Execution</strong>
            <span className="comp-meta">{current.circuit.gates.length} gates · {current.circuit.qubits} qubits</span>
          </div>

          <div className="comp-distribution">
            {allStates.map((state) => {
              const count = currentCounts[state] ?? 0;
              const pct = ((count / totalCurrent) * 100).toFixed(1);
              return (
                <div key={state} className="comp-dist-row">
                  <span className="comp-dist-state">|{state}⟩</span>
                  <div className="comp-bar-track">
                    <div className="comp-bar-fill current" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="comp-dist-val">{pct}% ({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
