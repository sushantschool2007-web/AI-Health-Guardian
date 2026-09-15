import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import type { AppState, SensorData, PersonalBaseline } from '../types';
import { calculateRisk } from '../utils/riskEngine';
import {
  DEFAULT_BASELINE,
  DEFAULT_SENSOR_DATA,
  DEFAULT_SYSTEM_STATUS,
  DEFAULT_EMERGENCY,
  generateSimulatedData,
  generateInitialHistory,
  generateHealthHistory,
} from '../api/dataService';

// ─── Actions ──────────────────────────────────────────────────
type Action =
  | { type: 'UPDATE_SENSOR'; payload: SensorData }
  | { type: 'SET_DEMO_MODE'; payload: boolean }
  | { type: 'SET_DEMO_SCENARIO'; payload: string | null }
  | { type: 'SET_DEVICE_CONNECTED'; payload: boolean }
  | { type: 'UPDATE_BASELINE'; payload: PersonalBaseline }
  | { type: 'TOGGLE_THEME' }
  | { type: 'RESOLVE_EMERGENCY' }
  | { type: 'TRIGGER_SOS' }
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' };

// ─── Initial State ────────────────────────────────────────────
const initialState: AppState = {
  currentData: DEFAULT_SENSOR_DATA,
  riskAssessment: calculateRisk(DEFAULT_SENSOR_DATA, DEFAULT_BASELINE),
  systemStatus: DEFAULT_SYSTEM_STATUS,
  emergencyState: DEFAULT_EMERGENCY,
  baseline: DEFAULT_BASELINE,
  chartHistory: generateInitialHistory(DEFAULT_SENSOR_DATA),
  healthHistory: generateHealthHistory(DEFAULT_BASELINE),
  isDemoMode: true,
  activeDemoScenario: 'normal',
  theme: 'light',
  isAuthenticated: false,
};

// ─── Reducer ──────────────────────────────────────────────────
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_SENSOR': {
      const data = action.payload;
      const risk = calculateRisk(data, state.baseline);

      // Determine emergency state
      let emergency = state.emergencyState;
      if ((data.sos || risk.level === 'CRITICAL') && state.emergencyState.status === 'NORMAL') {
        emergency = {
          status: data.sos ? 'SOS_ACTIVE' : 'CRITICAL',
          triggeredAt: new Date().toISOString(),
          reason: data.sos ? 'SOS button activated by patient' : risk.explanation,
          location: data.latitude && data.longitude ? { lat: data.latitude, lng: data.longitude } : null,
          buzzerActive: true,
          ledActive: true,
          caregiverNotified: true,
          resolvedAt: null,
        };
      }

      // Update chart history (keep last 60 points)
      const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newChartPoint = {
        time: timeStr,
        heartRate: data.heartRate,
        spo2: data.spo2,
        temperature: data.temperature,
        activityNum: ['RESTING', 'WALKING', 'RUNNING', 'STATIONARY'].indexOf(data.activity),
      };
      const updatedChart = [...state.chartHistory.slice(-59), newChartPoint];

      // Add to health history if notable
      const latestHist = state.healthHistory[0];
      const isNotable = risk.level !== 'LOW' || data.fallDetected || data.sos;
      let updatedHistory = state.healthHistory;
      if (isNotable && (!latestHist || new Date().getTime() - new Date(latestHist.timestamp).getTime() > 60000)) {
        updatedHistory = [{
          id: `hist-${Date.now()}`,
          timestamp: data.timestamp,
          heartRate: data.heartRate,
          spo2: data.spo2,
          temperature: data.temperature,
          activity: data.activity,
          riskLevel: risk.level,
          event: data.sos ? 'SOS Activated' : data.fallDetected ? 'Fall Detected' : `${risk.level} Risk Detected`,
          fallDetected: data.fallDetected,
        }, ...state.healthHistory].slice(0, 100);
      }

      return {
        ...state,
        currentData: data,
        riskAssessment: risk,
        emergencyState: emergency,
        chartHistory: updatedChart,
        healthHistory: updatedHistory,
        systemStatus: {
          ...state.systemStatus,
          lastDataReceived: new Date().toISOString(),
          deviceConnected: true,
        },
      };
    }

    case 'SET_DEMO_MODE':
      return { ...state, isDemoMode: action.payload };

    case 'SET_DEMO_SCENARIO':
      return { ...state, activeDemoScenario: action.payload };

    case 'SET_DEVICE_CONNECTED':
      return {
        ...state,
        systemStatus: { ...state.systemStatus, deviceConnected: action.payload },
      };

    case 'UPDATE_BASELINE':
      return { ...state, baseline: action.payload };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };

    case 'RESOLVE_EMERGENCY':
      return {
        ...state,
        emergencyState: {
          ...state.emergencyState,
          status: 'NORMAL',
          resolvedAt: new Date().toISOString(),
          buzzerActive: false,
          ledActive: false,
        },
        currentData: { ...state.currentData, sos: false },
      };

    case 'TRIGGER_SOS':
      return {
        ...state,
        currentData: { ...state.currentData, sos: true },
      };

    case 'LOGIN':
      return { ...state, isAuthenticated: true };

    case 'LOGOUT':
      return { ...state, isAuthenticated: false };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  activateDemoScenario: (scenarioData: Partial<SensorData>, scenarioId: string) => void;
  triggerVirtualSOS: () => void;
  resolveEmergency: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baseDataRef = useRef<SensorData>(DEFAULT_SENSOR_DATA);

  // Auto-simulate data in demo mode
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const simulated = generateSimulatedData(baseDataRef.current);
      dispatch({ type: 'UPDATE_SENSOR', payload: simulated });
    }, 2000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const activateDemoScenario = useCallback((scenarioData: Partial<SensorData>, scenarioId: string) => {
    const merged: SensorData = { ...DEFAULT_SENSOR_DATA, ...scenarioData, timestamp: new Date().toISOString() };
    baseDataRef.current = merged;
    dispatch({ type: 'SET_DEMO_SCENARIO', payload: scenarioId });
    dispatch({ type: 'UPDATE_SENSOR', payload: merged });
  }, []);

  const triggerVirtualSOS = useCallback(() => {
    const sosData: SensorData = { ...baseDataRef.current, sos: true, timestamp: new Date().toISOString() };
    baseDataRef.current = sosData;
    dispatch({ type: 'UPDATE_SENSOR', payload: sosData });
  }, []);

  const resolveEmergency = useCallback(() => {
    baseDataRef.current = { ...baseDataRef.current, sos: false, fallDetected: false };
    dispatch({ type: 'RESOLVE_EMERGENCY' });
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch, activateDemoScenario, triggerVirtualSOS, resolveEmergency }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used inside AppProvider');
  return ctx;
}
