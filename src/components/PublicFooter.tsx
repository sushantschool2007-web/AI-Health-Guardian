import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Cpu, Radio } from 'lucide-react';
import { useAppState } from '../context/AppContext';

export default function PublicFooter() {
  const { state } = useAppState();

  return (
    <footer style={{
      borderTop: '1px solid var(--border-card)',
      background: state.theme === 'dark' ? 'rgba(3, 7, 18, 0.85)' : 'rgba(248, 250, 252, 0.9)',
      backdropFilter: 'blur(16px)',
      marginTop: 80,
      position: 'relative',
      zIndex: 10,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '60px 24px 30px',
      }}>
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 40,
          marginBottom: 48,
        }}>
          {/* Col 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Activity size={18} color="#fff" />
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                AI HEALTH GUARDIAN
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              Autonomous multi-sensor bio-telemetry and edge AI predictive triage. Engineered for continuous preventive monitoring, rapid fall detection, and zero-latency emergency escalation.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: 11, color: '#10b981', fontWeight: 600 }}>
              <Radio size={12} className="animate-pulse" />
              <span>Edge Telemetry Engine Active</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: 16, textTransform: 'uppercase' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>
                <Link to="/" style={{ textDecoration: 'none', fontSize: 13, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
                  Overview & Live Preview
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ textDecoration: 'none', fontSize: 13, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
                  System Architecture & Hardware
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ textDecoration: 'none', fontSize: 13, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
                  Contact Engineering Team
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ textDecoration: 'none', fontSize: 13, color: '#0ea5e9', fontWeight: 600, transition: 'color 0.2s' }}>
                  Secure Console Sign In
                </Link>
              </li>
              <li>
                <Link to="/privacy" style={{ textDecoration: 'none', fontSize: 13, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
                  Patient Data Privacy & Telemetry
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Wearable Hardware Spec */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: 16, textTransform: 'uppercase' }}>
              Hardware Integration
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Cpu size={14} color="#0ea5e9" /> ESP32-WROOM-32 (240MHz Dual Core)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={14} color="#ef4444" /> MAX30102 High-Sensitivity Pulse/SpO₂
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={14} color="#f59e0b" /> MPU-6050 6-Axis IMU Fall Acceleration
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Radio size={14} color="#10b981" /> NEO-6M High-Precision GPS Tracker
              </li>
            </ul>
          </div>

          {/* Col 4: SIH Hackathon & Emergency Disclaimer */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: 16, textTransform: 'uppercase' }}>
              Smart India Hackathon
            </h4>
            <div style={{
              padding: 16,
              borderRadius: 12,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                SIH Problem Statement Focus
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Intelligent wearable bio-telemetry for preventive medical care, solitary worker safety, and elderly remote monitoring.
              </p>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              * Medical notice: Algorithmic risk predictions assist healthcare triage and do not supersede professional clinical diagnosis.
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div style={{
          paddingTop: 24,
          borderTop: '1px solid var(--divider)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          fontSize: 12,
          color: 'var(--text-muted)',
        }}>
          <div>
            © {new Date().getFullYear()} AI Health Guardian. Built with precision for SIH. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span>Telemetry WebSocket: Ready</span>
            <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
            <span>Encrypted AES-256 Transport</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
