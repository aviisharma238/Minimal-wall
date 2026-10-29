'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function PaletteInspector({ dominantColors = [] }) {
  const [copiedHex, setCopiedHex] = useState(null);

  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  if (!dominantColors.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div
        className="mono-tag"
        style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}
      >
        EXTRACTED PALETTE
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        {dominantColors.map((color, idx) => {
          const isCopied = copiedHex === color.hex;
          return (
            <button
              key={idx}
              onClick={() => handleCopy(color.hex)}
              title={`Click to copy ${color.hex} (${color.name})`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.65rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
              }}
            >
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: color.hex,
                  border: '1px solid rgba(128, 128, 128, 0.25)',
                  flexShrink: 0,
                }}
              />
              <span>{color.hex}</span>
              {isCopied ? (
                <Check size={12} color="#10B981" />
              ) : (
                <Copy size={11} style={{ opacity: 0.45 }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
