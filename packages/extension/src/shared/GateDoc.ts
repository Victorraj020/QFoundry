/**
 * @file GateDoc.ts
 * @description Schema for gate documentation cards.
 *
 * Consumed by HoverProvider (VS Code markdown), GateDocCard (React webview),
 * and future documentation platform. Adding a field here is a breaking change
 * for all consumers — version carefully.
 */

/**
 * A single illustrative example of gate usage.
 */
export interface GateExample {
  readonly label: string;
  readonly code: string;
  readonly explanation: string;
}

/**
 * Structured documentation for a single quantum gate.
 * All fields are optional except `name` and `summary` to support
 * partial documentation entries (e.g., unknown custom gates).
 */
export interface GateDoc {
  /** Canonical lowercase gate name matching GateOp.name. */
  readonly name: string;

  /** Human-readable display name. Example: "Hadamard Gate" */
  readonly displayName: string;

  /** One-sentence summary shown in hover tooltip header. */
  readonly summary: string;

  /**
   * Intuitive mathematical description. Written for developers,
   * not physicists. Supports Markdown.
   */
  readonly mathIntuition?: string;

  /**
   * LaTeX matrix representation. Rendered by webview MathJax.
   * Example: "\\frac{1}{\\sqrt{2}}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}"
   */
  readonly matrixLatex?: string;

  /** Common use-cases and why this gate matters. */
  readonly useCases?: readonly string[];

  /** Practical code examples. */
  readonly examples?: readonly GateExample[];

  /**
   * Related gate names. Enables "see also" links in the documentation UI.
   */
  readonly seeAlso?: readonly string[];

  /**
   * True if this gate is parameterized (Rx, Ry, Rz, U, P, etc.).
   * Used to decide whether to show parameter input UI.
   */
  readonly isParameterized: boolean;

  /**
   * Number of qubits this gate acts on.
   * Used for rendering validation.
   */
  readonly qubitCount: number;
}
