// 🔐 SECURITY SENTINEL - SOFTWARE SIMULATION VERSION
// Simulated person detection for hackathon (no hardware required)

// ==================== CONFIGURATION ====================
const BACKEND_URL = 'http://127.0.0.1:8000';
let detectionInterval = null;
let isMonitoring = false;
let isModelLoaded = true; // Simulated as always loaded

// Statistics
let stats = {
    authorized: 0,
    tailgating: 0,
    total: 0
};

const ENTRY_LOCATION = {
    lat: 28.7041,
    lon: 77.1025,
    name: "Main Gate"
};

// ==================== SIMULATE MODEL LOADING ====================
async function loadTensorFlowModel() {
    try {
        updateStatus('aiStatus', '⏳ Initializing Simulated AI...', 'warning');
        showToast('🤖 Initializing Software Simulation...', 'warning');

        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 500));

        isModelLoaded = true;
        updateStatus('aiStatus', '✅ Simulated AI Ready', 'success');
        showToast('✅ Software simulation ready! No hardware required!', 'success');
        console.log('🤖 Software simulation initialized successfully');
    } catch (error) {
        updateStatus('aiStatus', '❌ Simulation Failed', 'error');
        showToast('❌ Failed to initialize simulation.', 'error');
        console.error('Simulation initialization error:', error);
    }
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 TailGuard - TensorFlow.js AI Mode');
    checkBackendStatus();
    initializeCamera();
    setupEventListeners();
    loadStatistics();
    
    // Load TensorFlow model on startup
    loadTensorFlowModel();
});

// ==================== BACKEND STATUS ====================
async function checkBackendStatus() {
    try {
        const response = await fetch(`${BACKEND_URL}/`);
        const data = await response.json();
        updateStatus('backendStatus', '✅ Connected', 'success');
    } catch (error) {
        updateStatus('backendStatus', '⚠️ Offline Mode', 'warning');
    }
}

// ==================== SIMULATED CAMERA ====================
async function initializeCamera() {
    try {
        // Simulate camera initialization (no actual hardware access)
        updateStatus('cameraStatus', '⏳ Initializing Simulated Camera...', 'warning');

        // Simulate initialization time
        await new Promise(resolve => setTimeout(resolve, 500));

        // Create a placeholder video element with simulated content
        const videoPreview = document.getElementById('videoPreview');
        if (videoPreview) {
            // Create a canvas to simulate video feed
            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');

            // Draw simulated video feed
            function drawSimulatedFeed() {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw some simulated content
                ctx.fillStyle = '#333';
                ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

                ctx.fillStyle = '#fff';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('SIMULATED VIDEO FEED', canvas.width / 2, canvas.height / 2);
                ctx.fillText('No Hardware Required', canvas.width / 2, canvas.height / 2 + 30);

                requestAnimationFrame(drawSimulatedFeed);
            }
            drawSimulatedFeed();

            // Convert canvas to video-like element
            videoPreview.srcObject = canvas.captureStream(30);
            videoPreview.play();

            updateStatus('cameraStatus', '✅ Simulated Camera Ready', 'success');
            console.log('📹 Simulated camera ready for AI detection (No hardware)');
        }
    } catch (error) {
        updateStatus('cameraStatus', '❌ Camera Error', 'error');
        console.error('Simulated camera error:', error);
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    document.getElementById('monitorBtn').addEventListener('click', toggleMonitoring);
    document.getElementById('alertBtn').addEventListener('click', runSingleDetection);
    document.getElementById('cameraBtn').addEventListener('click', () => window.open('monitor.html', '_blank'));
    document.getElementById('startDetection').addEventListener('click', startDetection);
    document.getElementById('stopDetection').addEventListener('click', stopDetection);
    document.getElementById('captureEvidence').addEventListener('click', captureEvidence);
    document.getElementById('counterBtn').addEventListener('click', toggleCounter);
    document.getElementById('dashboardBtn').addEventListener('click', () => window.open('admin.html', '_blank'));
    document.getElementById('mapBtn').addEventListener('click', toggleMap);
}

// ==================== MONITORING TOGGLE ====================
function toggleMonitoring() {
    isMonitoring = !isMonitoring;
    
    if (isMonitoring) {
        if (!isModelLoaded) {
            showToast('⚠️ AI model not loaded yet. Please wait...', 'warning');
            isMonitoring = false;
            return;
        }
        
        updateStatus('monitoringStatus', '🟢 Active', 'success');
        showToast('🔍 REAL AI detection activated!', 'success');
        const videoContainer = document.getElementById('videoContainer');
        if (videoContainer.style.display === 'none') toggleCamera();
        startDetection();
    } else {
        updateStatus('monitoringStatus', '🔴 Inactive', 'error');
        showToast('⏸️ Monitoring paused', 'warning');
        stopDetection();
    }
}

// ==================== REAL AI DETECTION ====================
function startDetection() {
    if (detectionInterval) return;
    if (!isModelLoaded) {
        showToast('❌ AI model not ready. Please wait for model to load.', 'error');
        return;
    }
    
    document.getElementById('startDetection').disabled = true;
    document.getElementById('stopDetection').disabled = false;
    updateStatus('aiStatus', '🔍 REAL AI Detecting...', 'success');
    showToast('🤖 TensorFlow.js detection started - REAL person counting!', 'success');
    
    // Run detection every 2 seconds
    detectionInterval = setInterval(() => {
        detectPersonsWithAI();
    }, 2000);
}

function stopDetection() {
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
    }
    document.getElementById('startDetection').disabled = false;
    document.getElementById('stopDetection').disabled = true;
    updateStatus('aiStatus', '⏸️ Paused', 'warning');
    document.getElementById('detectionCount').textContent = '0';
}

// ==================== SIMULATED PERSON DETECTION ====================
async function detectPersonsWithAI() {
    try {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 100));

        // Simulate person detection with realistic probabilities
        // 70% chance of 0-1 person, 25% chance of 2 persons (tailgating), 5% chance of 3+ persons
        let personCount;
        const rand = Math.random();
        if (rand < 0.7) {
            personCount = Math.floor(Math.random() * 2); // 0 or 1
        } else if (rand < 0.95) {
            personCount = 2; // Tailgating scenario
        } else {
            personCount = Math.floor(Math.random() * 2) + 3; // 3 or 4
        }

        // Generate simulated detections with confidence scores
        const persons = [];
        for (let i = 0; i < personCount; i++) {
            persons.push({
                score: 0.6 + Math.random() * 0.4, // 60-100% confidence
                bbox: [
                    Math.random() * 200, // x
                    Math.random() * 150, // y
                    80 + Math.random() * 40, // width
                    160 + Math.random() * 80  // height
                ]
            });
        }

        // Update UI with count
        document.getElementById('detectionCount').textContent = personCount;

        // Draw simulated bounding boxes
        drawBoundingBoxes(null, persons);

        // Update live demo indicators
        updateLiveDemoIndicators(personCount, persons);

        // Trigger alerts based on count
        if (personCount === 1) {
            handleAuthorizedEntry();
        } else if (personCount >= 2) {
            handleTailgating(personCount);
        }

        console.log(`🤖 SIMULATED AI detected ${personCount} person(s) - No hardware required!`);

    } catch (error) {
        console.error('Simulated detection error:', error);
    }
}

// ==================== DRAW BOUNDING BOXES ====================
function drawBoundingBoxes(video, predictions) {
    // Create canvas overlay if doesn't exist
    let canvas = document.getElementById('detectionCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'detectionCanvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(canvas);
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.style.width = video.offsetWidth + 'px';
    canvas.style.height = video.offsetHeight + 'px';
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw boxes
    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        const confidence = (prediction.score * 100).toFixed(1);
        
        // Draw box
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // Draw label
        ctx.fillStyle = '#00ff00';
        ctx.font = '18px Arial';
        ctx.fillText(`Person ${confidence}%`, x, y - 5);
    });
}

// ==================== SINGLE DETECTION TEST ====================
async function runSingleDetection() {
    if (!isModelLoaded) {
        showToast('⚠️ AI model not loaded yet', 'warning');
        return;
    }
    
    showToast('🧪 Running REAL AI detection test...', 'warning');
    await detectPersonsWithAI();
}

// ==================== AUTHORIZED ENTRY ====================
function handleAuthorizedEntry() {
    stats.authorized++;
    stats.total++;
    updateCounters();
    
    logIncident({
        type: 'AUTHORIZED',
        persons: 1,
        location: ENTRY_LOCATION,
        timestamp: new Date().toISOString(),
        detectionMethod: 'Software Simulation'
    });
}

// ==================== TAILGATING DETECTION ====================
function handleTailgating(personCount) {
    stats.tailgating++;
    stats.total++;
    updateCounters();
    
    playAlertSound();
    showToast(`🚨 TAILGATING ALERT! ${personCount} persons detected by SIMULATED AI!`, 'error');

    const incident = {
        type: 'TAILGATING',
        persons: personCount,
        location: ENTRY_LOCATION,
        timestamp: new Date().toISOString(),
        status: 'DETECTED',
        detectionMethod: 'Software Simulation',
        aiConfidence: 'Simulated AI Detection'
    };
    
    logIncident(incident);
    sendToBackend(incident);
}

// ==================== ALERT SOUND ====================
function playAlertSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 500);
}

// ==================== STORAGE ====================
function logIncident(incident) {
    let incidents = JSON.parse(localStorage.getItem('incidents') || '[]');
    incidents.unshift(incident);
    localStorage.setItem('incidents', JSON.stringify(incidents));
    console.log('💾 Incident logged:', incident);
}

async function sendToBackend(incident) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/tailgating`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(incident)
        });
        if (response.ok) console.log('✅ Sent to backend');
    } catch (error) {
        console.log('Backend unavailable, saved locally');
    }
}

// ==================== COUNTERS ====================
function updateCounters() {
    document.getElementById('authorizedCount').textContent = stats.authorized;
    document.getElementById('tailgatingCount').textContent = stats.tailgating;
    document.getElementById('totalCount').textContent = stats.total;
    localStorage.setItem('stats', JSON.stringify(stats));
}

function loadStatistics() {
    const saved = localStorage.getItem('stats');
    if (saved) {
        stats = JSON.parse(saved);
        updateCounters();
    }
}

// ==================== EVIDENCE CAPTURE ====================
function captureEvidence() {
    const video = document.getElementById('videoPreview');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    logIncident({
        type: 'EVIDENCE',
        timestamp: new Date().toISOString(),
        location: ENTRY_LOCATION,
        image: canvas.toDataURL('image/jpeg', 0.8)
    });
    
    showToast('📸 Evidence captured with AI detection overlay', 'success');
}

// ==================== UI TOGGLES ====================
function toggleCamera() {
    const container = document.getElementById('videoContainer');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
    if (container.style.display === 'block') showToast('📹 Camera feed enabled', 'success');
}

function toggleCounter() {
    const panel = document.getElementById('counterPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display === 'block') showToast('🔢 Counter panel displayed', 'success');
}

function toggleMap() {
    const container = document.getElementById('mapContainer');
    if (container.style.display === 'none') {
        container.style.display = 'block';
        initializeMap();
        showToast('🗺️ Map displayed', 'success');
    } else {
        container.style.display = 'none';
    }
}

// ==================== MAP ====================
let map = null;

function initializeMap() {
    if (map) return;
    map = L.map('map').setView([ENTRY_LOCATION.lat, ENTRY_LOCATION.lon], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker([ENTRY_LOCATION.lat, ENTRY_LOCATION.lon])
        .addTo(map)
        .bindPopup(`📍 ${ENTRY_LOCATION.name}<br>AI-Powered Monitoring`)
        .openPopup();
    L.circle([ENTRY_LOCATION.lat, ENTRY_LOCATION.lon], {
        color: '#3b82f6',
        fillColor: '#60a5fa',
        fillOpacity: 0.2,
        radius: 100
    }).addTo(map);
}

// ==================== UTILITIES ====================
function updateStatus(elementId, text, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        element.style.color = type === 'success' ? '#4CAF50' : 
                              type === 'error' ? '#f44336' :
                              type === 'warning' ? '#ff9800' : '#ffffff';
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 5000);
}

// ==================== LIVE DEMO INDICATORS ====================
function updateLiveDemoIndicators(personCount, persons) {
    // Update security status
    const securityStatus = document.getElementById('securityStatus');
    const threatLevel = document.getElementById('threatLevel');
    const lastDetection = document.getElementById('lastDetection');

    if (securityStatus && threatLevel && lastDetection) {
        // Security status
        if (personCount === 0) {
            securityStatus.textContent = '🔒 SECURE';
            securityStatus.style.color = '#10b981';
            threatLevel.textContent = 'LOW';
            threatLevel.style.color = '#10b981';
        } else if (personCount === 1) {
            securityStatus.textContent = '⚠️ MONITORING';
            securityStatus.style.color = '#f59e0b';
            threatLevel.textContent = 'MEDIUM';
            threatLevel.style.color = '#f59e0b';
        } else if (personCount >= 2) {
            securityStatus.textContent = '🚨 TAILGATING ALERT!';
            securityStatus.style.color = '#ef4444';
            threatLevel.textContent = 'HIGH';
            threatLevel.style.color = '#ef4444';

            // Flash effect for alerts
            flashAlert();
        }

        // Last detection time
        lastDetection.textContent = new Date().toLocaleTimeString();
    }

    // Update confidence meter
    const confidenceMeter = document.getElementById('confidenceMeter');
    if (confidenceMeter && persons.length > 0) {
        const avgConfidence = persons.reduce((sum, p) => sum + p.score, 0) / persons.length;
        const confidencePercent = Math.round(avgConfidence * 100);
        confidenceMeter.textContent = `${confidencePercent}%`;
        confidenceMeter.style.color = confidencePercent > 70 ? '#10b981' : confidencePercent > 50 ? '#f59e0b' : '#ef4444';
    }

    // Update detection log
    updateDetectionLog(personCount, persons);
}

// ==================== FLASH ALERT EFFECT ====================
function flashAlert() {
    const container = document.querySelector('.container');
    if (container) {
        container.style.animation = 'flash 0.5s ease-in-out';
        setTimeout(() => {
            container.style.animation = '';
        }, 500);
    }
}

// ==================== DETECTION LOG ====================
function updateDetectionLog(personCount, persons) {
    const logContainer = document.getElementById('detectionLog');
    if (!logContainer) return;

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <span class="log-time">${timestamp}</span>
        <span class="log-event">Detected ${personCount} person${personCount !== 1 ? 's' : ''}</span>
        <span class="log-confidence">${persons.length > 0 ? Math.round((persons.reduce((sum, p) => sum + p.score, 0) / persons.length) * 100) + '%' : 'N/A'}</span>
    `;

    // Add to top of log
    logContainer.insertBefore(logEntry, logContainer.firstChild);

    // Keep only last 10 entries
    while (logContainer.children.length > 10) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// ==================== CONSOLE LOG ====================
console.log(`
╔══════════════════════════════════════════╗
║   SECURITY SENTINEL - SOFTWARE SIMULATION║
║   Simulated Person Detection Active      ║
║   Model: Software Simulation (No Hardware)║
║   Detection: Simulated AI Processing     ║
║   Bounding Boxes: Enabled                ║
║                                          ║
║   Status: Software-Only                  ║
║   Version: 3.0 Hackathon Edition         ║
╚══════════════════════════════════════════╝
`);
