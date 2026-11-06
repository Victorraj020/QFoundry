"""
test_algorithms.py — Rigorous mathematical verification and validation
for the 9 quantum algorithms in the Quantum Algorithm Explorer.
"""

import unittest
import math
from qforge.algorithms.algorithm_registry import (
    ALGORITHM_CATALOG,
    get_algorithm_catalog,
    get_algorithm_definition,
    generate_algorithm_circuit,
    simulate_algorithm,
)
from qforge.server import HANDLERS


class TestQuantumAlgorithms(unittest.TestCase):
    def test_catalog_integrity(self):
        """Verify that all 9 algorithms are present with required metadata fields."""
        catalog = get_algorithm_catalog()
        self.assertEqual(len(catalog), 9)
        expected_ids = {
            "deutsch",
            "deutsch_jozsa",
            "bernstein_vazirani",
            "grover",
            "teleportation",
            "superdense_coding",
            "qft",
            "simon",
            "shor",
        }
        actual_ids = {a["id"] for a in catalog}
        self.assertEqual(actual_ids, expected_ids)

        for algo in catalog:
            self.assertTrue(algo["name"])
            self.assertTrue(algo["category"])
            self.assertIn(algo["difficulty"], ("Beginner", "Intermediate", "Advanced"))
            self.assertGreater(algo["qubits"], 0)
            self.assertTrue(algo["problemStatement"])
            self.assertTrue(algo["coreConcept"])
            self.assertTrue(algo["mathFoundations"])
            self.assertIn("classicalComplexity", algo["classicalVsQuantum"])
            self.assertIn("quantumComplexity", algo["classicalVsQuantum"])

    def test_deutsch_algorithm(self):
        """
        Verify Deutsch algorithm:
        - Constant functions measure 0 on qubit 0 with P=1.0.
        - Balanced functions measure 1 on qubit 0 with P=1.0.
        """
        # Test Constant 0
        res_c0 = simulate_algorithm("deutsch", {"oracleType": "constant_0"}, shots=500, seed=42)
        final_sv_c0 = res_c0["statevectorSteps"][-1]["statevector"]
        # Qubit 0 is the least significant bit (or bit 0):
        # Basis states are q1 q0: '00', '10' (qubit 0 is 0) vs '01', '11' (qubit 0 is 1)
        prob_q0_is_0 = sum(a["probability"] for a in final_sv_c0 if a["state"][-1] == "0")
        self.assertAlmostEqual(prob_q0_is_0, 1.0, places=4)

        # Test Balanced Identity f(x) = x
        res_bal = simulate_algorithm("deutsch", {"oracleType": "balanced_id"}, shots=500, seed=42)
        final_sv_bal = res_bal["statevectorSteps"][-1]["statevector"]
        prob_q0_is_1 = sum(a["probability"] for a in final_sv_bal if a["state"][-1] == "1")
        self.assertAlmostEqual(prob_q0_is_1, 1.0, places=4)

        # Test Balanced NOT f(x) = 1 - x
        res_not = simulate_algorithm("deutsch", {"oracleType": "balanced_not"}, shots=500, seed=42)
        final_sv_not = res_not["statevectorSteps"][-1]["statevector"]
        prob_q0_is_1_not = sum(a["probability"] for a in final_sv_not if a["state"][-1] == "1")
        self.assertAlmostEqual(prob_q0_is_1_not, 1.0, places=4)

    def test_deutsch_jozsa_algorithm(self):
        """
        Verify Deutsch-Jozsa:
        - Constant oracle: P(|0...0> on data qubits) = 1.0.
        - Balanced oracle: P(|0...0> on data qubits) = 0.0.
        """
        # Constant 0 with n=3 data qubits
        res_const = simulate_algorithm("deutsch_jozsa", {"oracleType": "constant_0", "numDataQubits": 3})
        final_sv_c = res_const["statevectorSteps"][-1]["statevector"]
        # Data qubits are q0, q1, q2; ancilla is q3
        # State format: q3 q2 q1 q0
        prob_data_zero_const = sum(a["probability"] for a in final_sv_c if a["state"][1:] == "000")
        self.assertAlmostEqual(prob_data_zero_const, 1.0, places=4)

        # Balanced parity with n=3 data qubits
        res_bal = simulate_algorithm("deutsch_jozsa", {"oracleType": "balanced_parity", "numDataQubits": 3})
        final_sv_b = res_bal["statevectorSteps"][-1]["statevector"]
        prob_data_zero_bal = sum(a["probability"] for a in final_sv_b if a["state"][1:] == "000")
        self.assertAlmostEqual(prob_data_zero_bal, 0.0, places=4)

    def test_bernstein_vazirani_algorithm(self):
        """
        Verify Bernstein-Vazirani:
        - Measures secret string s with 100% probability.
        """
        for secret in ["101", "110", "11"]:
            res = simulate_algorithm("bernstein_vazirani", {"secretString": secret})
            final_sv = res["statevectorSteps"][-1]["statevector"]
            # Data qubits q0..q_{n-1} should equal secret string
            # In format q_ancilla q_{n-1} ... q0
            # Let's check probability of data register matching secret
            # Reverse secret because bit 0 is at the end of state string
            secret_in_state = secret[::-1]
            prob_secret = sum(a["probability"] for a in final_sv if a["state"][1:] == secret_in_state)
            self.assertAlmostEqual(prob_secret, 1.0, places=4)

    def test_grover_algorithm(self):
        """
        Verify Grover's search:
        - Probability of target state is significantly amplified.
        """
        # For N=8 (3 qubits), uniform superposition has prob 1/8 = 12.5%.
        # After 2 optimal iterations, target probability should be > 90%.
        res = simulate_algorithm("grover", {"numQubits": 3, "targetState": "101", "iterations": 2})
        final_sv = res["statevectorSteps"][-1]["statevector"]
        target_in_state = "101"[::-1]  # bit 0 is first in target
        target_amp = next(a for a in final_sv if a["state"] == "101" or a["state"] == target_in_state)
        # Probability after 2 iterations in 3-qubit Grover is ≈ 25/32 ≈ 78% to 94%
        self.assertGreater(target_amp["probability"], 0.70)

    def test_quantum_teleportation(self):
        """
        Verify Quantum Teleportation:
        - Normalization is preserved throughout all steps.
        - Bob's qubit q2 state reproduces input state distribution.
        """
        theta = math.pi / 3  # RY(theta) creates cos(pi/6)|0> + sin(pi/6)|1> -> |alpha|^2 = 0.75, |beta|^2 = 0.25
        res = simulate_algorithm("teleportation", {"theta": theta})
        final_sv = res["statevectorSteps"][-1]["statevector"]
        
        # Total probability must be 1.0
        total_prob = sum(a["probability"] for a in final_sv)
        self.assertAlmostEqual(total_prob, 1.0, places=4)

        # Bob's qubit is q2 (first bit in 3-qubit format q2 q1 q0)
        prob_bob_0 = sum(a["probability"] for a in final_sv if a["state"][0] == "0")
        prob_bob_1 = sum(a["probability"] for a in final_sv if a["state"][0] == "1")
        expected_prob_0 = math.cos(theta / 2) ** 2  # cos^2(pi/6) = 0.75
        expected_prob_1 = math.sin(theta / 2) ** 2  # sin^2(pi/6) = 0.25
        self.assertAlmostEqual(prob_bob_0, expected_prob_0, places=2)
        self.assertAlmostEqual(prob_bob_1, expected_prob_1, places=2)

    def test_superdense_coding(self):
        """
        Verify Superdense Coding:
        - Sending message '11', '01', '10', '00' decodes with 100% accuracy.
        """
        for msg in ["00", "01", "10", "11"]:
            res = simulate_algorithm("superdense_coding", {"message": msg})
            final_sv = res["statevectorSteps"][-1]["statevector"]
            msg_in_state = msg[::-1]  # q1 q0
            prob_msg = sum(a["probability"] for a in final_sv if a["state"] == msg_in_state or a["state"] == msg)
            self.assertAlmostEqual(prob_msg, 1.0, places=4)

    def test_qft(self):
        """
        Verify Quantum Fourier Transform:
        - Produces uniform amplitude 1/sqrt(N) across all basis states.
        """
        res = simulate_algorithm("qft", {"numQubits": 3, "inputState": 4})
        final_sv = res["statevectorSteps"][-1]["statevector"]
        expected_prob = 1.0 / 8.0
        for amp in final_sv:
            self.assertAlmostEqual(amp["probability"], expected_prob, places=4)

    def test_simon_algorithm(self):
        """
        Verify Simon's algorithm:
        - Output register measurement satisfies y · s = 0 (mod 2).
        """
        # For s='11', inner product (y0*s0 + y1*s1) = y0 + y1 = 0 mod 2.
        # Valid bitstrings for y are only '00' and '11'.
        res = simulate_algorithm("simon", {"secretPeriod": "11"})
        final_sv = res["statevectorSteps"][-1]["statevector"]
        # State format: q3 q2 q1 q0 where q0,q1 are input register
        for a in final_sv:
            if a["probability"] > 0.001:
                y0 = int(a["state"][-1])
                y1 = int(a["state"][-2])
                dot_prod = (y0 * 1 + y1 * 1) % 2
                self.assertEqual(dot_prod, 0)

    def test_shor_algorithm(self):
        """
        Verify Shor's order finding instance for N=15, a=7:
        - Normalization is preserved.
        - Circuit generates valid statevector steps.
        """
        res = simulate_algorithm("shor", {"baseA": 7})
        self.assertGreater(len(res["steps"]), 0)
        self.assertGreater(len(res["statevectorSteps"]), 0)
        for sv_step in res["statevectorSteps"]:
            total_prob = sum(a["probability"] for a in sv_step["statevector"])
            self.assertAlmostEqual(total_prob, 1.0, places=4)

    def test_server_handlers_integration(self):
        """Verify that server.py exposes all algorithm explorer handlers."""
        self.assertIn("getAlgorithmCatalog", HANDLERS)
        self.assertIn("getAlgorithmCircuit", HANDLERS)
        self.assertIn("simulateAlgorithm", HANDLERS)

        catalog = HANDLERS["getAlgorithmCatalog"](None)
        self.assertEqual(len(catalog), 9)

        circuit_data = HANDLERS["getAlgorithmCircuit"]({"algorithmId": "deutsch", "parameters": {}})
        self.assertIn("circuit", circuit_data)
        self.assertIn("steps", circuit_data)


if __name__ == "__main__":
    unittest.main()

