"""
TRUSTSHIELD AI - Curated Hackathon Demo Cases Library
Provides 6 distinct realistic demo cases covering:
- Suspicious Image
- Deepfake Image
- Suspicious Video
- Deepfake Video
- Suspicious Audio
- Deepfake Audio
- Authentic Verified Media
"""

from backend.services import DemoDetectionService

def get_demo_samples():
    """Returns all 6 curated realistic demo cases from DemoDetectionService."""
    cases = DemoDetectionService.get_all_demo_cases()
    # Add authentic verified broadcast benchmark
    cases.append({
        "id": "demo_authentic_broadcast",
        "title": "Quarterly Earnings Broadcast (C2PA Verified)",
        "media_type": "video",
        "category": "Authentic Media",
        "file_name": "quarterly_earnings_authentic_camera_feed.mp4",
        "file_size_formatted": "42.1 MB",
        "preview_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=350&fit=crop",
        "verdict": "AUTHENTIC",
        "trust_score": 97.4,
        "confidence": 99.2,
        "risk_level": "Low",
        "summary": "AUTHENTIC VERIFIED: Valid C2PA hardware sensor certificate from Sony FX6. Corneal specular reflections are symmetrical and speech audio retains natural vocal tract resonance.",
        "indicators": {
            "facial_inconsistencies": {
                "score": 3,
                "status": "Authentic",
                "details": "Physiologically accurate micro-expressions and symmetrical corneal reflections."
            },
            "lip_sync_issues": {
                "score": 2,
                "status": "Authentic",
                "details": "Sub-millisecond audio-visual temporal alignment across all spoken syllables."
            },
            "frame_anomalies": {
                "score": 4,
                "status": "Authentic",
                "details": "Continuous physical camera sensor noise distribution (PRNU)."
            },
            "audio_artifacts": {
                "score": 1,
                "status": "Authentic",
                "details": "Rich vocal tract harmonic frequencies with natural human vocal jitter and breathing pauses."
            },
            "metadata_anomalies": {
                "score": 0,
                "status": "Authentic",
                "details": "Valid C2PA hardware signature from Sony FX6 sensor. Untampered camera provenance."
            }
        },
        "video_timeline": [
            {"time": "00:00.0 - 00:30.0", "anomaly": "Zero biometric or optical flow anomalies across entire clip", "severity": "None"}
        ],
        "audio_spectral": {
            "harmonic_distortion": "Low / Natural (2%)",
            "pitch_quantization": "Natural human pitch inflection",
            "respiration_signatures": "Detected (Continuous natural breathing pattern)",
            "spectral_continuity": "Continuous full-frequency spectrum"
        }
    })
    return cases
