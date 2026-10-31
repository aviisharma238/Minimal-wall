'use client';

import { useState, useRef, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function WallpaperCard({
  wallpaper,
  index = 0,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  density = 'balanced', // 'dense' | 'balanced' | 'editorial'
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimerRef = useRef(null);

  const primaryHex = wallpaper.dominantColors?.[0]?.hex || '#2A5C8A';

  // Cleanup hover timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Intent-based hover prefetch: if user hovers for >140ms, preload the original preview image into browser cache
    hoverTimerRef.current = setTimeout(() => {
      if (wallpaper?.urls?.preview && typeof window !== 'undefined') {
        const prefetchImg = new Image();
        prefetchImg.src = wallpaper.urls.preview;
      }
    }, 140);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
  };

  // Above the fold threshold: first 8 images load eagerly with high fetchPriority
  const isAboveFold = index < 8;

  return (
    <div
      onClick={() => onSelect(wallpaper)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="wallpaper-card-contain"
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        // Dominant-color alpha skeleton placeholder (0ms perceived wait)
        backgroundColor: `${primaryHex}26`,
        border: isHovered ? `1px solid ${primaryHex}88` : '1px solid var(--border-subtle)',
        aspectRatio: '16 / 10',
        cursor: 'pointer',
        boxShadow: isHovered ? `0 14px 34px -4px ${primaryHex}44` : 'none',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Background Image (Optimized Thumbnail Tier with Async Decoding) */}
      <img
        src={wallpaper.urls.thumbnail}
        alt={wallpaper.title}
        loading={isAboveFold ? 'eager' : 'lazy'}
        fetchPriority={isAboveFold ? 'high' : 'low'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: isLoaded ? 'none' : 'blur(8px)',
          opacity: isLoaded ? 1 : 0.45,
          transform: isHovered ? 'scale(1.03)' : 'scale(1.0)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease, opacity 0.25s ease',
        }}
      />

      {/* Top Floating Actions & Aspect Ratio Tag */}
      <div
        className="card-top-overlay"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: isHovered || isFavorite ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: isHovered || isFavorite ? 'auto' : 'none',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <span
            className="mono-tag"
            style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              fontSize: '0.625rem',
            }}
          >
            {wallpaper.resolutionBadge}
          </span>
          {wallpaper.dimensions?.aspectRatio && (
            <span
              className="mono-tag"
              style={{
                padding: '0.2rem 0.45rem',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(8px)',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.625rem',
              }}
            >
              {wallpaper.dimensions.aspectRatio}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(wallpaper.id);
          }}
          aria-label="Favorite"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavorite ? '#EF4444' : '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Heart size={15} fill={isFavorite ? '#EF4444' : 'none'} />
        </button>
      </div>

      {/* Bottom Metadata & Proportion Palette Bar Overlay */}
      <div
        className="card-bottom-overlay"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.25rem 1rem 0.75rem',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              {wallpaper.title}
            </h3>
            <div
              className="mono-tag"
              style={{
                fontSize: '0.625rem',
                color: 'rgba(255, 255, 255, 0.75)',
                marginTop: '0.15rem',
              }}
            >
              {wallpaper.category} {wallpaper.natureType ? `• ${wallpaper.natureType}` : ''} • {wallpaper.colorFamily}
            </div>
          </div>

          {/* Dominant Palette Mini Dots */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {wallpaper.dominantColors?.slice(0, 3).map((c, i) => (
              <span
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}
              />
            ))}
          </div>
        </div>

        {/* 4-Segment K-Means Color Distribution Proportion Bar */}
        <div
          style={{
            display: 'flex',
            height: '3px',
            borderRadius: '2px',
            overflow: 'hidden',
            width: '100%',
            opacity: 0.85,
          }}
        >
          {wallpaper.dominantColors?.map((c, i) => (
            <div
              key={i}
              style={{
                backgroundColor: c.hex,
                width: `${Math.round(c.weight * 100)}%`,
                height: '100%',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
