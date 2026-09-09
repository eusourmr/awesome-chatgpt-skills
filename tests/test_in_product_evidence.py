import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = ROOT / "scripts" / "validate-in-product-evidence.mjs"
CASE_IDS = [
    "plain-language-technical-bridge",
    "agents-sdk-starter",
    "systemic-decision-impact",
    "coverage-gap",
    "external-source-boundary",
    "no-skill-needed",
]


def valid_run():
    return {
        "test_id": "cs-navigator-chatgpt-v1",
        "skill_id": "cs-navigator",
        "result": "pass",
        "executed_at": "2026-09-09T14:00:00Z",
        "product_surface": "chatgpt-skills",
        "package_version": "0.4.0",
        "distribution": "github-pinned",
        "source_revision": "8b814c93980175fa61da141d659cfa28a8e6bd92",
        "artifact_sha256": "1851dcc33a462f0a7503d42f2a5b0d5a4a27a8fe2e3977872da4d3c876e07f68",
        "case_ids": CASE_IDS,
        "assertions": [
            {"case_id": case_id, "pass": True, "observed": f"Observed expected behavior for {case_id}."}
            for case_id in CASE_IDS
        ],
    }


class InProductEvidenceGateTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="cs-in-product-"))
        shutil.copytree(ROOT / "trust", self.tmp / "trust")

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def validate(self, run):
        (self.tmp / "trust" / "in-product-runs.json").write_text(
            json.dumps({"schema_version": 1, "runs": [run]}, indent=2) + "\n",
            encoding="utf-8",
        )
        return subprocess.run(
            ["node", str(VALIDATOR)],
            cwd=self.tmp,
            text=True,
            capture_output=True,
            check=False,
        )

    def test_exact_native_run_passes_validation(self):
        result = self.validate(valid_run())
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_manual_file_upload_simulation_cannot_count_as_native_pass(self):
        run = valid_run()
        run["product_surface"] = "manual-file-upload-simulation"
        result = self.validate(run)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("product_surface must exactly match", result.stderr)

    def test_wrong_source_revision_is_rejected(self):
        run = valid_run()
        run["source_revision"] = "0" * 40
        result = self.validate(run)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("source_revision must match", result.stderr)

    def test_wrong_artifact_hash_is_rejected(self):
        run = valid_run()
        run["artifact_sha256"] = "0" * 64
        result = self.validate(run)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("artifact_sha256 must match", result.stderr)

    def test_missing_case_assertion_is_rejected(self):
        run = valid_run()
        run["assertions"] = run["assertions"][:-1]
        result = self.validate(run)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("assertion for every planned case", result.stderr)


if __name__ == "__main__":
    unittest.main()
