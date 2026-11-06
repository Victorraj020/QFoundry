/**
 * @file AlgorithmTheoryPanel.tsx
 * @description Educational explanation panel for quantum algorithms with progressive disclosure.
 */

import { useState } from 'react';
import type { AlgorithmMetadata } from '@shared/messages';

interface AlgorithmTheoryPanelProps {
  algorithm: AlgorithmMetadata;
}

export function AlgorithmTheoryPanel({ algorithm }: AlgorithmTheoryPanelProps): JSX.Element {
  const [showDeepMath, setShowDeepMath] = useState(false);

  return (
    <div className="theory-panel">
      {/* Overview section */}
      <section className="theory-section">
        <h3 className="section-title">Overview</h3>
        <p className="theory-text">{algorithm.shortDescription}</p>
        <div className="theory-importance-box">
          <strong>Why it matters: </strong>
          <span>{algorithm.importance}</span>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="theory-section">
        <h3 className="section-title">Problem Statement</h3>
        <div className="theory-callout">
          <p>{algorithm.problemStatement}</p>
        </div>
      </section>

      {/* Core Quantum Concept */}
      <section className="theory-section">
        <h3 className="section-title">Core Quantum Concept</h3>
        <div className="concept-highlight-pill">
          <span className="concept-badge-icon">⚛️</span>
          <strong>{algorithm.coreConcept}</strong>
        </div>
      </section>

      {/* Classical vs Quantum Comparison */}
      {algorithm.classicalVsQuantum && (
        <section className="theory-section">
          <h3 className="section-title">Classical vs Quantum Approach</h3>
          <div className="comparison-grid">
            <div className="comparison-card classical">
              <span className="comp-tag">Classical</span>
              <div className="comp-metric-label">Query Complexity</div>
              <div className="comp-metric-val">{algorithm.classicalVsQuantum.classicalComplexity}</div>
              <div className="comp-subtext">{algorithm.classicalVsQuantum.classicalQueries} queries</div>
            </div>
            <div className="comparison-card quantum">
              <span className="comp-tag">Quantum</span>
              <div className="comp-metric-label">Query Complexity</div>
              <div className="comp-metric-val">{algorithm.classicalVsQuantum.quantumComplexity}</div>
              <div className="comp-subtext">{algorithm.classicalVsQuantum.quantumQueries} queries</div>
            </div>
          </div>
          <p className="comp-explanation">{algorithm.classicalVsQuantum.explanation}</p>
        </section>
      )}

      {/* Mathematical Foundations (with progressive disclosure) */}
      <section className="theory-section">
        <div className="math-header-toggle">
          <h3 className="section-title">Mathematical Foundation</h3>
          <button
            className="toggle-math-btn"
            onClick={() => setShowDeepMath(!showDeepMath)}
          >
            {showDeepMath ? 'Hide Math Derivation ▲' : 'Show Full Math Derivation ▼'}
          </button>
        </div>

        {showDeepMath ? (
          <div className="math-deep-container">
            <pre className="math-foundations-code">{algorithm.mathFoundations}</pre>
          </div>
        ) : (
          <p className="math-summary-hint">
            Click <em>Show Full Math Derivation</em> above to inspect explicit state transformations,
            tensor product evolutions, and phase kickback equations.
          </p>
        )}
      </section>

      {/* Expected Result & Prerequisites */}
      <section className="theory-section meta-section">
        <div className="meta-split">
          <div className="meta-col">
            <h4 className="meta-subtitle">Expected Measurement Output</h4>
            <p className="meta-text">{algorithm.expectedOutput}</p>
          </div>
          <div className="meta-col">
            <h4 className="meta-subtitle">Prerequisite Concepts</h4>
            <ul className="prereq-list">
              {algorithm.prerequisites.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
