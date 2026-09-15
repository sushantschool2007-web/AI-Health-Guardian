import React from 'react';
import Header from '../components/Header';
import SensorStream from '../components/SensorStream';
import { useAppState } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LiveMonitoring() {
  const { state } = useAppState();
  const { chartHistory } = state; // We need history array for the chart
  
  const chartData = chartHistory.slice(-20).map(item => ({
    time: item.time,
    heartRate: item.heartRate,
    spo2: item.spo2,
    temperature: item.temperature
  }));

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header title="Live Monitoring" subtitle="Real-time sensor telemetry and waveforms" />
      
      <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
        
        <div style={{ marginBottom: 24 }}>
          <SensorStream />
        </div>

        <div className="glass-card" style={{ padding: '24px', height: 400, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.1em', fontWeight: 800 }}>LIVE WAVEFORM VISUALIZATION</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['1 MIN', '5 MIN', '1 HR', '24 HR'].map(t => (
                <button key={t} style={{
                  background: t === '1 MIN' ? 'rgba(14, 165, 233, 0.2)' : 'var(--tag-bg)',
                  border: `1px solid ${t === '1 MIN' ? '#0ea5e9' : 'var(--tag-border)'}`,
                  color: t === '1 MIN' ? '#38bdf8' : 'var(--text-secondary)',
                  padding: '4px 12px', borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: 'pointer'
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-card)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickMargin={10} />
              <YAxis stroke="var(--text-muted)" fontSize={11} domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip 
                contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid var(--input-border)', borderRadius: 8 }}
                itemStyle={{ fontSize: 12, fontWeight: 600 }}
                labelStyle={{ color: 'var(--text-secondary)', marginBottom: 4 }}
              />
              <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="spo2" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
