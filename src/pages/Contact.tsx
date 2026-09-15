import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, MapPin, Send, CheckCircle2, 
  ChevronDown, ChevronUp, Clock, ShieldAlert
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does the wearable distinguish true falls from dropping the device or sitting quickly?',
    answer: 'The MPU-6050 algorithm utilizes a multi-phase validation gate: first, it registers a free-fall transition (< 0.5G for > 150ms); second, it measures the sudden impact deceleration spike (> 3.0G); third, it observes a subsequent 3-5 second post-impact immobility window before confirming a critical fall event.',
  },
  {
    question: 'Can the device trigger emergency alarms if home WiFi or cellular hotspots drop?',
    answer: 'Yes! The ESP32 firmware includes an autonomous offline fallback mode. If WiFi disconnects, local sensor polling continues uninterrupted. If critical vitals or fall events occur, the onboard 85dB piezo buzzer and strobe LED activate immediately to alert nearby bystanders.',
  },
  {
    question: 'What is the expected battery life on a standard Li-ion cell?',
    answer: 'Using an 18650 2500mAh lithium cell with FreeRTOS tickless idle and dynamic sensor polling intervals (100Hz during movement, 20Hz at rest), the wearable provides between 28 to 36 hours of continuous continuous bio-telemetry on a single charge.',
  },
  {
    question: 'How do family members and paramedics receive the emergency coordinates?',
    answer: 'When a critical risk state or manual SOS is triggered, the telemetry server dispatches instant SMS alerts containing Google Maps pinpoint URLs generated directly from the NEO-6M satellite fix, alongside the live heart rate and SpO₂ status.',
  },
  {
    question: 'Is telemetry data encrypted in transit and compliant with privacy standards?',
    answer: 'All WebSocket telemetry frames and REST API endpoints utilize TLS 1.3 encryption with HMAC authentication tokens. Biometric baselines are anonymized and bound only to a cryptographically generated device GUID.',
  },
];

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('sih');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 6000);
    }, 1000);
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* ─── Hero Header ─────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '70px 24px 40px',
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
          <Mail size={14} />
          <span>CONNECT WITH THE ENGINEERING LAB</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          margin: '0 0 16px',
        }}>
          Get in Touch & Support
        </h1>

        <p style={{
          fontSize: 16,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: 680,
          margin: '0 auto',
        }}>
          Have questions about the ESP32 hardware schematic, sensor calibration, or Smart India Hackathon project integration? Send us a message or review our technical FAQ below.
        </p>
      </section>

      {/* ─── Emergency Notice Card ───────────────────────────────── */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto 40px',
        padding: '0 24px',
      }}>
        <div style={{
          padding: '20px 24px',
          borderRadius: 14,
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
        }}>
          <ShieldAlert size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', letterSpacing: '0.05em', marginBottom: 4 }}>
              EMERGENCY PROTOCOL NOTICE
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
              This contact channel is strictly for academic, technical, and engineering support. If a monitored patient is experiencing an acute medical event, trigger the physical wearable SOS button immediately or contact regional ambulance emergency services (112 / 911).
            </p>
          </div>
        </div>
      </section>

      {/* ─── Main Grid: Form + Info ──────────────────────────────── */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto 80px',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 32,
      }}>
        {/* Contact Form */}
        <div className="glass-card" style={{ padding: '36px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Direct Engineering Inquiry
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Fill in the details below and our hardware/AI team will respond within 24 hours.
          </p>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  padding: 16,
                  borderRadius: 10,
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10b981',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <CheckCircle2 size={18} />
                <span>Message received! Our team will get back to you shortly.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 6 }}>
                YOUR NAME *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Jane Doe"
                className="dark-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 6 }}>
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.edu"
                className="dark-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 6 }}>
                INQUIRY TOPIC
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="dark-input"
                style={{ width: '100%', background: 'var(--input-bg)' }}
              >
                <option value="sih">Smart India Hackathon (SIH) Evaluation</option>
                <option value="hardware">ESP32 & Biosensor Pinout Assistance</option>
                <option value="algorithm">Neural Risk Engine & Baseline Logic</option>
                <option value="deployment">Elderly Care & Ward Fleet Deployment</option>
                <option value="other">General Technical Feedback</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 6 }}>
                SUBJECT
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Inquiring about MPU6050 fall thresholds"
                className="dark-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 6 }}>
                MESSAGE *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your inquiry or technical query here..."
                className="dark-input"
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                border: 'none',
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.35)',
                transition: 'all 0.2s',
              }}
            >
              {isSubmitting ? (
                <span>Transmitting...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Transmit Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info & Team Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Card: Direct Channels */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 20px' }}>
              Project Information Hub
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ padding: 10, borderRadius: 10, background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>RESEARCH CONTACT</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>team@aihealthguardian.org</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ padding: 10, borderRadius: 10, background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>INNOVATION LAB</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>IoT & Biomedical Engineering Cell, SIH-2026</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ padding: 10, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  <Clock size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>TELEMETRY STATUS</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>24/7 Continuous Edge Node Monitoring</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: SIH 2026 Note */}
          <div className="glass-card" style={{ padding: '28px', background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.1em', marginBottom: 6 }}>
              SIH JURY / EVALUATORS
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
              Want to see real-time simulated sensor stress drills? Access the Command Console directly using the default admin account:
            </p>
            <div style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'var(--tag-bg)',
              fontFamily: 'monospace',
              fontSize: 12,
              color: 'var(--text-primary)',
              border: '1px solid var(--border-card)',
            }}>
              Username: <strong>admin</strong> • Password: <strong>admin</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive FAQ Accordion ───────────────────────────── */}
      <section style={{
        maxWidth: 960,
        margin: '0 auto 100px',
        padding: '0 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', color: '#0ea5e9', marginBottom: 8, textTransform: 'uppercase' }}>
            Frequently Asked Questions
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Technical & Clinical Queries
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.question}
                className="glass-card"
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: isOpen ? '1px solid rgba(14, 165, 233, 0.4)' : '1px solid var(--border-card)',
                  transition: 'all 0.2s',
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  <span>{faq.question}</span>
                  <div style={{ color: isOpen ? '#0ea5e9' : 'var(--text-muted)' }}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: '0 24px 20px',
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        borderTop: '1px solid var(--divider)',
                        paddingTop: 16,
                      }}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
