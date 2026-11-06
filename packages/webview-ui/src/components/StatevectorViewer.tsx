/**
 * @file StatevectorViewer.tsx
 * @description Detailed statevector viewer with Dirac notation, phase disks,
 * complex amplitude components, and measurement probabilities.
 */

import type { Amplitude } from '@shared/plugins';

interface StatevectorViewerProps {
  statevector: readonly Amplitude[];
  measurementCounts?: Record<string, number> | undefined;
  totalShots?: number | undefined;
}

export function StatevectorViewer({
  statevector,
  measurementCounts,
  totalShots = 1024,
}: StatevectorViewerProps): JSX.Element {
  if (!statevector || statevector.length === 0) {
    return (
      <div className="statevector-empty">
        <p>No statevector available for this step.</p>
      </div>
    );
  }

  return (
    <div className="statevector-viewer-widget">
      <div className="sv-header">
        <h4 className="sv-title">Quantum Statevector & Probability Amplitudes</h4>
        <span className="sv-dimension-badge">{statevector.length} Basis States (2^{Math.round(Math.log2(statevector.length))})</span>
      </div>

      <div className="sv-table-container">
        <table className="sv-table">
          <thead>
            <tr>
              <th className="th-basis">Basis |x⟩</th>
              <th className="th-phase">Phase</th>
              <th className="th-amplitude">Complex Amplitude (α)</th>
              <th className="th-prob">Probability (|α|²)</th>
              {measurementCounts && <th className="th-shots">Sampled Shots</th>}
            </tr>
          </thead>
          <tbody>
            {statevector.map((amp) => {
              const isNonZero = amp.probability > 0.0001;
              const percentage = (amp.probability * 100).toFixed(2);
              const deg = ((amp.phase * 180) / Math.PI).toFixed(0);

              // Phase disk colors
              const hue = ((amp.phase + Math.PI) / (2 * Math.PI)) * 360;
              const diskColor = isNonZero ? `hsl(${hue}, 80%, 55%)` : 'transparent';
              const strokeColor = isNonZero ? 'var(--vscode-editor-foreground, #fff)' : 'var(--vscode-panel-border, #475569)';

              const reSign = amp.re >= 0 ? '+' : '-';
              const imSign = amp.im >= 0 ? '+' : '-';
              const ampStr = `${reSign}${Math.abs(amp.re).toFixed(4)} ${imSign} ${Math.abs(amp.im).toFixed(4)}i`;

              const shots = measurementCounts?.[amp.state] ?? 0;
              const shotPercentage = totalShots > 0 ? ((shots / totalShots) * 100).toFixed(1) : '0.0';

              return (
                <tr key={amp.state} className={`sv-row ${isNonZero ? 'active-basis' : 'zero-basis'}`}>
                  <td className="col-basis">
                    <strong>|{amp.state}⟩</strong>
                  </td>

                  <td className="col-phase">
                    <div className="phase-cell">
                      <svg width="22" height="22" viewBox="0 0 22 22" className="phase-icon">
                        <circle cx="11" cy="11" r="9" fill={diskColor} stroke={strokeColor} strokeWidth="1.2" />
                        {isNonZero && (
                          <line
                            x1="11"
                            y1="11"
                            x2={11 + 9 * Math.cos(amp.phase)}
                            y2={11 - 9 * Math.sin(amp.phase)}
                            stroke="var(--vscode-editor-background, #1e1e1e)"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                      <span className="phase-deg">{isNonZero ? `${deg}°` : '—'}</span>
                    </div>
                  </td>

                  <td className="col-amp">
                    <code className="amp-code">{ampStr}</code>
                  </td>

                  <td className="col-prob">
                    <div className="prob-wrapper">
                      <div className="prob-bar-track">
                        <div className="prob-bar-fill" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="prob-num">{percentage}%</span>
                    </div>
                  </td>

                  {measurementCounts && (
                    <td className="col-shots">
                      <span className="shots-text">
                        {shots} ({shotPercentage}%)
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
