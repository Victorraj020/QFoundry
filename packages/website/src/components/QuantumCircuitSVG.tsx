/**
 * @file QuantumCircuitSVG.tsx
 * @description Interactive, crisp SVG quantum circuit renderer.
 */

import React from 'react';

export interface GateVisual {
  type: string;
  target: number;
  control?: number;
  controls?: number[];
  param?: string | number;
}

interface QuantumCircuitSVGProps {
  numQubits: number;
  gates: GateVisual[];
  activeStep?: number;
  className?: string;
}

const GATE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  h: { bg: '#e0e7ff', text: '#3730a3', border: '#818cf8' },
  x: { bg: '#fee2e2', text: '#991b1b', border: '#f87171' },
  y: { bg: '#ffedd5', text: '#9a3412', border: '#fb923c' },
  z: { bg: '#fef9c3', text: '#854d0e', border: '#facc15' },
  s: { bg: '#dcfce7', text: '#166534', border: '#4ade80' },
  t: { bg: '#d1fae5', text: '#065f46', border: '#34d399' },
  rx: { bg: '#fce7f3', text: '#831843', border: '#f472b6' },
  ry: { bg: '#ffe4e6', text: '#881337', border: '#fb7185' },
  rz: { bg: '#ffe4e6', text: '#881337', border: '#fb7185' },
  p: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  u: { bg: '#ede9fe', text: '#5b21b6', border: '#a78bfa' },
  swap: { bg: '#cffafe', text: '#155e75', border: '#22d3ee' },
  measure: { bg: '#f1f5f9', text: '#334155', border: '#94a3b8' },
};

export const QuantumCircuitSVG: React.FC<QuantumCircuitSVGProps> = ({
  numQubits,
  gates,
  activeStep,
  className = '',
}) => {
  const laneHeight = 56;
  const paddingLeft = 56;
  const paddingRight = 40;
  const paddingTop = 28;
  const stepWidth = 60;
  const totalSteps = Math.max(gates.length, 3);
  const width = paddingLeft + totalSteps * stepWidth + paddingRight;
  const height = paddingTop + numQubits * laneHeight;

  return (
    <div className={`overflow-x-auto select-none ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="font-mono text-xs"
        style={{ minWidth: '100%' }}
      >
        {/* Qubit wires and labels */}
        {Array.from({ length: numQubits }).map((_, q) => {
          const y = paddingTop + q * laneHeight + laneHeight / 2;
          return (
            <g key={`qubit-${q}`}>
              {/* Qubit label */}
              <text
                x={12}
                y={y + 4}
                className="fill-slate-600 dark:fill-slate-400 font-semibold text-[11px]"
              >
                q[{q}]
              </text>
              {/* Wire */}
              <line
                x1={paddingLeft - 12}
                y1={y}
                x2={width - 20}
                y2={y}
                stroke="currentColor"
                strokeWidth={1.5}
                className="text-slate-300 dark:text-slate-700"
              />
            </g>
          );
        })}

        {/* Gates */}
        {gates.map((gate, step) => {
          const x = paddingLeft + step * stepWidth + stepWidth / 2;
          const targetY = paddingTop + gate.target * laneHeight + laneHeight / 2;
          const isActive = activeStep === step;
          const colors = GATE_COLORS[gate.type.toLowerCase()] || {
            bg: '#f1f5f9',
            text: '#0f172a',
            border: '#94a3b8',
          };

          // Controlled gates (CX, CZ, CCX)
          const allControls = gate.controls || (gate.control !== undefined ? [gate.control] : []);

          return (
            <g key={`gate-${step}`} className="transition-all duration-200">
              {/* Vertical connector line for multi-qubit gates */}
              {allControls.length > 0 &&
                allControls.map((c, i) => {
                  const cy = paddingTop + c * laneHeight + laneHeight / 2;
                  return (
                    <g key={`ctrl-line-${i}`}>
                      <line
                        x1={x}
                        y1={Math.min(targetY, cy)}
                        x2={x}
                        y2={Math.max(targetY, cy)}
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                      {/* Control dot */}
                      <circle cx={x} cy={cy} r={5} fill="#3b82f6" />
                    </g>
                  );
                })}

              {/* Target Gate Rendering */}
              {gate.type.toLowerCase() === 'cx' ? (
                // CNOT target: cross in circle
                <g>
                  <circle
                    cx={x}
                    cy={targetY}
                    r={12}
                    fill="#3b82f6"
                    className="transition-transform"
                  />
                  <line x1={x - 8} y1={targetY} x2={x + 8} y2={targetY} stroke="#fff" strokeWidth={2} />
                  <line x1={x} y1={targetY - 8} x2={x} y2={targetY + 8} stroke="#fff" strokeWidth={2} />
                </g>
              ) : gate.type.toLowerCase() === 'measure' ? (
                // Measurement gate
                <g transform={`translate(${x - 16}, ${targetY - 16})`}>
                  <rect
                    width={32}
                    height={32}
                    rx={6}
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth={1.5}
                  />
                  <path
                    d="M 6 22 A 10 10 0 0 1 26 22"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={1.5}
                  />
                  <line x1={16} y1={22} x2={23} y2={11} stroke="#22c55e" strokeWidth={1.5} />
                </g>
              ) : gate.type.toLowerCase() === 'swap' ? (
                <g>
                  <line x1={x - 6} y1={targetY - 6} x2={x + 6} y2={targetY + 6} stroke="#06b6d4" strokeWidth={2} />
                  <line x1={x - 6} y1={targetY + 6} x2={x + 6} y2={targetY - 6} stroke="#06b6d4" strokeWidth={2} />
                </g>
              ) : (
                // Standard rectangular gate box
                <g transform={`translate(${x - 16}, ${targetY - 16})`}>
                  <rect
                    width={32}
                    height={32}
                    rx={6}
                    fill={colors.bg}
                    stroke={isActive ? '#15803d' : colors.border}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    filter={isActive ? 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.5))' : undefined}
                  />
                  <text
                    x={16}
                    y={gate.param !== undefined ? 14 : 20}
                    textAnchor="middle"
                    fill={colors.text}
                    fontWeight={700}
                    fontSize={11}
                  >
                    {gate.type.toUpperCase()}
                  </text>
                  {gate.param !== undefined && (
                    <text
                      x={16}
                      y={26}
                      textAnchor="middle"
                      fill={colors.text}
                      fontSize={8}
                    >
                      {typeof gate.param === 'number' ? gate.param.toFixed(2) : gate.param}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

