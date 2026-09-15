import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, ShieldAlert, History, Navigation, 
  Cpu, PlayCircle, Settings as SettingsIcon, Shield, CloudLightning, Sun, Moon, LogOut, Globe
} from 'lucide-react';
import { useAppState } from '../context/AppContext';

export default function Sidebar() {
  const { state, dispatch } = useAppState();
  const r = state.riskAssessment.level;
  const isEmergency = r === 'CRITICAL';

  return (
    <aside className="sidebar-desktop glass-card" style={{
      width: '260px', height: '100vh', position: 'sticky', top: 0,
      borderRight: '1px solid var(--border-card)',
      display: 'flex', flexDirection: 'column', borderRadius: 0,
      background: 'var(--bg-card)', borderTop: 'none', borderBottom: 'none', borderLeft: 'none'
    }}>
      <div style={{ padding: '30px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: isEmergency ? '#ef4444' : 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isEmergency ? '0 0 20px #ef4444' : '0 0 15px rgba(14, 165, 233, 0.5)',
            animation: isEmergency ? 'pulse-danger 1s infinite' : 'none'
          }}>
            <Activity size={22} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: '0.02em', color: 'var(--text-primary)', textShadow: state.theme === 'dark' ? '0 0 10px rgba(255,255,255,0.2)' : 'none' }}>
              AI GUARDIAN
            </h1>
            <div style={{ fontSize: 10, color: '#0ea5e9', fontWeight: 700, letterSpacing: '0.1em' }}>COMMAND CENTER</div>
          </div>
        </div>
      </div>

      <div className="divider" style={{ margin: '0 24px 20px' }} />

      <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.1em', padding: '0 10px', marginBottom: 4 }}>MAIN CONSOLE</div>
        <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavItem to="/monitor" icon={<Activity size={18} />} label="Live Monitoring" />
        <NavItem to="/risk" icon={<ShieldAlert size={18} />} label="AI Risk" />
        <NavItem to="/history" icon={<History size={18} />} label="Health History" />
        <NavItem to="/environment" icon={<CloudLightning size={18} />} label="Environment" />
        
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.1em', padding: '0 10px', marginTop: 20, marginBottom: 4 }}>SYSTEM & PROTOCOLS</div>
        <NavItem to="/emergency" icon={<Shield size={18} />} label="Emergency" badge={isEmergency ? 'ACTIVE' : undefined} />
        <NavItem to="/gps" icon={<Navigation size={18} />} label="GPS Tracker" />
        <NavItem to="/hardware" icon={<Cpu size={18} />} label="Device Health" />
        <NavItem to="/demo" icon={<PlayCircle size={18} />} label="Demo Scenarios" />
        
        <div style={{ marginTop: 'auto', marginBottom: 20 }}>
          <div className="divider" style={{ margin: '20px 8px' }} />
          <NavItem to="/settings" icon={<SettingsIcon size={18} />} label="Settings" />
          <NavItem to="/privacy" icon={<Shield size={18} />} label="Privacy" />
        </div>
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid var(--divider)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '9px', borderRadius: 8, background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.25)',
            color: '#0ea5e9', fontSize: 12, fontWeight: 700
          }}
        >
          <Globe size={15} /> PUBLIC SITE
        </Link>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '9px', borderRadius: 8, background: 'var(--tag-bg)', border: '1px solid var(--tag-border)',
            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 700
          }}
        >
          {state.theme === 'dark' ? <><Sun size={16} /> LIGHT MODE</> : <><Moon size={16} /> DARK MODE</>}
        </button>

        <button
          onClick={() => dispatch({ type: 'LOGOUT' })}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '9px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 700
          }}
        >
          <LogOut size={16} /> SECURE LOGOUT
        </button>
      </div>
    </aside>
  );
}

function NavItem({ to, icon, label, badge }: { to: string, icon: React.ReactNode, label: string, badge?: string }) {
  return (
    <NavLink to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <span style={{ opacity: 0.8 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{ 
          background: '#ef4444', color: 'white', fontSize: 9, fontWeight: 800, 
          padding: '2px 6px', borderRadius: 4, letterSpacing: '0.05em',
          boxShadow: '0 0 10px rgba(239,68,68,0.5)', animation: 'pulse-danger 1s infinite'
        }}>
          {badge}
        </span>
      )}
    </NavLink>
  );
}
