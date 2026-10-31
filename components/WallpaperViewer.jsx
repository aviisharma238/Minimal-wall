'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Heart,
  Monitor,
  Smartphone,
  Image as ImageIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Laptop,
  Tablet,
  Check,
} from 'lucide-react';
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
  const [downloadProgressText, setDownloadProgressText] = useState('');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showWidgets, setShowWidgets] = useState(true);
  const downloadMenuRef = useRef(null);

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

  const handleDownloadCrop = async (type = 'original') => {
    if (!wallpaper) return;
    setDownloading(true);
    setShowDownloadMenu(false);

    let targetUrl = wallpaper.urls.original;
    let filename = `${wallpaper.slug || 'wallpaper'}-original.png`;
    const isIK = targetUrl?.startsWith('https://ik.imagekit.io');

    if (type === 'mobile') {
      setDownloadProgressText('Formatting for Mobile...');
      targetUrl = isIK
        ? `${wallpaper.urls.original}?tr=w-1170,h-2532,fo-auto,q-90,f-auto`
        : wallpaper.urls.original;
      filename = `${wallpaper.slug || 'wallpaper'}-mobile-1170x2532.jpg`;
    } else if (type === 'desktop_4k') {
      setDownloadProgressText('Rendering 4K Desktop...');
      targetUrl = isIK
        ? `${wallpaper.urls.original}?tr=w-3840,h-2160,c-maintain_ratio,q-90,f-auto`
        : wallpaper.urls.original;
      filename = `${wallpaper.slug || 'wallpaper'}-desktop-4k.jpg`;
    } else if (type === 'ultrawide') {
      setDownloadProgressText('Formatting Ultrawide 21:9...');
      targetUrl = isIK
        ? `${wallpaper.urls.original}?tr=w-3440,h-1440,fo-auto,q-90,f-auto`
        : wallpaper.urls.original;
      filename = `${wallpaper.slug || 'wallpaper'}-ultrawide-3440x1440.jpg`;
    } else if (type === 'tablet') {
      setDownloadProgressText('Formatting Tablet 4:3...');
      targetUrl = isIK
        ? `${wallpaper.urls.original}?tr=w-2048,h-2732,fo-auto,q-90,f-auto`
        : wallpaper.urls.original;
      filename = `${wallpaper.slug || 'wallpaper'}-tablet-2048x2732.jpg`;
    } else {
      setDownloadProgressText('Downloading Master File...');
    }

    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      window.open(targetUrl, '_blank');
    } finally {
      setDownloading(false);
      setDownloadProgressText('');
    }
  };

  const handleDownload = () => handleDownloadCrop('original');

  // Close download menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target)) {
        setShowDownloadMenu(false);
      }
    };
    if (showDownloadMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDownloadMenu]);

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

          {/* Split Multi-Resolution Download Button & Dropdown */}
          <div ref={downloadMenuRef} style={{ position: 'relative' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: '10px',
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                overflow: 'hidden',
                boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.25)',
              }}
            >
              <button
                onClick={handleDownload}
                disabled={downloading}
                title="Download original file (Press D)"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1rem 0.65rem 1.15rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  cursor: downloading ? 'wait' : 'pointer',
                  border: 'none',
                  background: 'transparent',
                  color: 'inherit',
                  transition: 'opacity 0.15s ease',
                }}
              >
                <Download size={15} />
                <span>
                  {downloading
                    ? downloadProgressText || 'Downloading...'
                    : `Download ${wallpaper.resolutionBadge || 'Original'}`}
                </span>
              </button>

              <div
                style={{
                  width: '1px',
                  height: '20px',
                  backgroundColor: 'rgba(128, 128, 128, 0.3)',
                }}
              />

              <button
                onClick={() => setShowDownloadMenu((prev) => !prev)}
                disabled={downloading}
                aria-label="Choose tailored resolution"
                title="Choose device resolution"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.65rem 0.65rem',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  color: 'inherit',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <ChevronDown
                  size={14}
                  style={{
                    transform: showDownloadMenu ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>
            </div>

            {/* Floating Device Crop Menu */}
            {showDownloadMenu && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  right: 0,
                  width: '260px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 16px 40px -8px rgba(0, 0, 0, 0.35)',
                  padding: '0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  zIndex: 50,
                  animation: 'cmdScaleUp 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  className="mono-tag"
                  style={{
                    padding: '0.4rem 0.6rem 0.2rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.625rem',
                  }}
                >
                  TAILORED DEVICE CROPS
                </div>

                <button
                  onClick={() => handleDownloadCrop('desktop_4k')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Monitor size={15} style={{ color: 'var(--text-secondary)' }} />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Desktop 4K</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        3840 × 2160 • 16:9
                      </div>
                    </div>
                  </div>
                  <span
                    className="mono-tag"
                    style={{
                      fontSize: '0.6rem',
                      padding: '0.15rem 0.35rem',
                      borderRadius: '4px',
                      background: 'var(--bg-surface-elevated)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    UHD
                  </span>
                </button>

                <button
                  onClick={() => handleDownloadCrop('mobile')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Smartphone size={15} style={{ color: 'var(--text-secondary)' }} />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>iPhone / Android</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        1170 × 2532 • 9:16 Crop
                      </div>
                    </div>
                  </div>
                  <span
                    className="mono-tag"
                    style={{
                      fontSize: '0.6rem',
                      padding: '0.15rem 0.35rem',
                      borderRadius: '4px',
                      background: 'var(--bg-surface-elevated)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    9:16
                  </span>
                </button>

                <button
                  onClick={() => handleDownloadCrop('ultrawide')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Laptop size={15} style={{ color: 'var(--text-secondary)' }} />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Ultrawide Monitor</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        3440 × 1440 • 21:9
                      </div>
                    </div>
                  </div>
                  <span
                    className="mono-tag"
                    style={{
                      fontSize: '0.6rem',
                      padding: '0.15rem 0.35rem',
                      borderRadius: '4px',
                      background: 'var(--bg-surface-elevated)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    21:9
                  </span>
                </button>

                <button
                  onClick={() => handleDownloadCrop('tablet')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Tablet size={15} style={{ color: 'var(--text-secondary)' }} />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>iPad & Tablet</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        2048 × 2732 • 4:3
                      </div>
                    </div>
                  </div>
                  <span
                    className="mono-tag"
                    style={{
                      fontSize: '0.6rem',
                      padding: '0.15rem 0.35rem',
                      borderRadius: '4px',
                      background: 'var(--bg-surface-elevated)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    4:3
                  </span>
                </button>

                <div
                  style={{
                    height: '1px',
                    backgroundColor: 'var(--border-subtle)',
                    margin: '0.2rem 0',
                  }}
                />

                <button
                  onClick={() => handleDownloadCrop('original')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Sparkles size={15} style={{ color: 'var(--text-primary)' }} />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Master Original</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {wallpaper.dimensions?.width} × {wallpaper.dimensions?.height} • Full Quality
                      </div>
                    </div>
                  </div>
                  <span
                    className="mono-tag"
                    style={{
                      fontSize: '0.6rem',
                      padding: '0.15rem 0.35rem',
                      borderRadius: '4px',
                      background: 'var(--text-primary)',
                      color: 'var(--bg-primary)',
                    }}
                  >
                    RAW
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
