'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import ColorRibbon from '@/components/ColorRibbon';
import CategoryFilters from '@/components/CategoryFilters';
import WallpaperGrid from '@/components/WallpaperGrid';
import WallpaperViewer from '@/components/WallpaperViewer';
import { WALLPAPERS } from '@/data/wallpapers';
import { filterWallpapers } from '@/lib/filters';
import { ChevronDown, Sparkles } from 'lucide-react';

// Fisher-Yates shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Home() {
  const [shuffledWallpapers, setShuffledWallpapers] = useState(WALLPAPERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [natureType, setNatureType] = useState('all');
  const [format, setFormat] = useState('all');
  const [activeTag, setActiveTag] = useState('');
  const [colorMode, setColorMode] = useState('family');
  const [colorFamily, setColorFamily] = useState('all');
  const [targetHex, setTargetHex] = useState('#2A5C8A');
  const [similarityThreshold, setSimilarityThreshold] = useState(35);
  const [density, setDensity] = useState('balanced');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);

  // Pagination: Load 30 thumbnails initially
  const [visibleCount, setVisibleCount] = useState(30);

  // Randomize wallpapers on initial client mount so each visit feels fresh
  useEffect(() => {
    setShuffledWallpapers(shuffleArray(WALLPAPERS));
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(30);
  }, [searchQuery, category, natureType, format, activeTag, colorMode, colorFamily, targetHex, similarityThreshold, favoritesOnly]);

  // Load saved favorites on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('minimal_favorites');
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
  }, []);

  // Save favorites when updated
  const toggleFavorite = (id) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('minimal_favorites', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save favorites', e);
      }
      return next;
    });
  };

  // Pre-calculate real item counts for each color family across entire catalog
  const colorCounts = useMemo(() => {
    const counts = { all: WALLPAPERS.length };
    for (const w of WALLPAPERS) {
      const fam = w.colorFamily || 'monochrome';
      counts[fam] = (counts[fam] || 0) + 1;
    }
    return counts;
  }, []);

  // Filter wallpapers based on all active parameters
  const filteredWallpapers = useMemo(() => {
    return filterWallpapers(shuffledWallpapers, {
      searchQuery,
      category,
      natureType,
      format,
      activeTag,
      colorMode,
      colorFamily,
      targetHex,
      similarityThreshold,
      favoriteIds,
      favoritesOnly,
    });
  }, [
    shuffledWallpapers,
    searchQuery,
    category,
    natureType,
    format,
    activeTag,
    colorMode,
    colorFamily,
    targetHex,
    similarityThreshold,
    favoriteIds,
    favoritesOnly,
  ]);

  // Visible subset (30 initially, then +30 per click)
  const displayedWallpapers = useMemo(() => {
    return filteredWallpapers.slice(0, visibleCount);
  }, [filteredWallpapers, visibleCount]);

  const hasMore = visibleCount < filteredWallpapers.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 30);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setNatureType('all');
    setFormat('all');
    setActiveTag('');
    setColorMode('family');
    setColorFamily('all');
    setFavoritesOnly(false);
    setVisibleCount(30);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Center Floating Pill Header */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Container with 25px side gaps and top clearance for pill header */}
      <main className="container" style={{ flex: '1', paddingTop: '5.25rem' }}>
        {/* ML Color Ribbon */}
        <ColorRibbon
          colorMode={colorMode}
          onColorModeChange={setColorMode}
          activeFamily={colorFamily}
          onSelectFamily={setColorFamily}
          targetHex={targetHex}
          onTargetHexChange={setTargetHex}
          similarityThreshold={similarityThreshold}
          onThresholdChange={setSimilarityThreshold}
          colorCounts={colorCounts}
        />

        {/* Style, Nature, Screen Format & Curated Tag Filters */}
        <CategoryFilters
          activeCategory={category}
          onSelectCategory={setCategory}
          activeNatureType={natureType}
          onSelectNatureType={setNatureType}
          activeFormat={format}
          onSelectFormat={setFormat}
          activeTag={activeTag}
          onSelectTag={setActiveTag}
          favoritesOnly={favoritesOnly}
          onToggleFavoritesOnly={setFavoritesOnly}
          favoritesCount={favoriteIds.length}
          totalCount={filteredWallpapers.length}
        />

        {/* Image-First CSS Grid Gallery (renders 30 thumbnails initially) */}
        <WallpaperGrid
          wallpapers={displayedWallpapers}
          onSelectWallpaper={setSelectedWallpaper}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onResetFilters={resetAllFilters}
          density={density}
          onDensityChange={setDensity}
        />

        {/* Minimal Middle Line to Load More */}
        {hasMore && (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '2rem 0 4rem',
            }}
          >
            {/* Horizontal Line Rule */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '1px',
                background: 'var(--border-subtle)',
                zIndex: 0,
              }}
            />

            {/* Load More Pill Button in the Middle */}
            <button
              onClick={loadMore}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.4rem',
                borderRadius: '9999px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--card-shadow)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
              }}
            >
              <span>Load More Wallpapers</span>
              <span className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.625rem' }}>
                ({displayedWallpapers.length} of {filteredWallpapers.length})
              </span>
              <ChevronDown size={14} style={{ opacity: 0.6 }} />
            </button>
          </div>
        )}

        {/* Subtle Completion Mark when all items are loaded */}
        {!hasMore && filteredWallpapers.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              margin: '3rem 0 4rem',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ width: '40px', height: '1px', background: 'var(--border-subtle)' }} />
            <span>All {filteredWallpapers.length} wallpapers loaded</span>
            <span style={{ width: '40px', height: '1px', background: 'var(--border-subtle)' }} />
          </div>
        )}
      </main>

      {/* Lightbox / Zen Device Viewer with Ambient Bloom */}
      {selectedWallpaper && (
        <WallpaperViewer
          wallpaper={selectedWallpaper}
          allWallpapers={filteredWallpapers}
          onClose={() => setSelectedWallpaper(null)}
          onSelectWallpaper={setSelectedWallpaper}
          isFavorite={favoriteIds.includes(selectedWallpaper.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Minimalist Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '2rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <p
            className="mono-tag"
            style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}
          >
            MINIMAL.WALL — SHUFFLED AESTHETICS • 30-LOAD ACCELERATION • {WALLPAPERS.length} CURATED WALLPAPERS
          </p>
        </div>
      </footer>
    </div>
  );
}
