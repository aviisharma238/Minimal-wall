'use client';

import { Heart, Hash, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Styles' },
  { id: 'nature', label: 'Nature' },
  { id: 'anime', label: 'Anime & Japan' },
  { id: 'nord', label: 'Nord Aesthetic' },
  { id: 'space', label: 'Space & Cosmic' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'oled', label: 'OLED Black' },
  { id: 'monochrome', label: 'Monochrome' },
  { id: 'minimal', label: 'Minimalist' },
  { id: 'abstract', label: 'Abstract' },
];

const NATURE_SUBTYPES = [
  { id: 'all', label: 'All Nature' },
  { id: 'mountain', label: 'Mountains' },
  { id: 'forest', label: 'Forests' },
  { id: 'ocean', label: 'Oceans' },
  { id: 'sky', label: 'Cosmic & Sky' },
  { id: 'desert', label: 'Dunes' },
];

const FORMAT_TYPES = [
  { id: 'all', label: 'All Formats' },
  { id: '16:9', label: '16:9 Desktop' },
  { id: '21:9', label: '21:9 Ultrawide' },
  { id: '9:16', label: '9:16 Mobile' },
];

export const POPULAR_TAGS = [
  'nord',
  'forest',
  'cyberpunk',
  'space',
  'waves',
  'pixelart',
  'city',
  'samurai',
  'arch',
  'astronaut',
  'sunset',
  'tokyonight',
  'linux',
  'sakura',
];

export default function CategoryFilters({
  activeCategory = 'all',
  onSelectCategory,
  activeNatureType = 'all',
  onSelectNatureType,
  activeFormat = 'all',
  onSelectFormat,
  favoritesOnly = false,
  onToggleFavoritesOnly,
  favoritesCount = 0,
  totalCount = 0,
  activeTag = '',
  onSelectTag,
  tagCounts = {},
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}
    >
      {/* Primary Category Row & Format Selector */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflowX: 'auto',
            paddingBottom: '0.2rem',
            WebkitOverflowScrolling: 'touch',
            flex: '1',
            minWidth: 0,
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = !favoritesOnly && activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (favoritesOnly) onToggleFavoritesOnly(false);
                  onSelectCategory(cat.id);
                }}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 500 : 400,
                  background: isActive ? 'var(--bg-surface)' : 'transparent',
                  border: isActive
                    ? '1px solid var(--border-focus)'
                    : '1px solid var(--border-subtle)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'var(--transition-smooth)',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Format & Favorites Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Format selector */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '2px',
            }}
          >
            {FORMAT_TYPES.map((fmt) => {
              const isFmtActive = activeFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  onClick={() => onSelectFormat(fmt.id)}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    background: isFmtActive ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: isFmtActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {fmt.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onToggleFavoritesOnly(!favoritesOnly)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: favoritesOnly ? 500 : 400,
              background: favoritesOnly ? 'var(--bg-surface)' : 'transparent',
              border: favoritesOnly
                ? '1px solid #EF4444'
                : '1px solid var(--border-subtle)',
              color: favoritesOnly ? '#EF4444' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
            }}
          >
            <Heart size={14} fill={favoritesOnly ? '#EF4444' : 'none'} />
            <span>Saved ({favoritesCount})</span>
          </button>

          <span
            className="mono-tag"
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.6875rem',
              padding: '0.4rem 0.5rem',
            }}
          >
            {totalCount} ITEMS
          </span>
        </div>
      </div>

      {/* Popular Aesthetic Tag Chips Bar */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          overflowX: 'auto',
          padding: '0.2rem 0',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <span
          className="mono-tag"
          style={{ color: 'var(--text-muted)', fontSize: '0.625rem', marginRight: '0.2rem', flexShrink: 0 }}
        >
          CURATED TAGS:
        </span>

        {/* Quick Clear Tag pill when a tag is active */}
        {activeTag && (
          <button
            onClick={() => onSelectTag('')}
            title="Clear active tag filter"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              background: 'rgba(235, 87, 87, 0.15)',
              color: '#eb5757',
              border: '1px solid rgba(235, 87, 87, 0.35)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
          >
            <X size={11} />
            <span>Clear Tag</span>
          </button>
        )}

        {POPULAR_TAGS.map((tag) => {
          const isTagActive = activeTag.toLowerCase() === tag.toLowerCase();
          const count = tagCounts[tag];
          return (
            <button
              key={tag}
              onClick={() => onSelectTag(isTagActive ? '' : tag)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.22rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                background: isTagActive ? 'var(--text-primary)' : 'var(--bg-surface-elevated)',
                color: isTagActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: isTagActive ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                boxShadow: isTagActive ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              <span>#{tag}</span>
              {typeof count === 'number' && (
                <span
                  style={{
                    fontSize: '0.625rem',
                    opacity: isTagActive ? 0.9 : 0.6,
                    padding: '0.05rem 0.28rem',
                    borderRadius: '4px',
                    background: isTagActive ? 'rgba(0, 0, 0, 0.25)' : 'var(--bg-surface)',
                  }}
                >
                  {count}
                </span>
              )}
              {isTagActive && <X size={11} style={{ marginLeft: '1px' }} />}
            </button>
          );
        })}
      </div>

      {/* Secondary Nature Subtype Row (when Nature is selected) */}
      {(activeCategory === 'nature') && !favoritesOnly && (
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            overflowX: 'auto',
            paddingLeft: '0.25rem',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <span
            className="mono-tag"
            style={{ color: 'var(--text-muted)', fontSize: '0.625rem', marginRight: '0.25rem' }}
          >
            NATURE:
          </span>
          {NATURE_SUBTYPES.map((sub) => {
            const isActive = activeNatureType === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSelectNatureType(sub.id)}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 500 : 400,
                  background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'color 0.15s ease',
                }}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
