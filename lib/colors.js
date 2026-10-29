/**
 * Color Science & Perceptual Distance Algorithms
 * Provides RGB, XYZ, and CIELAB conversions and CIE76 Delta-E calculations.
 */

// Convert HEX string to RGB object { r, g, b }
export function hexToRgb(hex) {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((char) => char + char).join('');
  }
  const intVal = parseInt(cleaned, 16);
  if (isNaN(intVal)) return { r: 0, g: 0, b: 0 };
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255,
  };
}

// Convert RGB to sRGB-adjusted XYZ color space (D65 standard illuminant)
export function rgbToXyz(r, g, b) {
  let rr = r / 255;
  let gg = g / 255;
  let bb = b / 255;

  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;

  rr *= 100;
  gg *= 100;
  bb *= 100;

  const x = rr * 0.4124 + gg * 0.3576 + bb * 0.1805;
  const y = rr * 0.2126 + gg * 0.7152 + bb * 0.0722;
  const z = rr * 0.0193 + gg * 0.1192 + bb * 0.9505;

  return { x, y, z };
}

// Convert XYZ to CIELAB (CIE L*a*b*)
export function xyzToLab(x, y, z) {
  // D65 reference white
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  let xx = x / refX;
  let yy = y / refY;
  let zz = z / refZ;

  const fx = xx > 0.008856 ? Math.cbrt(xx) : 7.787 * xx + 16 / 116;
  const fy = yy > 0.008856 ? Math.cbrt(yy) : 7.787 * yy + 16 / 116;
  const fz = zz > 0.008856 ? Math.cbrt(zz) : 7.787 * zz + 16 / 116;

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return { L, a, b };
}

// Convert HEX directly to CIELAB
export function hexToLab(hex) {
  const rgb = hexToRgb(hex);
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
}

// CIE76 Delta-E formula for perceptual color difference
export function deltaE(labA, labB) {
  const dL = labA.L - labB.L;
  const da = labA.a - labB.a;
  const db = labA.b - labB.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

// Compute lowest Delta-E between target HEX and array of dominant colors in a wallpaper
export function getMinimumDeltaE(targetHex, dominantColors = []) {
  if (!targetHex || !dominantColors.length) return 999;
  const targetLab = hexToLab(targetHex);

  let minDiff = Infinity;
  for (const item of dominantColors) {
    const hex = typeof item === 'string' ? item : item.hex;
    if (!hex) continue;
    const currentLab = hexToLab(hex);
    const diff = deltaE(targetLab, currentLab);
    if (diff < minDiff) {
      minDiff = diff;
    }
  }

  return minDiff;
}

// Standard Color Families definition
export const COLOR_FAMILIES = [
  { id: 'all', label: 'All Colors', hex: null },
  { id: 'monochrome', label: 'Monochrome', hex: '#1C1D1F', border: true },
  { id: 'blue', label: 'Ocean Blue', hex: '#2A5C8A' },
  { id: 'green', label: 'Forest Green', hex: '#2E6645' },
  { id: 'amber', label: 'Sunset Amber', hex: '#D97736' },
  { id: 'purple', label: 'Dusk Violet', hex: '#6C4887' },
  { id: 'earth', label: 'Warm Sand', hex: '#B89B72' },
  { id: 'rose', label: 'Muted Rose', hex: '#B85D6C' },
];
