import type { SensorData, PersonalBaseline, SystemStatus, EmergencyState, HealthHistoryEntry, ChartDataPoint } from '../types';
import { calculateRisk } from '../utils/riskEngine';

// ─── Default Personal Baseline ────────────────────────────────
export const DEFAULT_BASELINE: PersonalBaseline = {
  heartRateMin: 60,
  heartRateMax: 90,
  spo2Min: 95,
  temperatureMin: 36.1,
  temperatureMax: 37.2,
  typicalActivity: 'RESTING',
  name: 'Patient',
  age: 68,
  conditions: ['Hypertension', 'Type 2 Diabetes'],
};

// ─── Default Sensor Data ──────────────────────────────────────
export const DEFAULT_SENSOR_DATA: SensorData = {
  heartRate: 74,
  spo2: 97,
  temperature: 36.6,
  activity: 'RESTING',
  fallDetected: false,
  latitude: 18.5204,
  longitude: 73.8567,
  sos: false,
  timestamp: new Date().toISOString(),
  batteryPercent: 82,
};

// ─── Default System Status ────────────────────────────────────
export const DEFAULT_SYSTEM_STATUS: SystemStatus = {
  deviceConnected: false,
  lastDataReceived: null,
  connectionMode: 'demo',
  sensorStatus: {
    max30102: true,
    mpu6050: true,
    ds18b20: true,
    gpsNeo6m: true,
    buzzer: true,
    led: true,
    oled: true,
    sosButton: true,
  },
  batteryPercent: 82,
};

// ─── Default Emergency State ──────────────────────────────────
export const DEFAULT_EMERGENCY: EmergencyState = {
  status: 'NORMAL',
  triggeredAt: null,
  reason: '',
  location: null,
  buzzerActive: false,
  ledActive: false,
  caregiverNotified: false,
  resolvedAt: null,
};

// ─── Simulated Data Generator ─────────────────────────────────
// Adds realistic noise to sensor readings for live simulation
export function generateSimulatedData(base: SensorData): SensorData {
  const jitter = (val: number, range: number) => +(val + (Math.random() - 0.5) * range).toFixed(1);
  return {
    ...base,
    heartRate: Math.max(40, Math.min(200, Math.round(jitter(base.heartRate, 4)))),
    spo2: Math.max(70, Math.min(100, Math.round(jitter(base.spo2, 1)))),
    temperature: Math.max(34, Math.min(42, jitter(base.temperature, 0.2))),
    timestamp: new Date().toISOString(),
  };
}

// ─── Chart History Generator ──────────────────────────────────
export function generateInitialHistory(base: SensorData): ChartDataPoint[] {
  const points: ChartDataPoint[] = [];
  const now = Date.now();
  for (let i = 29; i >= 0; i--) {
    const t = new Date(now - i * 5000);
    const simulated = generateSimulatedData(base);
    points.push({
      time: t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      heartRate: simulated.heartRate,
      spo2: simulated.spo2,
      temperature: simulated.temperature,
      activityNum: ['RESTING', 'WALKING', 'RUNNING'].indexOf(simulated.activity as string),
    });
  }
  return points;
}

// ─── Health History Generator ─────────────────────────────────
export function generateHealthHistory(baseline: PersonalBaseline): HealthHistoryEntry[] {
  const entries: HealthHistoryEntry[] = [];
  const now = Date.now();
  const events = [
    { hr: 72, spo2: 97, temp: 36.5, activity: 'RESTING' as const, event: 'Routine check' },
    { hr: 88, spo2: 96, temp: 36.8, activity: 'WALKING' as const, event: 'Post-walk reading' },
    { hr: 115, spo2: 95, temp: 37.1, activity: 'RESTING' as const, event: 'Elevated HR alert' },
    { hr: 70, spo2: 98, temp: 36.4, activity: 'RESTING' as const, event: 'Normal reading' },
    { hr: 78, spo2: 93, temp: 36.7, activity: 'RESTING' as const, event: 'Low SpO2 warning' },
    { hr: 65, spo2: 97, temp: 36.3, activity: 'RESTING' as const, event: 'Morning baseline' },
    { hr: 102, spo2: 96, temp: 38.1, activity: 'RESTING' as const, event: 'Fever detected' },
    { hr: 74, spo2: 97, temp: 36.5, activity: 'WALKING' as const, event: 'Evening walk' },
    { hr: 80, spo2: 96, temp: 36.6, activity: 'RESTING' as const, event: 'Routine check' },
    { hr: 68, spo2: 98, temp: 36.4, activity: 'RESTING' as const, event: 'Night reading' },
  ];

  events.forEach((e, i) => {
    const data: SensorData = {
      heartRate: e.hr, spo2: e.spo2, temperature: e.temp,
      activity: e.activity, fallDetected: false,
      latitude: 18.5204, longitude: 73.8567,
      sos: false, timestamp: new Date(now - (events.length - i) * 3 * 60 * 60 * 1000).toISOString(),
    };
    const risk = calculateRisk(data, baseline);
    entries.push({
      id: `hist-${i}`,
      timestamp: data.timestamp,
      heartRate: e.hr, spo2: e.spo2, temperature: e.temp,
      activity: e.activity, riskLevel: risk.level,
      event: e.event, fallDetected: false,
    });
  });
  return entries.reverse();
}

// ─── ESP32 WebSocket Connection Manager ───────────────────────
export class ESP32Connection {
  private ws: WebSocket | null = null;
  private url: string;
  private onData: (data: SensorData) => void;
  private onStatusChange: (connected: boolean) => void;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isConnecting = false;

  constructor(
    url: string,
    onData: (data: SensorData) => void,
    onStatusChange: (connected: boolean) => void
  ) {
    this.url = url;
    this.onData = onData;
    this.onStatusChange = onStatusChange;
  }

  connect() {
    if (this.isConnecting) return;
    this.isConnecting = true;
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => { this.isConnecting = false; this.onStatusChange(true); };
      this.ws.onmessage = (e) => {
        try { this.onData(JSON.parse(e.data) as SensorData); } catch (_) {}
      };
      this.ws.onclose = () => {
        this.isConnecting = false;
        this.onStatusChange(false);
        this.reconnectTimer = setTimeout(() => this.connect(), 5000);
      };
      this.ws.onerror = () => { this.isConnecting = false; this.ws?.close(); };
    } catch (_) { this.isConnecting = false; }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }
}

/**
 * ESP32 API Format Documentation
 *
 * WebSocket URL: ws://<ESP32_IP>:81/ws
 * HTTP Polling:  GET http://<ESP32_IP>/data
 *
 * Payload JSON:
 * {
 *   "heartRate": 78,       // BPM from MAX30102
 *   "spo2": 98,            // % from MAX30102
 *   "temperature": 36.7,   // °C from DS18B20
 *   "activity": "RESTING", // RESTING | WALKING | RUNNING | STATIONARY | UNKNOWN
 *   "fallDetected": false, // boolean from MPU6050
 *   "latitude": 18.5204,   // decimal degrees from GPS NEO-6M
 *   "longitude": 73.8567,  // decimal degrees from GPS NEO-6M
 *   "sos": false,          // boolean from GPIO 13 button
 *   "timestamp": "2024-01-01T00:00:00Z",  // ISO 8601
 *   "batteryPercent": 82   // optional
 * }
 */
