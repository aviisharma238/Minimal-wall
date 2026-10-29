import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import PaletteInspector from '@/components/PaletteInspector';
import { getWallpaperBySlug, getRelatedWallpapers } from '@/lib/wallpapers';
import { ArrowLeft, Download, ExternalLink, Sparkles } from 'lucide-react';

export async function generateMetadata({ params }) {
  const wallpaper = await getWallpaperBySlug(params.slug);
  if (!wallpaper) return { title: 'Wallpaper Not Found' };
  return {
    title: `${wallpaper.title} — Minimal Wallpaper`,
    description: `Download ${wallpaper.title} minimal aesthetic wallpaper in ${wallpaper.resolutionBadge}.`,
  };
}

export default async function WallpaperDetailPage({ params }) {
  const wallpaper = await getWallpaperBySlug(params.slug);
  if (!wallpaper) notFound();

  const related = await getRelatedWallpapers(wallpaper, 8);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: '1', paddingTop: '5.25rem', paddingBottom: '5rem' }}>
        {/* Breadcrumb Back Link */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              transition: 'color 0.15s ease',
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Gallery</span>
          </Link>
        </div>

        {/* Hero Wallpaper Preview Container */}
        <div
          style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--card-shadow)',
            marginBottom: '2rem',
          }}
        >
          <img
            src={wallpaper.urls.preview || wallpaper.urls.original}
            alt={wallpaper.title}
            style={{
              width: '100%',
              maxHeight: '75vh',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Metadata, Palette & Download Action Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* Left Column: Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
                {wallpaper.title}
              </h1>
              <span
                className="mono-tag"
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                {wallpaper.resolutionBadge}
              </span>
            </div>

            <div
              className="mono-tag"
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <span>STYLE: {wallpaper.category?.toUpperCase()}</span>
              {wallpaper.natureType && <span>• NATURE: {wallpaper.natureType?.toUpperCase()}</span>}
              <span>• RATIO: {wallpaper.dimensions?.aspectRatio}</span>
              <span>• {wallpaper.dimensions?.width}×{wallpaper.dimensions?.height}</span>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
              {wallpaper.tags?.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Palette & Direct Download */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '1.25rem',
            }}
          >
            <PaletteInspector dominantColors={wallpaper.dominantColors} />

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
              <a
                href={wallpaper.urls.original}
                target="_blank"
                rel="noopener noreferrer"
                download={`${wallpaper.slug}.png`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <Download size={15} />
                <span>Download Original ({wallpaper.resolutionBadge})</span>
              </a>
            </div>
          </div>
        </div>

        {/* Similar Wallpapers in Bottom */}
        {related.length > 0 && (
          <div style={{ marginTop: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Sparkles size={16} style={{ color: 'var(--text-secondary)' }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                Similar Wallpapers
              </h2>
              <span
                className="mono-tag"
                style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}
              >
                ({related.length} MATCHES)
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/wallpaper/${item.id}`}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    aspectRatio: '16 / 10',
                    display: 'block',
                    position: 'relative',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <img
                    src={item.urls.thumbnail}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '0.75rem 0.85rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                      color: '#fff',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
