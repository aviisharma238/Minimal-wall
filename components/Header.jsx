'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({ searchQuery = '', onSearchChange }) {
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
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
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
              placeholder="Search aesthetics..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                width: '100%',
                padding: '0.35rem 1.8rem 0.35rem 1.8rem',
                borderRadius: '9999px',
                background: isFocused ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
                border: isFocused
                  ? '1px solid var(--border-focus)'
                  : '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                outline: 'none',
                transition: 'var(--transition-smooth)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
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
            )}
          </div>

          <ThemeToggle />
        </div>
      </header>
    </div>
  );
}
