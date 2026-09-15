import React from 'react';
import { useAppState } from '../context/AppContext';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { state } = useAppState();
  const { emergencyState, riskAssessment, systemStatus } = state;
  const isConnected = systemStatus.deviceConnected;

  return (
    <header style={{ 
      padding: '24px 32px', 
      borderBottom: '1px solid var(--border-card)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: state.theme === 'dark' ? 'rgba(3, 7, 18, 0.6)' : 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div>
        <h2 style={{ 
          margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', 
          letterSpacing: '-0.02em', 
          textShadow: state.theme === 'dark' ? '0 0 20px var(--tag-border)' : 'none' 
        }}>
          {title}
        </h2>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <StatusPill 
          icon={<Cpu size={14} />} 
          label="ESP32" 
          status={isConnected ? 'CONNECTED' : 'OFFLINE'} 
          color={isConnected ? '#10b981' : '#ef4444'} 
        />
        <StatusPill 
          icon={<Activity size={14} />} 
          label="AI ENGINE" 
          status="ACTIVE" 
          color="#0ea5e9" 
        />
        {emergencyState.status !== 'NORMAL' ? (
          <StatusPill 
            icon={<ShieldAlert size={14} />} 
            label="SYSTEM STATUS" 
            status="EMERGENCY" 
            color="#ef4444" 
            pulse
          />
        ) : (
          <StatusPill 
            icon={<ShieldAlert size={14} />} 
            label="RISK LEVEL" 
            status={riskAssessment.level} 
            color={
              riskAssessment.level === 'LOW' ? '#10b981' : 
              riskAssessment.level === 'MEDIUM' ? '#f59e0b' : 
              riskAssessment.level === 'HIGH' ? '#f97316' : '#ef4444'
            } 
          />
        )}
      </div>
    </header>
  );
}

function StatusPill({ icon, label, status, color, pulse }: any) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 12px', borderRadius: 8,
      background: 'var(--bg-card)', border: `1px solid ${color}40`,
      boxShadow: pulse ? `0 0 15px ${color}60` : 'none',
      animation: pulse ? 'pulse-danger 1.5s infinite' : 'none'
    }}>
      <div style={{ color: color }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1 }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.2, textShadow: `0 0 10px ${color}80` }}>{status}</span>
      </div>
    </div>
  );
}
