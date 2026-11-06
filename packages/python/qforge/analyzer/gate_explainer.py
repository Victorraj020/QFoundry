"""
gate_explainer.py — Rule-based circuit pattern recognition and explanation.

Identifies well-known quantum circuit patterns and generates human-readable summaries.
No LLM required — deterministic, offline, instant.

Phase 3+: This module can be augmented with an LLM API call as a "deep explanation"
fallback while rule-based matching remains the fast path.
"""

from __future__ import annotations

from typing import Any


# ---------------------------------------------------------------------------
# Pattern matching rules
# ---------------------------------------------------------------------------

def identify_circuit_pattern(
    gate_breakdown: dict[str, int],
    n_qubits: int,
    is_entangled: bool,
    depth: int,
) -> str:
    """
    Returns a human-readable summary of what the circuit does.
    Matches against known patterns in order of specificity.
    """
    gates = gate_breakdown

    # Bell State: 1 H + 1 CX on 2 qubits, depth ~2
    if (n_qubits == 2 and gates.get("h", 0) == 1 and
            gates.get("cx", 0) == 1 and depth <= 3):
        return (
            "This circuit prepares a **Bell State** (|Φ+⟩ = (|00⟩ + |11⟩)/√2) — "
            "a maximally entangled 2-qubit state. "
            "It is the simplest quantum circuit that demonstrates entanglement."
        )

    # GHZ State: H on qubit 0, then (n-1) CX gates
    if (n_qubits >= 3 and gates.get("h", 0) == 1 and
            gates.get("cx", 0) == n_qubits - 1 and depth <= n_qubits):
        return (
            f"This circuit prepares a **GHZ State** across {n_qubits} qubits — "
            f"a maximally entangled state of the form (|0...0⟩ + |1...1⟩)/√2. "
            "GHZ states are used in quantum error correction and multi-party protocols."
        )

    # Uniform superposition: all H gates, no entanglement
    if (gates.get("h", 0) == n_qubits and
            sum(v for k, v in gates.items() if k not in ("h", "measure", "barrier")) == 0):
        return (
            f"This circuit creates a **uniform superposition** across all {n_qubits} qubits "
            f"using Hadamard gates — the starting state for many quantum search algorithms."
        )

    # Quantum teleportation: 3 qubits, Bell pair + classical correction
    if n_qubits == 3 and gates.get("cx", 0) >= 2 and gates.get("h", 0) >= 1 and is_entangled:
        return (
            "This circuit appears to implement **quantum teleportation** — "
            "transferring an unknown qubit state using a Bell pair and classical communication."
        )

    # Parameterized/variational: rotation gates present
    rotation_gates = sum(gates.get(g, 0) for g in ("rx", "ry", "rz", "u", "p"))
    if rotation_gates > 0 and is_entangled:
        return (
            f"This is a **variational quantum circuit** with {rotation_gates} parameterized "
            f"rotation gate(s) and entanglement across {n_qubits} qubit(s). "
            "Circuits like this are used in VQE, QAOA, and quantum machine learning."
        )

    # Single-qubit circuit
    if n_qubits == 1:
        gates_str = ", ".join(f"{k.upper()} × {v}" for k, v in gates.items()
                              if k not in ("measure", "barrier"))
        return (
            f"This is a **single-qubit circuit** applying: {gates_str}. "
            f"Circuit depth: {depth}."
        )

    # Generic entangled
    if is_entangled:
        return (
            f"This is a {n_qubits}-qubit **entangled circuit** with depth {depth}. "
            f"Gate composition: {_format_gate_summary(gates)}."
        )

    # Generic non-entangled
    return (
        f"This is a {n_qubits}-qubit circuit with depth {depth}. "
        f"Gate composition: {_format_gate_summary(gates)}."
    )


def _format_gate_summary(gates: dict[str, int]) -> str:
    parts = [f"{k.upper()} × {v}" for k, v in sorted(gates.items()) if k != "barrier"]
    return ", ".join(parts) if parts else "no gates"
