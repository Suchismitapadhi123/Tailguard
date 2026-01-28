// 📊 SECURITY SENTINEL - ADMIN DASHBOARD
// Hackathon Problem 2: Unauthorized Entry & Tailgating

const BACKEND_URL = 'http://127.0.0.1:8000';

// Load incidents when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Admin Dashboard Loaded');
    loadIncidents();
});

// ==================== LOAD INCIDENTS ====================
async function loadIncidents() {
    showToast('🔄 Loading incidents...', 'warning');
    
    let incidents = [];
    let fromBackend = false;
    
    // Try to fetch from backend first
    try {
        const response = await fetch(`${BACKEND_URL}/api/incidents`);
        if (response.ok) {
            const data = await response.json();
            incidents = data.incidents || [];
            fromBackend = true;
            console.log('✅ Loaded from backend:', incidents);
        }
    } catch (error) {
        console.log('Backend unavailable, loading from localStorage');
    }
    
    // If backend fails, load from localStorage
    if (!fromBackend) {
        const stored = localStorage.getItem('incidents');
        incidents = stored ? JSON.parse(stored) : [];
        console.log('📱 Loaded from localStorage:', incidents);
    }
    
    // Update statistics
    updateStatistics(incidents);
    
    // Display incidents in table
    displayIncidents(incidents);
    
    const source = fromBackend ? 'backend database' : 'local storage';
    showToast(`✅ Loaded ${incidents.length} incidents from ${source}`, 'success');
}

// Update statistics
function updateStatistics(incidents) {
    const total = incidents.length;
    
    // Count today's incidents
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const today = incidents.filter(inc => {
        const incDate = new Date(inc.timestamp);
        return incDate > oneDayAgo;
    }).length;
    
    // Count tailgating incidents
    const tailgating = incidents.filter(inc => inc.type === 'TAILGATING').length;
    
    // Count evidence captures
    const evidence = incidents.filter(inc => inc.type === 'EVIDENCE').length;
    
    // Update DOM
    document.getElementById('totalIncidents').textContent = total;
    document.getElementById('tailgatingIncidents').textContent = tailgating;
    document.getElementById('todayIncidents').textContent = today;
    document.getElementById('evidenceCount').textContent = evidence;
}

// ==================== DISPLAY INCIDENTS IN TABLE ====================
function displayIncidents(incidents) {
    const tbody = document.getElementById('incidentsBody');
    
    if (incidents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No incidents recorded yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    incidents.forEach((incident, index) => {
        const row = document.createElement('tr');
        
        // Format timestamp
        const date = new Date(incident.timestamp);
        const formattedDate = date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Format location
        let location = 'Unknown';
        if (incident.latitude && incident.longitude) {
            if (incident.latitude !== 'Unknown') {
                location = `${parseFloat(incident.latitude).toFixed(4)}, ${parseFloat(incident.longitude).toFixed(4)}`;
            }
        }
        
        // Status badge
        const statusClass = incident.status === 'ACTIVE' ? 'status-active' : 'status-resolved';
        const statusText = incident.status || 'N/A';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${formattedDate}</td>
            <td>${incident.type || 'SOS'}</td>
            <td>${location}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <button onclick="viewDetails(${index})" style="padding: 5px 10px; background: rgba(33, 150, 243, 0.3); border: 1px solid rgba(33, 150, 243, 0.5); border-radius: 5px; color: white; cursor: pointer;">
                    View
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// ==================== VIEW INCIDENT DETAILS ====================
function viewDetails(index) {
    const stored = localStorage.getItem('incidents');
    const incidents = stored ? JSON.parse(stored) : [];
    const incident = incidents[index];
    
    if (!incident) {
        showToast('❌ Incident not found', 'error');
        return;
    }
    
    const details = `
📋 INCIDENT DETAILS

Timestamp: ${new Date(incident.timestamp).toLocaleString()}
Type: ${incident.type || 'SOS'}
Status: ${incident.status || 'N/A'}
Location: ${incident.latitude}, ${incident.longitude}
${incident.size ? `Video Size: ${(incident.size / 1024 / 1024).toFixed(2)} MB` : ''}
    `;
    
    alert(details);
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ==================== AUTO REFRESH ====================
// Refresh data every 30 seconds
setInterval(() => {
    console.log('🔄 Auto-refreshing data...');
    loadIncidents();
}, 30000);

console.log('📊 Admin Dashboard Ready');