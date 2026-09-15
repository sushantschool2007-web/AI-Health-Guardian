import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { useAppState } from '../context/AppContext';
import { MapPin, Navigation } from 'lucide-react';

export default function GPSLocation() {
  const { state } = useAppState();
  const { currentData, emergencyState } = state;
  const isEmergency = emergencyState.status !== 'NORMAL';
  
  const [liveLat, setLiveLat] = useState<number>(currentData.latitude || 0);
  const [liveLng, setLiveLng] = useState<number>(currentData.longitude || 0);

  useEffect(() => {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function successCallback(position: GeolocationPosition): void {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);
      setLiveLat(latitude);
      setLiveLng(longitude);
    }

    function errorCallback(error: GeolocationPositionError): void {
      switch (error.code) {
        case error.PERMISSION_DENIED: console.error("User denied the request for Geolocation."); break;
        case error.POSITION_UNAVAILABLE: console.error("Location information is unavailable."); break;
        case error.TIMEOUT: console.error("The request to get user location timed out."); break;
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const hasLocation = liveLat !== 0 && liveLng !== 0;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (hasLocation && iframeRef.current) {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'INSERT_YOUR_API_KEY';
      const src = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${liveLat},${liveLng}&zoom=16&maptype=satellite`;
      iframeRef.current.src = src;
    }
  }, [liveLat, liveLng, hasLocation]);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header title="GPS Intelligence" subtitle="Live NEO-6M satellite tracking and coordinate broadcasting" />

      <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

          {/* Live Map Visualization */}
          <div className="glass-card" style={{ height: 600, padding: 24, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 20 }}>
              LIVE SATELLITE LINK
            </div>

            <div style={{ flex: 1, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-card)', position: 'relative', overflow: 'hidden' }}>

              {hasLocation ? (
                <>
                  <iframe
                    ref={iframeRef}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    style={{ border: 0, filter: 'invert(100%) hue-rotate(180deg) brightness(80%) contrast(120%)' }}
                    title="Live GPS Location"
                  />
                  {/* Cyberpunk Overlay for the marker */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', background: isEmergency ? '#ef4444' : '#0ea5e9',
                      boxShadow: `0 0 20px ${isEmergency ? '#ef4444' : '#0ea5e9'}`,
                      animation: 'pulse-danger 1s infinite'
                    }} />
                  </div>
                </>
              ) : (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <MapPin size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>ACQUIRING SIGNAL...</div>
                </div>
              )}
            </div>
          </div>

          {/* Coordinates Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 20 }}>
                TELEMETRY
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Latitude</div>
                <div className="metric-value text-glow-cyan" style={{ fontSize: 24, color: 'var(--text-primary)' }}>{hasLocation ? liveLat.toFixed(6) : '--'}°</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Longitude</div>
                <div className="metric-value text-glow-cyan" style={{ fontSize: 24, color: 'var(--text-primary)' }}>{hasLocation ? liveLng.toFixed(6) : '--'}°</div>
              </div>

              <div className="divider" style={{ margin: '24px 0' }} />

              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`status-dot ${hasLocation ? 'online' : 'warning'}`} />
                <span style={{ fontSize: 12, color: hasLocation ? '#10b981' : '#f59e0b', fontWeight: 700, letterSpacing: '0.1em' }}>
                  {hasLocation ? 'LOCKED' : 'SEARCHING'}
                </span>
              </div>
            </div>

            {isEmergency && hasLocation && (
              <div className="glass-card emergency-active" style={{ padding: '20px', border: '1px solid #ef4444' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#ef4444', marginBottom: 8 }}>
                  <Navigation size={18} />
                  <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em' }}>BROADCASTING</span>
                </div>
                <div style={{ fontSize: 11, color: '#fca5a5', lineHeight: 1.5 }}>
                  Coordinates are actively attached to the SOS payload for emergency responders.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
