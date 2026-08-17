/**
 * TRUSTSHIELD AI - Core Frontend Logic & Detection Engine
 * Real-Time Deepfake Detection, Explainable AI Forensics, and Digital Trust Ledger
 */

// Application State
const state = {
  currentView: 'home',
  currentScan: null,
  selectedFile: null,
  selectedFileBytes: null,
  selectedMediaType: 'image',
  soundEnabled: true,
  currentUser: {
    username: 'alex.vance',
    name: 'Alex Vance',
    role: 'SecOps Lead Analyst',
    apiKey: 'ts_live_k89f0293da829c38e91024'
  },
  samples: [],
  history: [],
  charts: {
    volume: null,
    category: null
  },
  webcamStream: null,
  audioContext: null,
  mediaRecorder: null,
  audioChunks: []
};

// =========================================================================
// 1. INITIALIZATION & ROUTING
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initSoundEngine();
  loadSamples();
  loadStats();
  loadHistory();
  setupDropzone();
  checkAuth();

  // Handle URL Hash routing if present
  const hash = window.location.hash.replace('#', '');
  if (['home', 'analyze', 'dashboard', 'history', 'verify', 'about'].includes(hash)) {
    switchView(hash);
  }
});

function switchView(viewName) {
  playCyberSound('click');
  state.currentView = viewName;
  window.location.hash = viewName;

  // Toggle active views
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Toggle nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  const targetNav = document.getElementById(`nav-${viewName}`);
  if (targetNav) {
    targetNav.classList.add('active');
  }

  // View specific callbacks
  if (viewName === 'dashboard') {
    setTimeout(renderDashboardCharts, 100);
  } else if (viewName === 'history') {
    loadHistory();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToDemo() {
  playCyberSound('click');
  document.getElementById('demo-sandbox').scrollIntoView({ behavior: 'smooth' });
}

// =========================================================================
// 2. AUDIO & SOUND FX (Web Audio API Synthesizers)
// =========================================================================
function initSoundEngine() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      state.audioContext = new AudioCtx();
    }
  } catch (e) {
    console.warn("Web Audio API not supported on this browser.");
  }
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  const icon = document.getElementById('soundIcon');
  if (state.soundEnabled) {
    icon.className = 'fa-solid fa-volume-high';
    showToast('Sound Effects Enabled', 'success');
    playCyberSound('chime');
  } else {
    icon.className = 'fa-solid fa-volume-xmark';
    showToast('Sound Effects Muted', 'info');
  }
}

function playCyberSound(type) {
  if (!state.soundEnabled || !state.audioContext) return;
  if (state.audioContext.state === 'suspended') {
    state.audioContext.resume();
  }

  try {
    const ctx = state.audioContext;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'scan') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // Ignore audio error
  }
}

// =========================================================================
// 3. SAMPLES & TEST DATA MANAGEMENT
// =========================================================================
async function loadSamples() {
  try {
    const res = await fetch('/api/samples');
    const data = await res.json();
    state.samples = data.samples || [];

    renderHomeSampleCards();
    renderAnalyzeStudioSampleGrid();
  } catch (e) {
    console.error("Failed to load samples:", e);
  }
}

function renderHomeSampleCards() {
  const container = document.getElementById('sampleCardsContainer');
  if (!container) return;

  container.innerHTML = state.samples.map(s => `
    <div class="cyber-card" style="display:flex; flex-direction:column; justify-content:space-between; border-color:${s.verdict === 'DEEPFAKE' ? 'rgba(244,63,94,0.3)' : s.verdict === 'AUTHENTIC' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'};">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span class="brand-badge" style="font-size:0.7rem; color:var(--cyan-core);">${s.category.toUpperCase()}</span>
          <span class="xai-badge ${s.verdict === 'DEEPFAKE' ? 'badge-risk-high' : s.verdict === 'AUTHENTIC' ? 'badge-risk-low' : 'badge-risk-med'}">${s.verdict}</span>
        </div>
        <div style="height:130px; border-radius:6px; overflow:hidden; margin-bottom:12px; border:1px solid rgba(255,255,255,0.08); background:#030712; display:flex; align-items:center; justify-content:center; position:relative;">
          <img src="${s.preview_url}" style="width:100%; height:100%; object-fit:cover;" alt="${s.title}">
          <span style="position:absolute; bottom:6px; right:6px; font-family:var(--font-mono); font-size:0.65rem; background:rgba(0,0,0,0.7); padding:2px 6px; border-radius:3px; color:#fff;">
            ${s.media_type.toUpperCase()}
          </span>
        </div>
        <h3 style="font-size:0.95rem; margin-bottom:6px; color:#fff;">${s.title}</h3>
        <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4; margin-bottom:14px;">${s.summary.substring(0, 115)}...</p>
      </div>
      <button class="cyber-btn cyber-btn-primary cyber-btn-sm" style="width:100%;" onclick="triggerSampleTest('${s.id}')">
        <i class="fa-solid fa-play"></i> 1-Click Benchmark Test
      </button>
    </div>
  `).join('');
}

function renderAnalyzeStudioSampleGrid() {
  const container = document.getElementById('analyzeStudioSampleGrid');
  if (!container) return;

  container.innerHTML = state.samples.map(s => `
    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:12px; border-radius:6px; cursor:pointer;" onclick="triggerSampleTest('${s.id}')">
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <span style="font-weight:bold; font-size:0.85rem; color:#fff;">${s.title}</span>
        <span class="xai-badge ${s.verdict === 'DEEPFAKE' ? 'badge-risk-high' : s.verdict === 'AUTHENTIC' ? 'badge-risk-low' : 'badge-risk-med'}">${s.verdict}</span>
      </div>
      <div style="font-size:0.75rem; color:var(--text-muted);">${s.category} &bull; Expected Trust: ${s.trust_score}/100</div>
    </div>
  `).join('');
}

async function triggerSampleTest(sampleId) {
  playCyberSound('click');
  switchView('analyze');
  
  const sample = state.samples.find(s => s.id === sampleId);
  if (!sample) return;

  // Set preview
  showMediaPreview(sample.preview_url, sample.media_type, sample.file_name);

  // Trigger analysis
  await executeAnalysisApi('/api/analyze-sample', { sample_id: sampleId });
}

// =========================================================================
// 4. ANALYZE STUDIO WORKFLOW & INPUT HANDLING
// =========================================================================
function switchAnalyzeInput(mode) {
  playCyberSound('click');
  document.querySelectorAll('.input-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${mode}`).classList.add('active');

  const panels = ['upload', 'camera', 'mic', 'url', 'samples'];
  panels.forEach(p => {
    const el = document.getElementById(`panel-${p}`);
    if (el) el.style.display = p === mode ? 'block' : 'none';
  });

  if (mode !== 'camera' && state.webcamStream) {
    stopWebcam();
  }
}

function setupDropzone() {
  const dropzone = document.getElementById('fileDropzone');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  });
}

function handleFileSelected(event) {
  const files = event.target.files;
  if (files && files.length > 0) {
    processSelectedFile(files[0]);
  }
}

function processSelectedFile(file) {
  playCyberSound('click');
  state.selectedFile = file;

  let mediaType = 'image';
  if (file.type.startsWith('video/')) {
    mediaType = 'video';
  } else if (file.type.startsWith('audio/')) {
    mediaType = 'audio';
  }

  state.selectedMediaType = mediaType;
  const objectUrl = URL.createObjectURL(file);
  showMediaPreview(objectUrl, mediaType, file.name);
}

function showMediaPreview(src, type, name) {
  const box = document.getElementById('mediaPreviewBox');
  const container = document.getElementById('previewMediaContainer');
  const nameEl = document.getElementById('previewFileName');

  box.style.display = 'block';
  nameEl.textContent = name.toUpperCase();

  if (type === 'video') {
    container.innerHTML = `<video src="${src}" controls class="preview-media-element" style="max-height:300px; width:100%;"></video>`;
  } else if (type === 'audio') {
    container.innerHTML = `
      <div style="padding:20px; background:#040711; border-radius:6px; margin-bottom:10px;">
        <i class="fa-solid fa-waveform-lines fa-3x" style="color:var(--cyan-core); margin-bottom:12px;"></i>
        <audio src="${src}" controls style="width:100%;"></audio>
      </div>
    `;
  } else {
    container.innerHTML = `<img src="${src}" class="preview-media-element" alt="Media Preview">`;
  }

  showToast(`Loaded ${type.toUpperCase()}: ${name}`, 'info');
}

function clearSelectedFile() {
  playCyberSound('click');
  state.selectedFile = null;
  state.selectedFileBytes = null;
  document.getElementById('mediaPreviewBox').style.display = 'none';
  document.getElementById('fileInput').value = '';
}

// =========================================================================
// 5. LIVE WEBCAM & MICROPHONE INTEGRATION
// =========================================================================
async function startWebcam() {
  playCyberSound('scan');
  const video = document.getElementById('webcamVideo');
  const prompt = document.getElementById('cameraStatusPrompt');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    state.webcamStream = stream;
    video.srcObject = stream;
    prompt.style.display = 'none';
    showToast('Biometric Camera Stream Live', 'success');
  } catch (err) {
    showToast('Webcam access error: ' + err.message, 'danger');
  }
}

function stopWebcam() {
  if (state.webcamStream) {
    state.webcamStream.getTracks().forEach(track => track.stop());
    state.webcamStream = null;
    const video = document.getElementById('webcamVideo');
    if (video) video.srcObject = null;
    document.getElementById('cameraStatusPrompt').style.display = 'block';
  }
}

function captureWebcamFrame() {
  playCyberSound('click');
  const video = document.getElementById('webcamVideo');
  if (!state.webcamStream || !video.videoWidth) {
    showToast('Please start webcam first', 'danger');
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  showMediaPreview(dataUrl, 'image', 'live_webcam_frame.jpg');

  // Submit base64 analysis
  const formData = new FormData();
  formData.append('base64_data', dataUrl);
  formData.append('media_type', 'image');
  formData.append('file_name', 'live_webcam_face_capture.jpg');
  formData.append('title', 'Live Biometric Facial Scan');

  executeAnalysisFormData(formData);
}

// Microphone recording
let isRecordingMic = false;
async function toggleMicrophoneRecording() {
  const btn = document.getElementById('recordMicBtn');
  const status = document.getElementById('micStatusText');

  if (!isRecordingMic) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.mediaRecorder = new MediaRecorder(stream);
      state.audioChunks = [];

      state.mediaRecorder.ondataavailable = e => state.audioChunks.push(e.data);
      state.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(state.audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        showMediaPreview(audioUrl, 'audio', 'live_voice_sample.wav');

        const formData = new FormData();
        formData.append('file', audioBlob, 'live_microphone_recording.wav');
        formData.append('media_type', 'audio');
        formData.append('title', 'Live Vocal Audio Inspection');

        executeAnalysisFormData(formData);
      };

      state.mediaRecorder.start();
      isRecordingMic = true;
      btn.innerHTML = `<i class="fa-solid fa-stop"></i> Stop & Scan Recording`;
      status.textContent = "Recording active... Speak clearly into the microphone.";
      status.style.color = "var(--deepfake-crimson)";
      playCyberSound('scan');

      // Auto-stop after 5 seconds
      setTimeout(() => {
        if (isRecordingMic) toggleMicrophoneRecording();
      }, 5000);

    } catch (e) {
      showToast('Microphone access denied: ' + e.message, 'danger');
    }
  } else {
    state.mediaRecorder.stop();
    isRecordingMic = false;
    btn.innerHTML = `<i class="fa-solid fa-circle-dot"></i> Start 5s Audio Record`;
    status.textContent = "Processing audio stream...";
    status.style.color = "var(--cyan-core)";
  }
}

// Remote URL Analysis
async function submitRemoteUrl() {
  playCyberSound('click');
  const url = document.getElementById('remoteUrlInput').value.trim();
  if (!url) {
    showToast('Please enter a valid URL', 'danger');
    return;
  }

  showMediaPreview(url, 'image', 'remote_asset.jpg');
  await executeAnalysisApi('/api/analyze-url', { url: url, media_type: 'image' });
}

// =========================================================================
// 6. MULTI-STAGE ANALYSIS WORKFLOW & EXPLAINABLE AI RENDERING
// =========================================================================
async function startAnalysisWorkflow() {
  if (!state.selectedFile) {
    showToast('Please select or upload a media file first', 'danger');
    return;
  }

  const formData = new FormData();
  formData.append('file', state.selectedFile);
  formData.append('media_type', state.selectedMediaType);
  formData.append('title', `Manual Upload: ${state.selectedFile.name}`);

  await executeAnalysisFormData(formData);
}

async function executeAnalysisApi(endpoint, jsonBody) {
  await runProgressAnimation();
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonBody)
    });
    const result = await res.json();
    renderForensicResults(result);
  } catch (e) {
    showToast('Scan execution failed: ' + e.message, 'danger');
  }
}

async function executeAnalysisFormData(formData) {
  await runProgressAnimation();
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    renderForensicResults(result);
  } catch (e) {
    showToast('Scan execution failed: ' + e.message, 'danger');
  }
}

async function runProgressAnimation() {
  playCyberSound('scan');
  const wrapper = document.getElementById('workflowProgressWrapper');
  const bar = document.getElementById('workflowProgressBar');
  const status = document.getElementById('workflowStatusText');
  const percent = document.getElementById('workflowPercent');

  wrapper.style.display = 'block';
  
  const stages = [
    { step: 1, text: "UPLOADING FILE & COMPUTING SHA-256...", pct: 20 },
    { step: 2, text: "PREPROCESSING & SPATIAL DECONSTRUCTION...", pct: 45 },
    { step: 3, text: "NEURAL SPECTRAL CONVNET INFERENCE...", pct: 70 },
    { step: 4, text: "SYNTHESIZING EXPLAINABLE AI INDICATORS...", pct: 90 },
    { step: 5, text: "FORENSIC RESULTS SYNTHESIS COMPLETE", pct: 100 }
  ];

  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];
    status.textContent = s.text;
    percent.textContent = `${s.pct}%`;
    bar.style.width = `${s.pct}%`;

    // Highlight step
    document.querySelectorAll('.stage-step').forEach((st, idx) => {
      if (idx < s.step) {
        st.className = 'stage-step completed';
      } else if (idx === s.step - 1) {
        st.className = 'stage-step active';
      } else {
        st.className = 'stage-step';
      }
    });

    await new Promise(r => setTimeout(r, 220));
  }

  setTimeout(() => {
    wrapper.style.display = 'none';
  }, 1000);
}

function renderForensicResults(data) {
  state.currentScan = data;

  // Sound feedback based on verdict
  if (data.verdict === 'DEEPFAKE') {
    playCyberSound('alert');
  } else {
    playCyberSound('chime');
  }

  // Detection Mode Badge
  const modeBadge = document.getElementById('detectionModeBadge');
  if (modeBadge) {
    if (data.detection_mode === 'REAL_HEURISTIC_ML') {
      modeBadge.className = 'detection-mode-pill mode-real';
      modeBadge.innerHTML = '<i class="fa-solid fa-microchip"></i> LIVE HEURISTIC ML SCANNER';
    } else {
      modeBadge.className = 'detection-mode-pill mode-demo';
      modeBadge.innerHTML = '<i class="fa-solid fa-flask-vial"></i> DEMO BENCHMARK SUITE';
    }
  }

  // Header and Verification ID
  const verifyId = data.verification_id || `TS-VERIFY-${data.id.substring(data.id.length - 8).toUpperCase()}`;
  document.getElementById('resultScanId').textContent = `VERIFY ID: ${verifyId}`;
  
  const banner = document.getElementById('verdictBanner');
  banner.className = `verdict-banner ${data.verdict}`;

  const verdictText = document.getElementById('verdictText');
  verdictText.className = `verdict-tag ${data.verdict}`;
  verdictText.textContent = data.verdict;

  document.getElementById('confidenceText').textContent = `${data.confidence}%`;

  // Trust Score Gauge
  const trustScore = data.trust_score;
  document.getElementById('trustScoreVal').innerHTML = `${trustScore}<span style="font-size:0.6rem; color:var(--text-muted);">/100</span>`;
  
  const gaugeCircle = document.getElementById('trustGaugeCircle');
  gaugeCircle.setAttribute('stroke-dasharray', `${trustScore}, 100`);

  let gaugeColor = '#f43f5e';
  let trustVerdict = 'Low Trust (Synthetic Deepfake)';
  let riskColor = 'var(--deepfake-crimson)';

  if (trustScore >= 75) {
    gaugeColor = '#10b981';
    trustVerdict = 'High Trust (Verified Authentic)';
    riskColor = 'var(--authentic-emerald)';
  } else if (trustScore >= 40) {
    gaugeColor = '#f59e0b';
    trustVerdict = 'Moderate Trust (Suspicious Anomalies)';
    riskColor = 'var(--suspicious-amber)';
  }

  gaugeCircle.setAttribute('stroke', gaugeColor);
  document.getElementById('trustScoreVerdict').textContent = trustVerdict;
  
  const riskText = document.getElementById('manipulationRiskText');
  riskText.textContent = `${data.risk_level.toUpperCase()} RISK`;
  riskText.style.color = riskColor;

  document.getElementById('resultSummary').textContent = data.summary;

  // Render Explainable AI (XAI) Indicators Breakdown
  renderXaiIndicators(data.indicators);

  // Render Video Timeline if available
  renderVideoTimeline(data.video_timeline, data.media_type);

  // Render Audio Spectral Diagnostics if available
  renderAudioSpectral(data.audio_spectral, data.media_type);

  // Render Visual Spectral Heatmaps
  renderVisualHeatmaps(data);

  showToast(`Forensic scan complete: ${data.verdict} (${trustScore}/100)`, data.verdict === 'AUTHENTIC' ? 'success' : 'danger');

  // Refresh history and stats in background
  loadHistory();
  loadStats();
}

function renderVideoTimeline(timeline, mediaType) {
  const container = document.getElementById('videoTimelineContainer');
  const list = document.getElementById('videoTimelineList');
  if (!container || !list) return;

  if (mediaType === 'video' && timeline && timeline.length > 0) {
    container.style.display = 'block';
    list.innerHTML = timeline.map(item => {
      let sevBadge = 'badge-risk-low';
      if (item.severity === 'Critical' || item.severity === 'High') {
        sevBadge = 'badge-risk-high';
      } else if (item.severity === 'Medium') {
        sevBadge = 'badge-risk-med';
      }
      return `
        <div class="timeline-item-pill" onclick="highlightTimelinePoint('${item.time}')">
          <span class="timeline-timestamp"><i class="fa-solid fa-play"></i> ${item.time}</span>
          <span class="timeline-anomaly-text">${item.anomaly}</span>
          <span class="xai-badge ${sevBadge}">${item.severity}</span>
        </div>
      `;
    }).join('');
  } else {
    container.style.display = 'none';
  }
}

function highlightTimelinePoint(timeStr) {
  playCyberSound('click');
  showToast(`Jumped to timestamp: ${timeStr}`, 'info');
}

function renderAudioSpectral(spectral, mediaType) {
  const container = document.getElementById('audioSpectralContainer');
  const grid = document.getElementById('audioSpectralGrid');
  if (!container || !grid) return;

  if (mediaType === 'audio' && spectral && Object.keys(spectral).length > 0) {
    container.style.display = 'block';
    grid.innerHTML = Object.entries(spectral).map(([key, val]) => `
      <div class="spectral-metric-box">
        <div class="spectral-metric-label">${key.replace(/_/g, ' ')}</div>
        <div class="spectral-metric-val" style="color:${val.includes('Critical') || val.includes('ABSENT') ? '#f43f5e' : val.includes('Normal') || val.includes('Detected') ? '#10b981' : '#38bdf8'};">${val}</div>
      </div>
    `).join('');
  } else {
    container.style.display = 'none';
  }
}

function copyCurrentVerificationId() {
  if (!state.currentScan) return;
  const verifyId = state.currentScan.verification_id || `TS-VERIFY-${state.currentScan.id.substring(state.currentScan.id.length - 8).toUpperCase()}`;
  navigator.clipboard.writeText(verifyId);
  showToast(`Verification ID copied: ${verifyId}`, 'success');
  playCyberSound('chime');
}

function renderXaiIndicators(indicators) {
  const container = document.getElementById('xaiIndicatorsContainer');
  if (!container || !indicators) return;

  const keyMap = [
    { key: 'facial_inconsistencies', label: 'Facial & Biometric Inconsistencies', icon: 'fa-user-astronaut' },
    { key: 'lip_sync_issues', label: 'Lip-Sync & Audio-Visual Sync', icon: 'fa-lips' },
    { key: 'frame_anomalies', label: 'Frame & Optical Flow Anomalies', icon: 'fa-film' },
    { key: 'audio_artifacts', label: 'Audio & Spectral Vocoder Gaps', icon: 'fa-wave-square' },
    { key: 'metadata_anomalies', label: 'Metadata & EXIF Tamper Traces', icon: 'fa-file-shield' }
  ];

  container.innerHTML = keyMap.map(item => {
    const ind = indicators[item.key] || { score: 0, status: 'N/A', details: 'Not evaluated.' };
    
    let badgeClass = 'badge-risk-low';
    let barColor = '#10b981';
    if (ind.score > 70) {
      badgeClass = 'badge-risk-high';
      barColor = '#f43f5e';
    } else if (ind.score > 30) {
      badgeClass = 'badge-risk-med';
      barColor = '#f59e0b';
    }

    return `
      <div class="xai-indicator-row">
        <div class="xai-header">
          <span class="xai-name">
            <i class="fa-solid ${item.icon}" style="color:var(--cyan-core);"></i>
            ${item.label}
          </span>
          <span class="xai-badge ${badgeClass}">${ind.status} (${ind.score}%)</span>
        </div>
        <div class="xai-progress-track">
          <div class="xai-progress-bar" style="width:${ind.score}%; background:${barColor};"></div>
        </div>
        <div class="xai-desc">${ind.details}</div>
      </div>
    `;
  }).join('');
}

function renderVisualHeatmaps(data) {
  const imgEl = document.getElementById('heatmapImageElement');
  if (data.ela_heatmap_data) {
    imgEl.src = data.ela_heatmap_data;
  } else if (data.fft_spectrum_data) {
    imgEl.src = data.fft_spectrum_data;
  }
}

function switchForensicTab(tab) {
  playCyberSound('click');
  document.getElementById('btnTabEla').classList.toggle('active', tab === 'ela');
  document.getElementById('btnTabFft').classList.toggle('active', tab === 'fft');

  const imgEl = document.getElementById('heatmapImageElement');
  if (!state.currentScan) return;

  if (tab === 'ela' && state.currentScan.ela_heatmap_data) {
    imgEl.src = state.currentScan.ela_heatmap_data;
  } else if (tab === 'fft' && state.currentScan.fft_spectrum_data) {
    imgEl.src = state.currentScan.fft_spectrum_data;
  }
}

function exportCurrentCertificate() {
  if (!state.currentScan) {
    showToast('No active scan to export', 'danger');
    return;
  }
  playCyberSound('click');
  window.open(`/api/export/${state.currentScan.id}`, '_blank');
}

function copyCurrentSha() {
  if (!state.currentScan) return;
  navigator.clipboard.writeText(state.currentScan.sha256_hash);
  showToast('SHA-256 Hash copied to clipboard!', 'success');
  playCyberSound('chime');
}

function verifyCurrentInLedger() {
  if (!state.currentScan) return;
  switchView('verify');
  document.getElementById('verifyLookupInput').value = state.currentScan.sha256_hash;
  lookupCertificate();
}

// =========================================================================
// 7. DASHBOARD & THREAT INTEL TELEMETRY
// =========================================================================
async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();

    document.getElementById('kpi-total-scans').textContent = Number(data.total_scans).toLocaleString();
    document.getElementById('kpi-deepfakes').textContent = Number(data.deepfakes_flagged).toLocaleString();
    document.getElementById('kpi-latency').textContent = `${data.avg_latency_ms}ms`;

    // Render threat ticker feed
    const threatFeed = document.getElementById('threatFeedList');
    if (threatFeed && data.threat_intel_feed) {
      threatFeed.innerHTML = data.threat_intel_feed.map(t => `
        <li class="threat-feed-item">
          <div>
            <div style="font-weight:600; font-size:0.85rem; color:#fff;">${t.threat}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${t.time} &bull; Vector Intercept</div>
          </div>
          <span class="xai-badge ${t.risk === 'Critical' ? 'badge-risk-high' : t.risk === 'Moderate' ? 'badge-risk-med' : 'badge-risk-low'}">${t.risk}</span>
        </li>
      `).join('');
    }
  } catch (e) {
    console.error("Failed to load telemetry stats:", e);
  }
}

function renderDashboardCharts() {
  const volumeCtx = document.getElementById('scanVolumeChart');
  const categoryCtx = document.getElementById('threatCategoryChart');

  if (volumeCtx) {
    if (state.charts.volume) state.charts.volume.destroy();
    state.charts.volume = new Chart(volumeCtx, {
      type: 'line',
      data: {
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        datasets: [
          {
            label: 'Total Scanned Media',
            data: [120, 95, 80, 240, 480, 520, 390, 290],
            borderColor: '#00f0ff',
            backgroundColor: 'rgba(0, 240, 255, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Deepfakes Flagged',
            data: [35, 22, 18, 78, 142, 160, 110, 85],
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Space Grotesk' } } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }
        }
      }
    });
  }

  if (categoryCtx) {
    if (state.charts.category) state.charts.category.destroy();
    state.charts.category = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: ['Face Swap', 'Voice Clone', 'Diffusion GAN', 'Lip Sync', 'Metadata Tamper'],
        datasets: [{
          data: [38.5, 27.2, 21.4, 9.1, 3.8],
          backgroundColor: ['#f43f5e', '#00f0ff', '#38bdf8', '#f59e0b', '#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Space Grotesk', size: 11 } } }
        }
      }
    });
  }
}

// =========================================================================
// 8. AUDIT HISTORY & SEARCH FILTER
// =========================================================================
async function loadHistory() {
  try {
    const res = await fetch('/api/scans');
    const data = await res.json();
    state.history = data.scans || [];
    filterHistory();
  } catch (e) {
    console.error("Failed to load scan history:", e);
  }
}

function filterHistory() {
  const search = document.getElementById('historySearchInput')?.value.toLowerCase() || '';
  const verdict = document.getElementById('historyVerdictFilter')?.value || 'ALL';
  const type = document.getElementById('historyTypeFilter')?.value || 'ALL';

  const filtered = state.history.filter(item => {
    const matchesSearch = !search || 
      item.title.toLowerCase().includes(search) || 
      item.file_name.toLowerCase().includes(search) || 
      item.sha256_hash.toLowerCase().includes(search);

    const matchesVerdict = verdict === 'ALL' || item.verdict === verdict;
    const matchesType = type === 'ALL' || item.media_type === type;

    return matchesSearch && matchesVerdict && matchesType;
  });

  const tbody = document.getElementById('historyTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">No matching audit records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>
        <div style="font-weight:600; color:#fff;">${s.title}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${s.file_name}</div>
      </td>
      <td><span class="brand-badge" style="font-size:0.65rem;">${s.media_type.toUpperCase()}</span></td>
      <td>
        <span class="xai-badge ${s.verdict === 'DEEPFAKE' ? 'badge-risk-high' : s.verdict === 'AUTHENTIC' ? 'badge-risk-low' : 'badge-risk-med'}">
          ${s.verdict}
        </span>
      </td>
      <td>
        <strong style="color:${s.trust_score > 70 ? '#10b981' : s.trust_score < 30 ? '#f43f5e' : '#f59e0b'};">
          ${s.trust_score}
        </strong>/100
      </td>
      <td>${s.confidence}%</td>
      <td class="mono" style="font-size:0.75rem;" title="${s.sha256_hash}">${s.sha256_hash.substring(0, 12)}...</td>
      <td style="font-size:0.8rem;">${s.created_at.split('T')[0]}</td>
      <td>
        <button class="cyber-btn cyber-btn-icon cyber-btn-sm" onclick="inspectHistoryItem('${s.id}')" title="Inspect Forensic Details">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function inspectHistoryItem(scanId) {
  const scan = state.history.find(s => s.id === scanId);
  if (scan) {
    switchView('analyze');
    renderForensicResults(scan);
  }
}

function exportHistoryCsv() {
  playCyberSound('chime');
  let csv = "ID,Title,File Name,Media Type,Verdict,Trust Score,Confidence,SHA-256,Created At\n";
  state.history.forEach(s => {
    csv += `"${s.id}","${s.title}","${s.file_name}","${s.media_type}","${s.verdict}",${s.trust_score},${s.confidence},"${s.sha256_hash}","${s.created_at}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trustshield_audit_logs_${Date.now()}.csv`;
  a.click();
  showToast('Audit Log CSV exported successfully!', 'success');
}

// =========================================================================
// 9. PUBLIC CRYPTOGRAPHIC LEDGER (VERIFY VIEW)
// =========================================================================
async function lookupCertificate() {
  playCyberSound('click');
  const input = document.getElementById('verifyLookupInput').value.trim();
  if (!input) {
    showToast('Please enter a Certificate ID or SHA-256 hash', 'danger');
    return;
  }

  try {
    const res = await fetch(`/api/verify/${encodeURIComponent(input)}`);
    const data = await res.json();
    const container = document.getElementById('certificatePassportContainer');

    if (!data.verified) {
      showToast('Hash not found in immutable ledger.', 'danger');
      playCyberSound('alert');
      container.style.display = 'none';
      return;
    }

    playCyberSound('chime');
    container.style.display = 'block';

    document.getElementById('certBadge').textContent = data.verdict;
    document.getElementById('certBadge').className = `xai-badge ${data.verdict === 'DEEPFAKE' ? 'badge-risk-high' : 'badge-risk-low'}`;
    
    document.getElementById('certIssuedAt').textContent = `ISSUED: ${data.issued_at || data.created_at || '2026-08-17'}`;
    document.getElementById('certIdText').textContent = data.certificate_id || `CERT-${data.scan_id.toUpperCase()}`;
    document.getElementById('certScoreText').textContent = `${data.trust_score} / 100`;
    document.getElementById('certShaText').textContent = data.sha256_hash;
    document.getElementById('certSignatureText').textContent = data.digital_signature || `0x${data.sha256_hash.substring(0, 48)}`;

    showToast('Cryptographic provenance passport verified!', 'success');
  } catch (e) {
    showToast('Verification query failed: ' + e.message, 'danger');
  }
}

// =========================================================================
// 10. AUTH MODAL & DEMO LOGIN
// =========================================================================
function openAuthModal() {
  playCyberSound('click');
  document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
}

function loginAsDemo(username, role) {
  playCyberSound('chime');
  state.currentUser = {
    username: username,
    name: username.replace('.', ' ').toUpperCase(),
    role: role,
    apiKey: `ts_live_${Math.random().toString(36).substring(2, 18)}`
  };
  localStorage.setItem('trustshield_user', JSON.stringify(state.currentUser));
  updateAuthUi();
  closeAuthModal();
  showToast(`Signed in as Demo User: ${state.currentUser.name} (${role})`, 'success');
}

function handleManualLogin() {
  const u = document.getElementById('loginUsername').value.trim();
  if (!u) {
    showToast('Please enter a username', 'danger');
    return;
  }
  loginAsDemo(u, 'SecOps Forensic Examiner');
}

function checkAuth() {
  const saved = localStorage.getItem('trustshield_user');
  if (saved) {
    state.currentUser = JSON.parse(saved);
  }
  updateAuthUi();
}

function updateAuthUi() {
  const btnText = document.getElementById('authButtonText');
  if (btnText && state.currentUser) {
    btnText.textContent = state.currentUser.name;
  }
}

// =========================================================================
// 11. TOAST NOTIFICATION UTILITY
// =========================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = 'fa-circle-info';
  let borderCol = 'var(--border-active)';
  if (type === 'success') {
    icon = 'fa-circle-check';
    borderCol = '#10b981';
  } else if (type === 'danger') {
    icon = 'fa-triangle-exclamation';
    borderCol = '#f43f5e';
  }

  toast.style.borderColor = borderCol;
  toast.innerHTML = `
    <i class="fa-solid ${icon}" style="color:${borderCol};"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
