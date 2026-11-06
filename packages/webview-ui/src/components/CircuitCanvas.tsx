/**
 * @file CircuitCanvas.tsx
 * @description Container component that hosts a CircuitRenderer plugin.
 *
 * Holds a ref to the container div, instantiates the renderer,
 * and calls render() whenever the CircuitIR changes.
 */

import { useEffect, useRef } from 'react';
import type { CircuitIR } from '@shared/CircuitIR';
import { SvgCircuitRenderer } from '../renderers/SvgCircuitRenderer';
import { DEFAULT_THEME } from '../renderers/types';

const renderer = new SvgCircuitRenderer();

interface CircuitCanvasProps {
  ir: CircuitIR;
  activeGateIndex?: number | undefined;
  activeStep?: number | undefined;
}

export function CircuitCanvas({ ir, activeGateIndex, activeStep }: CircuitCanvasProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      renderer.render(ir, containerRef.current, DEFAULT_THEME, {
        activeGateIndex,
        activeStep,
      });

      // Auto-scroll container to keep the active gate in view
      if (activeGateIndex !== undefined && activeGateIndex >= 0 && ir.gates[activeGateIndex]) {
        const step = ir.gates[activeGateIndex].step;
        // PADDING.left (40) + QUBIT_LABEL_WIDTH (48) + step * STEP_WIDTH (64)
        const gateCenterPx = 40 + 48 + step * 64 + 32;
        const container = containerRef.current;
        const visibleWidth = container.clientWidth;
        const targetScrollLeft = gateCenterPx - visibleWidth / 2;

        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth',
        });
      }
    }
    return () => {
      // Cleanup is handled by the next render call overwriting innerHTML
    };
  }, [ir, activeGateIndex, activeStep]);

  return (
    <div
      ref={containerRef}
      style={{ overflowX: 'auto', overflowY: 'hidden', width: '100%' }}
      aria-label="Quantum circuit diagram"
    />
  );
}
