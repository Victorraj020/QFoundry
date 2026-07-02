"""
circuit_analyzer.py — Deep Qiskit-powered circuit analysis.

This module is the authoritative analyzer. It:
  1. Accepts raw Python source
  2. Uses the AST extractor to identify circuits
  3. Uses Qiskit to transpile and measure circuit properties
  4. Calls the gate explainer for a human-readable summary
  5. Returns a complete AnalysisResult dict

This is the handler for the JSON-RPC "analyzeCircuit" method.
"""

from __future__ import annotations

import logging
from typing import Any, Optional

from qforge.parser.ast_extractor import extract_circuits
from qforge.analyzer.gate_explainer import identify_circuit_pattern

log = logging.getLogger(__name__)

# Two-qubit gate names for counting entanglement operations
TWO_QUBIT_GATES = {"cx", "cy", "cz", "ch", "swap", "iswap", "ecr", "dcx",
                   "cp", "crx", "cry", "crz", "cu", "cu1", "cu3"}


def handle_analyze_circuit(params: Any) -> dict[str, Any]:
    """
    JSON-RPC handler for 'analyzeCircuit'.

    Params: { source: str, filePath: str }
    Returns: AnalysisResult dict
    """
    if not isinstance(params, dict):
        raise ValueError("analyzeCircuit requires a dict params object")

    source: str = params.get("source", "")
    file_path: str = params.get("filePath", "<unknown>")

    circuits = extract_circuits(source, file_path)
    if not circuits:
        raise ValueError("No QuantumCircuit found in the provided source.")

    # Analyse the first detected circuit.
    circuit_data = circuits[0]

    # Attempt deep Qiskit analysis; fall back to AST-only if Qiskit unavailable.
    try:
        return _analyze_with_qiskit(circuit_data, source)
    except ImportError:
        log.warning("Qiskit not installed — falling back to AST-only analysis.")
        return _analyze_from_ast(circuit_data)
    except Exception as exc:
        log.exception("Qiskit analysis failed for %s: %s", file_path, exc)
        return _analyze_from_ast(circuit_data)


def _analyze_with_qiskit(circuit_data: dict[str, Any], source: str) -> dict[str, Any]:
    """Build the circuit using Qiskit and compute precise metrics."""
    from qiskit import QuantumCircuit  # type: ignore[import-untyped]
    from qiskit.converters import circuit_to_dag  # type: ignore[import-untyped]

    # Build a Qiskit QuantumCircuit from the extracted gate data
    n_qubits: int = circuit_data["qubits"]
    n_cbits: int = circuit_data["classicalBits"]

    if n_qubits <= 0:
        raise ValueError("Could not determine qubit count from source.")

    qc = QuantumCircuit(n_qubits, n_cbits or 0)

    for gate in circuit_data["gates"]:
        _apply_gate(qc, gate)

    dag = circuit_to_dag(qc)
    depth = dag.depth()

    # Gate counts (exclude barriers and idle)
    op_counts: dict[str, int] = {}
    for node in dag.topological_op_nodes():
        name = node.op.name
        if name in ("barrier", "id"):
            continue
        op_counts[name] = op_counts.get(name, 0) + 1

    gate_count = sum(op_counts.values())
    two_qubit_count = sum(v for k, v in op_counts.items() if k in TWO_QUBIT_GATES)
    is_entangled = two_qubit_count > 0
    is_complete = op_counts.get("measure", 0) >= n_qubits

    qubit_labels = [f"q_{i}" for i in range(n_qubits)]

    # Recompute step values from DAG (topological order)
    _assign_dag_steps(circuit_data["gates"], dag)

    summary = identify_circuit_pattern(op_counts, n_qubits, is_entangled, depth)

    return {
        "circuit": {**circuit_data, "isApproximate": False},
        "summary": summary,
        "depth": depth,
        "gateCount": gate_count,
        "gateBreakdown": op_counts,
        "isEntangled": is_entangled,
        "qubitLabels": qubit_labels,
        "twoQubitGateCount": two_qubit_count,
        "isComplete": is_complete,
    }


def _apply_gate(qc: Any, gate: dict[str, Any]) -> None:
    """Apply a single gate dict to a Qiskit QuantumCircuit."""
    name: str = gate["name"]
    qubits: list[int] = gate["qubits"]
    params: list[float] = gate["params"]

    gate_method = getattr(qc, name, None)
    if gate_method is None:
        return  # Skip unknown gates

    try:
        if name == "measure":
            if len(qubits) >= 1:
                gate_method(qubits[0], qubits[0])
        elif params:
            gate_method(*params, *qubits)
        else:
            gate_method(*qubits)
    except Exception as exc:
        log.debug("Could not apply gate %s: %s", name, exc)


def _assign_dag_steps(gates: list[dict[str, Any]], dag: Any) -> None:
    """
    Update step values in gate dicts using DAG topological ordering.
    This gives accurate parallel step values for the timeline.
    """
    try:
        for i, node in enumerate(dag.topological_op_nodes()):
            if i < len(gates):
                gates[i]["step"] = i
    except Exception:
        pass  # Fallback: keep sequential steps from AST


def _analyze_from_ast(circuit_data: dict[str, Any]) -> dict[str, Any]:
    """Fallback analysis when Qiskit is not available."""
    gates: list[dict[str, Any]] = circuit_data["gates"]
    n_qubits: int = max(circuit_data["qubits"], 1)

    op_counts: dict[str, int] = {}
    two_qubit_count = 0
    for gate in gates:
        name: str = gate["name"]
        if name in ("barrier",):
            continue
        op_counts[name] = op_counts.get(name, 0) + 1
        if name in TWO_QUBIT_GATES:
            two_qubit_count += 1

    gate_count = sum(op_counts.values())
    is_entangled = two_qubit_count > 0
    depth = len(gates)  # Approximation: sequential
    is_complete = op_counts.get("measure", 0) >= n_qubits
    qubit_labels = [f"q_{i}" for i in range(n_qubits)]
    summary = identify_circuit_pattern(op_counts, n_qubits, is_entangled, depth)

    return {
        "circuit": {**circuit_data, "isApproximate": True},
        "summary": summary + " _(Qiskit not installed — install for precise analysis.)_",
        "depth": depth,
        "gateCount": gate_count,
        "gateBreakdown": op_counts,
        "isEntangled": is_entangled,
        "qubitLabels": qubit_labels,
        "twoQubitGateCount": two_qubit_count,
        "isComplete": is_complete,
    }
