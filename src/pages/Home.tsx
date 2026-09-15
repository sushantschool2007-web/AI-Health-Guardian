import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { 
  Activity, Shield, HeartPulse, Zap, AlertTriangle, 
  Cpu, Navigation, Thermometer, ArrowRight, 
  Sparkles, BellRing
} from 'lucide-react';

interface SimulationPreset {
  id: string;
  name: string;
  heartRate: number;
  spo2: number;
  temperature: number;
  fallDetected: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  statusText: string;
  explanation: string;
  recommendation: string;
}

const PRESETS: SimulationPreset[] = [
  {
    id: 'normal',
    name: 'Normal Vitals',
    heartRate: 72,
    spo2: 98,
    temperature: 36.6,
    fallDetected: false,
    riskLevel: 'LOW',
    statusText: 'ALL VITALS NOMINAL',
    explanation: 'Cardiovascular and respiratory parameters are well within established baseline limits.',
    recommendation: 'Continuous routine telemetry active. No caregiver action required.',
  },
  {
    id: 'tachycardia',
    name: 'Tachycardia & Pyrexia',
    heartRate: 138,
    spo2: 95,
    temperature: 38.9,
    fallDetected: false,
    riskLevel: 'HIGH',
    statusText: 'ELEVATED CARDIOVASCULAR DISTRESS',
    explanation: 'Sustained heart rate above 135 BPM combined with high core temperature indicate fever stress or exertion overload.',
    recommendation: 'Prompt patient to sit and rehydrate. Sending alert notification to primary caregiver.',
  },
  {
    id: 'hypoxia',
    name: 'Severe Hypoxia',
    heartRate: 114,
    spo2: 86,
    temperature: 36.4,
    fallDetected: false,
    riskLevel: 'CRITICAL',
    statusText: 'ACUTE RESPIRATORY DESATURATION',
    explanation: 'Blood oxygen saturation has dropped below safe threshold (86%). Risk of hypoxemia and organ distress.',
    recommendation: 'Immediate medical escalation triggered. Sounding wearable buzzer and notifying emergency contacts.',
  },
  {
    id: 'fall',
    name: 'Kinetic Fall Event',
    heartRate: 128,
    spo2: 93,
    temperature: 36.5,
    fallDetected: true,
    riskLevel: 'CRITICAL',
    statusText: 'CRITICAL IMPACT DETECTED',
    explanation: 'Sudden free-fall acceleration followed by high-G impact and post-fall immobility confirmed by 6-axis IMU.',
    recommendation: 'Autonomous SOS triggered. Transmitting precise GPS coordinates to emergency dispatch.',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Home() {
  const [selectedPreset, setSelectedPreset] = useState<SimulationPreset>(PRESETS[0]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const riskColor = getRiskColor(selectedPreset.riskLevel);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '80px 24px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Glowing Top Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
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
            marginBottom: 24,
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.15)',
          }}
        >
          <Sparkles size={14} />
          <span>SMART INDIA HACKATHON 2026 INNOVATION</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: 960,
            margin: '0 0 24px',
            color: 'var(--text-primary)',
          }}
        >
          Autonomous Bio-Telemetry &{' '}
          <span style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Edge AI Medical Guardian
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: 760,
            lineHeight: 1.6,
            margin: '0 0 40px',
          }}
        >
          Combining ESP32 dual-core edge microcontrollers, optical pulse oximetry, 6-axis kinetic fall analytics, and real-time neural risk triage to protect solitary workers, elderly patients, and acute care individuals before emergencies turn fatal.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            justifyContent: 'center',
            marginBottom: 60,
          }}
        >
          <Link
            to="/login"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 32px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 700,
              boxShadow: '0 0 30px rgba(14, 165, 233, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(14, 165, 233, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(14, 165, 233, 0.4)';
            }}
          >
            <Shield size={18} />
            <span>Launch Command Console</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/about"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              borderRadius: 12,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-primary)',
              fontSize: 15,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <Cpu size={18} color="#0ea5e9" />
            <span>Explore Architecture</span>
          </Link>
        </motion.div>

        {/* Real-time Telemetry Status Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="glass-card"
          style={{
            width: '100%',
            maxWidth: 960,
            padding: '20px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 20,
            alignItems: 'center',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 10, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <HeartPulse size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>HEART RATE</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>72 <span style={{ fontSize: 11, fontWeight: 500 }}>BPM</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 10, background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
              <Activity size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>BLOOD OXYGEN</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>98 <span style={{ fontSize: 11, fontWeight: 500 }}>% SpO₂</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 10, background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Thermometer size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>BODY TEMP</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>36.6 <span style={{ fontSize: 11, fontWeight: 500 }}>°C</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Navigation size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>GPS TELEMETRY</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>LOCKED <span style={{ fontSize: 11, fontWeight: 500 }}>• 8 Sats</span></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Interactive AI Triage Sandbox ───────────────────────── */}
      <section style={{
        maxWidth: 1280,
        margin: '40px auto 100px',
        padding: '0 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', color: '#0ea5e9', marginBottom: 8, textTransform: 'uppercase' }}>
            Interactive Simulation
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            Experience the Neural Decision Engine
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto' }}>
            Select a clinical scenario below to see how our multi-sensor algorithmic risk model evaluates biometric telemetry and triggers protective countermeasures in milliseconds.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'center',
          marginBottom: 32,
        }}>
          {PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isSelected ? 'rgba(14, 165, 233, 0.2)' : 'var(--bg-card)',
                  border: isSelected ? '1px solid #0ea5e9' : '1px solid var(--border-card)',
                  color: isSelected ? '#38bdf8' : 'var(--text-secondary)',
                  boxShadow: isSelected ? '0 0 20px rgba(14, 165, 233, 0.25)' : 'none',
                }}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* Sandbox Arena Card */}
        <div className="glass-card" style={{
          padding: '40px',
          border: `1px solid ${riskColor}50`,
          boxShadow: `0 0 35px ${riskColor}20`,
          transition: 'all 0.4s ease',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
            alignItems: 'center',
          }}>
            {/* Left: Sensor Metrics Output */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: 20 }}>
                ACTIVE SIMULATED TELEMETRY
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 18, borderRadius: 12, background: 'var(--node-bg)', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>PULSE RATE</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
                    {selectedPreset.heartRate} <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>BPM</span>
                  </div>
                </div>

                <div style={{ padding: 18, borderRadius: 12, background: 'var(--node-bg)', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>OXYGEN SATURATION</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: selectedPreset.spo2 < 90 ? '#ef4444' : 'var(--text-primary)' }}>
                    {selectedPreset.spo2}% <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>SpO₂</span>
                  </div>
                </div>

                <div style={{ padding: 18, borderRadius: 12, background: 'var(--node-bg)', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>CORE TEMPERATURE</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: selectedPreset.temperature > 38 ? '#f59e0b' : 'var(--text-primary)' }}>
                    {selectedPreset.temperature} <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>°C</span>
                  </div>
                </div>

                <div style={{ padding: 18, borderRadius: 12, background: 'var(--node-bg)', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>IMU FALL VECTOR</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: selectedPreset.fallDetected ? '#ef4444' : '#10b981', marginTop: 4 }}>
                    {selectedPreset.fallDetected ? 'CRITICAL IMPACT' : 'STABLE (1.0G)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: AI Synthesis & Recommendation */}
            <div style={{
              padding: 28,
              borderRadius: 16,
              background: 'var(--tag-bg)',
              border: `1px solid ${riskColor}40`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                  NEURAL INFERENCE RESULT
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 800,
                  background: `${riskColor}20`,
                  color: riskColor,
                  border: `1px solid ${riskColor}60`,
                  boxShadow: `0 0 12px ${riskColor}40`,
                }}>
                  {selectedPreset.riskLevel} RISK
                </span>
              </div>

              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
                {selectedPreset.statusText}
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                {selectedPreset.explanation}
              </p>

              <div style={{
                padding: 14,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.04)',
                borderLeft: `3px solid ${riskColor}`,
                fontSize: 12,
                color: 'var(--text-primary)',
                lineHeight: 1.5,
              }}>
                <strong>Automated Action:</strong> {selectedPreset.recommendation}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6 Core Capabilities ─────────────────────────────────── */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto 100px',
        padding: '0 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', color: '#0ea5e9', marginBottom: 8, textTransform: 'uppercase' }}>
            System Capabilities
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            Precision Bio-Telemetry Architecture
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto' }}>
            Engineered from silicon to cloud to provide unbreakable medical surveillance and intelligent threat mitigation.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <HeartPulse size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
              Optical PPG Biosensing
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              MAX30102 integrated pulse oximeter with red and infrared LEDs. Measures arterial oxygen saturation (SpO₂) and pulse waveform at 100Hz with ambient light rejection.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
              6-Axis Kinetic Fall Engine
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              MPU-6050 accelerometer and gyroscope detecting weightlessness free-fall transitions followed by hard impact spike and immobility verification, eradicating false alerts.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
              ESP32 Edge Microcontroller
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Tensilica 240MHz dual-core processing. Performs local data filtering and baseline checking right on the wearable so emergency buzzers trigger even if WiFi disconnects.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Navigation size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
              Precision GPS Dispatch
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              NEO-6M satellite receiver provides exact latitude and longitude telemetry, embedding actionable emergency links into automated SMS alerts to family and paramedics.
            </p>
          </motion.div>

          {/* Card 5 */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
              Adaptive Personal Baseline
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Learns individual resting heart rate, age factors, and existing chronic conditions. Replaces generic one-size-fits-all medical rules with dynamic deviation metrics.
            </p>
          </motion.div>

          {/* Card 6 */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <BellRing size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
              Zero-Latency Cloud Escalation
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Bi-directional WebSocket streaming instantly pushes vital fluctuations to the command dashboard, caregiver smartphones, and monitoring ward stations under 800ms.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── 4-Step Pipeline Flow ─────────────────────────────────── */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto 100px',
        padding: '0 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', color: '#0ea5e9', marginBottom: 8, textTransform: 'uppercase' }}>
            System Pipeline
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            From Wearable Pulse to Emergency Response
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          position: 'relative',
        }}>
          {[
            { step: '01', title: 'Bio-Sensing', desc: 'MAX30102, MPU6050 & DS18B20 continuously sample micro-pulses and kinetic acceleration.' },
            { step: '02', title: 'Edge Preprocessing', desc: 'ESP32 filters signal artifacts, calibrates moving averages, and checks local threshold safety.' },
            { step: '03', title: 'Neural Triage', desc: 'Algorithm cross-correlates heart rate spikes, oxygen drops, and fall vectors against baseline.' },
            { step: '04', title: 'Autonomous Action', desc: 'Fires loud onboard piezo buzzer, LED strobe, and pushes live GPS coordinates to hospital dispatch.' },
          ].map((item) => (
            <div key={item.step} className="glass-card" style={{ padding: 28, position: 'relative' }}>
              <div style={{
                fontSize: 32,
                fontWeight: 900,
                color: 'rgba(14, 165, 233, 0.25)',
                marginBottom: 12,
                fontFamily: 'Outfit, sans-serif',
              }}>
                {item.step}
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Bottom CTA Banner ───────────────────────────────────── */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto 60px',
        padding: '0 24px',
      }}>
        <div className="glass-card" style={{
          padding: '50px 40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1))',
          border: '1px solid rgba(14, 165, 233, 0.3)',
          boxShadow: '0 0 50px rgba(14, 165, 233, 0.15)',
        }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 16px' }}>
            Ready to inspect real-time patient telemetry?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 32px' }}>
            Access the AI Medical Command Center, review live sensor feeds, customize baseline risk models, and execute simulated crisis drills.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 32px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 700,
                boxShadow: '0 0 25px rgba(14, 165, 233, 0.4)',
              }}
            >
              <Shield size={18} />
              <span>Launch Command Center</span>
            </Link>
            <Link
              to="/contact"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                borderRadius: 10,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-primary)',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              <span>Contact Engineering Team</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
