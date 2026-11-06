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
