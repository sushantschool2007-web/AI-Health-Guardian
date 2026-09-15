# AI Health Guardian 🏥

**Privacy-First Intelligent Personal Health Companion**  
An AI-IoT health monitoring dashboard for elderly and chronic-care patients, built for SIH/Ideathon.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📋 Features

| Feature | Status |
|---|---|
| Real-time health dashboard | ✅ |
| AI risk engine (multi-factor) | ✅ |
| Live charts (HR, SpO2, Temp) | ✅ |
| Demo mode (7 scenarios) | ✅ |
| Emergency SOS workflow | ✅ |
| GPS location display | ✅ |
| Health history table | ✅ |
| Hardware architecture page | ✅ |
| Personal baseline settings | ✅ |
| ESP32 WebSocket integration | ✅ Ready |

---

## 🎮 Demo Mode — Ideathon Instructions

1. Click **"Demo Mode"** in the sidebar
2. Select a scenario button:
   - ✅ Normal Condition
   - ❤️ High Heart Rate
   - 🫁 Low SpO₂
   - 🌡️ High Temperature
   - ⚠️ Fall Detected
   - 🚨 Critical Emergency
   - 🆘 SOS Activated
3. Watch the dashboard update in real time
4. Observe the SENSE→PREDICT→DECIDE→ACT pipeline animate

---

## ⚡ ESP32 Integration

### Hardware Setup
- ESP32 DevKit V1
- MAX30102 (HR + SpO2) → I²C (GPIO 21/22)
- MPU6050 (Motion/Fall) → I²C (GPIO 21/22)
- DS18B20 (Temperature) → OneWire (GPIO 4)
- GPS NEO-6M → UART2 (GPIO 16/17)
- SOS Button → GPIO 13
- Buzzer → GPIO 25
- LED → GPIO 2

### WebSocket Protocol

**URL:** `ws://<ESP32_IP>:81/ws`  
**HTTP Polling:** `GET http://<ESP32_IP>/data`

**ESP32 JSON Payload:**
```json
{
  "heartRate": 78,
  "spo2": 98,
  "temperature": 36.7,
  "activity": "RESTING",
  "fallDetected": false,
  "latitude": 18.5204,
  "longitude": 73.8567,
  "sos": false,
  "timestamp": "2024-01-01T00:00:00Z",
  "batteryPercent": 82
}
```

**Activity values:** `RESTING | WALKING | RUNNING | STATIONARY | UNKNOWN`

### Connecting to Physical ESP32

1. Go to **Settings** page
2. Enter your ESP32's IP address in the WebSocket URL field
3. Ensure ESP32 and your computer are on the same Wi-Fi
4. The dashboard will auto-connect and switch from Demo → Live mode

---

## 🧠 AI Risk Engine

The risk engine combines multiple sensor values using weighted scoring:

| Factor | Weight |
|---|---|
| SpO₂ | 30% |
| Heart Rate | 25% |
| Temperature | 20% |
| Fall Detection | 15% |
| Activity Pattern | 10% |

**Risk Levels:**
- 🟢 **LOW** — Continue monitoring
- 🟡 **MEDIUM** — Alert user, notify caregiver
- 🟠 **HIGH** — Notify caregiver immediately
- 🔴 **CRITICAL** — Emergency mode, call emergency services

---

## 📁 Project Structure

```
src/
├── api/
│   └── dataService.ts      # ESP32 connection + data simulation
├── components/
│   ├── Header.tsx           # Top header bar
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── MetricCard.tsx       # Sensor metric display card
│   ├── RiskBadge.tsx        # Risk level badge
│   └── Pipeline.tsx         # SENSE→PREDICT→DECIDE→ACT animation
├── context/
│   └── AppContext.tsx        # Global state + reducer
├── demo/
│   └── scenarios.ts         # 7 demo scenario definitions
├── pages/
│   ├── Dashboard.tsx         # Main dashboard
│   ├── LiveMonitoring.tsx    # Real-time charts
│   ├── AIRisk.tsx            # AI risk assessment detail
│   ├── HealthHistory.tsx     # Filterable history table
│   ├── GPSLocation.tsx       # Map + coordinates
│   ├── Emergency.tsx         # Emergency panel + SOS
│   ├── Hardware.tsx          # Hardware architecture
│   ├── DemoMode.tsx          # Demo scenarios
│   ├── Settings.tsx          # Baseline + connection settings
│   └── Privacy.tsx           # Privacy policy
├── types/
│   └── index.ts              # TypeScript types
└── utils/
    └── riskEngine.ts         # AI risk calculation engine
```

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Maps:** OpenStreetMap (iframe embed)
- **Dates:** date-fns

---

## ⚠️ Disclaimer

This is a **research prototype** for educational/hackathon purposes.  
It is **not a certified medical device** and does not diagnose diseases.  
Always consult a qualified healthcare professional for medical decisions.
