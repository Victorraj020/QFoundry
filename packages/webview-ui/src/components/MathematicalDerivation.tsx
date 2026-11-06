/**
 * @file MathematicalDerivation.tsx
 * @description Synchronized mathematical derivation panel for quantum operations.
 *
 * Displays exact Dirac notation, gate unitary matrix, transformation steps,
 * and amplitude probability calculations corresponding to the active execution step.
 */

import type { StepExplanation } from '@shared/messages';
import type { Amplitude } from '@shared/plugins';

interface MathematicalDerivationProps {
  currentStep?: StepExplanation | undefined;
  stepIndex: number;
  inputStatevector?: readonly Amplitude[] | undefined;
  outputStatevector?: readonly Amplitude[] | undefined;
}

export function MathematicalDerivation({
  currentStep,
  stepIndex,
  inputStatevector,
  outputStatevector,
}: MathematicalDerivationProps): JSX.Element {
  // Format statevector into compact Dirac notation
  const formatDirac = (amps?: readonly Amplitude[]): string => {
    if (!amps || amps.length === 0) {
      return '|0...0⟩';
    }
    const nonZero = amps.filter((a) => a.probability > 0.0001);
    if (nonZero.length === 0) {
      return '|0...0⟩';
    }

    return nonZero
      .map((a, idx) => {
        const sign = idx > 0 && a.re >= 0 && a.im >= 0 ? '+ ' : '';
        let coeff = '';
        if (Math.abs(a.im) < 0.001) {
          if (Math.abs(Math.abs(a.re) - 1.0) < 0.001) {
            coeff = a.re < 0 ? '-' : (idx > 0 ? '+ ' : '');
          } else if (Math.abs(Math.abs(a.re) - 0.7071) < 0.01) {
            coeff = (a.re < 0 ? '-' : (idx > 0 ? '+ ' : '')) + '1/√2 ';
          } else if (Math.abs(Math.abs(a.re) - 0.5) < 0.01) {
            coeff = (a.re < 0 ? '-' : (idx > 0 ? '+ ' : '')) + '1/2 ';
          } else {
            coeff = `${sign}${a.re.toFixed(3)} `;
          }
        } else {
          coeff = `(${a.re >= 0 ? '' : '-'}${Math.abs(a.re).toFixed(2)} ${a.im >= 0 ? '+' : '-'} ${Math.abs(a.im).toFixed(2)}i) `;
        }
        return `${coeff}|${a.state}⟩`;
      })
      .join(' ');
  };

  const getGateMatrix = (gateName?: string): { name: string; matrix: string[][] } => {
    switch (gateName?.toLowerCase()) {
      case 'h':
        return {
          name: 'Hadamard (H)',
          matrix: [
            ['1/√2', '1/√2'],
            ['1/√2', '-1/√2'],
          ],
        };
      case 'x':
        return {
          name: 'Pauli-X (NOT)',
          matrix: [
            ['0', '1'],
            ['1', '0'],
          ],
        };
      case 'y':
        return {
          name: 'Pauli-Y',
          matrix: [
            ['0', '-i'],
            ['i', '0'],
          ],
        };
      case 'z':
        return {
          name: 'Pauli-Z (Phase Flip)',
          matrix: [
            ['1', '0'],
            ['0', '-1'],
          ],
        };
      case 's':
        return {
          name: 'Phase Gate (S)',
          matrix: [
            ['1', '0'],
            ['0', 'i'],
          ],
        };
      case 't':
        return {
          name: 'T Gate (π/8)',
          matrix: [
            ['1', '0'],
            ['0', 'e^(iπ/4)'],
          ],
        };
      case 'cx':
      case 'cnot':
        return {
          name: 'Controlled-NOT (CNOT)',
          matrix: [
            ['1', '0', '0', '0'],
            ['0', '1', '0', '0'],
            ['0', '0', '0', '1'],
            ['0', '0', '1', '0'],
          ],
        };
      case 'cz':
        return {
          name: 'Controlled-Z (CZ)',
          matrix: [
            ['1', '0', '0', '0'],
            ['0', '1', '0', '0'],
            ['0', '0', '1', '0'],
            ['0', '0', '0', '-1'],
          ],
        };
      case 'swap':
        return {
          name: 'SWAP Gate',
          matrix: [
            ['1', '0', '0', '0'],
            ['0', '0', '1', '0'],
            ['0', '1', '0', '0'],
            ['0', '0', '0', '1'],
          ],
        };
      default:
        return {
          name: gateName ? `${gateName.toUpperCase()} Gate` : 'Unitary U',
          matrix: [
            ['u₀₀', 'u₀₁'],
            ['u₁₀', 'u₁₁'],
          ],
        };
    }
  };

  const matrixInfo = getGateMatrix(currentStep?.gateName);

  return (
    <div className="math-derivation-panel">
      <div className="math-panel-header">
        <h3 className="math-title">Mathematical Derivation</h3>
        <span className="math-badge-step">
          {stepIndex === 0 ? 'Initial State' : `Step ${stepIndex}: ${currentStep?.operation || 'Gate Operation'}`}
        </span>
      </div>

      {stepIndex === 0 ? (
        <div className="math-initial-box">
          <div className="math-block">
            <span className="math-var-label">Initial State Vector:</span>
            <div className="math-equation">|ψ₀⟩ = |00...0⟩</div>
            <p className="math-description">
              The quantum register is prepared in the standard ground computational basis state,
              with all qubits having state |0⟩ and unit probability P(00...0) = 1.0.
            </p>
          </div>
        </div>
      ) : (
        <div className="math-flow">
          {/* Step 1: Input State */}
          <div className="math-card input-card">
            <span className="math-card-label">1. Pre-Operation Quantum State |ψₖ₋₁⟩</span>
            <div className="math-equation-box">
              <span className="math-formula">|ψ_{stepIndex - 1}⟩ = {formatDirac(inputStatevector)}</span>
            </div>
          </div>

          {/* Step 2: Gate Matrix & Transformation */}
          <div className="math-card transform-card">
            <span className="math-card-label">2. Unitary Transformation: {matrixInfo.name}</span>
            
            <div className="math-matrix-row">
              <div className="matrix-display">
                <span className="matrix-label">U = </span>
                <table className="math-matrix-table">
                  <tbody>
                    {matrixInfo.matrix.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {currentStep?.mathTransform && (
                <div className="math-transform-text">
                  <span className="transform-label">Algebraic Transformation:</span>
                  <pre className="transform-code">{currentStep.mathTransform}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Resulting State */}
          <div className="math-card output-card">
            <span className="math-card-label">3. Post-Operation Quantum State |ψₖ⟩</span>
            <div className="math-equation-box highlighted">
              <span className="math-formula">|ψ_{stepIndex}⟩ = U |ψ_{stepIndex - 1}⟩ = {formatDirac(outputStatevector)}</span>
            </div>
          </div>

          {/* Core Concept insight */}
          {currentStep?.concept && (
            <div className="math-concept-card">
              <span className="concept-icon">💡</span>
              <div className="concept-content">
                <strong>{currentStep.concept}:</strong> {currentStep.purpose}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
