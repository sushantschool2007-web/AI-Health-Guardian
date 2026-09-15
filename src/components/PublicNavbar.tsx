import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Shield, Sun, Moon, Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAppState } from '../context/AppContext';

export default function PublicNavbar() {
  const { state, dispatch } = useAppState();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Project', path: '/about' },
    { label: 'Contact & Support', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)',
      background: state.theme === 'dark' ? 'rgba(3, 7, 18, 0.8)' : 'rgba(255, 255, 255, 0.85)',
      borderBottom: '1px solid var(--border-card)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)',
          }}>
            <Activity size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span>AI HEALTH GUARDIAN</span>
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(14, 165, 233, 0.15)',
                color: '#0ea5e9',
                border: '1px solid rgba(14, 165, 233, 0.3)',
              }}>
                SIH-2026
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', fontWeight: 600 }}>
              EDGE IOT • SMART PREVENTIVE CARE
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="public-nav-desktop">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  color: active ? (state.theme === 'dark' ? '#38bdf8' : '#0284c7') : 'var(--text-secondary)',
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: active ? (state.theme === 'dark' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.1)') : 'transparent',
                  border: active ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-primary)',
              borderRadius: 8,
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title="Toggle theme"
          >
            {state.theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#8b5cf6" />}
          </button>

          {/* Console / Login CTA */}
          {state.isAuthenticated ? (
            <Link
              to="/dashboard"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.02em',
                boxShadow: '0 0 15px rgba(14, 165, 233, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <LayoutDashboard size={16} />
              <span>Open Console</span>
            </Link>
          ) : (
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.02em',
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <Shield size={16} />
              <span>Launch Console</span>
              <ArrowRight size={14} />
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-nav-toggle"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '16px 24px 20px',
          background: state.theme === 'dark' ? 'rgba(3, 7, 18, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          borderTop: '1px solid var(--border-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  fontSize: 15,
                  fontWeight: active ? 700 : 500,
                  color: active ? '#0ea5e9' : 'var(--text-primary)',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: active ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to={state.isAuthenticated ? '/dashboard' : '/login'}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              textDecoration: 'none',
              marginTop: 8,
              padding: '12px',
              textAlign: 'center',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {state.isAuthenticated ? 'Open Medical Console' : 'Launch Console / Sign In'}
          </Link>
        </div>
      )}
    </header>
  );
}
