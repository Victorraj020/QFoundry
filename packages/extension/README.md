# QFoundry — Quantum Developer Tools

QFoundry is a premium, interactive development suite for **Qiskit** built directly into VS Code. It provides real-time visualization, gate-by-gate debugging, local execution histograms, and comprehensive hover documentation to speed up your quantum computing workflow.

---

## Features

### 1. 🔍 Live Circuit Preview
No need to run your script to see if you built the circuit correctly. As you write code, QFoundry parses the source and renders a vector-perfect SVG diagram of your circuit in a side panel. It updates automatically on every keypress (debounced).

### 2. 🐛 Interactive Circuit Debugger
A professional-grade debugger built specifically for quantum state exploration:
* **Timeline Controls**: Play, pause, step forward/backward, and scrub through gate sequences.
* **Gate Highlighting**: Click any gate on the timeline sidebar to jump execution directly to that step.
* **Statevector Analysis**: View the exact complex amplitudes, real/imaginary parts, and outcome probabilities at each step.
* **HSL Phase Disks**: Visualize quantum phase angles ($\theta$) in real-time using custom SVG-based phase disks mapped to an HSL color-wheel.

### 3. 📊 Local Quantum Simulation & Histograms
Simulate your circuit locally directly from the panel:
* Supports custom shots count and random seed presets.
* Visualizes basis state measurements in a beautiful interactive histogram with hover details.
* Automatically injects `measure_all()` if you forget to add measurements.

### 4. 📚 Smart Hover Documentation
Get instant math and code references offline:
* Hovering over any gate method (e.g. `h`, `cx`, `rx`, `t`) in Python displays a rich documentation card.
* Details include mathematical matrices, physical intuition, typical use cases, code examples, and related gates.

### 5. 🧠 Circuit Analyzer & Pattern Explainer
Static analysis that automatically identifies circuit characteristics:
* Reports width, depth, total gate counts, and two-qubit gate counts.
* Analyzes structure to recognize known algorithms and states (such as Bell State, GHZ State, Quantum Teleportation, Superposition, and VQE).

---

## How to Use

1. Open a Python file containing a Qiskit circuit (e.g., `qc = QuantumCircuit(2)`).
2. Click the **Visualize Circuit** icon in the editor toolbar (top-right) or press **`Ctrl + Shift + Q`** (`Cmd + Shift + Q` on macOS).
3. The preview panel will slide in:
   * Use **Preview** to see the circuit diagram.
   * Switch to **Debugger** to step through the statevector step-by-step.
   * Switch to **Simulation** to configure and run local sampling.
   * Switch to **Explain** to see depth/gate counts and algorithmic patterns.

---

## Requirements & Prerequisites
* **Python 3.8+**
* **Qiskit** (Install via `pip install qiskit`)
* *(Optional)* **Qiskit Aer** for fast local simulation (Install via `pip install qiskit-aer`)
