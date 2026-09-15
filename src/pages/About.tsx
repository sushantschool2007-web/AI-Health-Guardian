import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Target, ArrowRight } from 'lucide-react';

export default function About() {
  const hardwareComponents = [
    {
      name: 'ESP32-WROOM-32',
      category: 'Edge Compute Core',
      specs: 'Xtensa 32-bit LX6 Dual-Core @ 240MHz • 520KB SRAM • WiFi 802.11 b/g/n & BLE',
      role: 'Executes edge anomaly filtering, local risk checks, and bi-directional WebSocket telemetry streaming.',
      color: '#0ea5e9',
    },
    {
      name: 'MAX30102 PPG Biosensor',
      category: 'Pulse & Oximetry',
      specs: 'Dual-wavelength optical PPG (660nm Red / 880nm IR) • 100Hz Sampling • I2C (SDA 21, SCL 22)',
      role: 'Continuous photoplethysmography monitoring for arterial oxygen saturation (SpO₂) and pulse waveforms.',
      color: '#ef4444',
    },
    {
      name: 'MPU-6050 6-Axis IMU',
      category: 'Kinetic Motion & Fall',
      specs: '3-Axis Accelerometer (±16g) + 3-Axis Gyroscope (±2000°/s) • Digital Motion Processor (DMP)',
      role: 'Registers free-fall weightlessness vector followed by high-G impact spike and subsequent immobility.',
      color: '#f59e0b',
    },
    {
      name: 'DS18B20 Digital Thermometer',
      category: 'Core Body Thermal',
      specs: '1-Wire Dallas Protocol (GPIO 4) • 9 to 12-bit Selectable Resolution (±0.5°C accuracy)',
      role: 'Monitors real-time core skin temperature to catch fever spikes, heat stroke, or hypothermia.',
      color: '#10b981',
    },
    {
      name: 'NEO-6M GPS Receiver',
      category: 'Satellite Geolocation',
      specs: '50-Channel u-blox 6 Engine • UART Serial (RX 16, TX 17) • Time-To-First-Fix < 27s',
      role: 'Pinpoints exact coordinates of patient during SOS or fall events for rapid caregiver/paramedic dispatch.',
      color: '#8b5cf6',
    },
    {
      name: 'Local Alarm & OLED Interface',
      category: 'Failsafe Peripherals',
      specs: '0.96" SSD1306 OLED (128x64) • Active 85dB Piezo Buzzer • High-Lumen Emergency Strobe LED',
      role: 'Ensures instantaneous local audible and optical warning even when internet connectivity is severed.',
      color: '#ec4899',
    },
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* ─── Hero Header ─────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '70px 24px 50px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 16px',
          borderRadius: 30,
          background: 'rgba(14, 165, 233, 0.1)',
          border: '1px solid rgba(14, 165, 233, 0.3)',
          color: '#0ea5e9',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          marginBottom: 20,
        }}>
          <Award size={14} />
          <span>SMART INDIA HACKATHON 2026 ARCHITECTURE</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          margin: '0 0 24px',
        }}>
          Engineering Next-Gen{' '}
          <span style={{
            background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Preventive Healthcare
          </span>
        </h1>

        <p style={{
          fontSize: 16,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          maxWidth: 760,
          margin: '0 auto',
        }}>
          The AI Health Guardian was conceived to solve the critical blind spot in modern medicine: acute health crises and falls occur without warning, leaving solitary individuals and elderly patients helpless before paramedics can be notified.
        </p>
      </section>

      {/* ─── Mission & The Problem ───────────────────────────────── */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto 80px',
        padding: '0 24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 32,
        }}>
          {/* Box 1: The Reactive Gap */}
          <div className="glass-card" style={{ padding: 36 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Target size={22} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
              The Reactive Emergency Dilemma
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Commercial consumer smartwatches are fundamentally designed for lifestyle analytics: step counts and sleep cycles. When an elderly person suffers cardiac arrest, severe respiratory desaturation, or a concussive fall, they are frequently unconscious or unable to reach a smartphone to trigger an emergency phone call.
            </p>
          </div>

          {/* Box 2: The Autonomous Solution */}
          <div className="glass-card" style={{ padding: 36 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
              Autonomous Edge AI Safeguard
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              AI Health Guardian operates autonomously at the edge. The wearable node continuously scores vital deviations against the patient’s clinical baseline. If a critical vector anomaly is detected, it does not wait for user confirmation—it alerts bystanders locally and broadcasts live GPS emergency packets over WebSockets to emergency response stations.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Hardware Engineering Stack ──────────────────────────── */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto 80px',
        padding: '0 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', color: '#0ea5e9', marginBottom: 8, textTransform: 'uppercase' }}>
            Hardware Blueprint
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            Physical Sensing & Peripheral Architecture
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 620, margin: '0 auto' }}>
            A unified wearable schematic designed for high fault tolerance, low power consumption, and deterministic sensor polling.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 24,
        }}>
          {hardwareComponents.map((item) => (
            <div
              key={item.name}
              className="glass-card"
              style={{
                padding: 28,
                borderTop: `3px solid ${item.color}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: item.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {item.category}
                  </span>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0' }}>
                    {item.name}
                  </h4>
                </div>
              </div>

              <div style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: 'var(--text-secondary)',
                background: 'var(--tag-bg)',
                padding: '8px 12px',
                borderRadius: 8,
                marginBottom: 16,
                border: '1px solid var(--border-card)',
              }}>
                {item.specs}
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {item.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Neural Risk Model Explanation ───────────────────────── */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto 80px',
        padding: '0 24px',
      }}>
        <div className="glass-card" style={{
          padding: '48px 40px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.5))',
        }}>
          <div style={{ maxWidth: 840 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', color: '#8b5cf6', marginBottom: 8, textTransform: 'uppercase' }}>
              Algorithmic Logic
            </div>
            <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 16px' }}>
              Adaptive Personal Baseline Engine
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
              Instead of relying on rigid, universal thresholds that trigger countless false positives (e.g., a marathon runner’s resting heart rate of 48 BPM triggering bradycardia alarms), our engine builds a tailored Bayesian statistical envelope for each user.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}>
              <div style={{ padding: 18, borderRadius: 10, background: 'var(--node-bg)', border: '1px solid var(--border-card)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0ea5e9', marginBottom: 6 }}>1. Variance Weighting</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Calculates standard standard-deviation scores (Z-scores) across pulse and SpO₂ trajectories.
                </div>
              </div>

              <div style={{ padding: 18, borderRadius: 10, background: 'var(--node-bg)', border: '1px solid var(--border-card)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 6 }}>2. Multi-Sensor Fusion</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Cross-checks temperature anomalies with kinetic activity to differentiate exercise from septic distress.
                </div>
              </div>

              <div style={{ padding: 18, borderRadius: 10, background: 'var(--node-bg)', border: '1px solid var(--border-card)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>3. Fall Verification Gate</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Requires free-fall transition, impact vector threshold, and post-fall immobility verification.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tech Stack Badges ───────────────────────────────────── */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto 100px',
        padding: '0 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: 24, textTransform: 'uppercase' }}>
          Built With Industry-Standard Software Stack
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'center',
        }}>
          {['React 19', 'TypeScript', 'Vite 8', 'Framer Motion', 'Recharts', 'Tailwind CSS v4', 'C++ / Arduino Core', 'WebSockets', 'FreeRTOS ESP32'].map((tech) => (
            <span
              key={tech}
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-primary)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ─── CTA Footer ─────────────────────────────────────────── */}
      <section style={{
        maxWidth: 960,
        margin: '0 auto 60px',
        padding: '0 24px',
        textAlign: 'center',
      }}>
        <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 16px' }}>
          Inspect the Live Telemetry Console
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
          Log in with default credentials or switch into interactive simulation mode to test real-time bio-telemetry.
        </p>
        <Link
          to="/login"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 28px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)',
          }}
        >
          <span>Sign In to Console</span>
          <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}
