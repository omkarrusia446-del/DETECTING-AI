# 🛡️ TRUSTSHIELD AI – Real-Time Deepfake Detection & Digital Trust Platform

> **Next-Gen Multi-Modal Deepfake Defense, Explainable AI Forensics, and Cryptographic Digital Trust Ledger.**

Built for cybersecurity analysts, media forensic examiners, and digital trust teams. TRUSTSHIELD AI combines spatial Error Level Analysis (ELA), 2D Fourier (FFT) frequency spectrum inspection, physiological biometric analysis, audio vocoder resynthesis detection, and cryptographic C2PA provenance ledger verification.

---

## ⚡ Key Features

- **🌐 Multi-Modal Support**: Inspect Images (`JPG`, `PNG`, `WebP`), Videos (`MP4`, `WebM`, `MOV`), Audio (`WAV`, `MP3`, `OGG`), Direct Web URLs, and Live Camera/Microphone streams.
- **⚡ 5-Stage Live Scanning Workflow**:
  `1. Uploading & SHA-256 Digest` ➔ `2. Preprocessing & Frame Extraction` ➔ `3. Neural Spectral ConvNet Inference` ➔ `4. Explainable AI Synthesis` ➔ `5. Verifiable Forensic Report`.
- **🎯 Precision Verdicts & Scoring**:
  - **Verdict**: `AUTHENTIC` (Emerald), `SUSPICIOUS` (Amber), or `DEEPFAKE` (Crimson).
  - **Digital Trust Score**: `0 – 100` with animated SVG circular gauge.
  - **Confidence Rating**: e.g., `98.7% Confidence`.
  - **Manipulation Risk Index**: `Low`, `Moderate`, `Elevated`, `Critical`.
- **🧠 Explainable AI (XAI) Diagnostic Breakdown**:
  1. 👤 **Facial & Biometric Inconsistencies**: Corneal specular reflection asymmetry, micro-saccadic eye movement, jawline boundary blending.
  2. 👄 **Lip-Sync & Audio-Visual Desynchronization**: Phoneme-viseme temporal offset, bilabial plosive dissonance.
  3. 🎞️ **Frame & Spatial Anomalies**: Optical flow discontinuity, GAN upsampler checkerboard residuals.
  4. 🎙️ **Audio & Spectral Vocoder Gaps**: Harmonic spectral quantization, synthetic pitch steps, missing respiratory pauses.
  5. 🔍 **Metadata & EXIF Tamper Forensics**: Camera hardware serials, double-compression quantization blocks, C2PA digital signatures.
- **🔬 Visual Spectral Inspector**: Real-time Error Level Analysis (ELA) and 2D FFT Frequency Heatmap canvas renderers.
- **📊 SecOps Threat Intel Dashboard**: Interactive Chart.js visualizations of 24-hour scan volume, deepfake category distribution, active zero-day AI generator signatures (Midjourney, Sora, ElevenLabs, DeepFaceLab, Kling), and live threat feed.
- **📜 Immutable Cryptographic Audit Trail**: Searchable, filterable history log with SHA-256 digests, CSV export, and forensic detail viewer.
- **🔐 Public Ledger & Digital Trust Passports**: Instant verification of SHA-256 hashes and certificate IDs against the tamper-proof ledger.
- **⚡ 1-Click Live Test Sandbox**: Curated pre-loaded samples for instant hackathon evaluation (CEO FaceSwap, C2PA Verified Keynote, ElevenLabs Voice Clone, Midjourney Headshot, Inpainted Incident Photo).

---

## 🚀 Quickstart

### 1. Prerequisites
- Python 3.10+ installed on your system.

### 2. Launch Application
Simply run the root launcher:
```bash
python run_app.py
```
This automatically starts the backend server on `http://127.0.0.1:8000` and opens your default browser.

Or start the server directly:
```bash
python backend/main.py
```

### 3. Run Automated Unit Tests
```bash
python tests/test_api.py
```

---

## 📡 RESTful API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Neural engine status, loaded models, latency |
| `POST` | `/api/analyze` | Multi-modal media upload & forensic scan |
| `POST` | `/api/analyze-sample` | Trigger 1-click test on curated sample |
| `POST` | `/api/analyze-url` | Scrape and analyze remote media URL |
| `GET` | `/api/scans` | Paginated audit history with search and verdict filter |
| `GET` | `/api/scans/{id}` | Detailed forensic telemetry for a specific scan |
| `GET` | `/api/verify/{identifier}` | Cryptographic certificate & SHA-256 hash lookup |
| `GET` | `/api/stats` | SecOps telemetry, 24h metrics, threat signatures |
| `GET` | `/api/samples` | Curated sample library for live testing |
| `GET` | `/api/export/{id}` | Download printable HTML/PDF forensic certificate |
| `POST` | `/api/auth/login` | Session token & user role authentication |

---

## 🏗️ Architecture & Technology Stack

- **Backend**: Python (FastAPI / ASGI with lightweight built-in HTTP server fallback), SQLite (`trustshield.db`), PIL/NumPy image processing (Error Level Analysis, 2D FFT, Laplacian Edge Variance, Noise Residue Heuristics).
- **Frontend**: Cyberpunk/Enterprise Dark UI with Glassmorphism, Google Fonts (*Space Grotesk*, *Inter*, *JetBrains Mono*), Chart.js, Canvas biometric HUD, Web Audio API cyber synthesizer sound FX, responsive CSS grid/flexbox.
- **Compliance & Standards**: NIST AI RMF, ISO/IEC 27001, C2PA Media Provenance Standard.
