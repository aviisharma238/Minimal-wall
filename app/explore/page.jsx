'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { WALLPAPERS } from '@/data/wallpapers';
import { Compass, Sparkles, Mountain, Moon, Flame } from 'lucide-react';

const CURATED_COLLECTIONS = [
  {
    title: 'Nordic Silence & Peaks',
    description: 'Moody granite summits and foggy alpine horizons with monochromatic serenity.',
    category: 'nature',
    natureType: 'mountain',
    sampleWallpapers: WALLPAPERS.filter((w) => w.natureType === 'mountain').slice(0, 3),
    color: '#4E555C',
  },
  {
    title: 'OLED Pure Black',
    description: 'Designed specifically for high-contrast OLED displays with deep ink backdrops.',
    category: 'oled',
    natureType: null,
    sampleWallpapers: WALLPAPERS.filter((w) => w.category === 'oled' || w.colorFamily === 'monochrome').slice(0, 3),
    color: '#09090A',
  },
  {
    title: 'Warm Sandstone & Dunes',
    description: 'Golden hour terracotta, wind-swept Sahara dunes, and earthy desert geometries.',
    category: 'nature',
    natureType: 'desert',
    sampleWallpapers: WALLPAPERS.filter((w) => w.natureType === 'desert').slice(0, 3),
    color: '#BD6F35',
  },
  {
    title: 'Oceanic Calm & Abyss',
    description: 'Gentle cerulean horizons and peaceful coastal gradients.',
    category: 'nature',
    natureType: 'ocean',
    sampleWallpapers: WALLPAPERS.filter((w) => w.natureType === 'ocean').slice(0, 3),
    color: '#163E5E',
  },
];

export default function ExplorePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: '1', paddingTop: '5.25rem', paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            className="mono-tag"
            style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginBottom: '0.4rem' }}
          >
            CURATED ANTHOLOGIES
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
            Explore Minimal Themes
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.9375rem' }}>
            Handpicked visual spaces grouped by natural geometry and chromatic harmony.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
          {CURATED_COLLECTIONS.map((col, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: '16px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: col.color,
                      display: 'inline-block',
                    }}
                  />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 500 }}>{col.title}</h2>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {col.description}
                </p>

                {/* Previews */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    margin: '1.25rem 0',
                  }}
                >
                  {col.sampleWallpapers.map((w) => (
                    <div
                      key={w.id}
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        aspectRatio: '16 / 10',
                        background: 'var(--bg-surface-elevated)',
                      }}
                    >
                      <img
                        src={w.urls.thumbnail}
                        alt={w.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  transition: 'var(--transition-smooth)',
                }}
              >
                Browse Anthology
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
