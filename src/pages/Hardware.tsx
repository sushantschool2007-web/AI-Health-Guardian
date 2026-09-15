import React from 'react';
import Header from '../components/Header';
import { Cpu, Heart, Activity, Thermometer, MapPin, AlertCircle, Volume2, Lightbulb } from 'lucide-react';

export default function Hardware() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header title="Device Health" subtitle="ESP32 IoT sensor grid & hardware status" />
      
      <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Hardware Status Grid */}
        <div className="glass-card" style={{ padding: '32px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>
            HARDWARE DIAGNOSTICS
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <DiagNode name="ESP32 NodeMCU" status="CONNECTED" icon={<Cpu size={20}/>} type="CORE" />
            <DiagNode name="MAX30102" status="CONNECTED" icon={<Heart size={20}/>} type="SENSOR" />
            <DiagNode name="MPU6050" status="CONNECTED" icon={<Activity size={20}/>} type="SENSOR" />
            <DiagNode name="DS18B20" status="CONNECTED" icon={<Thermometer size={20}/>} type="SENSOR" />
            <DiagNode name="GPS NEO-6M" status="CONNECTED" icon={<MapPin size={20}/>} type="MODULE" />
            <DiagNode name="OLED Display" status="CONNECTED" icon={<Lightbulb size={20}/>} type="OUTPUT" />
            <DiagNode name="SOS Button" status="READY" icon={<AlertCircle size={20}/>} type="INPUT" />
            <DiagNode name="Active Buzzer" status="READY" icon={<Volume2 size={20}/>} type="OUTPUT" />
          </div>
        </div>

        {/* Pin Mapping */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 16 }}>
            GPIO PIN MAPPING
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <th style={thStyle}>Component</th>
                <th style={thStyle}>Function</th>
                <th style={thStyle}>ESP32 Pin</th>
                <th style={thStyle}>Protocol</th>
              </tr>
            </thead>
            <tbody>
              <TableRow comp="MAX30102" func="Heart Rate & SpO₂" pin="GPIO 21, 22" proto="I²C" />
              <TableRow comp="MPU6050" func="Motion & Fall Det." pin="GPIO 21, 22" proto="I²C" />
              <TableRow comp="DS18B20" func="Temperature" pin="GPIO 4" proto="OneWire" />
              <TableRow comp="NEO-6M" func="GPS Location" pin="GPIO 16, 17" proto="UART2" />
              <TableRow comp="Push Button" func="SOS Trigger" pin="GPIO 13" proto="Digital Input" />
              <TableRow comp="Active Buzzer" func="Emergency Audio" pin="GPIO 25" proto="Digital Output" />
              <TableRow comp="LED" func="Status Indicator" pin="GPIO 2" proto="Digital Output" />
              <TableRow comp="OLED 0.96&quot;" func="Local Display" pin="GPIO 21, 22" proto="I²C" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DiagNode({ name, status, icon, type }: any) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 12,
      padding: '16px', display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: 'inset 0 0 10px rgba(255,255,255,0.02)'
    }}>
      <div style={{ color: '#0ea5e9' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>{name}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{type}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(16,185,129,0.3)' }}>
        <div className="status-dot online" style={{ width: 6, height: 6 }} />
        <span style={{ fontSize: 9, color: '#34d399', fontWeight: 800, letterSpacing: '0.05em' }}>{status}</span>
      </div>
    </div>
  );
}

const thStyle = { padding: '12px 16px', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.1em' };

function TableRow({ comp, func, pin, proto }: any) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>{comp}</td>
      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{func}</td>
      <td style={{ padding: '14px 16px', fontSize: 12, color: '#38bdf8', fontFamily: 'monospace' }}>{pin}</td>
      <td style={{ padding: '14px 16px' }}><span className="tag">{proto}</span></td>
    </tr>
  );
}
