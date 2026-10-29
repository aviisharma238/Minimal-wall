'use client';

import WallpaperCard from './WallpaperCard';
import { RotateCcw, LayoutGrid, Grid3X3, Columns2 } from 'lucide-react';

export default function WallpaperGrid({
  wallpapers = [],
  onSelectWallpaper,
  favoriteIds = [],
  onToggleFavorite,
  onResetFilters,
  density = 'balanced',
  onDensityChange,
}) {
  if (wallpapers.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 1rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          No wallpapers match your selected filters.
        </p>
        <p
          className="mono-tag"
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          Try expanding color tolerance (ΔE) or resetting your criteria.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '9px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  const favSet = new Set(favoriteIds);

  const getGridTemplate = () => {
    if (density === 'dense') {
      return 'repeat(auto-fill, minmax(260px, 1fr))';
    }
    if (density === 'editorial') {
      return 'repeat(auto-fill, minmax(460px, 1fr))';
    }
    return 'repeat(auto-fill, minmax(320px, 1fr))';
  };

  return (
    <div>
      {/* Density Switcher Bar */}
      {onDensityChange && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '1rem',
            gap: '0.5rem',
          }}
        >
          <span
            className="mono-tag"
            style={{ color: 'var(--text-muted)', fontSize: '0.625rem' }}
          >
            GRID DENSITY:
          </span>
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '2px',
            }}
          >
            <button
              onClick={() => onDensityChange('dense')}
              title="Dense Grid (4-5 columns)"
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                background: density === 'dense' ? 'var(--bg-surface-elevated)' : 'transparent',
                color: density === 'dense' ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => onDensityChange('balanced')}
              title="Balanced Grid (3-4 columns)"
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                background: density === 'balanced' ? 'var(--bg-surface-elevated)' : 'transparent',
                color: density === 'balanced' ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => onDensityChange('editorial')}
              title="Editorial Grid (2 columns)"
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                background: density === 'editorial' ? 'var(--bg-surface-elevated)' : 'transparent',
                color: density === 'editorial' ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              <Columns2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: getGridTemplate(),
          gap: density === 'dense' ? '1rem' : density === 'editorial' ? '2rem' : '1.5rem',
          paddingBottom: '4rem',
        }}
      >
        {wallpapers.map((wallpaper, idx) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            index={idx}
            onSelect={onSelectWallpaper}
            isFavorite={favSet.has(wallpaper.id)}
            onToggleFavorite={onToggleFavorite}
            density={density}
          />
        ))}
      </div>
    </div>
  );
}
