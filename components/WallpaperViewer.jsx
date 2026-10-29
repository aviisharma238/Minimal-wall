'use client';

import { useState, useEffect } from 'react';
import { X, Download, Heart, Monitor, Smartphone, Image as ImageIcon, ExternalLink, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import DeviceMockup from './DeviceMockup';
import PaletteInspector from './PaletteInspector';

export default function WallpaperViewer({
  wallpaper,
  allWallpapers = [],
  onClose,
  onSelectWallpaper,
  isFavorite,
  onToggleFavorite,
}) {
  const [mockupMode, setMockupMode] = useState('raw'); // 'raw' | 'macbook' | 'iphone'
  const [downloading, setDownloading] = useState(false);
  const [showWidgets, setShowWidgets] = useState(true);

  const primaryColor = wallpaper?.dominantColors?.[0]?.hex || '#2A5C8A';
  const currentIndex = wallpaper ? allWallpapers.findIndex((w) => w.id === wallpaper.id) : -1;

  const navigateNext = () => {
    if (currentIndex >= 0 && currentIndex < allWallpapers.length - 1) {
      onSelectWallpaper(allWallpapers[currentIndex + 1]);
    } else if (allWallpapers.length > 0) {
      onSelectWallpaper(allWallpapers[0]);
    }
  };

  const navigatePrev = () => {
    if (currentIndex > 0) {
      onSelectWallpaper(allWallpapers[currentIndex - 1]);
    } else if (allWallpapers.length > 0) {
      onSelectWallpaper(allWallpapers[allWallpapers.length - 1]);
    }
  };

  const handleDownload = async () => {
    if (!wallpaper) return;
    setDownloading(true);
    try {
      const response = await fetch(wallpaper.urls.original);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${wallpaper.slug}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      window.open(wallpaper.urls.original, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!wallpaper) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') navigateNext();
      if (e.key === 'ArrowLeft') navigatePrev();
      if (e.key.toLowerCase() === 'm') {
        setMockupMode((prev) => (prev === 'raw' ? 'macbook' : prev === 'macbook' ? 'iphone' : 'raw'));
      }
      if (e.key.toLowerCase() === 'f') {
        onToggleFavorite(wallpaper.id);
      }
      if (e.key.toLowerCase() === 'd') {
        handleDownload();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [wallpaper, currentIndex]);

  // Adjacent image preloading for instantaneous ← / → keyboard navigation
  useEffect(() => {
    if (!wallpaper || currentIndex < 0 || allWallpapers.length === 0 || typeof window === 'undefined') return;

    const nextItem = allWallpapers[currentIndex + 1] || allWallpapers[0];
    const prevItem = allWallpapers[currentIndex - 1] || allWallpapers[allWallpapers.length - 1];

    if (nextItem?.urls?.preview) {
      const nextImg = new Image();
      nextImg.src = nextItem.urls.preview;
    }
    if (prevItem?.urls?.preview) {
      const prevImg = new Image();
      prevImg.src = prevItem.urls.preview;
    }
  }, [wallpaper, currentIndex, allWallpapers]);

  if (!wallpaper) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'var(--modal-backdrop)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem',
        overflowY: 'auto',
      }}
    >
      {/* Dynamic Ambient Bloom Halo derived from wallpaper primary dominant color */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '65vw',
          height: '65vh',
          borderRadius: '50%',
          backgroundColor: primaryColor,
          filter: 'blur(130px)',
          opacity: 0.22,
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Top Bar: Title, Device Switcher, Actions & Close */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          maxWidth: '1560px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 500, letterSpacing: '-0.01em' }}>
              {wallpaper.title}
            </h2>
            <span
              className="mono-tag"
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              {wallpaper.resolutionBadge}
            </span>
            {wallpaper.dimensions?.badge && (
              <span
                className="mono-tag"
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  background: 'var(--bg-surface-elevated)',
                  color: 'var(--text-muted)',
                }}
              >
                {wallpaper.dimensions.badge}
              </span>
            )}
          </div>
          <div
            className="mono-tag"
            style={{
              color: 'var(--text-muted)',
              marginTop: '0.25rem',
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <span>{wallpaper.category.toUpperCase()}</span>
            {wallpaper.natureType && <span>• {wallpaper.natureType.toUpperCase()}</span>}
            <span>• {wallpaper.colorFamily.toUpperCase()}</span>
            <span>• {wallpaper.dimensions?.width}×{wallpaper.dimensions?.height}</span>
          </div>
        </div>

        {/* Device Mockup Mode Switcher */}
        <div
          style={{
            display: 'inline-flex',
            padding: '0.25rem',
            borderRadius: '10px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            gap: '0.25rem',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <button
            onClick={() => setMockupMode('raw')}
            title="Raw Artwork (Press M to toggle)"
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              background: mockupMode === 'raw' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: mockupMode === 'raw' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: mockupMode === 'raw' ? 500 : 400,
            }}
          >
            <ImageIcon size={14} />
            <span>Artwork</span>
          </button>

          <button
            onClick={() => setMockupMode('macbook')}
            title="MacBook Mockup"
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              background: mockupMode === 'macbook' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: mockupMode === 'macbook' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: mockupMode === 'macbook' ? 500 : 400,
            }}
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => setMockupMode('iphone')}
            title="iPhone Mockup"
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              background: mockupMode === 'iphone' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: mockupMode === 'iphone' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: mockupMode === 'iphone' ? 500 : 400,
            }}
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => onToggleFavorite(wallpaper.id)}
            aria-label="Save to favorites (Press F)"
            title="Save to favorites (F)"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: isFavorite ? '#EF4444' : 'var(--text-primary)',
            }}
          >
            <Heart size={18} fill={isFavorite ? '#EF4444' : 'none'} />
          </button>

          <button
            onClick={onClose}
            aria-label="Close viewer (Esc)"
            title="Close (Esc)"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Canvas & Navigation Arrows */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1560px',
          width: '100%',
          margin: '1.5rem auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Left Arrow */}
        <button
          onClick={navigatePrev}
          aria-label="Previous wallpaper (←)"
          title="Previous (←)"
          style={{
            position: 'absolute',
            left: 0,
            zIndex: 20,
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Center Mockup / Artwork */}
        <div style={{ width: '100%', padding: '0 3.5rem' }}>
          <DeviceMockup
            wallpaper={wallpaper}
            mode={mockupMode}
            showWidgets={showWidgets}
            onToggleWidgets={() => setShowWidgets(!showWidgets)}
          />
        </div>

        {/* Right Arrow */}
        <button
          onClick={navigateNext}
          aria-label="Next wallpaper (→)"
          title="Next (→)"
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 20,
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Bottom Bar: Color Palette & Download */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1560px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <PaletteInspector dominantColors={wallpaper.dominantColors} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            className="mono-tag"
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.65rem',
              display: 'flex',
              gap: '0.6rem',
              marginRight: '0.5rem',
            }}
          >
            <span>[← / →] NAV</span>
            <span>[M] MOCKUP</span>
            <span>[F] FAV</span>
            <span>[D] SAVE</span>
          </div>

          <a
            href={`/wallpaper/${wallpaper.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.65rem 1rem',
              borderRadius: '9px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}
          >
            <ExternalLink size={14} />
            <span>Permalink</span>
          </a>

          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '9px',
              background: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: downloading ? 'wait' : 'pointer',
              transition: 'opacity 0.2s ease',
            }}
          >
            <Download size={15} />
            <span>{downloading ? 'Downloading...' : `Download ${wallpaper.resolutionBadge}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
