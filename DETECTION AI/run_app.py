"""
TRUSTSHIELD AI - Application Launcher
Starts the backend detection server and opens the browser interface.
"""

import os
import sys
import webbrowser
import threading
import time

# Add current directory to Python module search path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Ensure UTF-8 console output on Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

from backend.main import FASTAPI_AVAILABLE, run_standalone_server

def open_browser():
    time.sleep(1.2)
    url = "http://127.0.0.1:8000"
    print(f"\n🌐 Opening TRUSTSHIELD AI in your browser at: {url}\n")
    webbrowser.open(url)

def main():
    print("""
===================================================================
    🛡️  TRUSTSHIELD AI – Real-Time Deepfake Detection Platform
===================================================================
  [x] Neural Error Level Analysis (ELA) Engine
  [x] 2D Fourier (FFT) Generative Model Spectrum
  [x] Biometric Facial Landmark & Corneal Reflection Engine
  [x] Explainable AI (XAI) Multi-Vector Diagnostic Matrix
  [x] Cryptographic Provenance Ledger & SHA-256 Passports
===================================================================
    """)

    # Launch browser in a background thread
    threading.Thread(target=open_browser, daemon=True).start()

    if FASTAPI_AVAILABLE:
        import uvicorn
        print("🚀 Launching with FastAPI & Uvicorn ASGI on http://127.0.0.1:8000 ...")
        uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, log_level="info")
    else:
        print("⚡ Launching with High-Performance Python HTTP Server on http://127.0.0.1:8000 ...")
        run_standalone_server(8000)

if __name__ == "__main__":
    main()
