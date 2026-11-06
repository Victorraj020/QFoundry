"""
algorithm_registry.py — Educational metadata, circuit synthesis, and step derivation
for all 9 supported quantum algorithms in the Quantum Algorithm Explorer.
"""

from __future__ import annotations

import math
import uuid
from typing import Any

from qforge.debugger.step_engine import step_circuit_gates
from qforge.simulator.local_runner import simulate_circuit_data

# ---------------------------------------------------------------------------
# Metadata Catalog
# ---------------------------------------------------------------------------

ALGORITHM_CATALOG: list[dict[str, Any]] = [
    {
        "id": "deutsch",
        "name": "Deutsch Algorithm",
        "category": "Foundational algorithms",
        "difficulty": "Beginner",
        "qubits": 2,
        "shortDescription": "Determines whether a 1-bit boolean function f(x) is constant or balanced in a single quantum query.",
        "problemStatement": (
            "Given a black-box function f: {0, 1} -> {0, 1}, determine whether f is 'constant' "
            "(f(0) = f(1)) or 'balanced' (f(0) != f(1))."
        ),
        "importance": (
            "Deutsch's algorithm (1985) is historically the first quantum algorithm to demonstrate "
            "a deterministic separation in query complexity between quantum and classical computing."
        ),
        "coreConcept": "Phase Kickback and Quantum Interference",
        "classicalVsQuantum": {
            "classicalQueries": 2,
            "quantumQueries": 1,
            "classicalComplexity": "O(1) (2 queries)",
            "quantumComplexity": "O(1) (1 query, 50% query reduction)",
            "explanation": (
                "A classical computer must evaluate both f(0) and f(1) to check if f(0) == f(1). "
                "The quantum algorithm queries the oracle in superposition, kicking back the phase (-1)^f(x), "
                "and measures global property f(0) ⊕ f(1) in a single shot without learning f(0) or f(1) individually."
            ),
        },
        "mathFoundations": (
            "Input state: |ψ₀⟩ = |01⟩\n"
            "Superposition: |ψ₁⟩ = H|0⟩ ⊗ H|1⟩ = |+⟩ ⊗ |–⟩ = (1/2)(|0⟩+|1⟩)(|0⟩–|1⟩)\n"
            "Oracle U_f: U_f|x⟩|–⟩ = (-1)^f(x)|x⟩|–⟩\n"
            "State after oracle: |ψ₂⟩ = ((-1)^f(0)|0⟩ + (-1)^f(1)|1⟩)/√2 ⊗ |–⟩\n"
            "Interference H on qubit 0: |ψ₃⟩ = ±|f(0) ⊕ f(1)⟩ ⊗ |–⟩\n"
            "Measurement of q0: 0 indicates Constant; 1 indicates Balanced."
        ),
        "prerequisites": ["Single-qubit superposition (Hadamard)", "Phase kickback", "CNOT operation"],
        "expectedOutput": "Measurement of qubit 0 yields '0' if f is constant, and '1' if f is balanced.",
        "simulationComplexity": "O(1) gates, 2 qubits",
        "parameters": [
            {
                "id": "oracleType",
                "label": "Oracle Function f(x)",
                "type": "select",
                "options": [
                    {"label": "Constant 0 (f(0)=0, f(1)=0)", "value": "constant_0"},
                    {"label": "Constant 1 (f(0)=1, f(1)=1)", "value": "constant_1"},
                    {"label": "Balanced Identity (f(x)=x)", "value": "balanced_id"},
                    {"label": "Balanced NOT (f(x)=1-x)", "value": "balanced_not"},
                ],
                "default": "balanced_id",
            }
        ],
    },
    {
        "id": "deutsch_jozsa",
        "name": "Deutsch–Jozsa Algorithm",
        "category": "Foundational algorithms",
        "difficulty": "Intermediate",
        "qubits": 4,
        "shortDescription": "Generalizes Deutsch's algorithm to n-bit inputs, determining if f:{0,1}^n -> {0,1} is constant or balanced in 1 query.",
        "problemStatement": (
            "Given an oracle f: {0,1}^n -> {0,1} promised to be either constant (returns same value for all inputs) "
            "or balanced (returns 0 for exactly half of inputs and 1 for the other half), determine which it is."
        ),
        "importance": (
            "Demonstrates an exponential quantum query advantage over deterministic classical algorithms: "
            "quantum requires 1 query, whereas a deterministic classical algorithm requires 2^(n-1) + 1 queries in the worst case."
        ),
        "coreConcept": "Constructive vs Destructive Interference across 2^n Basis States",
        "classicalVsQuantum": {
            "classicalQueries": "2^(n-1) + 1 (worst-case deterministic)",
            "quantumQueries": 1,
            "classicalComplexity": "O(2^n)",
            "quantumComplexity": "O(1) query, O(n) gate depth",
            "explanation": (
                "To be 100% certain classically, you must check over half the inputs (2^(n-1)+1). "
                "Quantumly, if f is constant, all 2^n terms interfere constructively at |0...0⟩. "
                "If f is balanced, the terms interfere destructively at |0...0⟩ (zero amplitude), guaranteeing a non-zero state."
            ),
        },
        "mathFoundations": (
            "Initial state: |0⟩^⊗n |1⟩\n"
            "Superposition: H^⊗(n+1) -> (1/2^(n/2)) ∑_{x} |x⟩ |–⟩\n"
            "Oracle U_f: (1/2^(n/2)) ∑_{x} (-1)^f(x) |x⟩ |–⟩\n"
            "Hadamard on data: (1/2^n) ∑_{y} [∑_{x} (-1)^(x·y ⊕ f(x))] |y⟩ |–⟩\n"
            "Amplitude of |0^n⟩: (1/2^n) ∑_{x} (-1)^f(x)\n"
            "If f is constant: amplitude is ±1 (prob = 1 to measure |0...0⟩).\n"
            "If f is balanced: amplitude is 0 (prob = 0 to measure |0...0⟩)."
        ),
        "prerequisites": ["Deutsch algorithm", "Multi-qubit Hadamard transform", "Inner product mod 2"],
        "expectedOutput": "All data qubits measured as 0 (|0...0⟩) -> Constant. Any bit measured as 1 -> Balanced.",
        "simulationComplexity": "O(n) gates, n+1 qubits (default n=3, total 4 qubits)",
        "parameters": [
            {
                "id": "oracleType",
                "label": "Oracle Function",
                "type": "select",
                "options": [
                    {"label": "Constant 0 (all outputs 0)", "value": "constant_0"},
                    {"label": "Constant 1 (all outputs 1)", "value": "constant_1"},
                    {"label": "Balanced (parity / alternating)", "value": "balanced_parity"},
                    {"label": "Balanced (first bit)", "value": "balanced_first_bit"},
                ],
                "default": "balanced_parity",
            },
            {
                "id": "numDataQubits",
                "label": "Number of Data Qubits (n)",
                "type": "number",
                "min": 2,
                "max": 4,
                "default": 3,
            },
        ],
    },
    {
        "id": "bernstein_vazirani",
        "name": "Bernstein–Vazirani Algorithm",
        "category": "Foundational algorithms",
        "difficulty": "Intermediate",
        "qubits": 4,
        "shortDescription": "Finds a hidden n-bit secret string s in a linear boolean function f(x) = s · x (mod 2) in exactly 1 query.",
        "problemStatement": (
            "Given an oracle f(x) = s · x = s₀x₀ ⊕ s₁x₁ ⊕ ... ⊕ s_{n-1}x_{n-1} for an unknown secret string s in {0,1}^n, "
            "determine the entire string s."
        ),
        "importance": (
            "Demonstrates a polynomial query speedup: classical algorithms require n queries (querying 100..., 010..., etc.), "
            "while Bernstein-Vazirani learns all n bits of s in a single quantum query."
        ),
        "coreConcept": "Phase Encoding of Linear Functions via Phase Kickback",
        "classicalVsQuantum": {
            "classicalQueries": "n queries",
            "quantumQueries": 1,
            "classicalComplexity": "O(n)",
            "quantumComplexity": "O(1) query",
            "explanation": (
                "Classically, each query reveals at most 1 bit of information about s (e.g. f(100...) = s₀). "
                "The quantum algorithm maps the secret s directly into the relative phases of the superposition, "
                "and the final Hadamard transform decodes s directly into the measurement basis."
            ),
        },
        "mathFoundations": (
            "Initial state: |0⟩^⊗n |1⟩\n"
            "Superposition: H^⊗(n+1) -> (1/2^(n/2)) ∑_{x} |x⟩ |–⟩\n"
            "Oracle U_f: (1/2^(n/2)) ∑_{x} (-1)^(s·x) |x⟩ |–⟩\n"
            "Second Hadamard H^⊗n: H^⊗n [(1/2^(n/2)) ∑_{x} (-1)^(s·x) |x⟩] = |s⟩\n"
            "Measurement of data register: Deterministically yields |s⟩ with probability 1."
        ),
        "prerequisites": ["Deutsch-Jozsa algorithm", "Phase kickback", "Bitwise dot product mod 2"],
        "expectedOutput": "The measured bitstring of the data qubits matches the secret string s with 100% probability.",
        "simulationComplexity": "O(n) gates, n+1 qubits",
        "parameters": [
            {
                "id": "secretString",
                "label": "Hidden Secret String (s)",
                "type": "text",
                "default": "101",
                "description": "Binary string of length 2 to 4 (e.g. 101, 110, 1011)",
            }
        ],
    },
    {
        "id": "grover",
        "name": "Grover's Search Algorithm",
        "category": "Quantum search",
        "difficulty": "Intermediate",
        "qubits": 3,
        "shortDescription": "Searches an unsorted database of N items in O(√N) queries, achieving quadratic quantum speedup.",
        "problemStatement": (
            "Given an unsorted database of N = 2^n elements and an oracle that identifies a marked target item w "
            "(f(w) = 1, and f(x) = 0 for x != w), find the marked item w."
        ),
        "importance": (
            "Grover's algorithm (1996) provides a proven quadratic speedup for unstructured search and NP-complete problems. "
            "It is optimal: no quantum algorithm can search an unstructured space in fewer than Ω(√N) queries."
        ),
        "coreConcept": "Amplitude Amplification: Geometric rotation in 2D subspace spanned by |w⟩ and |s'⟩",
        "classicalVsQuantum": {
            "classicalQueries": "N / 2 on average, N worst-case",
            "quantumQueries": "≈ (π/4) √N",
            "classicalComplexity": "O(N)",
            "quantumComplexity": "O(√N)",
            "explanation": (
                "Classical search must test items one by one. Grover's algorithm starts with a uniform superposition "
                "and repeatedly applies two reflections: the Oracle reflection (flips target phase) followed by the "
                "Diffusion operator (inverts amplitudes about the mean), rotating the state vector towards |w⟩ by ≈ 2/√N radians per step."
            ),
        },
        "mathFoundations": (
            "Equal superposition: |s⟩ = (1/√N) ∑ |x⟩\n"
            "Angle with orthogonal subspace: sin(θ/2) = 1/√N\n"
            "Oracle O: I - 2|w⟩⟨w| (flips phase of |w⟩)\n"
            "Diffusion operator D: 2|s⟩⟨s| - I = H^⊗n (2|0⟩⟨0| - I) H^⊗n\n"
            "Combined Grover step G = D · O: rotates state towards |w⟩ by angle θ\n"
            "Optimal iterations: R ≈ round((π/4) √N)"
        ),
        "prerequisites": ["Hadamard transform", "Phase oracle", "Multi-controlled phase gates", "Reflection about mean"],
        "expectedOutput": "Measuring the qubits outputs the target state with high probability (approaching 100% for optimal R).",
        "simulationComplexity": "O(R · n) gates, 2 to 3 qubits",
        "parameters": [
            {
                "id": "numQubits",
                "label": "Number of Qubits (n)",
                "type": "number",
                "min": 2,
                "max": 3,
                "default": 3,
            },
            {
                "id": "targetState",
                "label": "Target State (w)",
                "type": "text",
                "default": "101",
                "description": "Binary string representing target basis state (e.g. '11' for 2 qubits, '101' for 3 qubits)",
            },
            {
                "id": "iterations",
                "label": "Grover Iterations (R)",
                "type": "number",
                "min": 1,
                "max": 4,
                "default": 2,
                "description": "For 3 qubits (N=8), optimal R is 2. Setting R=1 under-rotates; R=3 over-rotates.",
            },
        ],
    },
    {
        "id": "teleportation",
        "name": "Quantum Teleportation",
        "category": "Quantum information",
        "difficulty": "Intermediate",
        "qubits": 3,
        "shortDescription": "Transfers an unknown quantum state |ψ⟩ from sender to receiver using an entangled Bell pair and 2 classical bits.",
        "problemStatement": (
            "Alice possesses an unknown quantum state |ψ⟩ = α|0⟩ + β|1⟩. She wishes to transmit this state to Bob "
            "without physically sending the qubit itself, using only a shared entangled pair and classical communication."
        ),
        "importance": (
            "Teleportation is a foundational protocol for quantum networks, quantum repeaters, and measurement-based quantum computing. "
            "It illustrates the principle that quantum information cannot be cloned, but can be disembodied and reconstructed."
        ),
        "coreConcept": "Entanglement monogamy, Bell-state measurement, and unitary correction",
        "classicalVsQuantum": {
            "classicalQueries": "Impossible to transmit unknown quantum state with finite classical bits",
            "quantumQueries": "1 entangled pair + 2 classical bits",
            "classicalComplexity": "Infinite classical bits needed to describe continuous amplitudes α, β",
            "quantumComplexity": "Exact reconstruction with 2 classical bits",
            "explanation": (
                "Due to the No-Cloning Theorem, Alice cannot measure |ψ⟩ without destroying it. "
                "By performing a joint Bell measurement on |ψ⟩ and her half of the Bell pair, "
                "she collapses Bob's distant qubit into one of 4 Pauli variants of |ψ⟩. "
                "Sending 2 classical bits allows Bob to apply the matching Pauli correction (I, X, Z, or ZX)."
            ),
        },
        "mathFoundations": (
            "Initial total state: |ψ⟩_A ⊗ |Φ⁺⟩_AB = (α|0⟩ + β|1⟩) ⊗ (|00⟩ + |11⟩)/√2\n"
            "Expanded into Bell basis on Alice's two qubits:\n"
            "  = (1/2) [ |Φ⁺⟩(α|0⟩ + β|1⟩) + |Φ⁻⟩(α|0⟩ - β|1⟩) + |Ψ⁺⟩(α|1⟩ + β|0⟩) + |Ψ⁻⟩(α|1⟩ - β|0⟩) ]\n"
            "Alice applies CNOT(0->1) and H(0), then measures (m₀, m₁):\n"
            "  - 00: Bob has |ψ⟩ -> Apply I\n"
            "  - 01: Bob has X|ψ⟩ -> Apply X\n"
            "  - 10: Bob has Z|ψ⟩ -> Apply Z\n"
            "  - 11: Bob has XZ|ψ⟩ -> Apply X then Z\n"
            "Result: Bob's qubit is guaranteed to be in state |ψ⟩."
        ),
        "prerequisites": ["Bell states", "CNOT gate", "Measurement & state collapse", "Pauli corrections"],
        "expectedOutput": "Bob's qubit (q2) state matches Alice's original prepared state |ψ⟩ with unit fidelity.",
        "simulationComplexity": "O(1) gates (7 gates total), 3 qubits",
        "parameters": [
            {
                "id": "theta",
                "label": "State Prep Angle θ (radians)",
                "type": "number",
                "min": 0,
                "max": 3.14159,
                "step": 0.1,
                "default": 1.047,
                "description": "Angle for RY gate preparing |ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩ (1.047 rad ≈ π/3)",
            }
        ],
    },
    {
        "id": "superdense_coding",
        "name": "Superdense Coding",
        "category": "Quantum information",
        "difficulty": "Intermediate",
        "qubits": 2,
        "shortDescription": "Transmits 2 classical bits of information by sending only 1 physical qubit, using a shared Bell pair.",
        "problemStatement": (
            "Alice wants to send a 2-bit classical message m in {'00', '01', '10', '11'} to Bob by physically transmitting "
            "only a single qubit."
        ),
        "importance": (
            "Dual of quantum teleportation. Demonstrates that prior entanglement doubles the classical information-carrying "
            "capacity of a quantum channel (from Holevo bound 1 bit to 2 bits)."
        ),
        "coreConcept": "Local Unitary Transformation of Bipartite Entangled States",
        "classicalVsQuantum": {
            "classicalQueries": "Requires sending 2 physical bits",
            "quantumQueries": "Requires sending 1 physical qubit (with 1 pre-shared ebit)",
            "classicalComplexity": "2 physical transmissions",
            "quantumComplexity": "1 physical qubit transmission",
            "explanation": (
                "Classical bits must be sent as distinct physical signals. "
                "In superdense coding, Alice performs one of 4 local unitary operations (I, X, Z, XZ) "
                "on her single qubit, transforming the shared Bell pair into one of 4 mutually orthogonal Bell states. "
                "Bob performs a Bell-basis measurement on both qubits to distinguish all 4 messages with 100% certainty."
            ),
        },
        "mathFoundations": (
            "Shared pair: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2\n"
            "Alice's local encoding on q0:\n"
            "  - '00': I|Φ⁺⟩ = (|00⟩ + |11⟩)/√2 = |Φ⁺⟩\n"
            "  - '01': X|Φ⁺⟩ = (|10⟩ + |01⟩)/√2 = |Ψ⁺⟩\n"
            "  - '10': Z|Φ⁺⟩ = (|00⟩ - |11⟩)/√2 = |Φ⁻⟩\n"
            "  - '11': ZX|Φ⁺⟩ = (|01⟩ - |10⟩)/√2 = |Ψ⁻⟩\n"
            "Bob's Bell decoding: CNOT(0->1) followed by H(0)\n"
            "Transforms the 4 Bell states back to standard basis states |00⟩, |01⟩, |10⟩, |11⟩."
        ),
        "prerequisites": ["Bell states", "Pauli matrices", "Entanglement", "Orthogonal basis decoding"],
        "expectedOutput": "Bob measures q0 and q1, perfectly recovering Alice's 2-bit classical message.",
        "simulationComplexity": "O(1) gates (5 gates total), 2 qubits",
        "parameters": [
            {
                "id": "message",
                "label": "2-bit Classical Message",
                "type": "select",
                "options": [
                    {"label": "00 (Send I)", "value": "00"},
                    {"label": "01 (Send X)", "value": "01"},
                    {"label": "10 (Send Z)", "value": "10"},
                    {"label": "11 (Send Z·X)", "value": "11"},
                ],
                "default": "11",
            }
        ],
    },
    {
        "id": "qft",
        "name": "Quantum Fourier Transform (QFT)",
        "category": "Quantum transforms",
        "difficulty": "Advanced",
        "qubits": 3,
        "shortDescription": "Computes the Discrete Fourier Transform of quantum amplitudes in O(n²) gates compared to classical O(n 2ⁿ).",
        "problemStatement": (
            "Given a quantum state |j⟩ in the computational basis, compute the Fourier-transformed state "
            "(1/√N) ∑_{k=0}^{N-1} e^(2πi j k / N) |k⟩."
        ),
        "importance": (
            "The quantum Fourier transform is the core mathematical engine driving quantum phase estimation, "
            "Shor's factoring algorithm, and quantum order-finding, converting period in amplitude to position in basis."
        ),
        "coreConcept": "Phase factorization into tensor products of single-qubit rotations",
        "classicalVsQuantum": {
            "classicalQueries": "Fast Fourier Transform (FFT) requires O(N log N) = O(n 2^n) operations",
            "quantumQueries": "O(n²) quantum gates",
            "classicalComplexity": "O(n 2^n)",
            "quantumComplexity": "O(n²)",
            "explanation": (
                "The classical FFT on N=2^n data points requires O(n 2^n) operations. "
                "The QFT operates on the 2^n amplitudes simultaneously using only n(n+1)/2 Hadamard and controlled-phase gates, "
                "representing an exponential reduction in gate count."
            ),
        },
        "mathFoundations": (
            "Definition: QFT|j⟩ = (1/√N) ∑_{k=0}^{N-1} ω^(j k) |k⟩, where ω = e^(2πi / 2^n)\n"
            "Product representation: |j₁j₂...j_n⟩ -> 1/2^(n/2) ⊗_{l=1}^n (|0⟩ + e^(2πi 0.j_l...j_n)|1⟩)\n"
            "Circuit structure for qubit l:\n"
            "  1. Hadamard on qubit l\n"
            "  2. Controlled-P(π/2^(k-l)) gates controlled by qubits k > l\n"
            "  3. Final SWAP gates to reverse qubit endianness."
        ),
        "prerequisites": ["Complex roots of unity", "Controlled phase gates", "Tensor product factorization", "Endianness/SWAP"],
        "expectedOutput": "Creates a state where all basis states have equal magnitude 1/√N with linearly progressive phases.",
        "simulationComplexity": "O(n²) gates (for n=3: 3 H, 3 CP, 1 SWAP = 7 gates), 3 qubits",
        "parameters": [
            {
                "id": "numQubits",
                "label": "Number of Qubits (n)",
                "type": "number",
                "min": 2,
                "max": 3,
                "default": 3,
            },
            {
                "id": "inputState",
                "label": "Input Computational State |j⟩",
                "type": "number",
                "min": 0,
                "max": 7,
                "default": 4,
                "description": "Basis state index (e.g. 4 prepares |100⟩)",
            },
        ],
    },
    {
        "id": "simon",
        "name": "Simon's Algorithm",
        "category": "Advanced algorithms",
        "difficulty": "Advanced",
        "qubits": 4,
        "shortDescription": "Finds a hidden period s in a 2-to-1 function with an exponential query speedup over classical algorithms.",
        "problemStatement": (
            "Given an oracle f: {0,1}^n -> {0,1}^n promised to satisfy f(x) = f(y) <=> x ⊕ y in {0^n, s} for a hidden period s, "
            "determine the non-zero secret period s."
        ),
        "importance": (
            "Simon's algorithm (1994) provided the first provable exponential speedup for a black-box problem against "
            "randomized classical algorithms, and directly inspired Shor's factoring algorithm."
        ),
        "coreConcept": "Subspace sampling: Measurement yields vectors y orthogonal to s (y · s = 0 mod 2)",
        "classicalVsQuantum": {
            "classicalQueries": "Ω(2^(n/2)) queries (birthday problem lower bound)",
            "quantumQueries": "O(n) quantum queries + classical Gaussian elimination",
            "classicalComplexity": "O(2^(n/2))",
            "quantumComplexity": "O(n)",
            "explanation": (
                "Due to the birthday paradox, a classical algorithm must query at least Ω(2^(n/2)) inputs before finding a collision f(x)=f(y). "
                "Simon's algorithm queries in superposition, creating a 2-element entangled state (|x⟩ + |x⊕s⟩)|f(x)⟩. "
                "The final Hadamard transform causes interference such that every measurement yields a bitstring y with y · s = 0 (mod 2). "
                "Repeating O(n) times provides n-1 linearly independent equations to solve for s."
            ),
        },
        "mathFoundations": (
            "Initial state: |0⟩^⊗n |0⟩^⊗n\n"
            "Superposition: H^⊗n |0^n⟩ |0^n⟩ = (1/2^(n/2)) ∑_{x} |x⟩ |0^n⟩\n"
            "Oracle U_f: (1/2^(n/2)) ∑_{x} |x⟩ |f(x)⟩\n"
            "Grouping pairs with same f(x): = (1/2^(n/2)) ∑_{x in Reps} (|x⟩ + |x⊕s⟩) |f(x)⟩\n"
            "H^⊗n on first register: yields ∑_{y} [(-1)^(x·y) + (-1)^((x⊕s)·y)] |y⟩ |f(x)⟩\n"
            "Amplitude is non-zero ONLY when (-1)^(s·y) = 1 <=> s · y = 0 (mod 2).\n"
            "Every sample satisfies s · y = 0 mod 2."
        ),
        "prerequisites": ["Deutsch-Jozsa", "Modular arithmetic mod 2", "Linear systems / Gaussian elimination"],
        "expectedOutput": "Measurements on the input register yield bitstrings y satisfying y · s = 0 (mod 2).",
        "simulationComplexity": "O(n) gates, 2n qubits (n=2, total 4 qubits)",
        "parameters": [
            {
                "id": "secretPeriod",
                "label": "Hidden Period (s)",
                "type": "select",
                "options": [
                    {"label": "s = '11'", "value": "11"},
                    {"label": "s = '10'", "value": "10"},
                    {"label": "s = '01'", "value": "01"},
                ],
                "default": "11",
            }
        ],
    },
    {
        "id": "shor",
        "name": "Shor's Algorithm (Order Finding)",
        "category": "Advanced algorithms",
        "difficulty": "Advanced",
        "qubits": 5,
        "shortDescription": "Solves quantum order finding to factor N=15 using a=7 via Quantum Phase Estimation and modular exponentiation.",
        "problemStatement": (
            "Find the order r (period) of a coprime integer a modulo N, i.e., the smallest integer r > 0 such that a^r = 1 (mod N). "
            "For N=15 and a=7, find r, from which prime factors gcd(a^(r/2) ± 1, N) are computed."
        ),
        "importance": (
            "Peter Shor's 1994 algorithm achieves polynomial-time integer factorization O((log N)³), "
            "breaking classical RSA and Diffie-Hellman public-key cryptography. It relies on quantum period finding."
        ),
        "coreConcept": "Quantum Phase Estimation of the Unitary Operator U|y⟩ = |a·y mod N⟩",
        "classicalVsQuantum": {
            "classicalQueries": "General Number Field Sieve (GNFS): sub-exponential exp(O((log N)^(1/3) (log log N)^(2/3)))",
            "quantumQueries": "Polynomial time O((log N)³)",
            "classicalComplexity": "Sub-exponential",
            "quantumComplexity": "Polynomial (O((log N)³))",
            "explanation": (
                "Classical factoring cannot find the order r efficiently. "
                "Shor maps order finding to the problem of finding the eigenvalues of the unitary operator U|y⟩ = |a y mod N⟩. "
                "The eigenvalues are e^(2πi s / r). Quantum Phase Estimation extracts the phase s/r with high probability, "
                "and continued fractions find the period r."
            ),
        },
        "mathFoundations": (
            "For N=15, a=7: 7^0=1, 7^1=7, 7^2=4, 7^3=13, 7^4=1 (mod 15) -> Order r = 4.\n"
            "Register 1 (counting): 3 qubits (precision 2³=8)\n"
            "Register 2 (work): initialized to |1⟩ = |0001⟩ (simplified to 2 qubits: |1⟩, |7⟩, |4⟩, |13⟩)\n"
            "Superposition on counting register: H^⊗3 |000⟩\n"
            "Controlled modular multiplications: U^(2^j) mod 15\n"
            "Inverse QFT on counting register: extracts phases k/r for k in {0, 1, 2, 3}\n"
            "Measured values: multiples of 2^3 / r = 8 / 4 = 2 (outcomes 0, 2, 4, 6 -> binary 000, 010, 100, 110)\n"
            "Period r = 4 -> Factors: gcd(7^(4/2) - 1, 15) = gcd(48, 15) = 3; gcd(7^2 + 1, 15) = gcd(50, 15) = 5."
        ),
        "prerequisites": ["Quantum Phase Estimation", "Inverse QFT", "Modular arithmetic", "Continued fractions"],
        "expectedOutput": "Counting register collapses to binary values corresponding to phases 0, 1/4, 2/4, 3/4, directly revealing period r=4.",
        "simulationComplexity": "5 qubits, ~15 gates (simulatable educational instance)",
        "parameters": [
            {
                "id": "baseA",
                "label": "Base (a)",
                "type": "select",
                "options": [
                    {"label": "a = 7 (coprime to 15, order r=4)", "value": "7"},
                    {"label": "a = 2 (coprime to 15, order r=4)", "value": "2"},
                ],
                "default": "7",
            }
        ],
    },
]


def get_algorithm_catalog() -> list[dict[str, Any]]:
    """Return the full algorithm catalog with metadata."""
    return ALGORITHM_CATALOG


def get_algorithm_definition(algorithm_id: str) -> dict[str, Any] | None:
    """Find algorithm metadata by ID."""
    for algo in ALGORITHM_CATALOG:
        if algo["id"] == algorithm_id:
            return algo
    return None


# ---------------------------------------------------------------------------
# Circuit Synthesis & Step Explanation Generators
# ---------------------------------------------------------------------------

def _gate(
    name: str,
    qubits: list[int],
    params: list[float] | None = None,
    step: int = 0,
    line: int = 0,
) -> dict[str, Any]:
    return {
        "id": str(uuid.uuid4()),
        "name": name,
        "qubits": qubits,
        "params": params or [],
        "step": step,
        "sourceLine": line,
    }


def _step_exp(
    step_index: int,
    title: str,
    operation: str,
    gate_name: str,
    qubits: list[int],
    purpose: str,
    math_transform: str,
    concept: str,
) -> dict[str, Any]:
    return {
        "stepIndex": step_index,
        "title": title,
        "operation": operation,
        "gateName": gate_name,
        "targetQubits": qubits,
        "purpose": purpose,
        "mathTransform": math_transform,
        "concept": concept,
    }


def generate_algorithm_circuit(
    algorithm_id: str,
    parameters: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    Generate CircuitIR and step explanations for the chosen algorithm.
    Returns:
      {
        "circuit": CircuitIR dict,
        "steps": list[StepExplanation dict],
        "metadata": AlgorithmMetadata dict,
        "variableName": str
      }
    """
    params = parameters or {}
    meta = get_algorithm_definition(algorithm_id)
    if not meta:
        raise ValueError(f"Unknown algorithm ID: {algorithm_id}")

    if algorithm_id == "deutsch":
        return _gen_deutsch(meta, params)
    elif algorithm_id == "deutsch_jozsa":
        return _gen_deutsch_jozsa(meta, params)
    elif algorithm_id == "bernstein_vazirani":
        return _gen_bernstein_vazirani(meta, params)
    elif algorithm_id == "grover":
        return _gen_grover(meta, params)
    elif algorithm_id == "teleportation":
        return _gen_teleportation(meta, params)
    elif algorithm_id == "superdense_coding":
        return _gen_superdense_coding(meta, params)
    elif algorithm_id == "qft":
        return _gen_qft(meta, params)
    elif algorithm_id == "simon":
        return _gen_simon(meta, params)
    elif algorithm_id == "shor":
        return _gen_shor(meta, params)
    else:
        raise ValueError(f"No generator implemented for algorithm: {algorithm_id}")


# ---------------------------------------------------------------------------
# Individual Algorithm Generators
# ---------------------------------------------------------------------------

def _gen_deutsch(meta: dict[str, Any], params: dict[str, Any]) -> dict[str, Any]:
    oracle_type = params.get("oracleType", "balanced_id")
    gates = []
    steps = []
    step_num = 0

    # Step 0: Prep ancilla qubit |1>
    gates.append(_gate("x", [1], step=step_num, line=1))
    steps.append(_step_exp(
        0,
        "Ancilla Preparation",
        "X gate on qubit 1 (ancilla)",
        "X",
        [1],
        "Flips the ancilla from |0⟩ to |1⟩ so that the subsequent Hadamard creates the |-⟩ state required for phase kickback.",
        "|00⟩ -> |01⟩\nX|0⟩ = |1⟩",
        "State Preparation",
    ))
    step_num += 1

    # Step 1: Superposition on both qubits
    gates.append(_gate("h", [0], step=step_num, line=2))
    gates.append(_gate("h", [1], step=step_num, line=3))
    steps.append(_step_exp(
        1,
        "Equal Superposition",
        "Hadamard on qubit 0 (data) and qubit 1 (ancilla)",
        "H",
        [0, 1],
        "Creates |+⟩ = (|0⟩+|1⟩)/√2 on the data qubit and |–⟩ = (|0⟩-|1⟩)/√2 on the ancilla qubit.",
        "H|0⟩ ⊗ H|1⟩ = |+⟩ ⊗ |–⟩ = (1/2)(|0⟩+|1⟩)(|0⟩-|1⟩)",
        "Quantum Superposition",
    ))
    step_num += 1

    # Step 2: Oracle U_f
    if oracle_type == "constant_0":
        # f(x) = 0: Identity, no gate
        steps.append(_step_exp(
            2,
            "Oracle Evaluation: Constant 0",
            "Identity (No gate applied)",
            "I",
            [0, 1],
            "f(x) = 0 for all x. Since f(x)=0, the ancilla is unchanged and no phase is kicked back.",
            "U_f|x⟩|–⟩ = (-1)^0 |x⟩|–⟩ = |x⟩|–⟩",
            "Phase Kickback (Trivial)",
        ))
    elif oracle_type == "constant_1":
        # f(x) = 1: X on ancilla
        gates.append(_gate("x", [1], step=step_num, line=4))
        steps.append(_step_exp(
            2,
            "Oracle Evaluation: Constant 1",
            "X on ancilla qubit 1",
            "X",
            [1],
            "f(x) = 1 for all x. Flips the ancilla, kicking back a global (-1) phase to the entire state.",
            "U_f|x⟩|–⟩ = (-1)^1 |x⟩|–⟩ = -|x⟩|–⟩",
            "Global Phase Kickback",
        ))
        step_num += 1
    elif oracle_type == "balanced_id":
        # f(x) = x: CNOT from q0 to q1
        gates.append(_gate("cx", [0, 1], step=step_num, line=4))
        steps.append(_step_exp(
            2,
            "Oracle Evaluation: Balanced Identity (f(x)=x)",
            "CNOT(control=q0, target=q1)",
            "CX",
            [0, 1],
            "Kicks back (-1)^f(x) phase to qubit 0: |0⟩ receives phase (-1)⁰ = +1, while |1⟩ receives phase (-1)¹ = -1.",
            "CNOT |+⟩|–⟩ = (1/√2) [|0⟩|–⟩ - |1⟩|–⟩] = |–⟩|–⟩",
            "Phase Kickback",
        ))
        step_num += 1
    elif oracle_type == "balanced_not":
        # f(x) = 1 - x: X(0) then CNOT(0->1) then X(0)
        gates.append(_gate("x", [0], step=step_num, line=4))
        gates.append(_gate("cx", [0, 1], step=step_num + 1, line=5))
        gates.append(_gate("x", [0], step=step_num + 2, line=6))
        steps.append(_step_exp(
            2,
            "Oracle Evaluation: Balanced NOT (f(x)=1-x)",
            "X(0) -> CNOT(0->1) -> X(0)",
            "CX",
            [0, 1],
            "Kicks back (-1)^(1-x) phase to qubit 0, inverting phases between |0⟩ and |1⟩.",
            "U_f |+⟩|–⟩ = (1/√2) [-|0⟩|–⟩ + |1⟩|–⟩] = -|–⟩|–⟩",
            "Phase Kickback",
        ))
        step_num += 3

    # Step 3: Interference on data qubit
    gates.append(_gate("h", [0], step=step_num, line=7))
    is_const = oracle_type.startswith("constant")
    result_basis = "|0⟩" if is_const else "|1⟩"
    steps.append(_step_exp(
        step_num,
        "Interference & Readout Basis Transform",
        "Hadamard on qubit 0 (data)",
        "H",
        [0],
        f"Transforms relative phase into computational basis: |+⟩ -> |0⟩ (constant) or |–⟩ -> |1⟩ (balanced). State is {result_basis}.",
        f"H [± |{'0' if is_const else '1'}⟩_H] = ± {result_basis}",
        "Quantum Interference",
    ))
    step_num += 1

    # Step 4: Measurement
    gates.append(_gate("measure", [0], step=step_num, line=8))
    steps.append(_step_exp(
        step_num,
        "Measurement",
        "Measure qubit 0",
        "M",
        [0],
        f"Measurement yields 0 if f is constant, and 1 if f is balanced. For this oracle ({oracle_type}), result is deterministically {'0' if is_const else '1'}.",
        f"P({'0' if is_const else '1'}) = 1.0 (100% certainty)",
        "Wavefunction Collapse & Readout",
    ))

    circuit = {
        "id": str(uuid.uuid4()),
        "filePath": "deutsch.py",
        "variableName": "qc_deutsch",
        "qubits": 2,
        "classicalBits": 1,
        "gates": gates,
        "sourceRange": {"startLine": 1, "endLine": len(gates)},
        "isApproximate": False,
    }

    return {
        "circuit": circuit,
        "steps": steps,
        "metadata": meta,
        "variableName": "qc_deutsch",
    }


def _gen_deutsch_jozsa(meta: dict[str, Any], params: dict[str, Any]) -> dict[str, Any]:
    n = int(params.get("numDataQubits", 3))
    n = max(2, min(n, 4))
    oracle_type = params.get("oracleType", "balanced_parity")
    total_qubits = n + 1
    ancilla = n

    gates = []
    steps = []
    step_num = 0

    # Step 0: Prep ancilla
    gates.append(_gate("x", [ancilla], step=step_num, line=1))
    steps.append(_step_exp(
        0,
        "Ancilla Preparation",
        f"X gate on ancilla qubit {ancilla}",
        "X",
        [ancilla],
        "Flips ancilla to |1⟩ so Hadamard creates the |–⟩ state for phase kickback.",
        f"|0^{n} 0⟩ -> |0^{n} 1⟩",
        "State Preparation",
    ))
    step_num += 1

    # Step 1: Superposition on all qubits
    for q in range(total_qubits):
        gates.append(_gate("h", [q], step=step_num, line=2 + q))
    steps.append(_step_exp(
        1,
        "Full Superposition",
        f"Hadamard on all {total_qubits} qubits",
        "H",
        list(range(total_qubits)),
        f"Puts data qubits into uniform superposition of all 2^{n} = {2**n} basis states, and ancilla into |–⟩.",
        f"H^⊗{total_qubits} |0^{n}1⟩ = (1/2^({n}/2)) ∑_{{x}} |x⟩ |–⟩",
        "Quantum Superposition",
    ))
    step_num += 1

    # Step 2: Oracle
    if oracle_type == "constant_0":
        steps.append(_step_exp(
            2,
            "Oracle: Constant 0",
            "Identity (no gate)",
            "I",
            list(range(total_qubits)),
            "f(x) = 0 for all x. All amplitudes remain positive.",
            "U_f |x⟩|–⟩ = (-1)^0 |x⟩|–⟩ = |x⟩|–⟩",
            "Phase Kickback",
        ))
    elif oracle_type == "constant_1":
        gates.append(_gate("x", [ancilla], step=step_num, line=10))
        steps.append(_step_exp(
            2,
            "Oracle: Constant 1",
            f"X on ancilla qubit {ancilla}",
            "X",
            [ancilla],
            "f(x) = 1 for all x. Inverts the global sign of all amplitudes.",
            "U_f |x⟩|–⟩ = -|x⟩|–⟩",
            "Phase Kickback",
        ))
        step_num += 1
    elif oracle_type == "balanced_parity":
        # CNOT from each data qubit to ancilla
        for q in range(n):
            gates.append(_gate("cx", [q, ancilla], step=step_num + q, line=10 + q))
        steps.append(_step_exp(
            2,
            "Oracle: Balanced Parity (f(x) = x₀ ⊕ ... ⊕ xₙ₋₁)",
            f"CNOT from each data qubit 0..{n-1} to ancilla",
            "CX",
            list(range(total_qubits)),
            "Kicks back (-1)^(parity(x)) phase to each basis state |x⟩.",
            "U_f |x⟩|–⟩ = (-1)^(x₀ ⊕ ... ⊕ xₙ₋₁) |x⟩|–⟩",
            "Phase Kickback",
        ))
        step_num += n
    elif oracle_type == "balanced_first_bit":
        # CNOT from qubit 0 to ancilla
        gates.append(_gate("cx", [0, ancilla], step=step_num, line=10))
        steps.append(_step_exp(
            2,
            "Oracle: Balanced First Bit (f(x) = x₀)",
            f"CNOT(0 -> {ancilla})",
            "CX",
            [0, ancilla],
            "Kicks back (-1)^x₀ phase. Half the states receive +1, half receive -1.",
            "U_f |x⟩|–⟩ = (-1)^(x₀) |x⟩|–⟩",
            "Phase Kickback",
        ))
        step_num += 1

    # Step 3: Interference on data qubits
    for q in range(n):
        gates.append(_gate("h", [q], step=step_num, line=20 + q))
    is_const = oracle_type.startswith("constant")
    steps.append(_step_exp(
        step_num,
        "Interference Transform",
        f"Hadamard on data qubits 0..{n-1}",
        "H",
        list(range(n)),
        f"Constructive interference at |0^{n}⟩ if constant; destructive interference at |0^{n}⟩ if balanced. Result is {'|0...0⟩' if is_const else 'non-zero bitstring'}.",
        f"Amplitude of |0^{n}⟩: (1/2^{n}) ∑_{{x}} (-1)^f(x) = {'±1' if is_const else '0'}",
        "Quantum Interference",
    ))
    step_num += 1

    # Step 4: Measurement
    for q in range(n):
        gates.append(_gate("measure", [q], step=step_num, line=30 + q))
    steps.append(_step_exp(
        step_num,
        "Measurement of Data Register",
        f"Measure data qubits 0..{n-1}",
        "M",
        list(range(n)),
        f"If all qubits measure '0', function is constant. Otherwise, function is balanced. Predicted outcome: {'0'*n if is_const else 'non-zero'}.",
        f"Outcome: {'|' + '0'*n + '⟩ (Constant)' if is_const else 'Non-zero bitstring (Balanced)'}",
        "Readout",
    ))

    circuit = {
        "id": str(uuid.uuid4()),
        "filePath": "deutsch_jozsa.py",
        "variableName": "qc_dj",
        "qubits": total_qubits,
        "classicalBits": n,
        "gates": gates,
        "sourceRange": {"startLine": 1, "endLine": len(gates)},
        "isApproximate": False,
    }

    return {
        "circuit": circuit,
        "steps": steps,
        "metadata": meta,
        "variableName": "qc_dj",
    }


def _gen_bernstein_vazirani(meta: dict[str, Any], params: dict[str, Any]) -> dict[str, Any]:
    secret = str(params.get("secretString", "101")).strip()
    if not all(c in "01" for c in secret) or len(secret) < 2 or len(secret) > 4:
        secret = "101"

    n = len(secret)
    total_qubits = n + 1
    ancilla = n

    gates = []
    steps = []
    step_num = 0

    # Step 0: Prep ancilla |1>
    gates.append(_gate("x", [ancilla], step=step_num, line=1))
    steps.append(_step_exp(
        0,
        "Ancilla Initialization",
        f"X gate on ancilla qubit {ancilla}",
        "X",
        [ancilla],
        "Flips ancilla to |1⟩ to prepare for phase kickback.",
        "|0⟩ -> |1⟩",
        "State Preparation",
    ))
    step_num += 1

    # Step 1: Superposition
    for q in range(total_qubits):
        gates.append(_gate("h", [q], step=step_num, line=2 + q))
    steps.append(_step_exp(
        1,
        "Superposition of All 2^n States",
        f"Hadamard on all {total_qubits} qubits",
        "H",
        list(range(total_qubits)),
        "Creates equal superposition over all possible bitstrings x in {0,1}^n.",
        f"H^⊗{total_qubits} |0^{n}1⟩ = (1/2^({n}/2)) ∑_{{x}} |x⟩ |–⟩",
        "Quantum Superposition",
    ))
    step_num += 1

    # Step 2: Secret String Oracle
    # For each bit i where s_i == 1, apply CNOT(i -> ancilla)
    cx_qubits = []
    for i, bit in enumerate(secret):
        if bit == "1":
            gates.append(_gate("cx", [i, ancilla], step=step_num, line=10 + i))
            cx_qubits.append(i)
            step_num += 1

    steps.append(_step_exp(
        2,
        f"Inner Product Oracle for s = '{secret}'",
        f"CNOT gates from active qubits {cx_qubits} to ancilla",
        "CX",
        cx_qubits + [ancilla],
        f"Encodes secret s into relative phases via phase kickback: each |x⟩ gets phase (-1)^(s·x).",
        f"U_f |x⟩|–⟩ = (-1)^({secret} · x) |x⟩|–⟩",
        "Phase Kickback",
    ))

    # Step 3: Interference
    for q in range(n):
        gates.append(_gate("h", [q], step=step_num, line=20 + q))
    steps.append(_step_exp(
        step_num,
        "Interference & Basis Decoding",
        f"Hadamard on data qubits 0..{n-1}",
        "H",
        list(range(n)),
        f"The Fourier transform maps the phase (-1)^(s·x) directly to the basis state |s⟩ = |{secret}⟩ with 100% probability.",
        f"H^⊗{n} [(1/2^({n}/2)) ∑_{{x}} (-1)^(s·x) |x⟩] = |{secret}⟩",
        "Quantum Interference",
    ))
    step_num += 1

    # Step 4: Measurement
    for q in range(n):
        gates.append(_gate("measure", [q], step=step_num, line=30 + q))
    steps.append(_step_exp(
        step_num,
        "Measurement of Secret String",
        f"Measure data qubits 0..{n-1}",
        "M",
        list(range(n)),
        f"Measurement yields the exact secret string '{secret}' in a single shot.",
        f"Measured state: |{secret}⟩ with probability 1.0",
        "Readout",
    ))

    circuit = {
        "id": str(uuid.uuid4()),
        "filePath": "bernstein_vazirani.py",
        "variableName": "qc_bv",
        "qubits": total_qubits,
        "classicalBits": n,
        "gates": gates,
        "sourceRange": {"startLine": 1, "endLine": len(gates)},
        "isApproximate": False,
    }

    return {
        "circuit": circuit,
        "steps": steps,
        "metadata": meta,
        "variableName": "qc_bv",
    }


def _gen_grover(meta: dict[str, Any], params: dict[str, Any]) -> dict[str, Any]:
    n = int(params.get("numQubits", 3))
    n = max(2, min(n, 3))
    target = str(params.get("targetState", "101" if n == 3 else "11")).strip()
    if len(target) != n or not all(c in "01" for c in target):
        target = "101" if n == 3 else "11"

    iterations = int(params.get("iterations", 2 if n == 3 else 1))
    iterations = max(1, min(iterations, 4))

    gates = []
    steps = []
    step_num = 0

    # Step 0: Superposition
    for q in range(n):
        gates.append(_gate("h", [q], step=step_num, line=1 + q))
    steps.append(_step_exp(
        0,
        "Equal Superposition",
        f"Hadamard on all {n} qubits",
        "H",
        list(range(n)),
        f"Creates uniform superposition |s⟩ = (1/√{2**n}) ∑ |x⟩ across all {2**n} states.",
        f"|0^{n}⟩ -> (1/√{2**n}) ∑_{{x=0}}^{{{2**n-1}}} |x⟩",
        "Quantum Superposition",
    ))
    step_num += 1

    # Grover Iterations
    for it in range(iterations):
        # Oracle: Phase flip target state |w>
        # 1. Flip qubits where target has '0'
        zero_qubits = [i for i, b in enumerate(target) if b == "0"]
        for q in zero_qubits:
            gates.append(_gate("x", [q], step=step_num, line=10))
        if zero_qubits:
            step_num += 1

        # 2. Multi-controlled Z
        if n == 2:
            gates.append(_gate("cz", [0, 1], step=step_num, line=11))
            step_num += 1
        elif n == 3:
            # CCZ = H(2) -> CCX(0,1,2) -> H(2)
            gates.append(_gate("h", [2], step=step_num, line=11))
            step_num += 1
            gates.append(_gate("ccx", [0, 1, 2], step=step_num, line=12))
            step_num += 1
            gates.append(_gate("h", [2], step=step_num, line=13))
            step_num += 1

        # 3. Unflip qubits where target has '0'
        for q in zero_qubits:
            gates.append(_gate("x", [q], step=step_num, line=14))
        if zero_qubits:
            step_num += 1

        steps.append(_step_exp(
            step_num,
            f"Grover Iteration {it + 1}: Oracle Reflection",
            f"Phase flip target state |{target}⟩",
            "O",
            list(range(n)),
            f"Reflects the state vector across the hyperplane orthogonal to |{target}⟩, inverting the sign of its amplitude.",
            f"O |x⟩ = -|x⟩ if x = {target}, else +|x⟩\nO = I - 2|{target}⟩⟨{target}|",
            "Phase Inversion (Oracle)",
        ))

        # Diffusion Operator: 2|s><s| - I = H^⊗n (2|0><0| - I) H^⊗n
        for q in range(n):
            gates.append(_gate("h", [q], step=step_num, line=20 + q))
        step_num += 1

        for q in range(n):
            gates.append(_gate("x", [q], step=step_num, line=25 + q))
        step_num += 1

        # Multi-controlled Z on |00...0>
        if n == 2:
            gates.append(_gate("cz", [0, 1], step=step_num, line=30))
            step_num += 1
        elif n == 3:
            gates.append(_gate("h", [2], step=step_num, line=30))
            step_num += 1
            gates.append(_gate("ccx", [0, 1, 2], step=step_num, line=31))
            step_num += 1
            gates.append(_gate("h", [2], step=step_num, line=32))
            step_num += 1

        for q in range(n):
            gates.append(_gate("x", [q], step=step_num, line=35 + q))
        step_num += 1

        for q in range(n):
            gates.append(_gate("h", [q], step=step_num, line=40 + q))
        step_num += 1

        steps.append(_step_exp(
            step_num,
            f"Grover Iteration {it + 1}: Diffusion Operator (Inversion about Mean)",
            "H^⊗n -> X^⊗n -> Multi-CZ -> X^⊗n -> H^⊗n",
            "D",
            list(range(n)),
            f"Inverts all amplitudes about their average mean, boosting the amplitude of |{target}⟩ and suppressing non-target amplitudes.",
            "D = 2|s⟩⟨s| - I\nα_x' = 2⟨α⟩ - α_x",
            "Amplitude Amplification",
        ))

    # Measurement
    for q in range(n):
        gates.append(_gate("measure", [q], step=step_num, line=50 + q))
    steps.append(_step_exp(
        step_num,
        "Measurement",
        f"Measure all {n} qubits",
        "M",
        list(range(n)),
        f"Measures the computational basis. Target state |{target}⟩ will be observed with maximum probability.",
        f"High probability of observing |{target}⟩",
        "Readout",
    ))

    circuit = {
        "id": str(uuid.uuid4()),
        "filePath": "grover.py",
        "variableName": "qc_grover",
        "qubits": n,
        "classicalBits": n,
        "gates": gates,
        "sourceRange": {"startLine": 1, "endLine": len(gates)},
        "isApproximate": False,
    }

    return {
        "circuit": circuit,
        "steps": steps,
        "metadata": meta,
        "variableName": "qc_grover",
    }


def _gen_teleportation(meta: dict[str, Any], params: dict[str, Any]) -> dict[str, Any]:
    theta = float(params.get("theta", 1.047197))  # pi/3
    gates = []
    steps = []
    step_num = 0

    # Step 0: Prepare unknown state |psi> on qubit 0 (Alice)
    gates.append(_gate("ry", [0], params=[theta], step=step_num, line=1))
    steps.append(_step_exp(
        0,
        "Alice Prepares Unknown State |ψ⟩",
        f"RY({theta:.3f} rad) on qubit 0",
        "RY",
        [0],
        f"Prepares state |ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩ with θ = {theta:.3f} rad.",
        f"|0⟩ -> cos({theta/2:.3f})|0⟩ + sin({theta/2:.3f})|1⟩\n= {math.cos(theta/2):.3f}|0⟩ + {math.sin(theta/2):.3f}|1⟩",
        "State Preparation",
    ))
    step_num += 1

    # Step 1: Create shared Bell Pair between Alice (q1) and Bob (q2)
    gates.append(_gate("h", [1], step=step_num, line=2))
    gates.append(_gate("cx", [1, 2], step=step_num + 1, line=3))
    steps.append(_step_exp(
        1,
        "Shared Bell Pair Generation",
        "H(1) followed by CNOT(1 -> 2)",
        "Bell Pair",
        [1, 2],
        "Creates maximally entangled state |Φ⁺⟩ = (|00⟩+|11⟩)/√2 between Alice's ancilla (q1) and Bob's qubit (q2).",
        "|00⟩ -> (|00⟩ + |11⟩)/√2",
        "Entanglement Creation",
    ))
    step_num += 2

    # Step 2: Alice's Bell-basis measurement preparation
    gates.append(_gate("cx", [0, 1], step=step_num, line=4))
    gates.append(_gate("h", [0], step=step_num + 1, line=5))
    steps.append(_step_exp(
        2,
        "Alice's Bell-State Measurement",
        "CNOT(0 -> 1) followed by H(0)",
        "Bell Decode",
        [0, 1],
        "Entangles the state |ψ⟩ with Alice's half of the Bell pair, rotating Alice's two qubits into the Bell basis.",
        "Total state projected into Bell basis terms with Bob's qubit carrying Pauli-transformed |ψ⟩.",
        "Bell Measurement",
    ))
    step_num += 2

    # Step 3: Measurement of Alice's qubits
    gates.append(_gate("measure", [0], step=step_num, line=6))
    gates.append(_gate("measure", [1], step=step_num, line=7))
    steps.append(_step_exp(
        3,
        "Alice Measures Her Two Qubits",
        "Measure q0 and q1",
        "M",
        [0, 1],
        "Collapses Alice's qubits into one of 4 classical outcomes: '00', '01', '10', '11'. Bob's qubit collapses to matching Pauli variant.",
        "Alice obtains classical bits (c₀, c₁)",
        "State Collapse",
    ))
    step_num += 1

    # Step 4: Bob's Unitary Corrections (conditioned on classical bits)
    gates.append(_gate("cx", [1, 2], step=step_num, line=8))
    gates.append(_gate("cz", [0, 2], step=step_num + 1, line=9))
    steps.append(_step_exp(
        4,
        "Bob Applies Classical Feedforward Corrections",
        "CX(1 -> 2) [X correction] and CZ(0 -> 2) [Z correction]",
        "Correction",
        [2],
        "Bob applies Pauli X if c₁=1 and Pauli Z if c₀=1, restoring his qubit (q2) exactly to Alice's original state |ψ⟩.",
        "Bob's state becomes exactly |ψ⟩ = α|0⟩ + β|1⟩ with 100% fidelity.",
        "Unitary Recovery",
    ))

    circuit = {
        "id": str(uuid.uuid4()),
        "filePath": "teleportation.py",
        "variableName": "qc_teleport",
        "qubits": 3,
        "classicalBits": 2,
        "gates": gates,
        "sourceRange": {"startLine": 1, "endLine": len(gates)},
        "isApproximate": False,
    }

    return {
        "circuit": circuit,
        "steps": steps,
        "metadata": meta,
        "variableName": "qc_teleport",
    }


def _gen_superdense_coding(meta: dict[str, Any], params: dict[str, Any]) -> dict[str, Any]:
    msg = str(params.get("message", "11")).strip()
    if msg not in ("00", "01", "10", "11"):
        msg = "11"

    gates = []
    steps = []
    step_num = 0

    # Step 0: Shared Bell Pair between Alice (q0) and Bob (q1)
    gates.append(_gate("h", [0], step=step_num, line=1))
    gates.append(_gate("cx", [0, 1], step=step_num + 1, line=2))
    steps.append(_step_exp(
        0,
        "Entangled Pair Preparation",
        "H(0) -> CNOT(0 -> 1)",
        "Bell Pair",
        [0, 1],
        "Prepares shared Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 between Alice (q0) and Bob (q1).",
        "|00⟩ -> (|00⟩ + |11⟩)/√2 = |Φ⁺⟩",
        "Entanglement Creation",
    ))
    step_num += 2

    # Step 1: Alice's Local Encoding
    if msg == "00":
        # I
        steps.append(_step_exp(
            step_num,
            "Alice Encodes '00' (Identity)",
            "Identity (no gate)",
            "I",
            [0],
            "For message '00', Alice applies Identity. State remains |Φ⁺⟩.",
            "I|Φ⁺⟩ = |Φ⁺⟩ = (|00⟩ + |11⟩)/√2",
            "Local Unitary Encoding",
        ))
    elif msg == "01":
        # X
        gates.append(_gate("x", [0], step=step_num, line=3))
        steps.append(_step_exp(
            step_num,
            "Alice Encodes '01' (Bit Flip)",
            "X on qubit 0",
            "X",
            [0],
            "For message '01', Alice applies Pauli-X. State transforms to |Ψ⁺⟩.",
            "X|Φ⁺⟩ = |Ψ⁺⟩ = (|10⟩ + |01⟩)/√2",
            "Local Unitary Encoding",
        ))
        step_num += 1
    elif msg == "10":
        # Z
        gates.append(_gate("z", [0], step=step_num, line=3))
        steps.append(_step_exp(
            step_num,
            "Alice Encodes '10' (Phase Flip)",
            "Z on qubit 0",
            "Z",
            [0],
            "For message '10', Alice applies Pauli-Z. State transforms to |Φ⁻⟩.",
            "Z|Φ⁺⟩ = |Φ⁻⟩ = (|00⟩ - |11⟩)/√2",
            "Local Unitary Encoding",
        ))
        step_num += 1
    elif msg == "11":
        # Z followed by X (or X then Z)
        gates.append(_gate("x", [0], step=step_num, line=3))
        gates.append(_gate("z", [0], step=step_num + 1, line=4))
        steps.append(_step_exp(
            step_num,
            "Alice Encodes '11' (Bit and Phase Flip)",
            "X(0) followed by Z(0)",
            "ZX",
            [0],
            "For message '11', Alice applies X then Z. State transforms to |Ψ⁻⟩.",
            "ZX|Φ⁺⟩ = |Ψ⁻⟩ = (|01⟩ - |10⟩)/√2",
            "Local Unitary Encoding",
        ))
        step_num += 2

    # Step 2: Bob's Bell-basis Decoding
    gates.append(_gate("cx", [0, 1], step=step_num, line=5))
    gates.append(_gate("h", [0], step=step_num + 1, line=6))
    steps.append(_step_exp(
        step_num,
        "Bob's Bell-Basis Decoding",
        "CNOT(0 -> 1) followed by H(0)",
        "Bell Decode",
        [0, 1],
        "Bob decodes the 4 orthogonal Bell states back into the standard computational basis states |00⟩, |01⟩, |10⟩, |11⟩.",
        f"Bell State -> Computational State |{msg}⟩",
        "Orthogonal Decoding",
    ))
    step_num += 2

    # Step 3: Measurement
    gates.append(_gate("measure", [0], step=step_num, line=7))
    gates.append(_gate("measure", [1], step=step_num, line=8))
    steps.append(_step_exp(
        step_num,
        "Measurement of 2 Classical Bits",
        "Measure q0 and q1",
        "M",
        [0, 1],
        f"Bob measures both qubits, perfectly recovering Alice's 2-bit message '{msg}'.",
        f"Measured outcome: |{msg}⟩ with probability 1.0",
        "Readout",
    ))

    circuit = {
        "id": str(uuid.uuid4()),
        "filePath": "superdense_coding.py",
        "variableName": "qc_superdense",
        "qubits": 2,
        "classicalBits": 2,
        "gates": gates,
        "sourceRange": {"startLine": 1, "endLine": len(gates)},
        "isApproximate": False,
    }

    return {
        "circuit": circuit,
        "steps": steps,
        "metadata": meta,
        "variableName": "qc_superdense",
    }


def _gen_qft(meta: dict[str, Any], params: dict[str, Any]) -> dict[str, Any]:
    n = int(params.get("numQubits", 3))
    n = max(2, min(n, 3))
    input_val = int(params.get("inputState", 4))
    input_val = max(0, min(input_val, (2**n) - 1))

    gates = []
    steps = []
    step_num = 0

    # Step 0: Prepare input basis state |j>
    for q in range(n):
        if (input_val >> q) & 1:
            gates.append(_gate("x", [q], step=step_num, line=1 + q))
    if any((input_val >> q) & 1 for q in range(n)):
        steps.append(_step_exp(
            0,
            f"Input State Preparation: |{input_val}⟩",
            f"X gates to encode binary {format(input_val, f'0{n}b')}",
            "X",
            [q for q in range(n) if (input_val >> q) & 1],
            f"Prepares the computational basis state |j⟩ = |{input_val}⟩.",
            f"|0^{n}⟩ -> |{format(input_val, f'0{n}b')}⟩",
            "State Preparation",
        ))
        step_num += 1

    # QFT implementation
    for i in range(n):
        gates.append(_gate("h", [i], step=step_num, line=10 + i * 5))
        steps.append(_step_exp(
            step_num,
            f"QFT Layer {i}: Hadamard on Qubit {i}",
            f"H on qubit {i}",
            "H",
            [i],
            f"Creates superposition on qubit {i} with basic phase encoding.",
            f"H|x_{i}⟩ = (|0⟩ + (-1)^x_{i} |1⟩)/√2",
            "Hadamard Rotation",
        ))
        step_num += 1

        for j in range(i + 1, n):
            k = j - i
            theta = math.pi / (2**k)
            gates.append(_gate("cp", [j, i], params=[theta], step=step_num, line=11 + i * 5 + j))
            steps.append(_step_exp(
                step_num,
                f"QFT Controlled-Phase CP(π/{2**k})",
                f"CP(ctrl={j}, tgt={i}, angle=π/{2**k})",
                "CP",
                [j, i],
                f"Adds relative phase e^(2πi / 2^{k+1}) conditioned on qubit {j} being |1⟩.",
                f"CP(θ) = diag(1, 1, 1, e^(iπ/{2**k}))",
                "Phase Addition",
            ))
            step_num += 1

    # Final SWAP to correct endianness
    if n >= 2:
        gates.append(_gate("swap", [0, n - 1], step=step_num, line=30))
        steps.append(_step_exp(
            step_num,
            "SWAP Reverse Endianness",
            f"SWAP(0, {n - 1})",
            "SWAP",
            [0, n - 1],
            "Reverses the qubit order so the output basis matches standard binary representation.",
            "SWAP |q₀...qₙ₋₁⟩ -> |qₙ₋₁...q₀⟩",
            "Qubit Reversal",
        ))

    circuit = {
        "id": str(uuid.uuid4()),
        "filePath": "qft.py",
        "variableName": "qc_qft",
        "qubits": n,
        "classicalBits": n,
        "gates": gates,
        "sourceRange": {"startLine": 1, "endLine": len(gates)},
        "isApproximate": False,
    }

    return {
        "circuit": circuit,
        "steps": steps,
        "metadata": meta,
        "variableName": "qc_qft",
    }


def _gen_simon(meta: dict[str, Any], params: dict[str, Any]) -> dict[str, Any]:
    secret = str(params.get("secretPeriod", "11")).strip()
    if secret not in ("11", "10", "01"):
        secret = "11"

    n = 2
    total_qubits = 2 * n  # 4 qubits (q0, q1 = input; q2, q3 = output)
    gates = []
    steps = []
    step_num = 0

    # Step 0: Superposition on input register
    for q in range(n):
        gates.append(_gate("h", [q], step=step_num, line=1 + q))
    steps.append(_step_exp(
        0,
        "Input Register Superposition",
        "Hadamard on qubits 0 and 1",
        "H",
        [0, 1],
        "Puts the 2 input qubits into uniform superposition of all 4 states |00⟩, |01⟩, |10⟩, |11⟩.",
        "|00⟩ -> (1/2) (|00⟩ + |01⟩ + |10⟩ + |11⟩)",
        "Quantum Superposition",
    ))
    step_num += 1

    # Step 1: 2-to-1 Oracle f(x)
    # If s = '11': f(00)=f(11)=00, f(01)=f(10)=01.
    # Implemented by CNOT(0->2) and CNOT(1->2)
    if secret == "11":
        gates.append(_gate("cx", [0, 2], step=step_num, line=5))
        gates.append(_gate("cx", [1, 2], step=step_num + 1, line=6))
        steps.append(_step_exp(
            1,
            "Simon 2-to-1 Oracle for s = '11'",
            "CNOT(0->2) followed by CNOT(1->2)",
            "CX",
            [0, 1, 2],
            "Computes f(x) = x₀ ⊕ x₁ onto output qubit 2. Guaranteed that f(x ⊕ 11) = f(x).",
            "|x₀x₁⟩|00⟩ -> |x₀x₁⟩ |x₀ ⊕ x₁⟩|0⟩",
            "2-to-1 Oracle Evaluation",
        ))
        step_num += 2
    elif secret == "10":
        # f(x ⊕ 10) = f(x) -> depends only on x1: CNOT(1 -> 2)
        gates.append(_gate("cx", [1, 2], step=step_num, line=5))
        steps.append(_step_exp(
            1,
            "Simon 2-to-1 Oracle for s = '10'",
            "CNOT(1->2)",
            "CX",
            [1, 2],
            "Computes f(x) = x₁ onto qubit 2. Satisfies f(x ⊕ 10) = f(x).",
            "|x₀x₁⟩|00⟩ -> |x₀x₁⟩ |x₁⟩|0⟩",
            "2-to-1 Oracle Evaluation",
        ))
        step_num += 1
    elif secret == "01":
        # f(x ⊕ 01) = f(x) -> depends only on x0: CNOT(0 -> 2)
        gates.append(_gate("cx", [0, 2], step=step_num, line=5))
        steps.append(_step_exp(
            1,
            "Simon 2-to-1 Oracle for s = '01'",
            "CNOT(0->2)",
            "CX",
            [0, 2],
            "Computes f(x) = x₀ onto qubit 2. Satisfies f(x ⊕ 01) = f(x).",
            "|x₀x₁⟩|00⟩ -> |x₀x₁⟩ |x₀⟩|0⟩",
            "2-to-1 Oracle Evaluation",
        ))
        step_num += 1

    # Step 2: Second Hadamard transform on input register
    for q in range(n):
        gates.append(_gate("h", [q], step=step_num, line=10 + q))
    steps.append(_step_exp(
        step_num,
        "Interference on Input Register",
        "Hadamard on qubits 0 and 1",
        "H",
        [0, 1],
        f"Creates constructive interference for bitstrings y satisfying y · s = 0 (mod 2), and destructive interference for all other strings.",
        f"∑_{{y: y·{secret}=0}} |y⟩ |f(x)⟩",
        "Quantum Interference",
    ))
    step_num += 1

    # Step 3: Measurement of input qubits
    for q in range(n):
        gates.append(_gate("measure", [q], step=step_num, line=15 + q))
    steps.append(_step_exp(
        step_num,
        "Measurement of Orthogonal Vectors",
        "Measure qubits 0 and 1",
        "M",
        [0, 1],
        f"Every measured string y satisfies y · {secret} = 0 (mod 2). For s='{secret}', valid outputs are: " +
        ("00, 11" if secret == "11" else ("00, 01" if secret == "10" else "00, 10")),
        f"Sample y satisfying y · {secret} = 0 mod 2",
        "Readout",
    ))

    circuit = {
        "id": str(uuid.uuid4()),
        "filePath": "simon.py",
        "variableName": "qc_simon",
        "qubits": total_qubits,
        "classicalBits": n,
        "gates": gates,
        "sourceRange": {"startLine": 1, "endLine": len(gates)},
        "isApproximate": False,
    }

    return {
        "circuit": circuit,
        "steps": steps,
        "metadata": meta,
        "variableName": "qc_simon",
    }


def _gen_shor(meta: dict[str, Any], params: dict[str, Any]) -> dict[str, Any]:
    base_a = int(params.get("baseA", 7))
    total_qubits = 5  # q0, q1, q2 = counting register; q3, q4 = work register
    gates = []
    steps = []
    step_num = 0

    # Step 0: Prep work register to |1> = |01> (q3=1, q4=0)
    gates.append(_gate("x", [3], step=step_num, line=1))
    steps.append(_step_exp(
        0,
        "Work Register Initialization",
        "X gate on qubit 3",
        "X",
        [3],
        "Initializes the modular multiplication work register to |1⟩ = |01⟩.",
        "|00⟩_work -> |01⟩_work = |1⟩",
        "State Preparation",
    ))
    step_num += 1

    # Step 1: Superposition on counting register
    for q in range(3):
        gates.append(_gate("h", [q], step=step_num, line=2 + q))
    steps.append(_step_exp(
        1,
        "Counting Register Superposition",
        "Hadamard on qubits 0, 1, 2",
        "H",
        [0, 1, 2],
        "Creates uniform superposition over 2³ = 8 evaluation points.",
        "(1/√8) ∑_{k=0}^7 |k⟩ |1⟩_work",
        "Quantum Superposition",
    ))
    step_num += 1

    # Step 2: Controlled modular exponentiation U^(2^j) mod 15
    # For a=7 mod 15:
    # 7^1 = 7: SWAP controlled by q0, X gates
    gates.append(_gate("cx", [0, 4], step=step_num, line=6))
    step_num += 1
    # 7^2 = 4 = 1 mod 3 in cyclic subgroup: CNOT controlled by q1
    gates.append(_gate("cx", [1, 3], step=step_num, line=7))
    step_num += 1
    # 7^4 = 1 mod 15: Identity, no operation needed for 2^2
    steps.append(_step_exp(
        step_num - 2,
        "Controlled Modular Multiplication U^(2^j) mod 15",
        "Controlled gates representing U^(2^0)=7, U^(2^1)=4, U^(2^2)=1 mod 15",
        "U_mod",
        [0, 1, 3, 4],
        "Applies modular multiplication a^(2^j) mod 15, entangling the counting register with the modular sequence {1, 7, 4, 13}.",
        "∑_{k=0}^7 |k⟩ |(7^k mod 15)⟩",
        "Modular Exponentiation",
    ))

    # Step 3: Inverse QFT on 3-qubit counting register
    # SWAP(0, 2)
    gates.append(_gate("swap", [0, 2], step=step_num, line=10))
    step_num += 1
    gates.append(_gate("h", [0], step=step_num, line=11))
    step_num += 1
    gates.append(_gate("cp", [1, 0], params=[-math.pi / 2], step=step_num, line=12))
    step_num += 1
    gates.append(_gate("h", [1], step=step_num, line=13))
    step_num += 1
    gates.append(_gate("cp", [2, 0], params=[-math.pi / 4], step=step_num, line=14))
    gates.append(_gate("cp", [2, 1], params=[-math.pi / 2], step=step_num, line=15))
    step_num += 1
    gates.append(_gate("h", [2], step=step_num, line=16))
    step_num += 1

    steps.append(_step_exp(
        step_num - 5,
        "Inverse Quantum Fourier Transform (QFT†)",
        "QFT† on counting register (qubits 0, 1, 2)",
        "QFT†",
        [0, 1, 2],
        "Extracts the period r=4 from the periodic state into the counting register phases.",
        "QFT† -> Peaks at multiples of 2^3 / r = 8 / 4 = 2",
        "Phase Estimation",
    ))

    # Step 4: Measurement
    for q in range(3):
        gates.append(_gate("measure", [q], step=step_num, line=20 + q))
    steps.append(_step_exp(
        step_num,
        "Measurement of Phase",
        "Measure counting register (qubits 0, 1, 2)",
        "M",
        [0, 1, 2],
        "Yields outcomes corresponding to phase s/r ∈ {0/4, 1/4, 2/4, 3/4} (binary 000, 010, 100, 110). "
        "Continued fractions reveal the period r = 4. "
        "Factors of 15 are found via gcd(7^(4/2) ± 1, 15) = 3 and 5.",
        "Outcomes: 000 (0), 010 (2), 100 (4), 110 (6) with equal probability",
        "Factor Extraction",
    ))

    circuit = {
        "id": str(uuid.uuid4()),
        "filePath": "shor.py",
        "variableName": "qc_shor",
        "qubits": total_qubits,
        "classicalBits": 3,
        "gates": gates,
        "sourceRange": {"startLine": 1, "endLine": len(gates)},
        "isApproximate": False,
    }

    return {
        "circuit": circuit,
        "steps": steps,
        "metadata": meta,
        "variableName": "qc_shor",
    }


# ---------------------------------------------------------------------------
# Full Simulation Pipeline
# ---------------------------------------------------------------------------

def simulate_algorithm(
    algorithm_id: str,
    parameters: dict[str, Any] | None = None,
    shots: int = 1024,
    seed: int | None = None,
) -> dict[str, Any]:
    """
    Generate circuit, intermediate statevectors for every step, and measurement statistics.
    """
    algo_data = generate_algorithm_circuit(algorithm_id, parameters)
    circuit = algo_data["circuit"]
    n_qubits = circuit["qubits"]
    gates = circuit["gates"]

    # 1. Step-by-step statevector generation
    statevector_steps = step_circuit_gates(n_qubits, gates)

    # 2. Measurement sampling simulation
    counts, provider = simulate_circuit_data(circuit, shots=shots, seed=seed)

    return {
        "circuit": circuit,
        "steps": algo_data["steps"],
        "metadata": algo_data["metadata"],
        "statevectorSteps": statevector_steps,
        "simulation": {
            "counts": counts,
            "provider": provider,
            "shots": shots,
        },
    }

