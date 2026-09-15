import React from 'react';
import Header from '../components/Header';
import { Cloud, Flame, Wind, AlertTriangle } from 'lucide-react';

export default function Environment() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header title="Environmental Intelligence" subtitle="Contextual analysis of external risk factors" />
      
      <div style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto' }}>
        
        <div className="glass-card" style={{ padding: '24px', marginBottom: 24, borderLeft: '4px solid #3b82f6', background: 'rgba(59,130,246,0.05)' }}>
          <div style={{ fontSize: 14, color: '#3b82f6', letterSpacing: '0.1em', fontWeight: 800, marginBottom: 8 }}>
            ENVIRONMENTAL CONTEXT
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Personal health risks are amplified by external factors. The AI Health Guardian combines local patient telemetry (Temp, Activity, HR) with external environmental data to provide contextual risk modifications. (Simulated data)
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          
          <EnvCard 
            title="AIR QUALITY (AQI)" 
            val="142" 
            status="UNHEALTHY FOR SENSITIVE GROUPS" 
            icon={<Wind size={24} color="#f59e0b" />}
            color="#f59e0b"
            desc="High particulate matter can trigger asthma or reduce SpO₂. The AI engine will lower the threshold for SpO₂ alerts."
          />
          
          <EnvCard 
            title="HEAT RISK" 
            val="38°C" 
            status="HIGH RISK" 
            icon={<Flame size={24} color="#ef4444" />}
            color="#ef4444"
            desc="Extreme heat increases cardiovascular strain. Expected resting heart rate baseline is slightly elevated by the AI."
          />
          
          <EnvCard 
            title="DISASTER ALERT" 
            val="CLEAR" 
            status="NO ACTIVE WARNINGS" 
            icon={<AlertTriangle size={24} color="#10b981" />}
            color="#10b981"
            desc="No extreme weather or geological events detected in the current GPS radius."
          />

          <EnvCard 
            title="HUMIDITY" 
            val="65%" 
            status="NOMINAL" 
            icon={<Cloud size={24} color="#38bdf8" />}
            color="#38bdf8"
            desc="Humidity is within acceptable limits. No modifier applied to respiratory baselines."
          />

        </div>
      </div>
    </div>
  );
}

function EnvCard({ title, val, status, icon, color, desc }: any) {
  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800 }}>{title}</div>
        {icon}
      </div>
      
      <div className="metric-value" style={{ fontSize: 36, color: 'var(--text-primary)', marginBottom: 8, textShadow: `0 0 15px ${color}60` }}>
        {val}
      </div>
      
      <div style={{ 
        fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, display: 'inline-block',
        background: `${color}20`, color: color, border: `1px solid ${color}40`, marginBottom: 16,
        alignSelf: 'flex-start'
      }}>
        {status}
      </div>
      
      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 'auto' }}>
        {desc}
      </div>
    </div>
  );
}
