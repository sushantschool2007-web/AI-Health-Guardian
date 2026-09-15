import React from 'react';
import Header from '../components/Header';
import { useAppState } from '../context/AppContext';
import { DEMO_SCENARIOS } from '../demo/scenarios';

export default function DemoMode() {
  const { state, activateDemoScenario, resolveEmergency } = useAppState();

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header title="Ideathon Scenarios" subtitle="Simulate hardware data for presentation" />
      
      <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
        
        <div className="glass-card" style={{ padding: '24px', marginBottom: 24, borderLeft: '4px solid #0ea5e9' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', marginBottom: 4 }}>
            SIMULATION ENGINE ACTIVE
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Select a scenario below. The dashboard will immediately react, visualizing the SENSE → PREDICT → DECIDE → ACT flow.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 32 }}>
          {DEMO_SCENARIOS.map(scenario => {
            const isActive = state.activeDemoScenario === scenario.id;
            const rColor = scenario.expectedRisk === 'LOW' ? '#10b981' : scenario.expectedRisk === 'MEDIUM' ? '#f59e0b' : scenario.expectedRisk === 'HIGH' ? '#f97316' : '#ef4444';
            
            return (
              <button
                key={scenario.id}
                onClick={() => activateDemoScenario(scenario.data, scenario.id)}
                style={{
                  textAlign: 'left', padding: '20px', borderRadius: 12, cursor: 'pointer',
                  background: isActive ? `var(--bg-card)` : 'rgba(15,23,42,0.4)',
                  border: `1px solid ${isActive ? rColor : 'var(--border-card)'}`,
                  boxShadow: isActive ? `0 0 20px ${rColor}30, inset 0 0 10px ${rColor}10` : 'none',
                  transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                }}
              >
                {isActive && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: rColor, boxShadow: `0 0 10px ${rColor}` }} />}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{scenario.icon}</span> {scenario.name}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: rColor, letterSpacing: '0.1em', background: `${rColor}20`, padding: '2px 8px', borderRadius: 4, border: `1px solid ${rColor}40` }}>
                    {scenario.expectedRisk}
                  </div>
                </div>
                
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  {scenario.description}
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <DataPill label="HR" val={scenario.data.heartRate} />
                  <DataPill label="SpO₂" val={`${scenario.data.spo2}%`} />
                  <DataPill label="TEMP" val={`${scenario.data.temperature}°`} />
                  {scenario.data.fallDetected && <DataPill label="FALL" val="YES" alert />}
                </div>
              </button>
            );
          })}
        </div>

        {state.emergencyState.status !== 'NORMAL' && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={resolveEmergency}
              style={{
                background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid #10b981', borderRadius: 8,
                padding: '12px 24px', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', cursor: 'pointer',
                boxShadow: '0 0 15px rgba(16,185,129,0.2)'
              }}
            >
              RESOLVE ACTIVE EMERGENCY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DataPill({ label, val, alert }: any) {
  return (
    <div style={{ 
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
      background: alert ? 'rgba(239,68,68,0.2)' : 'var(--tag-bg)',
      color: alert ? '#fca5a5' : 'var(--text-secondary)', border: `1px solid ${alert ? 'rgba(239,68,68,0.3)' : 'var(--tag-border)'}`
    }}>
      <span style={{ opacity: 0.7, marginRight: 4 }}>{label}</span> {val}
    </div>
  );
}
