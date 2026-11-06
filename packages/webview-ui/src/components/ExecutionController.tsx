/**
 * @file ExecutionController.tsx
 * @description Playback controller for step-by-step quantum algorithm execution.
 */

import { useEffect, useRef } from 'react';
import type { StepExplanation } from '@shared/messages';

interface ExecutionControllerProps {
  currentStepIndex: number;
  totalSteps: number;
  currentStep?: StepExplanation | undefined;
  isPlaying: boolean;
  playSpeedMs: number;
  onStepChange: (index: number) => void;
  onPlayToggle: () => void;
  onSpeedChange: (speedMs: number) => void;
  onRestart: () => void;
}

export function ExecutionController({
  currentStepIndex,
  totalSteps,
  currentStep,
  isPlaying,
  playSpeedMs,
  onStepChange,
  onPlayToggle,
  onSpeedChange,
  onRestart,
}: ExecutionControllerProps): JSX.Element {
  // Stable refs to avoid timer interval teardown on every step tick
  const stepRef = useRef(currentStepIndex);
  stepRef.current = currentStepIndex;

  const totalStepsRef = useRef(totalSteps);
  totalStepsRef.current = totalSteps;

  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  const onPlayToggleRef = useRef(onPlayToggle);
  onPlayToggleRef.current = onPlayToggle;

  // Handle auto-play timer stably
  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const timer = setInterval(() => {
      const cur = stepRef.current;
      const total = totalStepsRef.current;
      if (cur >= total) {
        onPlayToggleRef.current(); // Stop when end is reached
      } else {
        onStepChangeRef.current(cur + 1);
      }
    }, playSpeedMs);

    return () => clearInterval(timer);
  }, [isPlaying, playSpeedMs]);

  return (
    <div className="algo-exec-controller">
      {/* Top row: Transport Controls */}
      <div className="controller-main-row">
        <div className="controller-buttons">
          <button
            className="ctrl-btn"
            title="Restart to Beginning"
            onClick={onRestart}
          >
            ⏮️
          </button>
          <button
            className="ctrl-btn"
            title="Previous Step"
            disabled={currentStepIndex <= 0}
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
          >
            ◀️
          </button>
          <button
            className={`ctrl-btn play-btn ${isPlaying ? 'active' : ''}`}
            title={isPlaying ? 'Pause Auto-Execution' : 'Start Auto-Execution'}
            onClick={onPlayToggle}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Auto-Play'}
          </button>
          <button
            className="ctrl-btn"
            title="Next Step"
            disabled={currentStepIndex >= totalSteps}
            onClick={() => onStepChange(Math.min(totalSteps, currentStepIndex + 1))}
          >
            ▶️
          </button>
          <button
            className="ctrl-btn"
            title="Jump to End"
            onClick={() => onStepChange(totalSteps)}
          >
            ⏭️
          </button>
        </div>

        {/* Speed Controls */}
        <div className="controller-speed-group">
          <span className="speed-label">Speed:</span>
          {[
            { label: '0.5x', ms: 1800 },
            { label: '1x', ms: 1000 },
            { label: '2x', ms: 500 },
            { label: '3x', ms: 300 },
          ].map((s) => (
            <button
              key={s.ms}
              className={`speed-btn ${playSpeedMs === s.ms ? 'active' : ''}`}
              onClick={() => onSpeedChange(s.ms)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Middle row: Scrubber Slider */}
      <div className="controller-scrubber-row">
        <input
          type="range"
          min={0}
          max={totalSteps}
          value={currentStepIndex}
          onChange={(e) => onStepChange(parseInt(e.target.value, 10))}
          className="exec-scrubber"
          aria-label="Algorithm execution step slider"
        />
        <div className="scrubber-labels">
          <span className="step-count">
            Step {currentStepIndex} of {totalSteps}
          </span>
          <span className="step-phase">
            {currentStepIndex === 0
              ? 'Initial State |00...0⟩'
              : currentStep
                ? `${currentStep.operation} [${currentStep.concept}]`
                : 'Complete'}
          </span>
        </div>
      </div>

      {/* Active step quick summary card */}
      {currentStep && currentStepIndex > 0 && (
        <div className="active-step-banner">
          <div className="banner-left">
            <span className="badge-gate">{currentStep.gateName}</span>
            <div className="banner-text">
              <strong className="banner-title">{currentStep.title}</strong>
              <span className="banner-purpose">{currentStep.purpose}</span>
            </div>
          </div>
          <div className="banner-right">
            <span className="banner-concept-pill">{currentStep.concept}</span>
          </div>
        </div>
      )}
    </div>
  );
}
