import React from 'react';
import { useAppState } from '../context/AppContext';
import { Activity, Heart, Thermometer, MapPin, AlertCircle } from 'lucide-react';

export default function SensorStream({ vertical = false }: { vertical?: boolean }) {
  const { state } = useAppState();
  const { currentData: d, emergencyState } = state;
  const isEmergency = emergencyState.status !== 'NORMAL';

  return (
    <div style={{
      display: 'flex', 
      flexDirection: vertical ? 'column' : 'row',
      gap: 12, flexWrap: vertical ? 'nowrap' : 'wrap',
    }}>
      <StreamNode sensor="MAX30102" label="HEART RATE" value={`${d.heartRate} BPM`} icon={<Heart size={14}/>} active color="#ef4444" />
      <StreamNode sensor="MAX30102" label="SpO₂" value={`${d.spo2}%`} icon={<Activity size={14}/>} active color="#3b82f6" />
      <StreamNode sensor="DS18B20" label="TEMPERATURE" value={`${d.temperature.toFixed(1)}°C`} icon={<Thermometer size={14}/>} active color="#f59e0b" />
      <StreamNode sensor="MPU6050" label="ACTIVITY" value={d.activity} icon={<Activity size={14}/>} active color="#8b5cf6" 
        alert={d.fallDetected ? "FALL DETECTED" : undefined} />
      <StreamNode sensor="GPS NEO-6M" label="LOCATION" value={d.latitude ? "LOCKED" : "SEARCHING"} icon={<MapPin size={14}/>} active={d.latitude !== 0} color="#10b981" />
      
      {isEmergency && (
        <StreamNode sensor="SOS BUTTON" label="EMERGENCY" value="TRIGGERED" icon={<AlertCircle size={14}/>} active color="#dc2626" emergency />
      )}
    </div>
  );
}

function StreamNode({ sensor, label, value, icon, active, color, alert, emergency }: any) {
  return (
    <div className={`glass-card ${emergency ? 'emergency-active' : ''}`} style={{
      padding: '12px 16px', flex: '1 1 180px',
      borderLeft: `3px solid ${color}`,
      display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: color, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
          {icon} {sensor}
        </div>
        {active ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(16,185,129,0.3)' }}>
            <div className="status-dot online" style={{ width: 6, height: 6 }} />
            <span style={{ fontSize: 9, color: '#34d399', fontWeight: 700, letterSpacing: '0.05em' }}>LIVE</span>
          </div>
        ) : (
          <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700 }}>OFFLINE</div>
        )}
      </div>

      <div>
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 2 }}>{label}</div>
        <div className="metric-value" style={{ fontSize: 20, color: 'var(--text-primary)', textShadow: `0 0 10px ${color}40` }}>{value}</div>
      </div>

      {alert && (
        <div style={{
          position: 'absolute', bottom: -6, right: 10,
          background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 800,
          padding: '2px 8px', borderRadius: 4, animation: 'pulse-danger 1s infinite'
        }}>
          {alert}
        </div>
      )}
    </div>
  );
}
