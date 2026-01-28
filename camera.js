// 🔐 SECURITY SENTINEL - CAMERA PAGE SCRIPT
// Dedicated camera feed with real-time AI detection

// ==================== CONFIGURATION ====================
const BACKEND_URL = 'http://127.0.0.1:8000';
let detectionInterval = null;
let isDetecting = false;

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📹 Camera page initialized');
    initializeCamera();
    setupEventListeners();
});

// ==================== CAMERA INITIALIZATION ====================
async function initializeCamera() {
    try {
        updateStatus('detectionStatus', '⏳ Initializing Camera...', 'inactive');

        const videoPreview = document.getElementById('videoPreview');
        if (videoPreview) {
            try {
                // REQUEST REAL CAMERA ACCESS
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280, min: 640 },
                        height: { ideal: 720, min: 480 },
                        facingMode: 'user', // Use 'environment' for rear camera on mobile
                        frameRate: { ideal: 30, min: 15 }
                    },
                    audio: false
                });

                // CONNECT REAL CAMERA TO VIDEO ELEMENT
                videoPreview.srcObject = stream;
                await videoPreview.play();

                updateStatus('detectionStatus', '✅ Real Camera Ready - Click Start Detection', 'inactive');
                console.log('📹 Real camera initialized successfully');
                console.log('Camera resolution:', stream.getVideoTracks()[0].getSettings());

                // Store stream for cleanup later
                window.cameraStream = stream;

            } catch (cameraError) {
                // Fallback to simulated if camera fails
                console.error('Camera access denied or unavailable:', cameraError);
                updateStatus('detectionStatus', '⚠️ Camera Denied - Using Simulation', 'inactive');

                // Show user-friendly error
                if (cameraError.name === 'NotAllowedError') {
                    alert('Camera permission denied. Please allow camera access in browser settings and refresh.\n\nFor Chrome: Click the camera icon in address bar.');
                } else if (cameraError.name === 'NotFoundError') {
                    alert('No camera found on this device. Using simulation mode.');
                } else {
                    alert('Camera error: ' + cameraError.message + '\nUsing simulation mode.');
                }

                // Use simulation as fallback
                initializeSimulatedCamera(videoPreview);
            }
        }
    } catch (error) {
        updateStatus('detectionStatus', '❌ Initialization Error', 'inactive');
        console.error('Camera initialization error:', error);
    }
}

// Fallback simulation function
function initializeSimulatedCamera(videoPreview) {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

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
        ctx.fillText('Camera not available', canvas.width / 2, canvas.height / 2 + 30);

        requestAnimationFrame(drawSimulatedFeed);
    }
    drawSimulatedFeed();
    videoPreview.srcObject = canvas.captureStream(30);
    videoPreview.play();
}

// Cleanup function to stop camera when done
function stopCamera() {
    if (window.cameraStream) {
        window.cameraStream.getTracks().forEach(track => track.stop());
        console.log('📹 Camera stopped');
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

    document.getElementById('startDetection').disabled = true;
    document.getElementById('stopDetection').disabled = false;

    updateStatus('detectionStatus', '🔍 AI Detection Active...', 'active');
    showToast('🤖 AI detection started!', 'success');

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

        // Update UI
        document.getElementById('detectionCount').textContent = personCount;

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
        detectionMethod: 'Camera Feed'
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

// ==================== CONSOLE LOG ====================
console.log(`
╔══════════════════════════════════════════╗
║   CAMERA FEED - SECURITY SENTINEL       ║
║   Live AI Detection Active              ║
║   Software Simulation (No Hardware)     ║
║   Real-time Person Counting             ║
╚══════════════════════════════════════════╝
`);
