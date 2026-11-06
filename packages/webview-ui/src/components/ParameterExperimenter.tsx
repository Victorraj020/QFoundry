/**
 * @file ParameterExperimenter.tsx
 * @description Parameter configuration & live experimentation widget.
 */

import { useState } from 'react';
import type { AlgorithmParameter } from '@shared/messages';

interface ParameterExperimenterProps {
  parameters?: readonly AlgorithmParameter[] | undefined;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onExecute: (shots: number, seed?: number | undefined) => void;
  isSimulating: boolean;
  isComparisonMode: boolean;
  onToggleComparison: () => void;
}

export function ParameterExperimenter({
  parameters = [],
  values,
  onChange,
  onExecute,
  isSimulating,
  isComparisonMode,
  onToggleComparison,
}: ParameterExperimenterProps): JSX.Element {
  const [shots, setShots] = useState<number>(1024);
  const [seed, setSeed] = useState<string>('');

  const handleRun = () => {
    const seedNum = seed.trim() ? parseInt(seed.trim(), 10) : undefined;
    onExecute(shots, seedNum);
  };

  return (
    <div className="param-experimenter-widget">
      <div className="param-header">
        <h4 className="param-title">Interactive Experimentation & Parameters</h4>
        <div className="param-header-actions">
          <button
            className={`comparison-toggle-btn ${isComparisonMode ? 'active' : ''}`}
            onClick={onToggleComparison}
            title="Toggle side-by-side comparison with original baseline execution"
          >
            {isComparisonMode ? '✓ Comparison Mode Active' : '⚖️ Compare with Baseline'}
          </button>
        </div>
      </div>

      <div className="param-grid">
        {/* Dynamic Algorithm Parameters */}
        {parameters.map((param) => {
          const currentVal = values[param.id] ?? param.default;

          return (
            <div key={param.id} className="param-field">
              <label htmlFor={`param-${param.id}`} className="param-label">
                {param.label}
              </label>

              {param.type === 'select' && param.options && (
                <select
                  id={`param-${param.id}`}
                  className="param-input select-input"
                  value={String(currentVal)}
                  disabled={isSimulating}
                  onChange={(e) => onChange(param.id, e.target.value)}
                >
                  {param.options.map((opt) => (
                    <option key={String(opt.value)} value={String(opt.value)}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {param.type === 'number' && (
                <div className="param-number-control">
                  <input
                    type="number"
                    id={`param-${param.id}`}
                    className="param-input number-input"
                    value={Number(currentVal)}
                    min={param.min}
                    max={param.max}
                    step={param.step ?? 1}
                    disabled={isSimulating}
                    onChange={(e) => onChange(param.id, parseFloat(e.target.value) || 0)}
                  />
                  {param.min !== undefined && param.max !== undefined && (
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step ?? 1}
                      value={Number(currentVal)}
                      disabled={isSimulating}
                      onChange={(e) => onChange(param.id, parseFloat(e.target.value) || 0)}
                      className="param-slider"
                    />
                  )}
                </div>
              )}

              {param.type === 'text' && (
                <input
                  type="text"
                  id={`param-${param.id}`}
                  className="param-input text-input"
                  value={String(currentVal)}
                  disabled={isSimulating}
                  onChange={(e) => onChange(param.id, e.target.value)}
                />
              )}

              {param.description && <span className="param-hint">{param.description}</span>}
            </div>
          );
        })}

        {/* Measurement Shots Configuration */}
        <div className="param-field">
          <label htmlFor="exp-shots-input" className="param-label">Measurement Shots</label>
          <div className="shots-picker">
            <input
              type="number"
              id="exp-shots-input"
              className="param-input shots-input"
              value={shots}
              min={100}
              max={10000}
              step={100}
              disabled={isSimulating}
              onChange={(e) => setShots(Math.max(1, parseInt(e.target.value, 10) || 1024))}
            />
            <div className="shots-quick-btns">
              {[512, 1024, 4096].map((s) => (
                <button
                  key={s}
                  className={`shot-preset-btn ${shots === s ? 'active' : ''}`}
                  onClick={() => setShots(s)}
                  disabled={isSimulating}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reproducible Seed */}
        <div className="param-field">
          <label htmlFor="exp-seed-input" className="param-label">Random Seed (Reproducibility)</label>
          <input
            type="text"
            id="exp-seed-input"
            className="param-input seed-input"
            placeholder="e.g. 42 (optional)"
            value={seed}
            disabled={isSimulating}
            onChange={(e) => setSeed(e.target.value.replace(/\D/g, ''))}
          />
        </div>
      </div>

      <div className="param-submit-row">
        <button
          className="execute-algo-button"
          disabled={isSimulating}
          onClick={handleRun}
        >
          {isSimulating ? (
            <>
              <span className="spinner-dot" />
              Re-Simulating Quantum Circuit...
            </>
          ) : (
            '⚡ Apply Parameters & Re-Simulate'
          )}
        </button>
      </div>
    </div>
  );
}
