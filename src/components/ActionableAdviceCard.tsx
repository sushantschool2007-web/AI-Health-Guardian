import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, AlertTriangle, Activity, CheckCircle2, 
  Clock, Copy, Check, PhoneCall, ChevronDown, ChevronUp,
  Stethoscope, XCircle
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import type { ClinicalAdvice } from '../types';

interface ActionableAdviceCardProps {
  compact?: boolean;
}

export default function ActionableAdviceCard({ compact = false }: ActionableAdviceCardProps) {
  const { state, dispatch } = useAppState();
  const advice: ClinicalAdvice = state.riskAssessment.advice;

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(advice.recheckIntervalMinutes * 60);
  const [expanded, setExpanded] = useState(!compact);
  const [prevHeadline, setPrevHeadline] = useState(advice.headline);

  // Synchronize timer duration when advice changes
  if (prevHeadline !== advice.headline) {
    setPrevHeadline(advice.headline);
    setTimeLeft(advice.recheckIntervalMinutes * 60);
    setTimerRunning(false);
  }

  // Countdown timer effect
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopySummary = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(advice.doctorSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getUrgencyTheme = (urgency: ClinicalAdvice['urgencyLevel']) => {
    switch (urgency) {
      case 'CRITICAL_EMERGENCY':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.4)',
          color: '#ef4444',
          label: 'CRITICAL ACTION REQUIRED',
          icon: <ShieldAlert size={20} color="#ef4444" />,
          pulse: true,
        };
      case 'HIGH_ATTENTION':
        return {
          bg: 'rgba(249, 115, 22, 0.1)',
          border: 'rgba(249, 115, 22, 0.4)',
          color: '#f97316',
          label: 'HIGH ATTENTION ADVISED',
          icon: <AlertTriangle size={20} color="#f97316" />,
          pulse: false,
        };
      case 'MODERATE_MONITOR':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.35)',
          color: '#f59e0b',
          label: 'MODERATE MONITORING ACTIVE',
          icon: <Activity size={20} color="#f59e0b" />,
          pulse: false,
        };
      default:
        return {
          bg: 'rgba(16, 185, 129, 0.08)',
          border: 'rgba(16, 185, 129, 0.3)',
          color: '#10b981',
          label: 'VITALS OPTIMAL • ROUTINE GUIDANCE',
          icon: <CheckCircle2 size={20} color="#10b981" />,
          pulse: false,
        };
    }
  };

  const theme = getUrgencyTheme(advice.urgencyLevel);
  const totalSteps = advice.immediateSteps.length;
  const finishedStepsCount = advice.immediateSteps.filter((s) => completedSteps[s.id]).length;
  const progressPercent = totalSteps > 0 ? Math.round((finishedStepsCount / totalSteps) * 100) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        border: `1px solid ${theme.border}`,
        boxShadow: theme.pulse ? `0 0 35px ${theme.color}25` : 'var(--shadow-card)',
        background: `linear-gradient(135deg, ${theme.bg}, var(--bg-card))`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            padding: 8,
            borderRadius: 10,
            background: `${theme.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: theme.pulse ? 'pulse-danger 1.5s infinite' : 'none',
          }}>
            {theme.icon}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: theme.color, textTransform: 'uppercase' }}>
              {theme.label}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
              {advice.headline}
            </h3>
          </div>
        </div>

        {compact && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'var(--tag-bg)',
              border: '1px solid var(--tag-border)',
              color: 'var(--text-secondary)',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <span>{expanded ? 'Collapse' : 'Details'}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {/* Primary Narrative Summary */}
      <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 20px' }}>
        {advice.summary}
      </p>

      {/* Expandable Body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            {/* Step-by-Step Interactive Checklist */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Stethoscope size={14} color="#0ea5e9" />
                  <span>STEP-BY-STEP CLINICAL ACTION PLAN</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: progressPercent === 100 ? '#10b981' : 'var(--text-secondary)' }}>
                  {finishedStepsCount}/{totalSteps} Steps Complete ({progressPercent}%)
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 14 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                  style={{ height: '100%', background: progressPercent === 100 ? '#10b981' : theme.color }}
                />
              </div>

              {/* Steps List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {advice.immediateSteps.map((step, idx) => {
                  const isDone = !!completedSteps[step.id];
                  return (
                    <div
                      key={step.id}
                      onClick={() => toggleStep(step.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: isDone ? 'rgba(16, 185, 129, 0.08)' : 'var(--node-bg)',
                        border: isDone ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-card)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        marginTop: 2,
                        width: 18,
                        height: 18,
                        borderRadius: 5,
                        border: isDone ? 'none' : '1px solid var(--input-border)',
                        background: isDone ? '#10b981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {isDone && <Check size={12} color="#fff" strokeWidth={3} />}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <span style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: isDone ? '#10b981' : 'var(--text-primary)',
                            textDecoration: isDone ? 'line-through' : 'none',
                          }}>
                            {idx + 1}. {step.title}
                          </span>
                          <span style={{
                            fontSize: 9,
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: step.urgency === 'immediate' ? 'rgba(239,68,68,0.2)' : 'rgba(14,165,233,0.15)',
                            color: step.urgency === 'immediate' ? '#ef4444' : '#0ea5e9',
                          }}>
                            {step.urgency.toUpperCase()}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Do's & Don'ts Safety Protocols */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
              marginBottom: 24,
            }}>
              {/* DO's */}
              <div style={{
                padding: '14px 16px',
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', letterSpacing: '0.08em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} /> RECOMMENDED DO'S
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {advice.dos.map((item, i) => (
                    <li key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <span style={{ color: '#10b981', fontWeight: 800 }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DON'Ts */}
              <div style={{
                padding: '14px 16px',
                borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', letterSpacing: '0.08em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <XCircle size={14} /> CRITICAL DON'TS
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {advice.donts.map((item, i) => (
                    <li key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <span style={{ color: '#ef4444', fontWeight: 800 }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Tools Bar */}
            <div style={{
              paddingTop: 16,
              borderTop: '1px solid var(--divider)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              {/* Countdown Re-Check Timer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: timerRunning ? 'rgba(245, 158, 11, 0.15)' : 'var(--tag-bg)',
                    border: timerRunning ? '1px solid #f59e0b' : '1px solid var(--tag-border)',
                    color: timerRunning ? '#f59e0b' : 'var(--text-secondary)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Clock size={14} />
                  <span>{timerRunning ? `Re-Check: ${formatTime(timeLeft)}` : `Start ${advice.recheckIntervalMinutes}m Timer`}</span>
                </button>

                {timeLeft === 0 && (
                  <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, animation: 'pulse-danger 1s infinite' }}>
                    Re-check vitals now!
                  </span>
                )}
              </div>

              {/* Action Buttons: Copy Summary & SOS Dispatch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={handleCopySummary}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: copied ? 'rgba(16, 185, 129, 0.2)' : 'var(--tag-bg)',
                    border: copied ? '1px solid #10b981' : '1px solid var(--tag-border)',
                    color: copied ? '#10b981' : 'var(--text-secondary)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  title="Copy formatted clinical summary for doctor or family"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Summary Copied!' : 'Copy Doctor Summary'}</span>
                </button>

                {advice.urgencyLevel === 'CRITICAL_EMERGENCY' && (
                  <button
                    onClick={() => dispatch({ type: 'TRIGGER_SOS' })}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 14px',
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    <PhoneCall size={14} />
                    <span>Trigger Emergency SOS</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
