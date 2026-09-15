import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { Shield, Activity, Lock, User, AlertCircle, Mail, UserPlus, HeartPulse, Zap, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Login() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      setError(false);
      dispatch({ type: 'LOGIN' });
      navigate('/dashboard');
    } else {
      if (username === 'admin' && password === 'admin') {
        setError(false);
        dispatch({ type: 'LOGIN' });
        navigate('/dashboard');
      } else {
        setError(true);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', position: 'relative', zIndex: 10, overflow: 'hidden'
      }}
    >
      {/* Dynamic Floating Elements behind the card */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '15%', left: '15%', opacity: 0.5, color: '#0ea5e9' }}
      >
        <HeartPulse size={64} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: '20%', right: '15%', opacity: 0.5, color: '#8b5cf6' }}
      >
        <Zap size={64} />
      </motion.div>

      <motion.div 
        className="glass-card" 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          width: '100%', maxWidth: 420, padding: '40px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <motion.div variants={itemVariants} style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={14} />
            <span>← Back to Home</span>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 30px rgba(14, 165, 233, 0.5)', marginBottom: 24
        }}>
          {isSignUp ? <UserPlus size={32} color="#fff" /> : <Activity size={32} color="#fff" />}
        </motion.div>

        <motion.h1 variants={itemVariants} style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-primary)', textAlign: 'center' }}>
          {isSignUp ? 'JOIN THE NETWORK' : 'AI HEALTH GUARDIAN'}
        </motion.h1>
        <motion.p variants={itemVariants} style={{ margin: '8px 0 32px', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.1em', fontWeight: 600 }}>
          {isSignUp ? 'CREATE SECURE ACCOUNT' : 'SECURE COMMAND CENTER'}
        </motion.p>

        <AnimatePresence>
          {error && !isSignUp && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }} 
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              style={{
                width: '100%', padding: '12px', borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ef4444', fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20
              }}
            >
              <AlertCircle size={16} /> Invalid credentials. Use admin / admin
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence mode="popLayout">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><User size={18} /></div>
                  <input type="text" className="dark-input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={{ paddingLeft: 44, height: 48 }} required />
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Mail size={18} /></div>
                  <input type="email" className="dark-input" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: 44, height: 48 }} required />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><User size={18} /></div>
            <input type="text" className="dark-input" placeholder={isSignUp ? "Choose Username" : "Username ID"} value={username} onChange={(e) => setUsername(e.target.value)} style={{ paddingLeft: 44, height: 48 }} required />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={18} /></div>
            <input type="password" className="dark-input" placeholder={isSignUp ? "Create Passcode" : "Passcode"} value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: 44, height: 48 }} required />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            style={{
              width: '100%', height: 48, borderRadius: 8, marginTop: 8,
              background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
              border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
              letterSpacing: '0.05em', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 8px 20px rgba(14, 165, 233, 0.4)',
            }}
          >
            {isSignUp ? <><UserPlus size={18} /> CREATE ACCOUNT</> : <><Shield size={18} /> AUTHENTICATE</>}
          </motion.button>
        </motion.form>

        <motion.div variants={itemVariants} style={{ marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
          {isSignUp ? "Already have a node?" : "Don't have an account?"}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ 
              background: 'none', border: 'none', color: '#0ea5e9', 
              fontWeight: 700, cursor: 'pointer', marginLeft: 8 
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="divider" style={{ width: '100%', margin: '24px 0' }} />

        <motion.div variants={itemVariants} style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
          Terminal Node v2.0 • ESP32 Link
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
