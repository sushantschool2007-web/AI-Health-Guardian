import React from 'react';
import { useAppState } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function HealthCore() {
  const { state } = useAppState();
  const { currentData: d, riskAssessment: r } = state;
  const isEmergency = r.level === 'CRITICAL';
  
  // Pulse animation duration based on heart rate
  const pulseDuration = d.heartRate > 0 ? `${60 / d.heartRate}s` : '1s';
  const color = isEmergency ? '#ef4444' : r.level === 'HIGH' ? '#f59e0b' : '#0ea5e9';

  return (
    <div style={{
      position: 'relative', width: 320, height: 320, margin: '0 auto',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <style>
        {`
          @keyframes core-pulse {
            0% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 20px ${color}40; }
            50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 40px ${color}80, inset 0 0 20px ${color}60; }
            100% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 20px ${color}40; }
          }
          @keyframes ring-spin {
            100% { transform: rotate(360deg); }
          }
          @keyframes ring-spin-reverse {
            100% { transform: rotate(-360deg); }
          }
        `}
      </style>

      {/* Outer Ring - Connectivity & Status */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        border: `1px dashed var(--input-border)`, borderRadius: '50%',
        animation: 'ring-spin 30s linear infinite',
      }}>
        <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', boxShadow: '0 0 10px #10b981' }} />
      </div>

      {/* Middle Ring - Sensors */}
      <div style={{
        position: 'absolute', width: '80%', height: '80%',
        border: `2px solid ${color}30`, borderRadius: '50%',
        borderTopColor: color, borderBottomColor: 'transparent',
        animation: 'ring-spin-reverse 15s linear infinite',
      }} />

      {/* Inner Ring - AI Processing */}
      <div style={{
        position: 'absolute', width: '65%', height: '65%',
        border: `2px solid ${color}40`, borderRadius: '50%',
        borderLeftColor: color, borderRightColor: 'transparent',
        animation: 'ring-spin 8s linear infinite',
        opacity: isEmergency ? 1 : 0.6,
      }} />

      {/* Center Core */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        style={{
          position: 'relative', width: '50%', height: '50%', borderRadius: '50%',
          background: state.theme === 'light' 
            ? `radial-gradient(circle, #ffffff 45%, ${color}15 100%)` 
            : `radial-gradient(circle, rgba(15,23,42,0.9) 40%, ${color}20 100%)`,
          border: `1px solid ${color}50`,
          boxShadow: state.theme === 'light' ? `0 10px 30px -5px ${color}30, 0 4px 12px rgba(0,0,0,0.05)` : undefined,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          animation: `core-pulse ${pulseDuration} ease-in-out infinite`,
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: -4 }}>
          Heart Rate
        </div>
        <div className="metric-value text-glow-cyan" style={{ fontSize: 56, color: 'var(--text-primary)', lineHeight: 1 }}>
          {d.heartRate}
        </div>
        <div style={{ fontSize: 12, color: color, fontWeight: 700 }}>
          BPM
        </div>
      </motion.div>

      {/* Surrounding Satellite Data Nodes */}
      <DataNode label="SpO₂" value={`${d.spo2}%`} top="10%" left="0%" color="#3b82f6" delay={0} isLight={state.theme === 'light'} />
      <DataNode label="Temp" value={`${d.temperature.toFixed(1)}°`} top="10%" right="0%" color="#f59e0b" delay={0.5} isLight={state.theme === 'light'} />
      <DataNode label="Activity" value={d.activity} bottom="10%" left="0%" color="#8b5cf6" delay={1} isLight={state.theme === 'light'} />
      <DataNode label="Risk" value={r.level} bottom="10%" right="0%" color={color} delay={1.5} isLight={state.theme === 'light'} />
      
    </div>
  );
}

function DataNode({ label, value, top, bottom, left, right, color, delay, isLight }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
      transition={{ 
        opacity: { duration: 0.5 }, 
        scale: { duration: 0.5 },
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay }
      }}
      whileHover={{ scale: 1.1, zIndex: 20 }}
      style={{
        position: 'absolute', top, bottom, left, right,
        background: 'var(--bg-card)', border: `1px solid ${color}50`,
        borderRadius: 12, padding: '8px 12px', backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        minWidth: 70, 
        boxShadow: isLight ? `0 4px 15px rgba(0,0,0,0.06), 0 0 10px ${color}15` : `0 4px 12px rgba(0,0,0,0.3), inset 0 0 10px ${color}20`,
      }}
    >
      <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
      <div className="metric-value" style={{ fontSize: 16, color: 'var(--text-primary)', textShadow: isLight ? 'none' : `0 0 8px ${color}80` }}>{value}</div>
    </motion.div>
  );
}
