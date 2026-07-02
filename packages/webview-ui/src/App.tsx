/**
 * @file App.tsx
 * @description Root React component.
 *
 * Reads the panel ID from the meta tag injected by PanelBase,
 * bootstraps data hooks, and renders the correct panel view.
 */

import { useCircuitData } from './hooks/useCircuitData';
import { CircuitPreviewPanel } from './panels/CircuitPreviewPanel';
import { TimelinePanel } from './panels/TimelinePanel';
import { ExplainPanel } from './panels/ExplainPanel';

function getPanelId(): string {
  const meta = document.querySelector('meta[name="qforge-panel-id"]');
  return meta?.getAttribute('content') ?? 'qforge.circuitPreview';
}

const PANEL_ID = getPanelId();

export function App(): JSX.Element {
  // Bootstrap the data pipeline — listens to VS Code messages, populates stores.
  useCircuitData();

  switch (PANEL_ID) {
    case 'qforge.circuitPreview':
      return <CircuitPreviewPanel />;
    case 'qforge.timeline':
      return <TimelinePanel />;
    case 'qforge.explain':
      return <ExplainPanel />;
    default:
      return <CircuitPreviewPanel />;
  }
}
