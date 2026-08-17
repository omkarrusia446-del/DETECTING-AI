"""
TRUSTSHIELD AI - Automated Verification Test Suite
Tests all 6 demo cases, RealDetectionService, and verification ledger.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import init_db, get_db_connection
from backend.services import DetectionService, DemoDetectionService, RealDetectionService
from backend.samples import get_demo_samples

class TestTrustShieldUpgrade(unittest.TestCase):

    def setUp(self):
        init_db()

    def test_all_6_demo_cases(self):
        demo_cases = [
            "demo_suspicious_image",
            "demo_deepfake_image",
            "demo_suspicious_video",
            "demo_deepfake_video",
            "demo_suspicious_audio",
            "demo_deepfake_audio"
        ]
        for demo_id in demo_cases:
            result = DetectionService.analyze_demo(demo_id)
            self.assertIsNotNone(result, f"Failed on {demo_id}")
            self.assertIn("id", result)
            self.assertIn("verification_id", result)
            self.assertIn("verdict", result)
            self.assertIn("trust_score", result)
            self.assertIn("indicators", result)
            self.assertEqual(result["detection_mode"], "DEMO_BENCHMARK")

            # Check indicators
            for ind_key in ["facial_inconsistencies", "lip_sync_issues", "frame_anomalies", "audio_artifacts", "metadata_anomalies"]:
                self.assertIn(ind_key, result["indicators"])

            # Video timeline check
            if result["media_type"] == "video":
                self.assertTrue("video_timeline" in result)

            # Audio spectral check
            if result["media_type"] == "audio":
                self.assertTrue("audio_spectral" in result)

    def test_real_heuristic_upload(self):
        test_bytes = b"real_heuristic_live_upload_test_stream_2026"
        result = DetectionService.analyze_upload(test_bytes, "test_upload.jpg", "image")
        self.assertEqual(result["detection_mode"], "REAL_HEURISTIC_ML")
        self.assertIn("verification_id", result)
        self.assertIn("verdict", result)

    def test_verification_ledger_persistence(self):
        result = DetectionService.analyze_demo("demo_deepfake_video")
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM scans WHERE id = ?", (result["id"],))
        row = cursor.fetchone()
        conn.close()
        self.assertIsNotNone(row)

if __name__ == "__main__":
    unittest.main()
