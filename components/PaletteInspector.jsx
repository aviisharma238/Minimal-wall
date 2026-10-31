'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, Copy, Code, ChevronDown } from 'lucide-react';

export default function PaletteInspector({ dominantColors = [] }) {
  const [copiedHex, setCopiedHex] = useState(null);
  const [copiedFormat, setCopiedFormat] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const menuRef = useRef(null);

  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleExportTheme = (format) => {
    let text = '';
    const colors = dominantColors.map((c) => c.hex);

    if (format === 'css') {
      text = `:root {\n${dominantColors
        .map((c, i) => `  --color-tone-${i + 1}: ${c.hex}; /* ${c.name || ''} */`)
        .join('\n')}\n}`;
    } else if (format === 'tailwind') {
      const entries = dominantColors
        .map((c, i) => `        tone${i + 1}: '${c.hex}',`)
        .join('\n');
      text = `// tailwind.config.js\nextend: {\n  colors: {\n${entries}\n  }\n}`;
    } else if (format === 'terminal') {
      text = `# Alacritty / Terminal Theme Palette\n[colors.normal]\nblack = "${colors[0] || '#1e1e2e'}"\nred = "${colors[1] || '#f38ba8'}"\ngreen = "${colors[2] || '#a6e3a1'}"\nyellow = "${colors[3] || '#f9e2af'}"\nblue = "${colors[0] || '#89b4fa'}"`;
    }

    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => {
      setCopiedFormat(null);
      setShowExportMenu(false);
    }, 1500);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

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

        {/* Theme Exporter Menu */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowExportMenu((prev) => !prev)}
            title="Export color palette for VS Code, CSS, or Terminal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
            }}
          >
            <Code size={13} />
            <span>Export</span>
            <ChevronDown size={11} style={{ opacity: 0.6 }} />
          </button>

          {showExportMenu && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 6px)',
                left: 0,
                width: '180px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 12px 30px -6px rgba(0, 0, 0, 0.3)',
                padding: '0.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                zIndex: 60,
                animation: 'cmdScaleUp 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <button
                onClick={() => handleExportTheme('css')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span>CSS Variables</span>
                {copiedFormat === 'css' && <Check size={12} color="#10B981" />}
              </button>

              <button
                onClick={() => handleExportTheme('tailwind')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span>Tailwind Config</span>
                {copiedFormat === 'tailwind' && <Check size={12} color="#10B981" />}
              </button>

              <button
                onClick={() => handleExportTheme('terminal')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span>Terminal (Alacritty)</span>
                {copiedFormat === 'terminal' && <Check size={12} color="#10B981" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
