import { getAllWallpapers } from '@/lib/wallpapers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://minimal-wall.vercel.app';

export default async function sitemap() {
  const wallpapers = await getAllWallpapers();

  const wallpaperUrls = wallpapers.map((w) => ({
    url: `${SITE_URL}/wallpaper/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  return [...staticUrls, ...wallpaperUrls];
}
