import React from 'react';
import { useAppState } from '../context/AppContext';

export default function DynamicBackground() {
  const { state } = useAppState();
  const risk = state.riskAssessment.level;
  const isLight = state.theme === 'light';

  // React to risk level
  const isEmergency = risk === 'CRITICAL';
  const isHigh = risk === 'HIGH';
  
  // Base colors
  const primaryColor = isEmergency ? (isLight ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.15)') : 
                       isHigh ? (isLight ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.1)') : 
                       isLight ? 'rgba(14, 165, 233, 0.06)' : 'rgba(14, 165, 233, 0.05)';
                       
  const gridColor = isEmergency ? 'rgba(239, 68, 68, 0.06)' : 
                    isHigh ? 'rgba(245, 158, 11, 0.04)' : 
                    isLight ? 'rgba(148, 163, 184, 0.12)' : 'rgba(14, 165, 233, 0.03)';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: -1, pointerEvents: 'none', overflow: 'hidden',
      background: 'var(--bg-app)',
    }}>
      {/* Subtle glowing orb in center/top */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
        transition: 'background 1s ease',
      }} />

      {/* Cyberpunk Grid */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          linear-gradient(to right, ${gridColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: 0.5,
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Animated Data Lines (CSS simulation of flowing data) */}
      <style>
        {`
          @keyframes data-flow {
            0% { transform: translateY(-100%); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
          .data-line {
            position: absolute; width: 1px;
            background: linear-gradient(to bottom, transparent, ${isEmergency ? '#ef4444' : '#0ea5e9'}, transparent);
            animation: data-flow 10s linear infinite;
          }
        `}
      </style>
      
      <div className="data-line" style={{ left: '10%', height: '30vh', animationDuration: isEmergency ? '4s' : '15s', animationDelay: '0s' }} />
      <div className="data-line" style={{ left: '30%', height: '40vh', animationDuration: isEmergency ? '5s' : '12s', animationDelay: '2s' }} />
      <div className="data-line" style={{ left: '70%', height: '25vh', animationDuration: isEmergency ? '3s' : '18s', animationDelay: '1s' }} />
      <div className="data-line" style={{ left: '90%', height: '50vh', animationDuration: isEmergency ? '6s' : '10s', animationDelay: '4s' }} />

      {/* Emergency Vignette */}
      {isEmergency && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle, transparent 60%, rgba(220,38,38,0.15) 100%)',
          animation: 'emergency-flash 2s infinite',
        }} />
      )}
    </div>
  );
}
