import React from 'react';
import { Activity, BrainCircuit, Lightbulb, Zap } from 'lucide-react';

const STEPS = [
  { id: 'sense', label: 'SENSE', icon: <Activity size={18} /> },
  { id: 'predict', label: 'PREDICT', icon: <BrainCircuit size={18} /> },
  { id: 'decide', label: 'DECIDE', icon: <Lightbulb size={18} /> },
  { id: 'act', label: 'ACT', icon: <Zap size={18} /> },
];

export default function Pipeline({ activeStep }: { activeStep?: string }) {
  // If activeStep is provided, highlight that step, otherwise all neutral/static
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 600, margin: '0 auto', position: 'relative' }}>
      
      {/* Background connection line */}
      <div style={{ position: 'absolute', top: 24, left: 40, right: 40, height: 2, background: 'rgba(71, 85, 105, 0.3)', zIndex: 0 }} />
      
      {/* Animated active line */}
      {activeStep && (
        <div style={{ 
          position: 'absolute', top: 23, left: 40, right: 40, height: 4, 
          background: 'linear-gradient(90deg, transparent, #0ea5e9, transparent)', 
          zIndex: 1, filter: 'blur(2px)', animation: 'data-flow 2s linear infinite'
        }} />
      )}

      {STEPS.map((step, index) => {
        const isActive = activeStep === step.id;
        
        return (
          <React.Fragment key={step.id}>
            <div className={`pipeline-node ${isActive ? 'active' : ''}`} style={{ zIndex: 2 }}>
              <div style={{
                color: isActive ? '#38bdf8' : 'var(--text-muted)',
                background: isActive ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                padding: 8, borderRadius: '50%', marginBottom: 4,
                boxShadow: isActive ? '0 0 15px rgba(14, 165, 233, 0.4)' : 'none',
              }}>
                {step.icon}
              </div>
              <div style={{ 
                fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', 
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                textShadow: isActive ? '0 0 10px rgba(14, 165, 233, 0.8)' : 'none'
              }}>
                {step.label}
              </div>
            </div>
            
            {/* Arrows between nodes */}
            {index < STEPS.length - 1 && (
              <div style={{ color: isActive ? '#0ea5e9' : 'var(--text-muted)', zIndex: 2, transform: 'translateY(-10px)' }}>
                <span className={isActive ? 'animate-flow' : ''} style={{ display: 'inline-block' }}>→</span>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
