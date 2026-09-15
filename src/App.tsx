import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppState } from './context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import DynamicBackground from './components/DynamicBackground';
import PublicNavbar from './components/PublicNavbar';
import PublicFooter from './components/PublicFooter';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import AIRisk from './pages/AIRisk';
import HealthHistory from './pages/HealthHistory';
import Emergency from './pages/Emergency';
import GPSLocation from './pages/GPSLocation';
import Hardware from './pages/Hardware';
import DemoMode from './pages/DemoMode';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Environment from './pages/Environment';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    style={{ width: '100%', height: '100%' }}
  >
    {children}
  </motion.div>
);

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
    <DynamicBackground />
    <PublicNavbar />
    <main style={{ flex: 1 }}>
      {children}
    </main>
    <PublicFooter />
  </div>
);

const ConsoleLayout = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAppState();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <DynamicBackground />
      <Sidebar />
      <main style={{ flex: 1, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="mobile-header" style={{ padding: '15px 20px', background: 'var(--bg-app)', borderBottom: '1px solid var(--border-card)', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: '#0ea5e9' }}></div>
          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>AI GUARDIAN</span>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><PublicLayout><Home /></PublicLayout></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><PublicLayout><About /></PublicLayout></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><PublicLayout><Contact /></PublicLayout></PageWrapper>} />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
                <DynamicBackground />
                <Login />
              </div>
            </PageWrapper>
          }
        />

        {/* Protected Command Center Console Routes */}
        <Route path="/dashboard" element={<PageWrapper><ConsoleLayout><Dashboard /></ConsoleLayout></PageWrapper>} />
        <Route path="/monitor" element={<PageWrapper><ConsoleLayout><LiveMonitoring /></ConsoleLayout></PageWrapper>} />
        <Route path="/risk" element={<PageWrapper><ConsoleLayout><AIRisk /></ConsoleLayout></PageWrapper>} />
        <Route path="/history" element={<PageWrapper><ConsoleLayout><HealthHistory /></ConsoleLayout></PageWrapper>} />
        <Route path="/emergency" element={<PageWrapper><ConsoleLayout><Emergency /></ConsoleLayout></PageWrapper>} />
        <Route path="/gps" element={<PageWrapper><ConsoleLayout><GPSLocation /></ConsoleLayout></PageWrapper>} />
        <Route path="/hardware" element={<PageWrapper><ConsoleLayout><Hardware /></ConsoleLayout></PageWrapper>} />
        <Route path="/environment" element={<PageWrapper><ConsoleLayout><Environment /></ConsoleLayout></PageWrapper>} />
        <Route path="/demo" element={<PageWrapper><ConsoleLayout><DemoMode /></ConsoleLayout></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper><ConsoleLayout><Settings /></ConsoleLayout></PageWrapper>} />
        <Route path="/privacy" element={<PageWrapper><ConsoleLayout><Privacy /></ConsoleLayout></PageWrapper>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
