import React from 'react';
import Header from '../components/Header';
import HealthCore from '../components/HealthCore';
import SensorStream from '../components/SensorStream';
import Pipeline from '../components/Pipeline';
import ActionableAdviceCard from '../components/ActionableAdviceCard';
import { useAppState } from '../context/AppContext';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const { state } = useAppState();
  const { riskAssessment: r } = state;
  const isEmergency = r.level === 'CRITICAL';
  const color = isEmergency ? '#ef4444' : r.level === 'HIGH' ? '#f59e0b' : '#0ea5e9';

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header title="AI Medical Command Center" subtitle="Real-time multi-sensor fusion and AI intelligence" />
      
      <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}
        >
          
          {/* Main Visual Arena */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Health Core Hero */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}
              className="glass-card" 
              style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 450 }}
            >
              <HealthCore />
              
              <div style={{ marginTop: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>System Status</div>
                <div style={{ fontSize: 24, fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                  {r.level === 'LOW' ? 'ALL VITALS NOMINAL' : 
                   r.level === 'MEDIUM' ? 'MONITORING ELEVATED METRICS' :
                   r.level === 'HIGH' ? 'HIGH RISK POTENTIAL DETECTED' :
                   'CRITICAL EMERGENCY ACTIVE'}
                </div>
              </div>
            </motion.div>

            {/* Actionable Clinical Advice & Next Actions */}
            <motion.div variants={itemVariants}>
              <ActionableAdviceCard />
            </motion.div>

            {/* Neural Pipeline */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}
              className="glass-card" 
              style={{ padding: '24px' }}
            >
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 20 }}>
                DECISION ENGINE PIPELINE
              </div>
              {/* In the dashboard, if not demo mode, we just animate the active step based on risk, or keep it static */}
              <Pipeline activeStep={isEmergency ? 'act' : 'predict'} />
            </motion.div>
            
          </div>

          {/* Right Panel - AI Intelligence & Live Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* AI Risk Intelligence */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}
              className="glass-card" 
              style={{ padding: '24px', background: `var(--bg-card)` }}
            >
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 16 }}>
                AI RISK INTELLIGENCE
              </div>
              
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: color, lineHeight: 1, textShadow: `0 0 20px ${color}80` }}>
                  {r.level}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 4 }}>CURRENT RISK CLASSIFICATION</div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>AI Confidence</span>
                  <span style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700 }}>{r.confidence}%</span>
                </div>
                <div style={{ width: '100%', height: 4, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${r.confidence}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    style={{ height: '100%', background: '#0ea5e9', boxShadow: '0 0 10px #0ea5e9' }} 
                  />
                </div>
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: 8, textTransform: 'uppercase' }}>
                Why?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {r.contributingFactors.slice(0,4).map((f, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}
                  >
                    <div style={{ color: f.severity === 'normal' ? '#10b981' : f.severity === 'warning' ? '#f59e0b' : '#ef4444' }}>✓</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.deviation}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Live Sensor Stream */}
            <motion.div variants={itemVariants} style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 12 }}>
                LIVE SENSOR STREAM
              </div>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                <SensorStream vertical />
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
