'use client';

import { useState } from 'react';
import {
  Heart,
  Hash,
  X,
  SlidersHorizontal,
  Sparkles,
  Monitor,
  Smartphone,
  Check,
  RotateCcw,
} from 'lucide-react';
import { COLOR_FAMILIES } from '@/lib/colors';

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
  { id: 'all', label: 'All', title: 'All Formats' },
  { id: '16:9', label: '16:9 PC', title: '16:9 Desktop PC' },
  { id: '21:9', label: '21:9 Ultra', title: '21:9 Ultrawide Monitor' },
  { id: '9:16', label: '9:16 Phone', title: '9:16 Mobile Phone' },
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
  // Color Props for mobile drawer
  colorMode = 'family',
  onColorModeChange,
  activeFamily = 'all',
  onSelectFamily,
  targetHex = '#2A5C8A',
  onTargetHexChange,
  similarityThreshold = 35,
  onThresholdChange,
  colorCounts = {},
  onResetFilters,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeFiltersCount =
    (activeFamily && activeFamily !== 'all' ? 1 : 0) +
    (activeTag ? 1 : 0) +
    (activeFormat && activeFormat !== 'all' ? 1 : 0) +
    (activeCategory && activeCategory !== 'all' ? 1 : 0);

  return (
    <div>
      {/* 1. Mobile Unified Single-Row Strip (Only shown on phones <768px) */}
      <div className="mobile-unified-filters no-scrollbar">
        {/* Mobile Filter Sheet Trigger Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.42rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 500,
            background: activeFiltersCount > 0 ? 'var(--text-primary)' : 'var(--bg-surface)',
            color: activeFiltersCount > 0 ? 'var(--bg-primary)' : 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--card-shadow)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'var(--transition-smooth)',
          }}
        >
          <SlidersHorizontal size={13} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span
              style={{
                fontSize: '0.625rem',
                padding: '0.05rem 0.35rem',
                borderRadius: '999px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontWeight: 600,
              }}
            >
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* 16:9 PC Quick Toggle on Mobile */}
        <button
          onClick={() => {
            if (favoritesOnly) onToggleFavoritesOnly(false);
            onSelectFormat(activeFormat === '16:9' ? 'all' : '16:9');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.42rem 0.8rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: activeFormat === '16:9' ? 600 : 400,
            background: activeFormat === '16:9' ? 'var(--text-primary)' : 'var(--bg-surface)',
            color: activeFormat === '16:9' ? 'var(--bg-primary)' : 'var(--text-secondary)',
            border: activeFormat === '16:9' ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'var(--transition-smooth)',
          }}
        >
          <Monitor size={13} />
          <span>16:9 PC</span>
        </button>

        {/* 9:16 Mobile Quick Toggle on Mobile */}
        <button
          onClick={() => {
            if (favoritesOnly) onToggleFavoritesOnly(false);
            onSelectFormat(activeFormat === '9:16' ? 'all' : '9:16');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.42rem 0.8rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: activeFormat === '9:16' ? 600 : 400,
            background: activeFormat === '9:16' ? 'var(--text-primary)' : 'var(--bg-surface)',
            color: activeFormat === '9:16' ? 'var(--bg-primary)' : 'var(--text-secondary)',
            border: activeFormat === '9:16' ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'var(--transition-smooth)',
          }}
        >
          <Smartphone size={13} />
          <span>9:16 Phone</span>
        </button>

        {/* Category Chips on Mobile */}
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
                padding: '0.42rem 0.8rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: isActive ? 500 : 400,
                background: isActive ? 'var(--text-primary)' : 'var(--bg-surface)',
                color: isActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'var(--transition-smooth)',
              }}
            >
              {cat.label}
            </button>
          );
        })}

        {/* Favorites on Mobile */}
        <button
          onClick={() => onToggleFavoritesOnly(!favoritesOnly)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.42rem 0.8rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: favoritesOnly ? 500 : 400,
            background: favoritesOnly ? 'var(--bg-surface)' : 'transparent',
            border: favoritesOnly ? '1px solid #EF4444' : '1px solid var(--border-subtle)',
            color: favoritesOnly ? '#EF4444' : 'var(--text-secondary)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'var(--transition-smooth)',
          }}
        >
          <Heart size={13} fill={favoritesOnly ? '#EF4444' : 'none'} />
          <span>Saved ({favoritesCount})</span>
        </button>
      </div>

      {/* 2. Desktop Full Filter Matrix (Shown on screens >=768px) */}
      <div className="desktop-category-filters">
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
          <div className="category-controls-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                    title={fmt.title}
                    style={{
                      padding: '0.28rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.71875rem',
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
              <span>Favorites ({favoritesCount})</span>
            </button>
          </div>
        </div>

        {/* Curated Tags Row */}
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

        {/* Nature Subtype Row */}
        {activeCategory === 'nature' && !favoritesOnly && (
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

      {/* 3. Mobile Filter Drawer / Bottom Sheet */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-end',
            animation: 'cmdFadeIn 0.15s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '24px 24px 0 0',
              border: '1px solid var(--border-subtle)',
              borderBottom: 'none',
              padding: '1.25rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom, 0px))',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              animation: 'slideUpMobile 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Sheet Handle & Header */}
            <div>
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--border-subtle)',
                  margin: '0 auto 1rem',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <SlidersHorizontal size={16} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Filter Collection</h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  style={{
                    border: 'none',
                    background: 'var(--bg-surface-elevated)',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Section 1: Screen Format */}
            <div>
              <div className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginBottom: '0.5rem' }}>
                SCREEN FORMAT / TARGET DEVICE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {FORMAT_TYPES.map((fmt) => {
                  const isActive = activeFormat === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => onSelectFormat(fmt.id)}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        fontSize: '0.78125rem',
                        fontWeight: isActive ? 600 : 400,
                        background: isActive ? 'var(--text-primary)' : 'var(--bg-surface-elevated)',
                        color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                        border: isActive ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{fmt.title}</span>
                      {isActive && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Color Palette */}
            {onSelectFamily && (
              <div>
                <div className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginBottom: '0.5rem' }}>
                  COLOR HARMONY
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {COLOR_FAMILIES.map((family) => {
                    const isActive = activeFamily === family.id;
                    const count = colorCounts[family.id] ?? 0;
                    return (
                      <button
                        key={family.id}
                        onClick={() => onSelectFamily(family.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: isActive ? 600 : 400,
                          background: isActive ? 'var(--text-primary)' : 'var(--bg-surface-elevated)',
                          color: isActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                          border: isActive ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                        }}
                      >
                        {family.hex ? (
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: family.hex,
                              border: '1px solid rgba(128, 128, 128, 0.4)',
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                            }}
                          />
                        )}
                        <span>{family.label}</span>
                        {count > 0 && <span style={{ opacity: 0.6, fontSize: '0.6875rem' }}>({count})</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 3: Curated Aesthetic Tags */}
            <div>
              <div className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginBottom: '0.5rem' }}>
                CURATED AESTHETIC TAGS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {POPULAR_TAGS.map((tag) => {
                  const isTagActive = activeTag.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      onClick={() => onSelectTag(isTagActive ? '' : tag)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        background: isTagActive ? 'var(--text-primary)' : 'var(--bg-surface-elevated)',
                        color: isTagActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                        border: isTagActive ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                      }}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Actions Footer */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              {onResetFilters && (
                <button
                  onClick={() => {
                    onResetFilters();
                    setIsDrawerOpen(false);
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              )}

              <button
                onClick={() => setIsDrawerOpen(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Show Wallpapers ({totalCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
