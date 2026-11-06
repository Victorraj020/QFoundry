/**
 * @file BlochSphere.tsx
 * @description Mathematically rigorous 3D Bloch sphere visualization.
 *
 * Computes exact reduced density matrix expectation values:
 *   ⟨X⟩ = Tr(ρ X), ⟨Y⟩ = Tr(ρ Y), ⟨Z⟩ = Tr(ρ Z)
 * Displays Bloch vector r, polar angle θ, azimuthal angle ϕ,
 * and explicitly flags entangled/mixed subsystem states where |r| < 1.
 */

import { useMemo } from 'react';
import type { Amplitude } from '@shared/plugins';

interface BlochSphereProps {
  statevector: readonly Amplitude[];
  numQubits: number;
  selectedQubit: number;
  onSelectQubit?: (qubit: number) => void;
}

export function BlochSphere({
  statevector,
  numQubits,
  selectedQubit,
  onSelectQubit,
}: BlochSphereProps): JSX.Element {
  // Compute reduced Bloch vector for selectedQubit
  const { x, y, z, r, theta, phi, isEntangled } = useMemo(() => {
    if (!statevector || statevector.length === 0) {
      return { x: 0, y: 0, z: 1, r: 1, theta: 0, phi: 0, isEntangled: false };
    }

    const q = selectedQubit;
    let sumZ = 0;
    let sumRePair = 0;
    let sumImPair = 0;

    // Build map from binary state to amplitude
    const ampMap = new Map<number, { re: number; im: number; prob: number }>();
    for (const amp of statevector) {
      const idx = parseInt(amp.state, 2);
      ampMap.set(idx, { re: amp.re, im: amp.im, prob: amp.probability });
    }

    const dim = 2 ** numQubits;
    for (let i = 0; i < dim; i++) {
      const ampI = ampMap.get(i) ?? { re: 0, im: 0, prob: 0 };
      const bit = (i >> q) & 1;

      // Z expectation: (+1 for |0>, -1 for |1>)
      sumZ += bit === 0 ? ampI.prob : -ampI.prob;

      // X and Y expectation: paired states i and i ^ (1 << q)
      if (bit === 0) {
        const j = i | (1 << q);
        const ampJ = ampMap.get(j) ?? { re: 0, im: 0, prob: 0 };
        // c_i* * c_j = (re_i - i*im_i)(re_j + i*im_j)
        const re = ampI.re * ampJ.re + ampI.im * ampJ.im;
        const im = ampI.re * ampJ.im - ampI.im * ampJ.re;
        sumRePair += re;
        sumImPair += im;
      }
    }

    const expX = 2 * sumRePair;
    const expY = 2 * sumImPair;
    const expZ = sumZ;

    const rawR = Math.sqrt(expX * expX + expY * expY + expZ * expZ);
    const clampedR = Math.min(1.0, rawR);
    const safeR = clampedR < 0.0001 ? 0.0001 : clampedR;

    const computedTheta = Math.acos(Math.max(-1, Math.min(1, expZ / safeR)));
    const computedPhi = Math.atan2(expY, expX);

    // If r < 0.95 and total qubits > 1, the qubit is entangled with other qubits
    const entangled = numQubits > 1 && clampedR < 0.95;

    return {
      x: expX,
      y: expY,
      z: expZ,
      r: clampedR,
      theta: computedTheta,
      phi: computedPhi,
      isEntangled: entangled,
    };
  }, [statevector, numQubits, selectedQubit]);

  // 3D to 2D projection parameters
  const CX = 120;
  const CY = 120;
  const R = 80;

  // Isometric-style projection angles:
  // X: down-left (+x projects to -cos30, +sin30)
  // Y: right (+y projects to +cos30, +sin30)
  // Z: straight up (-z in screen coords)
  const project = (px: number, py: number, pz: number) => {
    const screenX = CX + R * (py * 0.85 - px * 0.5);
    const screenY = CY + R * (-pz + px * 0.3 + py * 0.15);
    return { sx: screenX, sy: screenY };
  };

  const centerPt = { sx: CX, sy: CY };
  const zPlus = project(0, 0, 1);
  const zMinus = project(0, 0, -1);
  const xPlus = project(1, 0, 0);
  const yPlus = project(0, 1, 0);
  const tipPt = project(x, y, z);

  const thetaDeg = (theta * (180 / Math.PI)).toFixed(1);
  const phiDeg = (phi * (180 / Math.PI)).toFixed(1);

  return (
    <div className="bloch-sphere-widget">
      <div className="bloch-header">
        <h4 className="bloch-title">Bloch Sphere Representation</h4>
        {numQubits > 1 && (
          <div className="bloch-qubit-selector">
            <label htmlFor="bloch-qubit-select">Inspect Qubit:</label>
            <select
              id="bloch-qubit-select"
              value={selectedQubit}
              onChange={(e) => onSelectQubit?.(parseInt(e.target.value, 10))}
              className="bloch-select"
            >
              {Array.from({ length: numQubits }, (_, i) => (
                <option key={i} value={i}>
                  q{i}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {isEntangled && (
        <div className="bloch-entangled-alert">
          <span className="badge-entangled">⚛️ Mixed Subsystem (|r| = {r.toFixed(2)})</span>
          <span className="bloch-alert-desc">
            Qubit q{selectedQubit} is entangled with the quantum register. Its reduced state is mixed and resides inside the sphere.
          </span>
        </div>
      )}

      <div className="bloch-canvas-container">
        <svg width="240" height="240" viewBox="0 0 240 240" className="bloch-svg" aria-label="Bloch sphere diagram">
          <defs>
            <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.15)" />
              <stop offset="70%" stopColor="rgba(30, 41, 59, 0.4)" />
              <stop offset="100%" stopColor="rgba(15, 23, 42, 0.8)" />
            </radialGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Sphere circle */}
          <circle cx={CX} cy={CY} r={R} fill="url(#sphereGrad)" stroke="var(--vscode-panel-border, #475569)" strokeWidth="1.5" />

          {/* Equator ellipse (Z=0 plane) */}
          <ellipse
            cx={CX}
            cy={CY}
            rx={R}
            ry={R * 0.3}
            fill="none"
            stroke="var(--vscode-editorLineNumber-foreground, #64748b)"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.7"
          />

          {/* Meridian ellipse */}
          <ellipse
            cx={CX}
            cy={CY}
            rx={R * 0.3}
            ry={R}
            fill="none"
            stroke="var(--vscode-editorLineNumber-foreground, #64748b)"
            strokeWidth="0.75"
            strokeDasharray="2 2"
            opacity="0.4"
          />

          {/* Axes */}
          {/* Z Axis */}
          <line x1={zMinus.sx} y1={zMinus.sy} x2={zPlus.sx} y2={zPlus.sy} stroke="var(--vscode-foreground)" strokeWidth="1" opacity="0.6" />
          <text x={zPlus.sx} y={zPlus.sy - 8} fill="var(--vscode-foreground)" fontSize="11" textAnchor="middle" fontWeight="bold">
            |0⟩ (+z)
          </text>
          <text x={zMinus.sx} y={zMinus.sy + 14} fill="var(--vscode-foreground)" fontSize="11" textAnchor="middle" opacity="0.8">
            |1⟩ (-z)
          </text>

          {/* X Axis */}
          <line x1={centerPt.sx} y1={centerPt.sy} x2={xPlus.sx} y2={xPlus.sy} stroke="#ef4444" strokeWidth="1" opacity="0.6" strokeDasharray="2 2" />
          <text x={xPlus.sx - 10} y={xPlus.sy + 10} fill="#ef4444" fontSize="10" textAnchor="middle">
            |+⟩ (+x)
          </text>

          {/* Y Axis */}
          <line x1={centerPt.sx} y1={centerPt.sy} x2={yPlus.sx} y2={yPlus.sy} stroke="#22c55e" strokeWidth="1" opacity="0.6" strokeDasharray="2 2" />
          <text x={yPlus.sx + 14} y={yPlus.sy + 4} fill="#22c55e" fontSize="10" textAnchor="middle">
            |+i⟩ (+y)
          </text>

          {/* State vector arrow */}
          <line
            x1={centerPt.sx}
            y1={centerPt.sy}
            x2={tipPt.sx}
            y2={tipPt.sy}
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />

          {/* Tip highlight dot */}
          <circle cx={tipPt.sx} cy={tipPt.sy} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
        </svg>

        {/* Coordinate stats table */}
        <div className="bloch-stats">
          <div className="bloch-stat-row">
            <span className="bloch-stat-label">Vector |r|:</span>
            <span className={`bloch-stat-val ${isEntangled ? 'mixed' : 'pure'}`}>{r.toFixed(3)} ({isEntangled ? 'Mixed' : 'Pure'})</span>
          </div>
          <div className="bloch-stat-row">
            <span className="bloch-stat-label">Polar θ:</span>
            <span className="bloch-stat-val">{thetaDeg}° ({theta.toFixed(2)} rad)</span>
          </div>
          <div className="bloch-stat-row">
            <span className="bloch-stat-label">Azimuthal ϕ:</span>
            <span className="bloch-stat-val">{phiDeg}° ({phi.toFixed(2)} rad)</span>
          </div>
          <div className="bloch-coords-vector">
            (⟨X⟩, ⟨Y⟩, ⟨Z⟩) = ({x.toFixed(2)}, {y.toFixed(2)}, {z.toFixed(2)})
          </div>
        </div>
      </div>
    </div>
  );
}
