"""
protocol.py — JSON-RPC 2.0 message schemas for the QForge IPC server.

All dataclasses here must mirror the TypeScript types in shared/messages.ts
and shared/CircuitIR.ts. When adding a field to the TypeScript side,
add the corresponding field here.
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Any, Optional
import json


# ---------------------------------------------------------------------------
# JSON-RPC 2.0 envelope types
# ---------------------------------------------------------------------------

@dataclass
class JsonRpcRequest:
    jsonrpc: str
    id: str
    method: str
    params: Optional[Any] = None

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "JsonRpcRequest":
        return cls(
            jsonrpc=d["jsonrpc"],
            id=d["id"],
            method=d["method"],
            params=d.get("params"),
        )


@dataclass
class JsonRpcSuccess:
    id: str
    result: Any
    jsonrpc: str = "2.0"

    def to_json(self) -> str:
        return json.dumps({"jsonrpc": self.jsonrpc, "id": self.id, "result": self.result})


@dataclass
class JsonRpcError:
    id: str
    code: int
    message: str
    data: Optional[Any] = None
    jsonrpc: str = "2.0"

    def to_json(self) -> str:
        error: dict[str, Any] = {"code": self.code, "message": self.message}
        if self.data is not None:
            error["data"] = self.data
        return json.dumps({"jsonrpc": self.jsonrpc, "id": self.id, "error": error})


# ---------------------------------------------------------------------------
# Standard JSON-RPC error codes
# ---------------------------------------------------------------------------

PARSE_ERROR = -32700
INVALID_REQUEST = -32600
METHOD_NOT_FOUND = -32601
INVALID_PARAMS = -32602
INTERNAL_ERROR = -32603


# ---------------------------------------------------------------------------
# Domain types — mirror TypeScript shared/CircuitIR.ts
# ---------------------------------------------------------------------------

@dataclass
class GateOp:
    id: str
    name: str
    qubits: list[int]
    params: list[float]
    step: int
    source_line: int
    conditional_on: Optional[int] = None

    def to_dict(self) -> dict[str, Any]:
        d: dict[str, Any] = {
            "id": self.id,
            "name": self.name,
            "qubits": self.qubits,
            "params": self.params,
            "step": self.step,
            "sourceLine": self.source_line,
        }
        if self.conditional_on is not None:
            d["conditionalOn"] = self.conditional_on
        return d


@dataclass
class SourceRange:
    start_line: int
    end_line: int

    def to_dict(self) -> dict[str, Any]:
        return {"startLine": self.start_line, "endLine": self.end_line}


@dataclass
class CircuitIR:
    id: str
    file_path: str
    variable_name: str
    qubits: int
    classical_bits: int
    gates: list[GateOp]
    source_range: SourceRange
    is_approximate: bool = False

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "filePath": self.file_path,
            "variableName": self.variable_name,
            "qubits": self.qubits,
            "classicalBits": self.classical_bits,
            "gates": [g.to_dict() for g in self.gates],
            "sourceRange": self.source_range.to_dict(),
            "isApproximate": self.is_approximate,
        }


@dataclass
class GateBreakdown:
    counts: dict[str, int] = field(default_factory=dict)

    def to_dict(self) -> dict[str, int]:
        return dict(self.counts)


@dataclass
class AnalysisResult:
    circuit: CircuitIR
    summary: str
    depth: int
    gate_count: int
    gate_breakdown: GateBreakdown
    is_entangled: bool
    qubit_labels: list[str]
    two_qubit_gate_count: int
    is_complete: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "circuit": self.circuit.to_dict(),
            "summary": self.summary,
            "depth": self.depth,
            "gateCount": self.gate_count,
            "gateBreakdown": self.gate_breakdown.to_dict(),
            "isEntangled": self.is_entangled,
            "qubitLabels": self.qubit_labels,
            "twoQubitGateCount": self.two_qubit_gate_count,
            "isComplete": self.is_complete,
        }
