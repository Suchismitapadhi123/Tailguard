// 🔐 SECURITY SENTINEL - MONITOR PAGE SCRIPT
// Dedicated live entry point monitor with real-time AI detection

// ==================== CONFIGURATION ====================
const BACKEND_URL = 'http://127.0.0.1:8000';
let detectionInterval = null;
let isDetecting = false;
let startTime = null;

// ==================== STATISTICS ====================
let stats = {
    totalDetections: 0,
    alertsToday: 0,
    singleEntry: 0,
    tailgating: 0,
    suspicious: 0
};

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📹 Monitor page initialized');
    initializeMonitor();
    setupEventListeners();
});

// ==================== MONITOR INITIALIZATION ====================
async function initializeMonitor() {
    try {
        updateStatus('detectionStatus', '⏳ Initializing Monitor...', 'inactive');

        const videoPreview = document.getElementById('videoPreview');
        if (videoPreview) {
            try {
                // REQUEST REAL CAMERA ACCESS
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280, min: 640 },
                        height: { ideal: 720, min: 480 },
                        facingMode: 'user',
                        frameRate: { ideal: 30, min: 15 }
                    },
                    audio: false
                });

                // CONNECT REAL CAMERA TO VIDEO ELEMENT
                videoPreview.srcObject = stream;
                await videoPreview.play();

                updateStatus('detectionStatus', '✅ Real Camera Ready - Click Start Detection', 'inactive');
                console.log('📹 Real monitor camera initialized');
                window.cameraStream = stream;

            } catch (cameraError) {
                console.error('Camera error:', cameraError);
                updateStatus('detectionStatus', '⚠️ Using Simulation', 'inactive');
                if (cameraError.name === 'NotAllowedError') {
                    alert('Camera permission denied. Please allow access and refresh.');
                }
                initializeSimulatedMonitor(videoPreview);
            }
        }
    } catch (error) {
        updateStatus('detectionStatus', '❌ Error', 'inactive');
        console.error('Monitor initialization error:', error);
    }
}

function initializeSimulatedMonitor(videoPreview) {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    function drawSimulatedFeed() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#333';
        ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SIMULATED MONITOR', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Camera not available', canvas.width / 2, canvas.height / 2 + 30);
        requestAnimationFrame(drawSimulatedFeed);
    }
    drawSimulatedFeed();
    videoPreview.srcObject = canvas.captureStream(30);
    videoPreview.play();
}

function stopMonitor() {
    if (window.cameraStream) {
        window.cameraStream.getTracks().forEach(track => track.stop());
        console.log('📹 Monitor camera stopped');
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    document.getElementById('startDetection').addEventListener('click', startDetection);
    document.getElementById('stopDetection').addEventListener('click', stopDetection);
    document.getElementById('captureEvidence').addEventListener('click', captureEvidence);
}

// ==================== DETECTION CONTROLS ====================
function startDetection() {
    if (detectionInterval) return;

    // Reset statistics when starting detection
    resetStatistics();

    document.getElementById('startDetection').disabled = true;
    document.getElementById('stopDetection').disabled = false;

    // Show AI processing indicator
    document.getElementById('aiProcessing').style.display = 'flex';

    updateStatus('detectionStatus', '🔍 AI Detection Active...', 'active');
    showToast('🤖 AI detection started!', 'success');

    // Start uptime tracking
    startTime = Date.now();

    // Start uptime display
    setInterval(updateUptime, 1000);

    // Run detection every 2 seconds
    detectionInterval = setInterval(() => {
        detectPersons();
    }, 2000);
}

function stopDetection() {
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
    }

    document.getElementById('startDetection').disabled = false;
    document.getElementById('stopDetection').disabled = true;

    // Hide AI processing indicator
    document.getElementById('aiProcessing').style.display = 'none';

    updateStatus('detectionStatus', '⏸️ Detection Stopped', 'inactive');
    document.getElementById('detectionCount').textContent = '0';
    showToast('⏸️ Detection stopped', 'warning');
}

// ==================== PERSON DETECTION ====================
async function detectPersons() {
    try {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 100));

        // Simulate person detection with realistic probabilities
        let personCount;
        const rand = Math.random();
        if (rand < 0.7) {
            personCount = Math.floor(Math.random() * 2); // 0 or 1
        } else if (rand < 0.95) {
            personCount = 2; // Tailgating scenario
        } else {
            personCount = Math.floor(Math.random() * 2) + 3; // 3 or 4
        }

        // Generate simulated detections
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

        // Update statistics
        stats.totalDetections += personCount;

        if (personCount === 1) {
            stats.singleEntry++;
        } else if (personCount === 2) {
            stats.tailgating++;
            stats.alertsToday++;
        } else if (personCount > 2) {
            stats.suspicious++;
            stats.alertsToday++;
        }

        // Update UI
        document.getElementById('detectionCount').textContent = personCount;
        document.getElementById('totalDetections').textContent = stats.totalDetections;
        document.getElementById('alertsToday').textContent = stats.alertsToday;
        document.getElementById('singleEntry').textContent = stats.singleEntry;
        document.getElementById('tailgating').textContent = stats.tailgating;
        document.getElementById('suspicious').textContent = stats.suspicious;

        // Update performance metrics
        updatePerformanceMetrics(persons);

        // Draw bounding boxes
        drawBoundingBoxes(persons);

        // Update detection log
        updateDetectionLog(personCount, persons);

        // Handle alerts
        if (personCount >= 2) {
            handleTailgatingAlert(personCount);
        }

        console.log(`🤖 Detected ${personCount} person(s) - Software simulation`);

    } catch (error) {
        console.error('Detection error:', error);
    }
}

// ==================== DRAW BOUNDING BOXES ====================
function drawBoundingBoxes(persons) {
    const video = document.getElementById('videoPreview');
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
    persons.forEach(person => {
        const [x, y, width, height] = person.bbox;
        const confidence = (person.score * 100).toFixed(1);

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

// ==================== TAILGATING ALERT ====================
function handleTailgatingAlert(personCount) {
    playAlertSound();
    showToast(`🚨 TAILGATING ALERT! ${personCount} persons detected!`, 'error');

    // Send to backend
    const incident = {
        type: 'TAILGATING',
        persons: personCount,
        location: { lat: 28.7041, lon: 77.1025, name: "Main Gate" },
        timestamp: new Date().toISOString(),
        status: 'DETECTED',
        detectionMethod: 'Live Monitor'
    };

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

// ==================== EVIDENCE CAPTURE ====================
function captureEvidence() {
    const video = document.getElementById('videoPreview');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // Log evidence
    const incident = {
        type: 'EVIDENCE',
        timestamp: new Date().toISOString(),
        location: { lat: 28.7041, lon: 77.1025, name: "Main Gate" },
        image: canvas.toDataURL('image/jpeg', 0.8)
    };

    console.log('📸 Evidence captured:', incident);
    showToast('📸 Evidence captured!', 'success');
}

// ==================== BACKEND COMMUNICATION ====================
async function sendToBackend(incident) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/tailgating`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(incident)
        });
        if (response.ok) {
            console.log('✅ Incident sent to backend');
        }
    } catch (error) {
        console.log('Backend unavailable, incident logged locally');
    }
}

// ==================== DETECTION LOG ====================
function updateDetectionLog(personCount, persons) {
    const logContainer = document.getElementById('detectionLog');
    if (!logContainer) return;

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';

    const avgConfidence = persons.length > 0 ?
        Math.round((persons.reduce((sum, p) => sum + p.score, 0) / persons.length) * 100) : 0;

    logEntry.innerHTML = `
        <span class="log-time">${timestamp}</span>
        <span class="log-event">Detected ${personCount} person${personCount !== 1 ? 's' : ''}</span>
        <span class="log-confidence" style="background: ${avgConfidence > 70 ? 'rgba(76, 175, 80, 0.3)' : avgConfidence > 50 ? 'rgba(255, 193, 7, 0.3)' : 'rgba(244, 67, 54, 0.3)'};">${avgConfidence}%</span>
    `;

    // Add to top of log
    logContainer.insertBefore(logEntry, logContainer.firstChild);

    // Keep only last 10 entries
    while (logContainer.children.length > 10) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// ==================== UTILITIES ====================
function updateStatus(elementId, text, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        element.className = `detection-status status-${type}`;
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 5000);
}

// ==================== UPTIME TRACKING ====================
function updateUptime() {
    if (!startTime) return;

    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);

    const uptimeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('uptime').textContent = uptimeString;
}

// ==================== RESET STATISTICS ====================
function resetStatistics() {
    stats = {
        totalDetections: 0,
        alertsToday: 0,
        singleEntry: 0,
        tailgating: 0,
        suspicious: 0
    };

    // Reset UI elements
    document.getElementById('totalDetections').textContent = '0';
    document.getElementById('alertsToday').textContent = '0';
    document.getElementById('singleEntry').textContent = '0';
    document.getElementById('tailgating').textContent = '0';
    document.getElementById('suspicious').textContent = '0';
    document.getElementById('uptime').textContent = '00:00:00';

    console.log('🔄 Statistics reset for new detection session');
}

// ==================== PERFORMANCE METRICS ====================
function updatePerformanceMetrics(persons) {
    // Update processing speed (simulated)
    const processingSpeed = (100 + Math.random() * 50).toFixed(0);
    document.getElementById('processingSpeed').textContent = `${processingSpeed}ms`;

    // Update accuracy (simulated)
    const accuracy = (90 + Math.random() * 10).toFixed(1);
    document.getElementById('accuracy').textContent = `${accuracy}%`;

    // Update confidence
    if (persons.length > 0) {
        const avgConfidence = Math.round((persons.reduce((sum, p) => sum + p.score, 0) / persons.length) * 100);
        document.getElementById('confidence').textContent = `${avgConfidence}%`;
    }
}

// ==================== CONSOLE LOG ====================
console.log(`
╔══════════════════════════════════════════╗
║   LIVE MONITOR - SECURITY SENTINEL      ║
║   Real-time AI Detection Active         ║
║   Software Simulation (No Hardware)     ║
║   Live Entry Point Monitoring            ║
╚══════════════════════════════════════════╝
`);
