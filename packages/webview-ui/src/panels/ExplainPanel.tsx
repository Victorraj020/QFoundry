/**
 * @file ExplainPanel.tsx
 * @description React view for the Explain Circuit panel.
 *
 * Shows the full AnalysisResult: summary, depth, gate breakdown, and properties.
 */

import { useCircuitStore } from '../store/circuitStore';
import { useUIStore } from '../store/uiStateStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { postMessageToExtension } from '../hooks/useVSCodeMessage';

export function ExplainPanel(): JSX.Element {
  const analysis = useCircuitStore((s) => s.analysis);
  const { isLoading, loadingMessage, error } = useUIStore();

  if (isLoading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  if (error) {
    return (
      <div className="panel-error" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="panel-empty">
        <div className="panel-empty-icon">💡</div>
        <h2>Explain Circuit</h2>
        <p>Run <strong>QForge: Explain Circuit</strong> (⌘⇧Q) on a Python file with a QuantumCircuit.</p>
        <button
          className="panel-action-button"
          onClick={() => postMessageToExtension({ type: 'REQUEST_ANALYSIS' })}
        >
          Analyze Now
        </button>
      </div>
    );
  }

  const gateEntries = Object.entries(analysis.gateBreakdown).sort(([, a], [, b]) => b - a);

  return (
    <div className="explain-panel">
      <header className="panel-header">
        <h1 className="panel-title">
          Circuit Analysis — <span className="panel-circuit-name">{analysis.circuit.variableName}</span>
        </h1>
      </header>

      <section className="explain-summary">
        <p>{analysis.summary}</p>
      </section>

      <div className="explain-stats-grid">
        <div className="stat-card">
          <span className="stat-value">{analysis.circuit.qubits}</span>
          <span className="stat-label">Qubits</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{analysis.depth}</span>
          <span className="stat-label">Depth</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{analysis.gateCount}</span>
          <span className="stat-label">Gates</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{analysis.twoQubitGateCount}</span>
          <span className="stat-label">2Q Gates</span>
        </div>
      </div>

      <div className="explain-properties">
        <div className={`property-badge ${analysis.isEntangled ? 'active' : 'inactive'}`}>
          {analysis.isEntangled ? '⚛️ Entangled' : '○ Not Entangled'}
        </div>
        <div className={`property-badge ${analysis.isComplete ? 'active' : 'inactive'}`}>
          {analysis.isComplete ? '✓ Measured' : '○ Unmeasured'}
        </div>
      </div>

      <section className="explain-gate-breakdown">
        <h2>Gate Breakdown</h2>
        <div className="gate-breakdown-list">
          {gateEntries.map(([gate, count]) => (
            <div key={gate} className="gate-breakdown-row">
              <span className="gate-breakdown-name">{gate.toUpperCase()}</span>
              <div className="gate-breakdown-bar-wrapper">
                <div
                  className="gate-breakdown-bar"
                  style={{ width: `${Math.round((count / analysis.gateCount) * 100)}%` }}
                />
              </div>
              <span className="gate-breakdown-count">× {count}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
