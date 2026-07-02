/**
 * @file CircuitPreviewPanel.tsx
 * @description React view for the Circuit Preview panel.
 *
 * Shows the live SVG circuit diagram. Updates in real time as the user types.
 */

import { useCircuitStore } from '../store/circuitStore';
import { useUIStore } from '../store/uiStateStore';
import { CircuitCanvas } from '../components/CircuitCanvas';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorBoundary } from '../components/ErrorBoundary';

export function CircuitPreviewPanel(): JSX.Element {
  const circuit = useCircuitStore((s) => s.circuit);
  const { isLoading, loadingMessage, error } = useUIStore();

  if (isLoading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  if (error) {
    return (
      <div className="panel-error" role="alert">
        <span className="panel-error-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!circuit) {
    return (
      <div className="panel-empty">
        <div className="panel-empty-icon">⚛️</div>
        <h2>No Circuit Detected</h2>
        <p>Open a Python file with a <code>QuantumCircuit</code> and start typing.</p>
        <p className="panel-empty-hint">Try: <code>qc = QuantumCircuit(2, 2)</code></p>
      </div>
    );
  }

  return (
    <div className="circuit-preview-panel">
      <header className="panel-header">
        <h1 className="panel-title">
          <span className="panel-circuit-name">{circuit.variableName}</span>
          <span className="panel-circuit-meta">
            {circuit.qubits} qubit{circuit.qubits !== 1 ? 's' : ''}
            {circuit.classicalBits > 0 ? ` · ${circuit.classicalBits} classical` : ''}
            {' · '}
            {circuit.gates.length} gate{circuit.gates.length !== 1 ? 's' : ''}
            {circuit.isApproximate && <span className="badge-approx">approx.</span>}
          </span>
        </h1>
      </header>

      <main className="circuit-canvas-wrapper">
        <ErrorBoundary>
          <CircuitCanvas ir={circuit} />
        </ErrorBoundary>
      </main>
    </div>
  );
}
