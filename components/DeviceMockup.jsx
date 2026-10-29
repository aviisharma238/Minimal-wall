'use client';

import { useState, useEffect } from 'react';
import { Battery, Wifi, CloudSun, Calendar } from 'lucide-react';

export default function DeviceMockup({
  wallpaper,
  mode = 'raw',
  showWidgets = true,
  onToggleWidgets,
}) {
  const [timeStr, setTimeStr] = useState('09:41');
  const [dateStr, setDateStr] = useState('Thursday, October 29');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${h}:${m}`);

      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      setDateStr(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  if (!wallpaper) return null;

  const imageUrl = wallpaper.urls.preview || wallpaper.urls.original;

  if (mode === 'macbook') {
    return (
      <div style={{ width: '100%', maxWidth: '840px', margin: '0 auto', padding: '1rem 0' }}>
        <div className="macbook-frame">
          <div className="macbook-notch" />

          {/* Simulated macOS Screen */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '62.5%', // 16:10 aspect ratio
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#000',
            }}
          >
            {/* macOS Menu Bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '24px',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem',
                fontSize: '0.6875rem',
                color: 'rgba(255, 255, 255, 0.9)',
                zIndex: 4,
                fontFamily: 'var(--font-sans)',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}></span>
                <span>Finder</span>
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span>Go</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Wifi size={12} />
                <Battery size={13} />
                <span>{timeStr}</span>
              </div>
            </div>

            {/* Background Image */}
            <img
              src={imageUrl}
              alt={wallpaper.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
        <div className="macbook-base" />
      </div>
    );
  }

  if (mode === 'iphone') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
        <div className="iphone-frame">
          <div className="iphone-island" />

          {/* Screen Content */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '38px',
              overflow: 'hidden',
              background: '#000',
            }}
          >
            {/* Image */}
            <img
              src={imageUrl}
              alt={wallpaper.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* iOS Status Bar Icons */}
            <div
              style={{
                position: 'absolute',
                top: '14px',
                left: '28px',
                right: '28px',
                display: 'flex',
                justifyContent: 'space-between',
                color: '#fff',
                fontSize: '0.75rem',
                zIndex: 6,
                fontWeight: 600,
              }}
            >
              <span>{timeStr}</span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Wifi size={13} />
                <Battery size={14} />
              </div>
            </div>

            {/* iOS Lockscreen Elements */}
            <div
              style={{
                position: 'absolute',
                top: '64px',
                left: 0,
                right: 0,
                textAlign: 'center',
                color: '#fff',
                textShadow: '0 2px 14px rgba(0,0,0,0.6)',
                zIndex: 5,
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 500, opacity: 0.95 }}>
                {dateStr}
              </div>
              <div
                style={{
                  fontSize: '4.25rem',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {timeStr}
              </div>

              {/* iOS Lock Screen Widgets Simulation */}
              {showWidgets && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    marginTop: '0.8rem',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '0.4rem 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.6875rem',
                    }}
                  >
                    <CloudSun size={13} />
                    <span>22° Sunny</span>
                  </div>
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '0.4rem 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.6875rem',
                    }}
                  >
                    <Calendar size={12} />
                    <span>Focus Zen</span>
                  </div>
                </div>
              )}
            </div>

            {/* iOS Bottom Flashlight & Camera shortcuts */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                zIndex: 5,
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  color: '#fff',
                }}
              >
                🔦
              </div>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  color: '#fff',
                }}
              >
                📷
              </div>
            </div>

            {/* iOS Bottom Home Bar */}
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '110px',
                height: '4px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.75)',
                zIndex: 5,
              }}
            />
          </div>
        </div>

        {onToggleWidgets && (
          <button
            onClick={onToggleWidgets}
            style={{
              marginTop: '0.75rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            {showWidgets ? 'Hide iOS Widgets' : 'Show iOS Widgets'}
          </button>
        )}
      </div>
    );
  }

  // Bare Artwork Mode
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxHeight: '68vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--bg-surface)',
      }}
    >
      <img
        src={imageUrl}
        alt={wallpaper.title}
        style={{
          maxWidth: '100%',
          maxHeight: '68vh',
          objectFit: 'contain',
          borderRadius: '12px',
          boxShadow: 'var(--card-shadow)',
        }}
      />
    </div>
  );
}
