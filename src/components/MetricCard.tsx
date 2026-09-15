import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  color?: string;
  bgColor?: string;
  alert?: boolean;
}

export default function MetricCard({
  icon, label, value, unit, subtext,
  color = '#2563eb', bgColor, alert,
}: MetricCardProps) {
  const iconBg = bgColor || color + '15';
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)' }}
      layout
      className="glass-card"
      style={{
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        ...(alert ? {
          borderColor: '#fca5a5',
          background: '#fff5f5',
          boxShadow: '0 0 0 3px rgba(239,68,68,0.08)',
        } : {}),
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}, ${color}40)`,
        borderRadius: '16px 16px 0 0',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{
          fontSize: 11, color: 'var(--text-muted)', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {label}
        </span>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
        }}>
          {icon}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span className="metric-value" style={{ fontSize: 34, color: alert ? '#dc2626' : color, lineHeight: 1 }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 500 }}>{unit}</span>
        )}
      </div>

      {subtext && (
        <div style={{
          marginTop: 8, fontSize: 12,
          color: alert ? '#dc2626' : 'var(--text-secondary)',
          fontWeight: alert ? 600 : 400,
        }}>
          {subtext}
        </div>
      )}
    </motion.div>
  );
}
