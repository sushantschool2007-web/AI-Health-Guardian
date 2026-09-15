import React, { useState } from 'react';
import Header from '../components/Header';
import { useAppState } from '../context/AppContext';
import { User, Settings2, Wifi } from 'lucide-react';
import type { PersonalBaseline } from '../types';

interface FieldProps {
  label: string;
  value: any;
  onChange: (val: any) => void;
  type?: string;
  step?: number;
  icon?: React.ReactNode;
}

function Field({ label, value, onChange, type = 'number', step, icon }: FieldProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 700, letterSpacing: '0.05em' }}>
        {icon} {label}
      </label>
      <input
        type={type}
        value={value}
        step={step || 1}
        onChange={e => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
        className="dark-input"
      />
    </div>
  );
}

export default function Settings() {
  const { state, dispatch } = useAppState();
  const [form, setForm] = useState<PersonalBaseline>({ ...state.baseline });
  const [saved, setSaved] = useState(false);

  const save = () => {
    dispatch({ type: 'UPDATE_BASELINE', payload: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header title="System Configuration" subtitle="Configure AI baseline and connection parameters" />
      
      <div style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Patient Info */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <User size={18} color="#0ea5e9" /> PATIENT PROFILE
            </div>
            <Field label="FULL NAME" value={form.name} type="text" onChange={(v: string) => setForm(f => ({ ...f, name: v }))} />
            <Field label="AGE" value={form.age} onChange={(v: number) => setForm(f => ({ ...f, age: v }))} />
            
            <div style={{ marginTop: 24 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 700, letterSpacing: '0.05em' }}>KNOWN CONDITIONS (CSV)</label>
              <input
                type="text" value={form.conditions.join(', ')}
                onChange={e => setForm(f => ({ ...f, conditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                className="dark-input"
              />
            </div>
          </div>

          {/* AI Baseline */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Settings2 size={18} color="#8b5cf6" /> AI RISK BASELINE
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="MIN HR (BPM)" value={form.heartRateMin} onChange={(v: number) => setForm(f => ({ ...f, heartRateMin: v }))} />
              <Field label="MAX HR (BPM)" value={form.heartRateMax} onChange={(v: number) => setForm(f => ({ ...f, heartRateMax: v }))} />
              <Field label="MIN SpO₂ (%)" value={form.spo2Min} onChange={(v: number) => setForm(f => ({ ...f, spo2Min: v }))} />
              <div />
              <Field label="MIN TEMP (°C)" value={form.temperatureMin} step={0.1} onChange={(v: number) => setForm(f => ({ ...f, temperatureMin: v }))} />
              <Field label="MAX TEMP (°C)" value={form.temperatureMax} step={0.1} onChange={(v: number) => setForm(f => ({ ...f, temperatureMax: v }))} />
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 700, letterSpacing: '0.05em' }}>TYPICAL ACTIVITY</label>
              <select
                value={form.typicalActivity}
                onChange={e => setForm(f => ({ ...f, typicalActivity: e.target.value as any }))}
                className="dark-input" style={{ appearance: 'auto' }}
              >
                <option value="RESTING">RESTING</option>
                <option value="WALKING">WALKING</option>
                <option value="RUNNING">RUNNING</option>
                <option value="STATIONARY">STATIONARY</option>
              </select>
            </div>
          </div>
        </div>

        {/* Connections */}
        <div className="glass-card" style={{ padding: '32px', marginTop: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wifi size={18} color="#10b981" /> TELEMETRY CONNECTION
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 700, letterSpacing: '0.05em' }}>ESP32 WEBSOCKET URI</label>
              <input type="text" defaultValue="ws://192.168.1.100:81/ws" className="dark-input" style={{ fontFamily: 'monospace', color: '#38bdf8' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 700, letterSpacing: '0.05em' }}>HTTP FALLBACK URI</label>
              <input type="text" defaultValue="http://192.168.1.100/data" className="dark-input" style={{ fontFamily: 'monospace', color: '#38bdf8' }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <button
            onClick={() => setForm({ ...state.baseline })}
            style={{
              padding: '12px 24px', borderRadius: 8, border: '1px solid rgba(148,163,184,0.3)',
              background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer'
            }}
          >
            RESET
          </button>
          <button
            onClick={save}
            style={{
              padding: '12px 32px', borderRadius: 8, border: '1px solid rgba(14,165,233,0.5)',
              background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', 
              cursor: 'pointer', boxShadow: '0 0 20px rgba(14,165,233,0.2)', transition: 'all 0.2s'
            }}
          >
            {saved ? '✓ APPLIED' : 'APPLY CONFIGURATION'}
          </button>
        </div>

      </div>
    </div>
  );
}
