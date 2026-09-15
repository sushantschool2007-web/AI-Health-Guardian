import React from 'react';
import Header from '../components/Header';
import { Shield, Lock, EyeOff } from 'lucide-react';

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header title="Privacy & Security" subtitle="Data handling protocols and medical disclaimers" />
      
      <div style={{ padding: '24px 32px', maxWidth: 900, margin: '0 auto' }}>
        
        {/* Medical Disclaimer */}
        <div className="glass-card" style={{ padding: '32px', marginBottom: 24, borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,0.05)' }}>
          <div style={{ fontSize: 14, color: '#f59e0b', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={20} /> MEDICAL DISCLAIMER
          </div>
          <p style={{ fontSize: 15, color: '#fcd34d', lineHeight: 1.6, margin: '0 0 12px' }}>
            AI Health Guardian is a <strong>research prototype</strong> and is <strong>not a certified medical device</strong>.
          </p>
          <p style={{ fontSize: 14, color: '#fbbf24', opacity: 0.8, lineHeight: 1.6, margin: 0 }}>
            This system provides early health-risk assessment and potential risk detection only. It does not diagnose diseases, prescribe treatments, or replace professional medical advice. The risk levels displayed are indicative estimates based on sensor data and user-configured baselines.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock size={18} color="#0ea5e9" /> DATA PRIVACY PRINCIPLES
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Prin title="Edge-First Processing" desc="All AI risk calculations are performed locally on the ESP32 and in-browser. No raw health data is sent to external cloud servers in this prototype." />
            <Prin title="Minimal Data Transmission" desc="Only necessary sensor readings (HR, SpO₂, temperature, activity, GPS) are transmitted between the ESP32 and the dashboard." />
            <Prin title="No Persistent Cloud Storage" desc="Health history is stored in browser memory only. No data is written to external databases without explicit user consent." />
            <Prin title="GPS Privacy" desc="GPS coordinates are used exclusively for emergency response location sharing. Location data is not tracked continuously in production without consent." />
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <EyeOff size={18} color="#8b5cf6" /> AI ETHICS & TRANSPARENCY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Prin title="Explainable AI" desc="The risk engine provides contributing factors and explanations for every risk assessment. No 'black box' decisions." />
            <Prin title="No Diagnostic Claims" desc="Risk language uses terms like 'Potential Risk Detected' and 'Early Warning' — never 'Diagnosis'." />
            <Prin title="Human Override" desc="Caregivers and patients can always override system recommendations via the Manual Override SOS button." />
          </div>
        </div>
        
      </div>
    </div>
  );
}

function Prin({ title, desc }: any) {
  return (
    <div style={{ paddingLeft: 16, borderLeft: '2px solid var(--input-border)' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}
