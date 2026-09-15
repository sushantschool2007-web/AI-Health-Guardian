import React from 'react';
import type { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pulse?: boolean;
}

const RISK_CONFIG = {
  LOW: {
    bg: '#d1fae5', border: '#6ee7b7', color: '#065f46',
    dot: '#10b981', label: 'LOW',
  },
  MEDIUM: {
    bg: '#fef3c7', border: '#fcd34d', color: '#78350f',
    dot: '#f59e0b', label: 'MEDIUM',
  },
  HIGH: {
    bg: '#ffedd5', border: '#fdba74', color: '#7c2d12',
    dot: '#f97316', label: 'HIGH',
  },
  CRITICAL: {
    bg: '#fee2e2', border: '#fca5a5', color: '#7f1d1d',
    dot: '#ef4444', label: 'CRITICAL',
  },
};

const SIZE_MAP = {
  sm: { fontSize: 10.5, padding: '3px 9px', borderRadius: 7, gap: 5, dotSize: 6 },
  md: { fontSize: 12,   padding: '4px 12px', borderRadius: 8, gap: 6, dotSize: 7 },
  lg: { fontSize: 15,   padding: '7px 18px', borderRadius: 10, gap: 8, dotSize: 8 },
  xl: { fontSize: 24,   padding: '10px 28px', borderRadius: 14, gap: 10, dotSize: 12 },
};

export default function RiskBadge({ level, size = 'md', pulse }: RiskBadgeProps) {
  const cfg = RISK_CONFIG[level];
  const sz = SIZE_MAP[size];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: sz.gap,
      background: cfg.bg,
      border: `1.5px solid ${cfg.border}`,
      color: cfg.color,
      fontWeight: 700,
      letterSpacing: '0.05em',
      fontFamily: 'Outfit, sans-serif',
      padding: sz.padding,
      borderRadius: sz.borderRadius,
      fontSize: sz.fontSize,
      animation: (pulse && level !== 'LOW') ? 'pulse-danger 1.1s infinite' : undefined,
    }}>
      <span style={{
        width: sz.dotSize, height: sz.dotSize, borderRadius: '50%',
        background: cfg.dot, flexShrink: 0,
        ...(level === 'CRITICAL' ? { animation: 'dot-pulse 1s infinite' } : {}),
      }} />
      {cfg.label}
    </span>
  );
}
