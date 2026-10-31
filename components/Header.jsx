'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({ searchQuery = '', onSearchChange, onOpenCommandPalette }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="pill-header-wrapper">
      <header className="pill-header">
        {/* Brand Logo & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--text-primary)',
                display: 'inline-block',
              }}
            />
            <span>minimal.wall</span>
          </Link>

          <nav style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <Link
              href="/"
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                transition: 'color 0.15s ease',
              }}
            >
              Gallery
            </Link>
            <Link
              href="/explore"
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontWeight: 400,
                transition: 'color 0.15s ease',
              }}
            >
              Explore
            </Link>
          </nav>
        </div>

        {/* Compact Search & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1', maxWidth: '300px', justifyContent: 'flex-end' }}>
          <div
            onClick={() => onOpenCommandPalette?.()}
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              cursor: onOpenCommandPalette ? 'pointer' : 'text',
            }}
          >
            <Search
              size={13}
              style={{
                position: 'absolute',
                left: '10px',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search or ⌘K..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onFocus={() => {
                if (onOpenCommandPalette) {
                  onOpenCommandPalette();
                } else {
                  setIsFocused(true);
                }
              }}
              onBlur={() => setIsFocused(false)}
              readOnly={!!onOpenCommandPalette}
              style={{
                width: '100%',
                padding: '0.35rem 2.2rem 0.35rem 1.8rem',
                borderRadius: '9999px',
                background: isFocused ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
                border: isFocused
                  ? '1px solid var(--border-focus)'
                  : '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                outline: 'none',
                cursor: onOpenCommandPalette ? 'pointer' : 'text',
                transition: 'var(--transition-smooth)',
              }}
            />
            {searchQuery ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSearchChange?.('');
                }}
                style={{
                  position: 'absolute',
                  right: '8px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={12} />
              </button>
            ) : (
              <span
                style={{
                  position: 'absolute',
                  right: '8px',
                  fontSize: '0.625rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-surface)',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)',
                  pointerEvents: 'none',
                }}
              >
                ⌘K
              </span>
            )}
          </div>

          <ThemeToggle />
        </div>
      </header>
    </div>
  );
}
