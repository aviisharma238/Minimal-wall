<div align="center">

# ⛩️ minimal.wall

### An Ultra-Fast, Adaptive Minimal Wallpaper Platform Powered by ML Color Science & Global Edge CDN

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/ImageKit-AWS_CloudFront_CDN-ff5722?style=for-the-badge" alt="ImageKit CDN" />
  <img src="https://img.shields.io/badge/Wallpapers-1%2C368_Curated-8a2be2?style=for-the-badge" alt="1,368 Curated Wallpapers" />
  <img src="https://img.shields.io/badge/Responsive-All_Devices-emerald?style=for-the-badge" alt="Responsive" />
  <img src="https://img.shields.io/badge/License-MIT-gray?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  A distraction-free, image-first aesthetic wallpaper engine designed with <b>Apple-grade polish</b> and <b>Linear-inspired micro-interactions</b>.<br />
  Explore 1,368 curated visual spaces with real-time CIELAB perceptual color matching, a Raycast-style Command Palette (<code>⌘K</code>), interactive device simulators, and tailored multi-device downloads.
</p>

[**Explore Live Demo**](https://minimal-wall.vercel.app) • [**Report Bug**](https://github.com/aviisharma238/Minimal-wall/issues) • [**Request Wallpaper**](https://github.com/aviisharma238/Minimal-wall/issues)

</div>

---

```
                       ┌───────────────────────────────┐
                       │   FLOATING GLASS PILL HEADER  │
                       │ [● minimal.wall] [Search ⌘K] [☼]│
                       └───────────────┬───────────────┘
                                       │
       ┌───────────────────────────────┴───────────────────────────────┐
       │                                                               │
┌──────▼─────────────────────┐  ┌────────────────────────┐  ┌──────────▼─────────────────┐
│   SPOTLIGHT COMMAND (⌘K)   │  │   ML COLOR DISCOVERY   │  │   RESPONSIVE GRID MATRIX   │
│ • Fuzzy Aesthetic Search   │  │ • CIELAB ΔE Color Match│  │ • Ultrawide (4–5 Columns)  │
│ • Randomizer Shuffle (R)   │  │ • 4-Segment Proportion │  │ • Desktop (3–4 Columns)    │
│ • Quick Actions (F, Mode)  │  │ • Live Swatch Counts   │  │ • Mobile (Full-Bleed 1-Col)│
└────────────────────────────┘  └────────────────────────┘  └──────────┬─────────────────┘
                                                                       │
                                                       ┌───────────────▼─────────────────┐
                                                       │   IMMERSIVE LIGHTBOX SIMULATOR  │
                                                       │ • Interactive iPhone / Mac Sim  │
                                                       │ • Live Clock, Battery & Widgets │
                                                       │ • Multi-Device Crop Downloader  │
                                                       │ • Developer Theme Exporter      │
                                                       │ • Touch Gestures (Swipe Nav/Down)│
                                                       └─────────────────────────────────┘
```

---

## ✨ Key Highlights

### 🔍 Spotlight Command Palette (`⌘K` / `Ctrl+K`)
* **Raycast / Linear-Grade UX**: Tap `⌘K` (or `Ctrl+K`), press `/`, or click the header badge from anywhere to summon the command center.
* **Instant Fuzzy Search**: Search across all 1,368 wallpapers by mood (*"cyberpunk"*, *"cozy"*, *"retro"*), color (*"mocha"*, *"slate"*, *"emerald"*), or resolution (*"4K"*, *"Mobile"*).
* **Keyboard-First Controls**: Seamlessly navigate with `↑` / `↓` and select with `Enter`.

### 📱 1-Click Multi-Device Crop Downloader
Powered by ImageKit CDN's dynamic real-time URL transformations:
* 💻 **Desktop 4K (16:9)**: `3840 × 2160` UHD presentation format.
* 📱 **iPhone / Mobile (9:16)**: `1170 × 2532` with smart focal-point center cropping.
* 🖥️ **Ultrawide (21:9)**: `3440 × 1440` panoramic monitor cut.
* 📲 **iPad & Tablet (4:3)**: `2048 × 2732` tablet crop.
* ⚡ **Master Original**: Full uncompressed 4K / 8K RAW file.

### 🎨 Developer "Rice" Theme & Palette Exporter
In the wallpaper inspector, export the artwork's dominant color palette in 1 click:
* 📋 **CSS Variables**: Ready-to-paste `:root { --color-tone-1: #...; }`
* ⚡ **Tailwind CSS**: `extend: { colors: { tone1: '#...' } }`
* 💻 **Terminal Config**: Ready-to-paste palette for **Alacritty**, **Kitty**, and modern terminals.

### ⌚ Interactive Photorealistic Device Simulator
* **Apple MacBook Pro & iPhone 16 Frames**: Live simulator canvas with realistic bezels, notch, and dynamic island.
* **Live Real-Time Clock & Date**: Updates live every second with local time.
* **Interactive Lock Screen Widgets**: Weather forecast, calendar, focus status, and simulated battery indicators.

### 🌐 Global Edge CDN Architecture (ImageKit & AWS CloudFront)
* **Automatic Format Delivery (`f-auto`)**: Next-gen **AVIF** and **WebP** image formats served automatically based on browser capability.
* **Tiered Loading Acceleration**:
  - Top 8 cards load eagerly with `fetchPriority="high"` and `decoding="async"`.
  - Remaining gallery items stream lazily with viewport virtualization (`content-visibility: auto`).
  - Dominant-color alpha skeleton placeholder (`${primaryHex}26`) guarantees **0ms perceived layout shift**.
* **Intent-Based Hover Prefetch**: Hovering any card for $>140\text{ms}$ pre-caches the high-res preview before you even click.

### 📐 Comprehensive Multi-Device Responsiveness
* **Mobile Touch Swipe Gestures**: Swipe left / right to transition between artworks; pull down to dismiss the viewer.
* **Fluid Breakpoint Grid**:
  - **Ultrawide (> 1600px)**: 4 to 5 columns (`minmax(320px, 1fr)`)
  - **Standard Desktop (1100px – 1599px)**: 3 to 4 columns (`minmax(280px, 1fr)`)
  - **Tablets & iPads (641px – 1099px)**: 2 to 3 columns (`minmax(240px, 1fr)`)
  - **Mobile Phones (< 640px)**: 1 full-bleed column with scaled margins (`12px` padding).
* **Touch Device Overlays (`@media (hover: none)`)**: On mobile devices without mouse hover, titles, tags, and favorites are softly visible by default.
* **Momentum Scroll Ribbons (`.no-scrollbar`)**: Smooth iOS momentum swiping for categories, curated tags, and color palettes.

---

## ⌨️ Keyboard Shortcuts Cheat Sheet

| Shortcut | Action | Scope |
| :---: | :--- | :--- |
| <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> | Open Spotlight Command Palette | Global |
| <kbd>/</kbd> | Quick-focus search / Open Command Palette | Global |
| <kbd>R</kbd> | **Surprise Me** — Shuffle & open a random wallpaper | Global |
| <kbd>T</kbd> | Toggle Dark / Light Theme | Global |
| <kbd>F</kbd> | Toggle Saved Favorites / Bookmark current wallpaper | Global / Viewer |
| <kbd>→</kbd> / <kbd>←</kbd> | Navigate to next / previous wallpaper | In Viewer |
| <kbd>M</kbd> | Cycle Device Mockup (`Raw` &rarr; `MacBook` &rarr; `iPhone`) | In Viewer |
| <kbd>D</kbd> | Download Master Resolution original | In Viewer |
| <kbd>Esc</kbd> | Close Viewer or Command Palette | Modals |

---

## 🔬 Machine Learning Color Science

Every wallpaper in the 1,368-piece catalog is pre-processed using Python NumPy K-Means clustering to extract dominant chromatic palettes and spatial weights:

1. **RGB &rarr; CIELAB Color Space**: Colors are transformed from sRGB into the perceptual CIELAB ($L^*, a^*, b^*$) color space where Euclidean distance ($\Delta E$) accurately mirrors human optical perception.
2. **$\Delta E$ Perceptual Formula**:
   $$\Delta E = \sqrt{(L_1^* - L_2^*)^2 + (a_1^* - a_2^*)^2 + (b_1^* - b_2^*)^2}$$
3. **Dual-Mode Filtering**:
   - **Color Family Taxonomy**: Fast categorization (*Monochrome, Ocean Blue, Forest Green, Sunset Amber, Dusk Violet, Warm Sand, Muted Rose*).
   - **Custom Hex Matcher**: Drag the color wheel or type any hex (`#2A5C8A`) with an adjustable tolerance slider ($\Delta E \le 35$).
4. **4-Segment Proportion Bar**: Visualizes the exact mathematical weight of each dominant color on every card.

---

## 🗂️ Curated Collections

| Category | Wallpapers | Highlights |
| :--- | :---: | :--- |
| **Anime & Studio** | 44 | Ghibli aesthetics, cyberpunk anime, samurai, Tokyo street scenes |
| **Blue & Oceanic** | 99 | Deep abyssal blues, misty horizons, cool slate gradients |
| **Cyberpunk & Tokyo** | 34 | Rainy neon streets, holographic grids, futuristic cityscapes |
| **Gruvbox Retro** | 77 | Warm retro autumnal tones, nostalgic developer rice palettes |
| **Nordic Frost** | 41 | Moody granite summits, Arctic slate, minimal fog |
| **OLED Pure Black** | 71 | Pitch-black backgrounds ($> 70\%$ `#000000`) for OLED power saving |
| **Monochrome Noir** | 90 | Architectural brutalism, high-contrast charcoal shadows |
| **Space & Cosmic** | 19 | Nebula dust, astronauts, deep-field star clusters |
| **Nature & Solitude** | 147 | Mountain ridges, pine canopies, desert dunes, oceanic calms |
| **Minimalist & Abstract** | 772 | Clean vectors, Bauhaus geometries, geometric gradients |

---

## 🏗️ Project Architecture

```
Minimal-wall/
├── app/
│   ├── api/wallpaper/[...path]/  # Local fallback image stream
│   ├── explore/                  # Curated theme anthologies page
│   ├── wallpaper/[slug]/         # Dynamic SSR wallpaper detail & permalink
│   ├── globals.css               # Adaptive CSS variables, spring physics & animations
│   ├── layout.jsx                # Theme provider & root shell
│   └── page.jsx                  # Main gallery page with ML filters & state
├── components/
│   ├── CategoryFilters.jsx       # Category tabs, format filters & curated tags
│   ├── ColorRibbon.jsx           # ML Color Discovery & CIELAB slider
│   ├── CommandPalette.jsx        # Spotlight Command Center (⌘K)
│   ├── DeviceMockup.jsx          # Photorealistic MacBook & iPhone simulator
│   ├── Header.jsx                # Top-center floating glass pill header
│   ├── PaletteInspector.jsx      # Hex inspector & developer theme exporter
│   ├── ThemeToggle.jsx           # Dark / Light mode switch
│   ├── WallpaperCard.jsx         # Virtualized card with dominant color wash
│   ├── WallpaperGrid.jsx         # Responsive multi-tier CSS Grid
│   └── WallpaperViewer.jsx       # Fullscreen lightbox with multi-device downloader
├── data/
│   └── wallpapers.js             # 1,368 item catalog with ImageKit CDN URLs
├── lib/
│   ├── colors.js                 # CIELAB color conversion & Delta E algorithms
│   ├── filters.js                # Search, tag synonyms & category filtering
│   ├── imagekit.js               # ImageKit transformation URL builders
│   └── wallpapers.js             # Query helpers & slug resolution
└── public/
    └── thumbs/                   # Local lightweight thumbnail fallbacks
```

---

## ⚡ Quick Start & Development

### Prerequisites
* **Node.js** 18.17+ or 20+
* **npm**, **pnpm**, or **yarn**

### 1. Clone the repository
```bash
git clone https://github.com/aviisharma238/Minimal-wall.git
cd Minimal-wall
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 🚀 One-Click Deployment

Deploy your own instance of **minimal.wall** to Vercel with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aviisharma238/Minimal-wall)

---

## 📜 License

This project is open-source under the **[MIT License](LICENSE)**.

<div align="center">
  <sub>Crafted with passion for minimalist design, color science, and developer ricing.</sub>
</div>
