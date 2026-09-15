// ============================================================
// AI Health Guardian - Core TypeScript Types
// ============================================================

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ActivityType = 'RESTING' | 'WALKING' | 'RUNNING' | 'STATIONARY' | 'UNKNOWN';
export type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
export type EmergencyStatus = 'NORMAL' | 'SOS_ACTIVE' | 'CRITICAL';

// ─── Sensor Data (matches ESP32 JSON payload) ───────────────
export interface SensorData {
  heartRate: number;          // BPM (0 = invalid)
  spo2: number;               // % (0 = invalid)
  temperature: number;        // °C
  activity: ActivityType;
  fallDetected: boolean;
  latitude: number | null;
  longitude: number | null;
  sos: boolean;
  timestamp: string;          // ISO 8601
  batteryPercent?: number;    // 0-100
}

// ─── AI Risk Engine Output & Action Advice ──────────────────────
export interface ActionStep {
  id: string;
  title: string;
  description: string;
  urgency: 'immediate' | 'soon' | 'routine';
}

export interface ClinicalAdvice {
  headline: string;
  summary: string;
  urgencyLevel: 'CRITICAL_EMERGENCY' | 'HIGH_ATTENTION' | 'MODERATE_MONITOR' | 'ROUTINE_NOMINAL';
  immediateSteps: ActionStep[];
  dos: string[];
  donts: string[];
  recheckIntervalMinutes: number;
  doctorSummary: string;
}

export interface RiskAssessment {
  level: RiskLevel;
  confidence: number;         // 0-100
  contributingFactors: ContributingFactor[];
  recommendedAction: string;
  explanation: string;
  advice: ClinicalAdvice;
}

export interface ContributingFactor {
  name: string;
  value: string;
  severity: 'normal' | 'warning' | 'danger';
  deviation: string;          // e.g. "+15 BPM above baseline"
}

// ─── Personal Baseline ────────────────────────────────────────
export interface PersonalBaseline {
  heartRateMin: number;
  heartRateMax: number;
  spo2Min: number;
  temperatureMin: number;
  temperatureMax: number;
  typicalActivity: ActivityType;
  name: string;
  age: number;
  conditions: string[];       // chronic conditions
}

// ─── System Status ────────────────────────────────────────────
export interface SystemStatus {
  deviceConnected: boolean;
  lastDataReceived: string | null;   // ISO timestamp
  connectionMode: 'websocket' | 'http' | 'demo' | 'offline';
  sensorStatus: SensorStatus;
  batteryPercent: number;
}

export interface SensorStatus {
  max30102: boolean;          // Heart Rate / SpO2
  mpu6050: boolean;           // Motion / Fall
  ds18b20: boolean;           // Temperature
  gpsNeo6m: boolean;          // GPS
  buzzer: boolean;
  led: boolean;
  oled: boolean;
  sosButton: boolean;
}

// ─── Emergency State ─────────────────────────────────────────
export interface EmergencyState {
  status: EmergencyStatus;
  triggeredAt: string | null;
  reason: string;
  location: { lat: number; lng: number } | null;
  buzzerActive: boolean;
  ledActive: boolean;
  caregiverNotified: boolean;
  resolvedAt: string | null;
}

// ─── Health History Entry ─────────────────────────────────────
export interface HealthHistoryEntry {
  id: string;
  timestamp: string;
  heartRate: number;
  spo2: number;
  temperature: number;
  activity: ActivityType;
  riskLevel: RiskLevel;
  event: string;
  fallDetected: boolean;
}

// ─── Chart Data Point ─────────────────────────────────────────
export interface ChartDataPoint {
  time: string;
  heartRate: number;
  spo2: number;
  temperature: number;
  activityNum: number;        // 0=resting,1=walking,2=running
}

// ─── Demo Scenario ───────────────────────────────────────────
export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  data: Partial<SensorData>;
  expectedRisk: RiskLevel;
}

// ─── Global App State ────────────────────────────────────────
export interface AppState {
  currentData: SensorData;
  riskAssessment: RiskAssessment;
  systemStatus: SystemStatus;
  emergencyState: EmergencyState;
  baseline: PersonalBaseline;
  chartHistory: ChartDataPoint[];
  healthHistory: HealthHistoryEntry[];
  isDemoMode: boolean;
  activeDemoScenario: string | null;
  theme: 'dark' | 'light';
  isAuthenticated: boolean;
}
