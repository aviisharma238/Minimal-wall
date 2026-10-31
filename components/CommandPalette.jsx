'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Shuffle,
  Sun,
  Moon,
  Heart,
  Monitor,
  Smartphone,
  Sparkles,
  Palette,
  X,
  ArrowRight,
  CornerDownLeft,
  Compass,
} from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  allWallpapers = [],
  onSelectWallpaper,
  onShuffle,
  onToggleFavorites,
  onFilterCategory,
  onFilterFormat,
  onFilterColorFamily,
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Quick Action Commands
  const quickActions = useMemo(
    () => [
      {
        id: 'action-shuffle',
        type: 'action',
        title: 'Shuffle Random Wallpaper',
        subtitle: 'Pick a random aesthetic artwork from the catalog',
        icon: Shuffle,
        badge: 'R',
        perform: () => {
          onShuffle?.();
          onClose();
        },
      },
      {
        id: 'action-favorites',
        type: 'action',
        title: 'Show Saved Favorites',
        subtitle: 'Filter gallery to your bookmarked collection',
        icon: Heart,
        badge: 'F',
        perform: () => {
          onToggleFavorites?.();
          onClose();
        },
      },
      {
        id: 'action-mobile',
        type: 'action',
        title: 'Mobile & Portrait Wallpapers',
        subtitle: 'Filter to vertical aspect ratios for iPhone & Android',
        icon: Smartphone,
        perform: () => {
          onFilterFormat?.('9:16');
          onClose();
        },
      },
      {
        id: 'action-ultrawide',
        type: 'action',
        title: 'Ultrawide 21:9 Wallpapers',
        subtitle: 'Filter to panoramic screens (3440×1440+)',
        icon: Monitor,
        perform: () => {
          onFilterFormat?.('21:9');
          onClose();
        },
      },
      {
        id: 'action-anime',
        type: 'action',
        title: 'Anime & Studio Aesthetic',
        subtitle: 'Browse 44 anime landscapes and illustrations',
        icon: Sparkles,
        perform: () => {
          onFilterCategory?.('anime');
          onClose();
        },
      },
      {
        id: 'action-cyberpunk',
        type: 'action',
        title: 'Cyberpunk & Tokyo Night',
        subtitle: 'Neon grids, rainy alleys, and futuristic cityscapes',
        icon: Compass,
        perform: () => {
          onFilterCategory?.('cyberpunk');
          onClose();
        },
      },
      {
        id: 'action-oled',
        type: 'action',
        title: 'OLED Pure Black',
        subtitle: 'High contrast wallpapers with >70% pure ink blacks',
        icon: Palette,
        perform: () => {
          onFilterCategory?.('oled');
          onClose();
        },
      },
      {
        id: 'action-nord',
        type: 'action',
        title: 'Nord Arctic Palette',
        subtitle: 'Subtle slate blues and misty summits',
        icon: Palette,
        perform: () => {
          onFilterCategory?.('nord');
          onClose();
        },
      },
    ],
    [onShuffle, onToggleFavorites, onFilterCategory, onFilterFormat, onClose]
  );

  // Filtered Wallpapers matching query
  const matchingWallpapers = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return allWallpapers
      .filter((w) => {
        const titleMatch = w.title?.toLowerCase().includes(q);
        const catMatch = w.category?.toLowerCase().includes(q);
        const colorMatch = w.colorFamily?.toLowerCase().includes(q);
        const tagMatch = w.tags?.some((t) => t.toLowerCase().includes(q));
        const resMatch = w.resolutionBadge?.toLowerCase().includes(q);
        return titleMatch || catMatch || colorMatch || tagMatch || resMatch;
      })
      .slice(0, 8); // Top 8 matches for speed
  }, [query, allWallpapers]);

  // Combined Results list
  const results = useMemo(() => {
    if (!query.trim()) {
      return quickActions;
    }
    const matchedActions = quickActions.filter(
      (a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.subtitle.toLowerCase().includes(query.toLowerCase())
    );

    return [
      ...matchedActions,
      ...matchingWallpapers.map((w) => ({
        id: `wall-${w.id}`,
        type: 'wallpaper',
        wallpaper: w,
        title: w.title,
        subtitle: `${w.category.toUpperCase()} • ${w.colorFamily} • ${w.resolutionBadge || 'HD'}`,
      })),
    ];
  }, [query, quickActions, matchingWallpapers]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keep selection within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          if (selected.type === 'action') {
            selected.perform();
          } else if (selected.type === 'wallpaper') {
            onSelectWallpaper(selected.wallpaper);
            onClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectWallpaper]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        animation: 'cmdFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px var(--border-subtle)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '75vh',
          animation: 'cmdScaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '0.75rem',
          }}
        >
          <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wallpapers, vibes, colors, or press Esc to exit..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              fontWeight: 400,
            }}
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={12} />
            </button>
          ) : (
            <div
              style={{
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                padding: '0.2rem 0.45rem',
                borderRadius: '6px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              ESC
            </div>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          style={{
            overflowY: 'auto',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          {results.length === 0 ? (
            <div
              style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
              }}
            >
              No matching wallpapers or commands found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isAction = item.type === 'action';
              const ActionIcon = item.icon || Sparkles;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isAction) item.perform();
                    else {
                      onSelectWallpaper(item.wallpaper);
                      onClose();
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--bg-hover)' : 'transparent',
                    border: isSelected ? '1px solid var(--border-subtle)' : '1px solid transparent',
                    transition: 'background-color 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                    {isAction ? (
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'var(--text-primary)' : 'var(--bg-surface-elevated)',
                          color: isSelected ? 'var(--bg-surface)' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.12s ease',
                        }}
                      >
                        <ActionIcon size={16} />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '44px',
                          height: '28px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          backgroundColor: `${item.wallpaper.dominantColors?.[0]?.hex || '#333'}33`,
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={item.wallpaper.urls.thumbnail}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: isSelected ? 500 : 400,
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.71875rem',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        flexShrink: 0,
                      }}
                    >
                      <span>Select</span>
                      <CornerDownLeft size={12} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div
          style={{
            padding: '0.6rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.71875rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>
              <kbd style={{ padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>↑</kbd>{' '}
              <kbd style={{ padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>↓</kbd> navigate
            </span>
            <span>
              <kbd style={{ padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>↵</kbd> choose
            </span>
            <span>
              <kbd style={{ padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>esc</kbd> close
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={11} />
            <span>1,368 Artworks</span>
          </div>
        </div>
      </div>
    </div>
  );
}

