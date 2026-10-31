'use client';

import { useState } from 'react';
import { COLOR_FAMILIES } from '@/lib/colors';
import { Sparkles } from 'lucide-react';

export default function ColorRibbon({
  colorMode = 'family', // 'family' | 'similarity'
  onColorModeChange,
  activeFamily = 'all',
  onSelectFamily,
  targetHex = '#2A5C8A',
  onTargetHexChange,
  similarityThreshold = 35,
  onThresholdChange,
  colorCounts = {},
}) {
  const [customHexInput, setCustomHexInput] = useState(targetHex);

  const handleHexInputChange = (e) => {
    const val = e.target.value;
    setCustomHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onTargetHexChange(val);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '0.85rem 1.15rem',
        borderRadius: '14px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1rem',
        boxShadow: 'var(--card-shadow)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Top Controls: Mode Switcher & Mode Description */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span
            className="mono-tag"
            style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}
          >
            ML COLOR DISCOVERY
          </span>

          <div
            style={{
              display: 'inline-flex',
              padding: '2px',
              borderRadius: '8px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => onColorModeChange('family')}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: colorMode === 'family' ? 500 : 400,
                background: colorMode === 'family' ? 'var(--bg-surface)' : 'transparent',
                color: colorMode === 'family' ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: colorMode === 'family' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Color Family
            </button>

            <button
              onClick={() => onColorModeChange('similarity')}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: colorMode === 'similarity' ? 500 : 400,
                background: colorMode === 'similarity' ? 'var(--bg-surface)' : 'transparent',
                color: colorMode === 'similarity' ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: colorMode === 'similarity' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease',
              }}
            >
              <Sparkles size={12} />
              <span>Similarity (ΔE)</span>
            </button>
          </div>
        </div>

        {colorMode === 'similarity' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
              ΔE DISTANCE TOLERANCE: {similarityThreshold}
            </span>
            <input
              type="range"
              min="15"
              max="55"
              value={similarityThreshold}
              onChange={(e) => onThresholdChange(Number(e.target.value))}
              style={{
                width: '85px',
                accentColor: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            />
          </div>
        )}
      </div>

      {/* Mode A: Color Family Swatches with Real Item Counts */}
      {colorMode === 'family' && (
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {COLOR_FAMILIES.map((family) => {
            const isActive = activeFamily === family.id;
            const count = colorCounts[family.id] ?? 0;
            return (
              <button
                key={family.id}
                onClick={() => onSelectFamily(family.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 500 : 400,
                  background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: isActive
                    ? '1px solid var(--border-focus)'
                    : '1px solid var(--border-subtle)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'var(--transition-smooth)',
                }}
              >
                {family.hex ? (
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: family.hex,
                      border: '1px solid rgba(128, 128, 128, 0.3)',
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                    }}
                  />
                )}
                <span>{family.label}</span>
                {count > 0 && (
                  <span
                    className="mono-tag"
                    style={{
                      fontSize: '0.625rem',
                      opacity: isActive ? 1 : 0.6,
                      marginLeft: '1px',
                    }}
                  >
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Mode B: Perceptual Color Similarity Picker */}
      {colorMode === 'similarity' && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.75rem',
            paddingTop: '0.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                position: 'relative',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                backgroundColor: targetHex,
              }}
            >
              <input
                type="color"
                value={targetHex}
                onChange={(e) => {
                  onTargetHexChange(e.target.value);
                  setCustomHexInput(e.target.value);
                }}
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  width: '60px',
                  height: '60px',
                  cursor: 'pointer',
                  opacity: 0,
                }}
              />
            </div>

            <input
              type="text"
              value={customHexInput}
              onChange={handleHexInputChange}
              placeholder="#2A5C8A"
              maxLength={7}
              style={{
                width: '85px',
                padding: '0.35rem 0.5rem',
                borderRadius: '8px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
              }}
            />
          </div>

          <span
            className="mono-tag"
            style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}
          >
            QUICK SELECTIONS:
          </span>

          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {['#1A1D20', '#172E21', '#163E5E', '#BD6F35', '#633B8E', '#B87F5E', '#6E2248', '#8E979F', '#3B4B74'].map(
              (sampleHex) => (
                <button
                  key={sampleHex}
                  onClick={() => {
                    onTargetHexChange(sampleHex);
                    setCustomHexInput(sampleHex);
                  }}
                  title={`Match wallpapers near ${sampleHex}`}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: sampleHex,
                    border: targetHex.toLowerCase() === sampleHex.toLowerCase()
                      ? '2px solid var(--text-primary)'
                      : '1px solid rgba(128, 128, 128, 0.3)',
                    cursor: 'pointer',
                    transform: targetHex.toLowerCase() === sampleHex.toLowerCase() ? 'scale(1.15)' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
