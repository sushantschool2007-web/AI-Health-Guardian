import React, { useState } from 'react';
import Header from '../components/Header';
import { useAppState } from '../context/AppContext';
import { format } from 'date-fns';
import { Calendar, Filter } from 'lucide-react';

export default function HealthHistory() {
  const { state } = useAppState();
  const [filter, setFilter] = useState('ALL');

  const filtered = (filter === 'ALL' ? state.healthHistory : state.healthHistory.filter(h => h.riskLevel === filter))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header title="Health History" subtitle="Immutable logs of sensor telemetry and AI risk events" />
      
      <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div className="glass-card" style={{ padding: '16px 20px', flex: 1, minWidth: 280, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ color: '#0ea5e9', background: 'rgba(14,165,233,0.1)', padding: 12, borderRadius: 12, border: '1px solid rgba(14,165,233,0.3)' }}>
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 4 }}>TOTAL LOGS</div>
              <div className="metric-value text-glow-cyan" style={{ fontSize: 24, color: 'var(--text-primary)' }}>{state.healthHistory.length}</div>
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: '16px 20px', flex: 2, minWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Filter size={14} color="var(--text-muted)" />
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>FILTER BY CLASSIFICATION</span>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <FilterBtn active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="ALL EVENTS" />
              <FilterBtn active={filter === 'LOW'} onClick={() => setFilter('LOW')} label="LOW" color="#10b981" />
              <FilterBtn active={filter === 'MEDIUM'} onClick={() => setFilter('MEDIUM')} label="MEDIUM" color="#f59e0b" />
              <FilterBtn active={filter === 'HIGH'} onClick={() => setFilter('HIGH')} label="HIGH" color="#f97316" />
              <FilterBtn active={filter === 'CRITICAL'} onClick={() => setFilter('CRITICAL')} label="CRITICAL" color="#ef4444" />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-card)', background: 'rgba(15,23,42,0.4)' }}>
                <th style={thStyle}>TIMESTAMP</th>
                <th style={thStyle}>RISK</th>
                <th style={thStyle}>HR (BPM)</th>
                <th style={thStyle}>SpO₂ (%)</th>
                <th style={thStyle}>TEMP (°C)</th>
                <th style={thStyle}>ACTIVITY</th>
                <th style={thStyle}>FALL</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const isCrit = item.riskLevel === 'CRITICAL';
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(148,163,184,0.05)', background: isCrit ? 'rgba(239,68,68,0.05)' : 'transparent' }}>
                    <td style={tdStyle}>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{format(new Date(item.timestamp), 'MMM d, yyyy')}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{format(new Date(item.timestamp), 'HH:mm:ss')}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ 
                        fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, display: 'inline-block',
                        background: item.riskLevel === 'LOW' ? 'rgba(16,185,129,0.1)' : item.riskLevel === 'MEDIUM' ? 'rgba(245,158,11,0.1)' : item.riskLevel === 'HIGH' ? 'rgba(249,115,22,0.1)' : 'rgba(239,68,68,0.1)',
                        color: item.riskLevel === 'LOW' ? '#10b981' : item.riskLevel === 'MEDIUM' ? '#f59e0b' : item.riskLevel === 'HIGH' ? '#f97316' : '#ef4444',
                        border: `1px solid ${item.riskLevel === 'LOW' ? 'rgba(16,185,129,0.3)' : item.riskLevel === 'MEDIUM' ? 'rgba(245,158,11,0.3)' : item.riskLevel === 'HIGH' ? 'rgba(249,115,22,0.3)' : 'rgba(239,68,68,0.3)'}`
                      }}>
                        {item.riskLevel}
                      </div>
                    </td>
                    <td style={{...tdStyle, color: item.heartRate > 100 ? '#fca5a5' : 'var(--text-secondary)' }}>{item.heartRate}</td>
                    <td style={{...tdStyle, color: item.spo2 < 95 ? '#fca5a5' : 'var(--text-secondary)' }}>{item.spo2}</td>
                    <td style={{...tdStyle, color: item.temperature > 37.5 ? '#fca5a5' : 'var(--text-secondary)' }}>{item.temperature.toFixed(1)}</td>
                    <td style={tdStyle}><span className="tag">{item.activity}</span></td>
                    <td style={tdStyle}>
                      {item.fallDetected ? <span className="tag" style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.3)' }}>DETECTED</span> : <span className="tag">NONE</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = { padding: '16px', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.1em' };
const tdStyle = { padding: '16px', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 };

function FilterBtn({ active, onClick, label, color }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 8, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em',
        background: active ? (color ? `${color}20` : 'rgba(14,165,233,0.2)') : 'var(--tag-bg)',
        border: `1px solid ${active ? (color || '#0ea5e9') : 'var(--tag-border)'}`,
        color: active ? (color || '#38bdf8') : 'var(--text-secondary)',
        cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}
