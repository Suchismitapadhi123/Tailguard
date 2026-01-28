# TailGuard - AI-Powered Tailgating Detection 🔐

## Hackathon Problem 2: Unauthorized Entry & Tailgating

TailGuard is a comprehensive AI-powered security system designed to detect and prevent tailgating incidents in real-time. Using advanced computer vision with YOLOv8, the system monitors entry points and alerts security personnel when unauthorized access attempts are detected.

## 🚀 Features

- **Real-time Tailgating Detection**: AI-powered detection of multiple persons attempting entry simultaneously
- **YOLOv8 Integration**: State-of-the-art computer vision for accurate human detection
- **Live Monitoring Dashboard**: Web-based interface for real-time security monitoring
- **Incident Logging**: Comprehensive logging of all security incidents with timestamps
- **RESTful API**: FastAPI backend providing robust API endpoints for integration
- **Cross-platform Support**: Works with image uploads, base64 streams, and live camera feeds
- **Statistics Dashboard**: Real-time statistics and incident history
- **Admin Panel**: Management interface for reviewing and managing incidents

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance web framework for building APIs
- **YOLOv8**: Advanced object detection model for human recognition
- **Python**: Core programming language
- **Uvicorn**: ASGI server for running FastAPI applications

### Frontend
- **HTML5/CSS3**: Modern web interface with glassmorphism design
- **JavaScript**: Interactive client-side functionality
- **Leaflet.js**: Interactive maps for location visualization

### Data Storage
- **JSON**: Simple file-based storage for incident data (easily replaceable with databases)

## 📋 Requirements

- Python 3.8+
- Webcam or image input device (for live detection)
- Modern web browser with JavaScript enabled

## 🏗️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd tailguard
   ```

2. **Set up Python virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Install YOLOv8 model:**
   The YOLO model will be automatically downloaded on first use, or you can preload it by calling the `/api/detect/load-model` endpoint.

## 🚀 Usage

### Running the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. The API will be available at: `http://127.0.0.1:8000`
4. Interactive API documentation: `http://127.0.0.1:8000/docs`

### Running the Frontend

1. Open your web browser
2. Navigate to the frontend directory and open `index.html`:
   ```bash
   cd frontend
   # Open index.html in your browser, or serve via a local server
   ```

   For better experience, serve the frontend using a local server:
   ```bash
   python -m http.server 3000
   ```
   Then visit: `http://localhost:3000`

## 📖 API Documentation

The backend provides the following key endpoints:

### Core Endpoints
- `GET /` - Health check and system status
- `POST /api/tailgating` - Report tailgating incidents
- `GET /api/incidents` - Retrieve all incidents
- `GET /api/incidents/{id}` - Get specific incident details
- `DELETE /api/incidents/{id}` - Delete incident (testing only)
- `GET /api/stats` - Get system statistics

### Detection Endpoints
- `POST /api/detect/image` - Detect humans in uploaded image
- `POST /api/detect/base64` - Detect humans from base64 image data
- `GET /api/detect/model-info` - Get YOLO model information
- `POST /api/detect/load-model` - Load YOLO model

## 📁 Project Structure

```
tailguard/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── incidents_data.json     # Incident data storage
│   └── services/
│       └── detection_service.py # YOLO detection service
├── frontend/
│   ├── index.html             # Main dashboard
│   ├── styles.css             # CSS styling
│   ├── script.js              # Main JavaScript logic
│   ├── camera.html            # Camera interface
│   ├── camera.js              # Camera functionality
│   ├── monitor.html           # Monitoring interface
│   ├── monitor.js             # Monitoring logic
│   ├── admin.html             # Admin panel
│   ├── admin.js               # Admin functionality
│   └── assets/                # Static assets
│       └── alert siren mp3    # Alert sound
├── README.md                  # This file
└── .gitignore                 # Git ignore rules
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory for custom configurations:

```env
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

### Model Configuration
The YOLO model configuration can be modified in `services/detection_service.py`:
- Model size (nano, small, medium, large)
- Confidence thresholds
- Detection classes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the API documentation at `/docs`
- Review the code comments for implementation details
- Open an issue on GitHub for bugs or feature requests

## 🎯 Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Real-time notifications (email/SMS)
- Multi-camera support
- Advanced analytics and reporting
- Mobile app companion
- Integration with existing security systems

---

**Built for Hackathon Problem 2: Unauthorized Entry & Tailgating**
*Empowering security through AI-driven detection*
