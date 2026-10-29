/**
 * Advanced Multi-Dimensional Filter Engine
 * Handles full-text search, Category/Nature filtering, Screen Format,
 * Curated Tag matching, Color Family, and Perceptual Color Similarity using CIELAB Delta-E.
 */

import { getMinimumDeltaE } from './colors';

export function filterWallpapers(wallpapers, options = {}) {
  const {
    searchQuery = '',
    category = 'all',
    natureType = 'all',
    format = 'all', // 'all' | '16:9' | '21:9' | '9:16'
    activeTag = '',
    colorMode = 'family', // 'family' | 'similarity'
    colorFamily = 'all',
    targetHex = '#2A5C8A',
    similarityThreshold = 35, // CIE76 Delta-E threshold
    favoriteIds = [],
    favoritesOnly = false,
  } = options;

  let results = [...wallpapers];

  // 1. Favorites Filter
  if (favoritesOnly) {
    const favSet = new Set(favoriteIds);
    results = results.filter((w) => favSet.has(w.id));
  }

  // 2. Category Filter
  if (category && category !== 'all') {
    results = results.filter((w) => w.category === category);
  }

  // 3. Nature Subtype Filter
  if (natureType && natureType !== 'all') {
    results = results.filter((w) => w.natureType === natureType);
  }

  // 4. Format / Aspect Ratio Filter
  if (format && format !== 'all') {
    results = results.filter((w) => w.dimensions?.aspectRatio === format);
  }

  // 5. Active Curated Tag Filter
  if (activeTag && activeTag.trim() !== '') {
    const t = activeTag.toLowerCase().trim();
    results = results.filter((w) => w.tags && w.tags.some((item) => item.toLowerCase() === t));
  }

  // 6. Color Filter
  if (colorMode === 'family') {
    if (colorFamily && colorFamily !== 'all') {
      results = results.filter((w) => w.colorFamily === colorFamily);
    }
  } else if (colorMode === 'similarity') {
    if (targetHex) {
      results = results
        .map((w) => {
          const distance = getMinimumDeltaE(targetHex, w.dominantColors);
          return { ...w, colorDistance: distance };
        })
        .filter((w) => w.colorDistance <= similarityThreshold)
        .sort((a, b) => a.colorDistance - b.colorDistance);
    }
  }

  // 7. Search Query (Title, tags, category, natureType, colorFamily)
  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    results = results.filter((w) => {
      const matchTitle = w.title?.toLowerCase().includes(q);
      const matchCategory = w.category?.toLowerCase().includes(q);
      const matchNature = w.natureType && w.natureType.toLowerCase().includes(q);
      const matchFamily = w.colorFamily?.toLowerCase().includes(q);
      const matchTags = w.tags && w.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchCategory || matchNature || matchFamily || matchTags;
    });
  }

  return results;
}
