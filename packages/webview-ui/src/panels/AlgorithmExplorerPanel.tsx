/**
 * @file AlgorithmExplorerPanel.tsx
 * @description React view for the Quantum Algorithm Explorer.
 *
 * Implements interactive algorithm selection, step-by-step circuit animation,
 * mathematical derivations, Bloch sphere visualization, statevector analysis,
 * parameter experimentation, and three learning modes (Guided, Interactive, Advanced).
 */

import { useEffect, useState, useMemo } from 'react';
import { useAlgorithmStore, type LearningMode } from '../store/algorithmStore';
import { useUIStore } from '../store/uiStateStore';
import { postMessageToExtension } from '../hooks/useVSCodeMessage';
import { CircuitCanvas } from '../components/CircuitCanvas';
import { ExecutionController } from '../components/ExecutionController';
import { MathematicalDerivation } from '../components/MathematicalDerivation';
import { StatevectorViewer } from '../components/StatevectorViewer';
import { BlochSphere } from '../components/BlochSphere';
import { AlgorithmTheoryPanel } from '../components/AlgorithmTheoryPanel';
import { ParameterExperimenter } from '../components/ParameterExperimenter';
import { ComparisonViewer } from '../components/ComparisonViewer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorBoundary } from '../components/ErrorBoundary';

const CATEGORIES = [
  'All',
  'Foundational algorithms',
  'Quantum search',
  'Quantum information',
  'Quantum transforms',
  'Advanced algorithms',
];

export function AlgorithmExplorerPanel(): JSX.Element {
  const {
    catalog,
    selectedAlgorithmId,
    selectedAlgorithm,
    activeMode,
    circuit,
    steps,
    statevectorSteps,
    simulationResult,
    currentStepIndex,
    isPlaying,
    playSpeedMs,
    parameters,
    baselineResult,
    isComparisonMode,
    selectedBlochQubit,
    searchQuery,
    selectedCategory,
    selectAlgorithm,
    setActiveMode,
    setCurrentStepIndex,
    setIsPlaying,
    setPlaySpeedMs,
    setParameter,
    toggleComparisonMode,
    setSelectedBlochQubit,
    setSearchQuery,
    setSelectedCategory,
  } = useAlgorithmStore();

  const { isLoading, loadingMessage, error } = useUIStore();
  const [activeTab, setActiveTab] = useState<'visuals' | 'theory' | 'math' | 'experiment'>('visuals');

  // Request catalog on mount
  useEffect(() => {
    postMessageToExtension({ type: 'REQUEST_ALGORITHM_CATALOG' });
  }, []);

  // Request simulation when algorithm or parameters change
  useEffect(() => {
    if (selectedAlgorithmId) {
      postMessageToExtension({
        type: 'REQUEST_SIMULATE_ALGORITHM',
        payload: {
          algorithmId: selectedAlgorithmId,
          parameters,
        },
      });
    }
  }, [selectedAlgorithmId, parameters]);

  // Filtered algorithms based on category and search query
  const filteredCatalog = useMemo(() => {
    return catalog.filter((algo) => {
      const matchCat = selectedCategory === 'All' || algo.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.coreConcept.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [catalog, selectedCategory, searchQuery]);

  // Current step explanation and statevector
  const currentStep = steps[currentStepIndex - 1];

  // In statevectorSteps, index 0 is gateIndex -1 (initial state), index k is gateIndex k-1
  // We locate the statevector matching the current execution step
  const currentSV = useMemo(() => {
    if (!statevectorSteps || statevectorSteps.length === 0) {
      return [];
    }
    // If step 0, return initial statevector
    if (currentStepIndex === 0) {
      return statevectorSteps[0]?.statevector ?? [];
    }
    // Return intermediate statevector after gate (currentStepIndex - 1)
    const svIndex = Math.min(currentStepIndex, statevectorSteps.length - 1);
    return statevectorSteps[svIndex]?.statevector ?? [];
  }, [statevectorSteps, currentStepIndex]);

  const prevSV = useMemo(() => {
    if (!statevectorSteps || statevectorSteps.length === 0 || currentStepIndex === 0) {
      return [];
    }
    const svIndex = Math.max(0, currentStepIndex - 1);
    return statevectorSteps[svIndex]?.statevector ?? [];
  }, [statevectorSteps, currentStepIndex]);

  // Active gate index for circuit renderer highlight
  const activeGateIdx = currentStepIndex === 0 ? -1 : currentStepIndex - 1;

  if (isLoading && !circuit) {
    return <LoadingSpinner message={loadingMessage || 'Loading Quantum Algorithm Explorer...'} />;
  }

  if (error && !circuit) {
    return (
      <div className="panel-error" role="alert">
        <span className="panel-error-icon">⚠️</span>
        <div className="panel-error-content">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const currentPayload = {
    circuit: circuit ?? {
      id: '',
      filePath: '',
      variableName: '',
      qubits: 1,
      classicalBits: 1,
      gates: [],
      sourceRange: { startLine: 0, endLine: 0 },
      isApproximate: false,
    },
    steps,
    metadata: selectedAlgorithm ?? (catalog[0] || ({} as any)),
    statevectorSteps,
    simulation: simulationResult ?? { counts: {}, provider: '', executionTimeMs: 0 },
  };

  return (
    <div className="algo-explorer-panel">
      {/* Top Bar: Selector, Badges & Learning Mode Switcher */}
      <header className="algo-header">
        <div className="algo-header-left">
          <div className="algo-select-group">
            <label htmlFor="algo-select-dropdown" className="algo-select-label">
              Algorithm:
            </label>
            <select
              id="algo-select-dropdown"
              className="algo-dropdown"
              value={selectedAlgorithmId}
              onChange={(e) => selectAlgorithm(e.target.value)}
            >
              {filteredCatalog.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.category})
                </option>
              ))}
            </select>
          </div>

          {selectedAlgorithm && (
            <div className="algo-badges">
              <span className={`badge-difficulty ${selectedAlgorithm.difficulty.toLowerCase()}`}>
                {selectedAlgorithm.difficulty}
              </span>
              <span className="badge-qubits">{circuit?.qubits ?? selectedAlgorithm.qubits} Qubits</span>
              <span className="badge-category">{selectedAlgorithm.category}</span>
            </div>
          )}
        </div>

        {/* Mode Switcher */}
        <div className="mode-switcher" role="radiogroup" aria-label="Learning Mode">
          {(
            [
              { id: 'guided', label: 'Guided Learning', icon: '🎓' },
              { id: 'interactive', label: 'Interactive Execution', icon: '⚡' },
              { id: 'advanced', label: 'Advanced Analysis', icon: '🔬' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              className={`mode-btn ${activeMode === m.id ? 'active' : ''}`}
              role="radio"
              aria-checked={activeMode === m.id}
              onClick={() => setActiveMode(m.id as LearningMode)}
            >
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
      </header>

      {/* Category Filter Pills & Search */}
      <div className="algo-filter-bar">
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="algo-search-wrapper">
          <input
            type="text"
            className="algo-search-input"
            placeholder="Search algorithms, oracles, concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="algo-main-layout">
        {/* Comparison Modal Overlay */}
        {isComparisonMode && baselineResult && (
          <div className="comparison-overlay">
            <ComparisonViewer
              baseline={baselineResult}
              current={currentPayload}
              onClose={toggleComparisonMode}
            />
          </div>
        )}

        {/* TOP SECTION: Animated Quantum Circuit Diagram & Execution Controls */}
        <section className="algo-circuit-section">
          <div className="circuit-card">
            <div className="circuit-card-header">
              <div className="circuit-meta-title">
                <strong>Quantum Circuit Execution</strong>
                <span className="step-gate-counter">
                  {currentStepIndex === 0
                    ? 'Step 0: Initial Ground State'
                    : `Step ${currentStepIndex} of ${circuit?.gates.length ?? 0}: ${currentStep?.operation || ''}`}
                </span>
              </div>
              <div className="circuit-view-tabs">
                <button
                  className={`view-tab-btn ${activeTab === 'visuals' ? 'active' : ''}`}
                  onClick={() => setActiveTab('visuals')}
                >
                  Visuals & Bloch
                </button>
                <button
                  className={`view-tab-btn ${activeTab === 'theory' ? 'active' : ''}`}
                  onClick={() => setActiveTab('theory')}
                >
                  Theory & Intuition
                </button>
                <button
                  className={`view-tab-btn ${activeTab === 'math' ? 'active' : ''}`}
                  onClick={() => setActiveTab('math')}
                >
                  Math Derivation
                </button>
                <button
                  className={`view-tab-btn ${activeTab === 'experiment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('experiment')}
                >
                  Experimentation
                </button>
              </div>
            </div>

            {/* Circuit Canvas with real-time gate highlighting */}
            {circuit && (
              <div className="algo-circuit-canvas-wrapper">
                <ErrorBoundary>
                  <CircuitCanvas
                    ir={circuit}
                    activeGateIndex={activeGateIdx}
                  />
                </ErrorBoundary>
              </div>
            )}

            {/* Execution Transport Controls */}
            <ExecutionController
              currentStepIndex={currentStepIndex}
              totalSteps={circuit?.gates.length ?? steps.length}
              currentStep={currentStep}
              isPlaying={isPlaying}
              playSpeedMs={playSpeedMs}
              onStepChange={setCurrentStepIndex}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
              onSpeedChange={setPlaySpeedMs}
              onRestart={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
            />
          </div>
        </section>

        {/* BOTTOM SECTION: Content panels based on selected tab and active mode */}
        <section className="algo-details-section">
          {activeTab === 'visuals' && (
            <div className="visuals-two-column-layout">
              {/* Left Column: Statevector Viewer */}
              <div className="visuals-col statevector-col">
                <StatevectorViewer
                  statevector={currentSV}
                  measurementCounts={simulationResult?.counts}
                  totalShots={simulationResult?.shots ?? 1024}
                />
              </div>

              {/* Right Column: Bloch Sphere */}
              <div className="visuals-col bloch-col">
                <BlochSphere
                  statevector={currentSV}
                  numQubits={circuit?.qubits ?? 1}
                  selectedQubit={selectedBlochQubit}
                  onSelectQubit={setSelectedBlochQubit}
                />
              </div>
            </div>
          )}

          {activeTab === 'theory' && selectedAlgorithm && (
            <div className="theory-tab-wrapper">
              <AlgorithmTheoryPanel algorithm={selectedAlgorithm} />
            </div>
          )}

          {activeTab === 'math' && (
            <div className="math-tab-wrapper">
              <MathematicalDerivation
                currentStep={currentStep}
                stepIndex={currentStepIndex}
                inputStatevector={prevSV}
                outputStatevector={currentSV}
              />
            </div>
          )}

          {activeTab === 'experiment' && (
            <div className="experiment-tab-wrapper">
              <ParameterExperimenter
                parameters={selectedAlgorithm?.parameters}
                values={parameters}
                onChange={setParameter}
                onExecute={(shots, seed) => {
                  postMessageToExtension({
                    type: 'REQUEST_SIMULATE_ALGORITHM',
                    payload: {
                      algorithmId: selectedAlgorithmId,
                      parameters,
                      shots,
                      seed,
                    },
                  });
                }}
                isSimulating={isLoading}
                isComparisonMode={isComparisonMode}
                onToggleComparison={toggleComparisonMode}
              />
            </div>
          )}
        </section>

        {/* Advanced Analysis Mode Extras / Guided Tips */}
        {activeMode === 'guided' && (
          <div className="guided-mode-footer">
            <span className="guided-icon">💡</span>
            <div className="guided-content">
              <strong>Guided Learning Tip:</strong> Use the <strong>Auto-Play</strong> or <strong>Next Step</strong> controls
              to observe the wave function evolve in real-time. Notice how gates like <strong>Hadamard</strong> create
              superpositions on the Bloch sphere, while <strong>CNOT</strong> entangles qubits and collapses pure single-qubit states into mixed states!
            </div>
          </div>
        )}

        {activeMode === 'advanced' && (
          <div className="advanced-analysis-footer">
            <div className="advanced-stat-row">
              <span className="adv-label">Simulation Provider:</span>
              <span className="adv-val">{simulationResult?.provider ?? 'Local Statevector Simulator'}</span>
              <span className="adv-sep">·</span>
              <span className="adv-label">Circuit Depth:</span>
              <span className="adv-val">{circuit?.gates.length ?? 0}</span>
              <span className="adv-sep">·</span>
              <span className="adv-label">QML Extension Hook:</span>
              <span className="adv-val">Parameterized Unitary Ready (U(θ, ϕ, λ))</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
