/**
 * Advanced Multi-Dimensional Filter Engine
 * Handles full-text search, Category/Nature filtering, Screen Format,
 * Curated Tag matching, Color Family, and Perceptual Color Similarity using CIELAB Delta-E.
 */

import { getMinimumDeltaE } from './colors';

// Smart tag synonyms and stemming dictionary for curated tags
export const TAG_VARIANTS = {
  tokyonight: ['tokyonight', 'tokyo'],
  waves: ['wave', 'waves'],
  arch: ['arch', 'archlinux'],
  linux: ['linux', 'archlinux', 'debian', 'tux'],
  sunset: ['sunset', 'sunrise'],
  sakura: ['sakura', 'cherry', 'blossom'],
  astronaut: ['astronaut', 'astronauts'],
  pixelart: ['pixelart', 'pixel'],
  city: ['city', 'skyline', 'urban'],
  space: ['space', 'cosmic', 'galaxy', 'planet', 'nebula'],
  samurai: ['samurai', 'katana', 'ronin'],
  forest: ['forest', 'trees', 'woods', 'pine'],
  nord: ['nord', 'nordic'],
  cyberpunk: ['cyberpunk', 'neon', 'futuristic'],
};

export function matchesTag(wallpaper, tag) {
  if (!tag || !tag.trim()) return true;
  const t = tag.toLowerCase().trim();
  const title = (wallpaper.title || '').toLowerCase();
  const slug = (wallpaper.slug || '').toLowerCase();
  const tags = (wallpaper.tags || []).map((x) => x.toLowerCase());

  const variants = TAG_VARIANTS[t] || [t];
  return variants.some((v) => tags.includes(v) || title.includes(v) || slug.includes(v));
}

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

  // 5. Active Curated Tag Filter (with smart synonyms, title, and tag matching)
  if (activeTag && activeTag.trim() !== '') {
    results = results.filter((w) => matchesTag(w, activeTag));
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
