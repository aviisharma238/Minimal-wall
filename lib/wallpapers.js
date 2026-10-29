/**
 * Wallpaper Repository Service
 * Provides data abstraction, slug/id lookup, and ML similarity matching.
 */

import { WALLPAPERS } from '../data/wallpapers';
import { getMinimumDeltaE } from './colors';

export async function getAllWallpapers() {
  return WALLPAPERS;
}

export async function getWallpaperBySlug(slugOrId) {
  if (!slugOrId) return null;
  const target = decodeURIComponent(slugOrId).toLowerCase();
  return (
    WALLPAPERS.find(
      (w) => w.slug.toLowerCase() === target || w.id.toLowerCase() === target
    ) || null
  );
}

export async function getRelatedWallpapers(wallpaper, limit = 8) {
  if (!wallpaper) return [];

  const targetTags = new Set(wallpaper.tags || []);
  const targetHex = wallpaper.dominantColors?.[0]?.hex;

  // Rank other wallpapers based on shared tags, category match, and color closeness
  const scored = WALLPAPERS.filter((w) => w.id !== wallpaper.id).map((w) => {
    let score = 0;

    // 1. Tag overlap (high relevance)
    if (w.tags) {
      for (const t of w.tags) {
        if (targetTags.has(t)) score += 3;
      }
    }

    // 2. Category match
    if (w.category === wallpaper.category) score += 2;
    if (w.natureType && w.natureType === wallpaper.natureType) score += 2;

    // 3. Color family match
    if (w.colorFamily === wallpaper.colorFamily) score += 1.5;

    // 4. Perceptual color closeness
    if (targetHex && w.dominantColors) {
      const dist = getMinimumDeltaE(targetHex, w.dominantColors);
      if (dist < 25) score += 2;
      else if (dist < 40) score += 1;
    }

    return { wallpaper: w, score };
  });

  // Sort by highest similarity score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.wallpaper);
}
