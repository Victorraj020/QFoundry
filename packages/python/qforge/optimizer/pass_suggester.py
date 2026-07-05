"""
pass_suggester.py — Phase 4 Quantum Circuit Optimizer.

Performs topological gate cancellation (self-inverse, mutual inverse)
and rotation merging (e.g. Rx(pi/2) + Rx(pi/4) -> Rx(3pi/4)),
generating in-place code rewrites and metrics.
"""

from __future__ import annotations
import math
from typing import Any
from qforge.parser.ast_extractor import extract_circuits

def format_param(val: float) -> str:
    """Format float parameters as nice fractions of pi if applicable."""
    for num, den in [(1, 4), (1, 2), (3, 4), (1, 1), (5, 4), (3, 2), (7, 4), (2, 1)]:
        pi_val = (num / den) * math.pi
        if abs(val - pi_val) < 1e-5:
            if num == 1 and den == 1:
                return "math.pi"
            elif num == 1:
                return f"math.pi / {den}"
            elif den == 1:
                return f"{num} * math.pi"
            else:
                return f"{num} * math.pi / {den}"
        # Negative fractions
        if abs(val + pi_val) < 1e-5:
            if num == 1 and den == 1:
                return "-math.pi"
            elif num == 1:
                return f"-math.pi / {den}"
            elif den == 1:
                return f"-{num} * math.pi"
            else:
                return f"-{num} * math.pi / {den}"
    return f"{val:.4f}"

def calculate_depth(gates_list: list[dict[str, Any]]) -> int:
    """Tracks the current layer depth for each qubit."""
    qubit_depths: dict[int, int] = {}
    for g in gates_list:
        qubits = g.get("qubits", [])
        if not qubits:
            continue
        max_prev_depth = max(qubit_depths.get(q, 0) for q in qubits)
        new_depth = max_prev_depth + 1
        for q in qubits:
            qubit_depths[q] = new_depth
    return max(qubit_depths.values()) if qubit_depths else 0

def handle_suggest_optimizations(params: dict[str, Any]) -> dict[str, Any]:
    """Phase 4: Suggest circuit optimisations via transpiler passes."""
    source = params.get("source", "")
    file_path = params.get("filePath", "")
    
    circuits = extract_circuits(source, file_path)
    if not circuits:
        return {
            "originalDepth": 0,
            "optimizedDepth": 0,
            "originalGateCount": 0,
            "optimizedGateCount": 0,
            "suggestions": [],
            "optimizedSource": source
        }
    
    circuit = circuits[0]
    gates = circuit.get("gates", [])
    
    # Store gate metadata
    gate_records = []
    for idx, g in enumerate(gates):
        gate_records.append({
            "idx": idx,
            "name": g["name"],
            "qubits": g["qubits"],
            "params": list(g["params"]),
            "line": g["sourceLine"],
            "status": "active",
            "cancel_reason": None,
            "merged_into": None,
            "new_params": list(g["params"])
        })
        
    SELF_INVERSES = {"h", "x", "y", "z", "cx", "cy", "cz", "ch", "swap"}
    MUTUAL_INVERSE_PAIRS = {
        ("t", "tdg"),
        ("tdg", "t"),
        ("s", "sdg"),
        ("sdg", "s"),
        ("sx", "sxdg"),
        ("sxdg", "sx")
    }
    ROTATION_GATES = {"rx", "ry", "rz", "p"}
    
    suggestions = []
    
    for i in range(len(gate_records)):
        g = gate_records[i]
        if g["status"] != "active":
            continue
            
        q_set = set(g["qubits"])
        
        # Trace backwards to find any blocking or meeting gate
        blocking_gate = None
        for j in range(i - 1, -1, -1):
            other = gate_records[j]
            if other["status"] != "active":
                continue
            
            other_q_set = set(other["qubits"])
            if q_set & other_q_set:
                blocking_gate = other
                break
                
        if blocking_gate:
            is_cancel = False
            # Check for cancellation
            if g["name"] in SELF_INVERSES and blocking_gate["name"] == g["name"] and blocking_gate["qubits"] == g["qubits"]:
                is_cancel = True
                reason = f"Cancelled self-inverse pair of {g['name'].upper()} gates on qubit(s) {', '.join(map(str, g['qubits']))}."
            elif (blocking_gate["name"], g["name"]) in MUTUAL_INVERSE_PAIRS and blocking_gate["qubits"] == g["qubits"]:
                is_cancel = True
                reason = f"Cancelled mutual inverse pair {blocking_gate['name'].upper()} and {g['name'].upper()} on qubit(s) {', '.join(map(str, g['qubits']))}."
                
            if is_cancel:
                g["status"] = "cancelled"
                g["cancel_reason"] = reason
                blocking_gate["status"] = "cancelled"
                blocking_gate["cancel_reason"] = reason
                
                suggestions.append({
                    "type": "GATE_CANCELLATION",
                    "description": reason,
                    "qubits": g["qubits"],
                    "lines": [blocking_gate["line"], g["line"]]
                })
                continue
                
            # Rotation Merging
            if g["name"] in ROTATION_GATES and blocking_gate["name"] == g["name"] and blocking_gate["qubits"] == g["qubits"]:
                p1 = blocking_gate["new_params"][0] if blocking_gate["new_params"] else 0.0
                p2 = g["new_params"][0] if g["new_params"] else 0.0
                merged_p = p1 + p2
                
                normalized_p = merged_p % (2 * math.pi)
                if abs(normalized_p) < 1e-5 or abs(normalized_p - 2 * math.pi) < 1e-5:
                    g["status"] = "cancelled"
                    g["cancel_reason"] = f"Merged rotations {g['name'].upper()} on qubit {g['qubits'][0]} canceled out completely."
                    blocking_gate["status"] = "cancelled"
                    blocking_gate["cancel_reason"] = f"Merged rotations {g['name'].upper()} on qubit {g['qubits'][0]} canceled out completely."
                    
                    suggestions.append({
                        "type": "GATE_CANCELLATION",
                        "description": f"Merged rotations {g['name'].upper()} with angles {format_param(p1)} and {format_param(p2)} canceled out completely.",
                        "qubits": g["qubits"],
                        "lines": [blocking_gate["line"], g["line"]]
                    })
                else:
                    blocking_gate["status"] = "merged"
                    blocking_gate["merged_into"] = g["idx"]
                    g["new_params"][0] = merged_p
                    
                    suggestions.append({
                        "type": "ROTATION_MERGING",
                        "description": f"Merged consecutive {g['name'].upper()} rotations on qubit {g['qubits'][0]} (angles: {format_param(p1)} + {format_param(p2)} -> {format_param(merged_p)}).",
                        "qubits": g["qubits"],
                        "lines": [blocking_gate["line"], g["line"]]
                    })
                continue

    source_lines = source.splitlines()
    
    for g in gate_records:
        line_idx = g["line"] - 1
        orig_line = source_lines[line_idx]
        
        if g["status"] == "cancelled":
            source_lines[line_idx] = f"# {orig_line}  # Canceled by QFoundry"
        elif g["status"] == "merged":
            source_lines[line_idx] = f"# {orig_line}  # Canceled by QFoundry (Merged)"
        elif g["status"] == "active" and g["name"] in ROTATION_GATES and g["new_params"] != g["params"]:
            gate_name = g["name"]
            new_val = g["new_params"][0]
            
            idx = orig_line.find(f".{gate_name}(")
            if idx != -1:
                start = idx + len(gate_name) + 2
                nesting = 0
                comma_idx = -1
                for k in range(start, len(orig_line)):
                    char = orig_line[k]
                    if char == '(':
                        nesting += 1
                    elif char == ')':
                        nesting -= 1
                    elif char == ',' and nesting == 0:
                        comma_idx = k
                        break
                if comma_idx != -1:
                    new_param_str = format_param(new_val)
                    source_lines[line_idx] = orig_line[:start] + new_param_str + orig_line[comma_idx:]

    optimized_source = "\n".join(source_lines)
    if source.endswith("\n") and not optimized_source.endswith("\n"):
        optimized_source += "\n"
        
    original_gate_count = len(gates)
    optimized_gate_count = sum(1 for g in gate_records if g["status"] == "active")
    
    original_depth = calculate_depth(gates)
    active_gates = [g for g in gate_records if g["status"] == "active"]
    optimized_depth = calculate_depth(active_gates)
    
    return {
        "originalDepth": original_depth,
        "optimizedDepth": optimized_depth,
        "originalGateCount": original_gate_count,
        "optimizedGateCount": optimized_gate_count,
        "suggestions": suggestions,
        "optimizedSource": optimized_source
    }
