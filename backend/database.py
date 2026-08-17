"""
TRUSTSHIELD AI - Database Layer (SQLite)
Manages scan audit trails, user accounts, and cryptographic trust certificates.
"""

import sqlite3
import json
import os
import hashlib
import time
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "trustshield.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Scans Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scans (
        id TEXT PRIMARY KEY,
        title TEXT,
        media_type TEXT,
        file_name TEXT,
        file_size INTEGER,
        sha256_hash TEXT,
        trust_score REAL,
        confidence REAL,
        risk_level TEXT,
        verdict TEXT,
        summary TEXT,
        indicators_json TEXT,
        metadata_json TEXT,
        ela_heatmap_data TEXT,
        fft_spectrum_data TEXT,
        thumbnail_data TEXT,
        created_at TEXT
    )
    """)

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password_hash TEXT,
        full_name TEXT,
        role TEXT,
        api_key TEXT UNIQUE,
        created_at TEXT
    )
    """)

    # Cryptographic Trust Certificates Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS certificates (
        certificate_id TEXT PRIMARY KEY,
        scan_id TEXT,
        sha256_hash TEXT,
        media_type TEXT,
        file_name TEXT,
        trust_score REAL,
        verdict TEXT,
        issuer TEXT,
        digital_signature TEXT,
        issued_at TEXT,
        is_revoked INTEGER DEFAULT 0,
        FOREIGN KEY(scan_id) REFERENCES scans(id)
    )
    """)

    conn.commit()

    # Seed demo users if empty
    cursor.execute("SELECT COUNT(*) as count FROM users")
    if cursor.fetchone()["count"] == 0:
        seed_users(cursor)
        conn.commit()

    # Seed past audit records if empty
    cursor.execute("SELECT COUNT(*) as count FROM scans")
    if cursor.fetchone()["count"] == 0:
        seed_scans(cursor)
        conn.commit()

    conn.close()

def seed_users(cursor):
    users = [
        ("usr_secops_01", "alex.vance", "alex.vance@defense.cyber.gov", hashlib.sha256(b"shield2026").hexdigest(), "Alex Vance", "SecOps Lead Analyst", "ts_live_k89f0293da829c38e91024", "2026-08-10T09:00:00Z"),
        ("usr_forensic_02", "elena.rostova", "elena.r@reuters-forensics.io", hashlib.sha256(b"forensic99").hexdigest(), "Dr. Elena Rostova", "Senior Media Cryptanalyst", "ts_live_m32d1847af992c47b82195", "2026-08-12T14:30:00Z"),
        ("usr_admin_03", "admin", "admin@trustshield.ai", hashlib.sha256(b"admin123").hexdigest(), "Chief Trust Officer", "Enterprise System Administrator", "ts_live_a99e4481bc772e01f56432", "2026-08-01T00:00:00Z")
    ]
    cursor.executemany("""
    INSERT INTO users (id, username, email, password_hash, full_name, role, api_key, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, users)

def seed_scans(cursor):
    sample_records = [
        {
            "id": "scan_8f92a10e",
            "title": "DeepFaceLab FaceSwap - Press Conference",
            "media_type": "video",
            "file_name": "ceo_press_statement_manipulated.mp4",
            "file_size": 18450230,
            "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "trust_score": 12.4,
            "confidence": 98.7,
            "risk_level": "Critical",
            "verdict": "DEEPFAKE",
            "summary": "High-confidence neural face replacement detected. Severe temporal frame flickering along jawline boundary and unnatural eye blink rate.",
            "indicators_json": json.dumps({
                "facial_inconsistencies": {
                    "score": 94,
                    "status": "High Risk",
                    "details": "Facial landmark warping detected around jawline; bilateral eye reflection asymmetry > 42%."
                },
                "lip_sync_issues": {
                    "score": 88,
                    "status": "High Risk",
                    "details": "Audio-visual phoneme delay offset of 185ms. Viseme geometric distortion in bilabial plosives."
                },
                "frame_anomalies": {
                    "score": 91,
                    "status": "High Risk",
                    "details": "Spatial-temporal optical flow discontinuities found on 47 distinct frames."
                },
                "audio_artifacts": {
                    "score": 32,
                    "status": "Low Risk",
                    "details": "Natural acoustic ambient background preserved, minor vocal compression."
                },
                "metadata_anomalies": {
                    "score": 96,
                    "status": "High Risk",
                    "details": "Stripped EXIF metadata and FFMPEG DeepFaceLab synthetic encoding headers detected."
                }
            }),
            "metadata_json": json.dumps({
                "resolution": "1920x1080",
                "codec": "H.264 / AVC",
                "duration": "14.8s",
                "fps": 30.0,
                "c2pa_present": False,
                "compression_cycles": 3
            }),
            "ela_heatmap_data": "simulated_ela_deepfake",
            "fft_spectrum_data": "simulated_fft_deepfake",
            "thumbnail_data": "",
            "created_at": "2026-08-17T18:42:10Z"
        },
        {
            "id": "scan_4a19b88c",
            "title": "Authentic Executive Keynote Speech",
            "media_type": "video",
            "file_name": "annual_earnings_broadcast_live.mp4",
            "file_size": 42100800,
            "sha256_hash": "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
            "trust_score": 97.2,
            "confidence": 99.1,
            "risk_level": "Low",
            "verdict": "AUTHENTIC",
            "summary": "Cryptographically verified broadcast. Continuous optical flow, natural micro-saccadic eye movement, and valid C2PA camera provenance certificate.",
            "indicators_json": json.dumps({
                "facial_inconsistencies": {
                    "score": 4,
                    "status": "Authentic",
                    "details": "Physiologically accurate micro-expressions and symmetrical corneal specular reflections."
                },
                "lip_sync_issues": {
                    "score": 3,
                    "status": "Authentic",
                    "details": "Sub-millisecond audio-visual temporal alignment across all spoken syllables."
                },
                "frame_anomalies": {
                    "score": 5,
                    "status": "Authentic",
                    "details": "Consistent sensor noise distribution and uniform light transport across full scene."
                },
                "audio_artifacts": {
                    "score": 2,
                    "status": "Authentic",
                    "details": "Natural vocal tract harmonic resonance without phase quantization."
                },
                "metadata_anomalies": {
                    "score": 0,
                    "status": "Authentic",
                    "details": "Valid C2PA hardware signature from Sony FX6 sensor. Untampered camera provenance."
                }
            }),
            "metadata_json": json.dumps({
                "resolution": "3840x2160 (4K)",
                "codec": "ProRes / H.265",
                "duration": "32.4s",
                "fps": 60.0,
                "c2pa_present": True,
                "c2pa_issuer": "Sony Electronics Provenance Root CA",
                "compression_cycles": 1
            }),
            "ela_heatmap_data": "simulated_ela_authentic",
            "fft_spectrum_data": "simulated_fft_authentic",
            "thumbnail_data": "",
            "created_at": "2026-08-17T20:15:30Z"
        },
        {
            "id": "scan_1c37d42f",
            "title": "ElevenLabs Synthetic Voice Clone - Wire Transfer Authorizer",
            "media_type": "audio",
            "file_name": "urgent_cfo_voice_authorization.wav",
            "file_size": 2450120,
            "sha256_hash": "fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9",
            "trust_score": 8.9,
            "confidence": 99.4,
            "risk_level": "Critical",
            "verdict": "DEEPFAKE",
            "summary": "AI synthetic voice cloning detected. Robotic formant frequencies above 4.5kHz, unnatural pitch quantization, and absent lung respiration pauses.",
            "indicators_json": json.dumps({
                "facial_inconsistencies": {
                    "score": 0,
                    "status": "N/A",
                    "details": "Audio-only stream"
                },
                "lip_sync_issues": {
                    "score": 0,
                    "status": "N/A",
                    "details": "Audio-only stream"
                },
                "frame_anomalies": {
                    "score": 0,
                    "status": "N/A",
                    "details": "Audio-only stream"
                },
                "audio_artifacts": {
                    "score": 98,
                    "status": "High Risk",
                    "details": "ElevenLabs neural acoustic vocoder signature detected; step-wise pitch quantization."
                },
                "metadata_anomalies": {
                    "score": 75,
                    "status": "Elevated",
                    "details": "Generic RIFF header structure typical of web-based audio synthesis engines."
                }
            }),
            "metadata_json": json.dumps({
                "sample_rate": "44100 Hz",
                "bitrate": "1411 kbps",
                "channels": "1 (Mono)",
                "duration": "12.2s",
                "vocoder_model": "ElevenLabs Multilingual v2 (Prob: 98.4%)"
            }),
            "ela_heatmap_data": "",
            "fft_spectrum_data": "simulated_fft_audio",
            "thumbnail_data": "",
            "created_at": "2026-08-17T22:04:12Z"
        },
        {
            "id": "scan_77e910aa",
            "title": "Midjourney v6 Photorealistic Profile Photo",
            "media_type": "image",
            "file_name": "board_member_headshot.jpg",
            "file_size": 4120300,
            "sha256_hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
            "trust_score": 18.5,
            "confidence": 96.8,
            "risk_level": "Critical",
            "verdict": "DEEPFAKE",
            "summary": "Diffusion-generated synthetic human face. High-frequency 2D Fourier checkerboard grid patterns and ear cartilage structural asymmetry.",
            "indicators_json": json.dumps({
                "facial_inconsistencies": {
                    "score": 89,
                    "status": "High Risk",
                    "details": "Ear lobe structural deformation, asymmetric pupil iris radial patterns, teeth boundary blending."
                },
                "lip_sync_issues": {
                    "score": 0,
                    "status": "N/A",
                    "details": "Static image"
                },
                "frame_anomalies": {
                    "score": 92,
                    "status": "High Risk",
                    "details": "Diffusion denoising spatial noise residual; non-natural gradient transitions in hair strands."
                },
                "audio_artifacts": {
                    "score": 0,
                    "status": "N/A",
                    "details": "Static image"
                },
                "metadata_anomalies": {
                    "score": 88,
                    "status": "High Risk",
                    "details": "Missing camera EXIF hardware tags, standard WebP to JPEG recompression signature."
                }
            }),
            "metadata_json": json.dumps({
                "resolution": "2048x2048",
                "color_space": "sRGB",
                "format": "JPEG",
                "exif_status": "Stripped",
                "diffusion_markers": "Midjourney v6 Latent Upscale Signature"
            }),
            "ela_heatmap_data": "simulated_ela_midjourney",
            "fft_spectrum_data": "simulated_fft_diffusion",
            "thumbnail_data": "",
            "created_at": "2026-08-17T23:18:45Z"
        },
        {
            "id": "scan_92b45e12",
            "title": "Edited Photo with Localized Object Inpainting",
            "media_type": "image",
            "file_name": "accident_scene_evidence.png",
            "file_size": 6512000,
            "sha256_hash": "4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865",
            "trust_score": 48.0,
            "confidence": 84.5,
            "risk_level": "Moderate",
            "verdict": "SUSPICIOUS",
            "summary": "Localized manipulation detected. Central vehicle area displays anomalous Error Level Analysis (ELA) compression residuals differing from the background.",
            "indicators_json": json.dumps({
                "facial_inconsistencies": {
                    "score": 12,
                    "status": "Low Risk",
                    "details": "No faces in localized manipulation zone."
                },
                "lip_sync_issues": {
                    "score": 0,
                    "status": "N/A",
                    "details": "Static image"
                },
                "frame_anomalies": {
                    "score": 68,
                    "status": "Elevated",
                    "details": "Discontinuity in JPEG DCT 8x8 block grid surrounding license plate."
                },
                "audio_artifacts": {
                    "score": 0,
                    "status": "N/A",
                    "details": "Static image"
                },
                "metadata_anomalies": {
                    "score": 62,
                    "status": "Elevated",
                    "details": "Adobe Photoshop 2025 XMP history tree present with layer rasterization records."
                }
            }),
            "metadata_json": json.dumps({
                "resolution": "2400x1600",
                "color_space": "Display P3",
                "format": "PNG",
                "software_history": "Adobe Photoshop 26.0 (Windows)",
                "layers_detected": 4
            }),
            "ela_heatmap_data": "simulated_ela_inpainting",
            "fft_spectrum_data": "simulated_fft_inpainting",
            "thumbnail_data": "",
            "created_at": "2026-08-18T00:10:05Z"
        }
    ]

    for s in sample_records:
        cursor.execute("""
        INSERT INTO scans (id, title, media_type, file_name, file_size, sha256_hash, trust_score, confidence, risk_level, verdict, summary, indicators_json, metadata_json, ela_heatmap_data, fft_spectrum_data, thumbnail_data, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            s["id"], s["title"], s["media_type"], s["file_name"], s["file_size"],
            s["sha256_hash"], s["trust_score"], s["confidence"], s["risk_level"],
            s["verdict"], s["summary"], s["indicators_json"], s["metadata_json"],
            s["ela_heatmap_data"], s["fft_spectrum_data"], s["thumbnail_data"], s["created_at"]
        ))

        # Create certificate for authentic scan
        if s["verdict"] == "AUTHENTIC":
            cursor.execute("""
            INSERT INTO certificates (certificate_id, scan_id, sha256_hash, media_type, file_name, trust_score, verdict, issuer, digital_signature, issued_at, is_revoked)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                f"CERT-{s['id'].upper()}-TRUST-2026",
                s["id"],
                s["sha256_hash"],
                s["media_type"],
                s["file_name"],
                s["trust_score"],
                s["verdict"],
                "TRUSTSHIELD Cryptographic Provenance Ledger v4.2",
                "0x7f9a2b8e104cde91f038174628d9a401c9b6814720ae891635817cba09e1346f",
                s["created_at"],
                0
            ))
