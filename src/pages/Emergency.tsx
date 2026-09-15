import React from 'react';
import Header from '../components/Header';
import { useAppState } from '../context/AppContext';
import { AlertTriangle, MapPin, ShieldAlert } from 'lucide-react';

export default function Emergency() {
  const { state, triggerVirtualSOS, resolveEmergency } = useAppState();
  const { emergencyState: e, currentData: d } = state;
  const isEmergency = e.status !== 'NORMAL';

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header title="Emergency Control Center" subtitle="Critical response protocols and manual overrides" />
      
      <div style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto' }}>
        
        {isEmergency ? (
          <div className="glass-card animate-slide-up" style={{ 
            background: 'rgba(20, 0, 0, 0.8)', border: '2px solid rgba(239, 68, 68, 0.8)',
            boxShadow: '0 0 50px rgba(239, 68, 68, 0.2), inset 0 0 30px rgba(239, 68, 68, 0.1)',
            padding: 40, textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}>
            {/* Warning stripes bg */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 16,
              background: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 20px, transparent 20px, transparent 40px)',
              borderBottom: '2px solid #ef4444'
            }} />
            
            <AlertTriangle size={64} color="#ef4444" style={{ animation: 'pulse-danger 1s infinite', margin: '20px auto' }} />
            
            <h2 style={{ margin: 0, fontSize: 36, color: 'var(--text-primary)', fontWeight: 900, letterSpacing: '0.1em', textShadow: '0 0 20px #ef4444' }}>
              EMERGENCY ACTIVE
            </h2>
            <p style={{ fontSize: 18, color: '#ef4444', fontWeight: 600, marginTop: 12, marginBottom: 40 }}>
              {e.reason}
            </p>

            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 40 }}>
              <div style={{ background: 'rgba(239,68,68,0.1)', padding: '20px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', width: 220 }}>
                <div style={{ fontSize: 11, color: '#fca5a5', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Trigger Source</div>
                <div style={{ fontSize: 16, color: 'var(--text-primary)', fontWeight: 800 }}>{e.status === 'SOS_ACTIVE' ? 'HARDWARE BUTTON' : 'AI SENSOR FUSION'}</div>
              </div>
              <div style={{ background: 'rgba(239,68,68,0.1)', padding: '20px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', width: 220 }}>
                <div style={{ fontSize: 11, color: '#fca5a5', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Location Locked</div>
                <div style={{ fontSize: 16, color: 'var(--text-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <MapPin size={16} color="#ef4444" /> {d.latitude ? 'GPS ACTIVE' : 'SEARCHING'}
                </div>
              </div>
            </div>

            <button
              onClick={resolveEmergency}
              style={{
                background: 'transparent', color: '#10b981', border: '2px solid #10b981', borderRadius: 12,
                padding: '16px 40px', fontSize: 16, fontWeight: 800, letterSpacing: '0.1em',
                cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 20px rgba(16,185,129,0.2)'
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              RESOLVE & STAND DOWN
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 24 }}>
                SYSTEM STATUS
              </div>
              <div style={{ 
                width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 30px rgba(16,185,129,0.2)'
              }}>
                <ShieldAlert size={40} color="#10b981" />
              </div>
              <h3 style={{ margin: '0 0 12px', fontSize: 28, color: '#10b981', fontWeight: 800, letterSpacing: '0.05em' }}>NORMAL</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 400, marginInline: 'auto' }}>
                All emergency protocols are currently inactive. The AI Health Guardian is monitoring telemetry continuously.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 24 }}>
                MANUAL OVERRIDE
              </div>
              <button
                onClick={triggerVirtualSOS}
                style={{
                  width: 180, height: 180, borderRadius: '50%',
                  background: 'radial-gradient(circle, #ef4444 0%, #991b1b 100%)',
                  border: '8px solid var(--tag-border)',
                  boxShadow: '0 0 40px rgba(239,68,68,0.5), inset 0 0 20px rgba(0,0,0,0.5)',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', color: 'white',
                  transition: 'transform 0.1s', outline: 'none'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '0.05em' }}>SOS</span>
                <span style={{ fontSize: 10, fontWeight: 800, opacity: 0.8, marginTop: 8, letterSpacing: '0.1em' }}>TRIGGER</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
