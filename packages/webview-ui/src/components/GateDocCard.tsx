/**
 * @file GateDocCard.tsx
 * @description Renders structured gate documentation in the webview.
 */

import type { GateDoc } from '@shared/GateDoc';

interface GateDocCardProps {
  doc: GateDoc;
}

export function GateDocCard({ doc }: GateDocCardProps): JSX.Element {
  return (
    <div className="gate-doc-card">
      <h2 className="gate-doc-title">{doc.displayName}</h2>
      <p className="gate-doc-summary">{doc.summary}</p>

      {doc.mathIntuition && (
        <section className="gate-doc-section">
          <h3>How it works</h3>
          <p>{doc.mathIntuition}</p>
        </section>
      )}

      {doc.useCases && doc.useCases.length > 0 && (
        <section className="gate-doc-section">
          <h3>Use Cases</h3>
          <ul>
            {doc.useCases.map((uc, i) => <li key={i}>{uc}</li>)}
          </ul>
        </section>
      )}

      {doc.examples && doc.examples.length > 0 && (
        <section className="gate-doc-section">
          <h3>Example — {doc.examples[0].label}</h3>
          <pre className="gate-doc-code"><code>{doc.examples[0].code}</code></pre>
          <p className="gate-doc-note">{doc.examples[0].explanation}</p>
        </section>
      )}

      {doc.seeAlso && doc.seeAlso.length > 0 && (
        <p className="gate-doc-see-also">
          <strong>See also:</strong> {doc.seeAlso.join(', ')}
        </p>
      )}
    </div>
  );
}
