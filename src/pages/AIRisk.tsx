import React from 'react';
import Header from '../components/Header';
import Pipeline from '../components/Pipeline';
import ActionableAdviceCard from '../components/ActionableAdviceCard';
import { useAppState } from '../context/AppContext';

export default function AIRisk() {
  const { state } = useAppState();
  const { riskAssessment: r, baseline: b, currentData: d } = state;
  const isEmergency = r.level === 'CRITICAL';
  const color = isEmergency ? '#ef4444' : r.level === 'HIGH' ? '#f59e0b' : r.level === 'MEDIUM' ? '#fcd34d' : '#0ea5e9';

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header title="AI Risk Intelligence" subtitle="Explainable AI decisions based on personal baselines" />
      
      <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Why did AI give this risk? */}
        <div className="glass-card" style={{ padding: '32px', marginBottom: 24, background: `var(--bg-card)` }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>
            "WHY DID AI GIVE THIS RISK?"
          </div>
          
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <div style={{ flexShrink: 0, textAlign: 'center', width: 200 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4 }}>Risk Level</div>
              <div style={{ fontSize: 42, fontWeight: 900, color: color, textShadow: `0 0 20px ${color}80`, lineHeight: 1 }}>{r.level}</div>
              
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4 }}>Confidence</div>
                <div style={{ fontSize: 24, color: '#0ea5e9', fontWeight: 700 }}>{r.confidence}%</div>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ background: 'var(--tag-bg)', padding: '20px', borderRadius: 12, border: '1px solid var(--tag-border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Reasoning</div>
                <p style={{ fontSize: 16, color: 'var(--text-primary)', margin: 0, lineHeight: 1.6, fontWeight: 300 }}>
                  "{r.explanation}"
                </p>
                
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--tag-border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Primary Guidance</div>
                  <p style={{ fontSize: 14, color: '#38bdf8', margin: 0, fontWeight: 600 }}>
                    {r.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Clinical Guidance & Next Steps */}
        <div style={{ marginBottom: 24 }}>
          <ActionableAdviceCard />
        </div>

        {/* Pipeline view */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 20, textAlign: 'center' }}>
            DECISION ENGINE FLOW
          </div>
          <Pipeline />
        </div>

        {/* Personal Baseline vs Current State */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 20 }}>
            MY HEALTH BASELINE vs CURRENT STATE
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <BaselineComparison label="Heart Rate" baseline={`${b.heartRateMin} - ${b.heartRateMax} BPM`} current={`${d.heartRate} BPM`} ok={d.heartRate >= b.heartRateMin && d.heartRate <= b.heartRateMax + 15} />
            <BaselineComparison label="SpO₂" baseline={`≥ ${b.spo2Min}%`} current={`${d.spo2}%`} ok={d.spo2 >= b.spo2Min} />
            <BaselineComparison label="Temperature" baseline={`${b.temperatureMin} - ${b.temperatureMax}°C`} current={`${d.temperature.toFixed(1)}°C`} ok={d.temperature >= b.temperatureMin && d.temperature <= b.temperatureMax + 0.5} />
            <BaselineComparison label="Typical Activity" baseline={b.typicalActivity} current={d.activity} ok={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BaselineComparison({ label, baseline, current, ok }: any) {
  return (
    <div style={{ padding: '16px', borderRadius: 12, background: 'var(--tag-bg)', border: `1px solid ${ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.3)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
        {ok ? <span style={{ color: '#10b981', fontSize: 11, fontWeight: 700 }}>NOMINAL</span> : <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, animation: 'pulse-danger 1s infinite' }}>DEVIATION</span>}
      </div>
      
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Baseline</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{baseline}</div>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>vs</div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current</div>
          <div style={{ fontSize: 18, color: ok ? 'var(--text-primary)' : '#ef4444', fontWeight: 700, textShadow: ok ? 'none' : '0 0 10px rgba(239,68,68,0.5)' }}>{current}</div>
        </div>
      </div>
    </div>
  );
}
