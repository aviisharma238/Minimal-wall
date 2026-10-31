/**
 * ImageKit CDN Delivery & Optimization Engine
 * Endpoint: https://ik.imagekit.io/ayusharma/wallpaper
 */

export const IMAGEKIT_BASE = 'https://ik.imagekit.io/ayusharma/wallpaper';

// Categories currently hosted on ImageKit
export const IMAGEKIT_ACTIVE_CATEGORIES = new Set([
  'anime',
]);

/**
 * Returns an optimized ImageKit CDN URL with dynamic on-the-fly transformations.
 * Falls back gracefully to local routes if the category isn't on ImageKit yet.
 */
export function getImageKitUrl(category, filename, transform = {}) {
  if (!category || !filename) return '';
  const cleanName = filename.replace(/^\/+/, '');

  const {
    width,
    height,
    quality = 80,
    blur,
    format = 'auto',
  } = transform;

  const transforms = [];
  if (format) transforms.push(`f-${format}`);
  if (width) transforms.push(`w-${width}`);
  if (height) transforms.push(`h-${height}`);
  if (quality) transforms.push(`q-${quality}`);
  if (blur) transforms.push(`bl-${blur}`);

  const transformParam = transforms.length > 0 ? `?tr=${transforms.join(',')}` : '';
  return `${IMAGEKIT_BASE}/${category}/${cleanName}${transformParam}`;
}

/**
 * Resolves optimal URLs for a wallpaper.
 * If the category is hosted on ImageKit, returns CloudFront CDN URLs with auto-WebP/AVIF.
 * Otherwise, falls back to the existing local pipeline.
 */
export function resolveWallpaperUrls(wallpaper) {
  if (!wallpaper) return null;

  const cat = (wallpaper.category || '').toLowerCase();
  
  if (IMAGEKIT_ACTIVE_CATEGORIES.has(cat) && wallpaper.urls?.original) {
    const filename = wallpaper.urls.original.split('/').pop();

    return {
      thumbnail: getImageKitUrl(cat, filename, { width: 480, quality: 80, format: 'auto' }),
      preview: getImageKitUrl(cat, filename, { width: 1920, quality: 85, format: 'auto' }),
      original: `${IMAGEKIT_BASE}/${cat}/${filename}`,
      isCdn: true,
    };
  }

  // Fallback to local paths
  return wallpaper.urls;
}
