<div align="center">

# ⛩️ minimal.wall

### An Adaptive Minimal Wallpaper Platform Powered by ML Color Science

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Wallpapers-1368-purple?style=for-the-badge" />
</p>

A distraction-free, image-first wallpaper platform engineered with **Next.js App Router**, **Adaptive Minimal** aesthetics, and advanced **Color Science**. Features 1,368 curated aesthetic wallpapers with real-time CIELAB perceptual color matching and realistic device simulation.

</div>

---

## ✨ Features

- **Adaptive Minimal Aesthetics**: Pure dual-theme system (Gallery Light & Deep Space Dark) with zero layout flash and seamless OS `prefers-color-scheme` synchronization.
- **Top-Center Floating Glass Pill Header**: Centered floating navigation with integrated search and quick theme toggling.
- **Machine Learning K-Means Color Science**: Every wallpaper has its top 4 dominant colors and percentage weights extracted, converted to CIELAB ($L^*a^*b^*$).
- **Dual-Mode Color Discovery**:
  - **Color Family**: Fast taxonomy matching (*Monochrome, Ocean Blue, Forest Green, Sunset Amber, Dusk Violet, Warm Sand, Muted Rose*).
  - **Similarity ($\Delta E$) Engine**: Perceptual color distance matching against any custom HEX color with adjustable tolerance.
- **Photorealistic Device Simulator**: Preview any wallpaper inside an **Apple MacBook Pro** desktop chassis or **iPhone 16** frame with live real-time clock and lock screen widgets.
- **1,368 Curated Wallpapers**: Spanning *Anime & Japan, Nord Aesthetic, Space & Cosmic, Cyberpunk, Nature, OLED Pitch-Black, and Minimalist*.
- **Curated Tag Chips**: One-click instant filtering for `#astronaut`, `#samurai`, `#nord`, `#pixelart`, `#tokyonight`, `#city`, `#waves`, `#forest`, `#sunset`, `#arch`, `#linux`, `#sakura`.
- **Dynamic Ambient Bloom**: Lightbox modal projects a soft diffuse halo matching each wallpaper's primary dominant HEX code.
- **Performance Optimized**: 30-item accelerated thumbnail pagination and high-efficiency WebP thumbnails (`~20KB`) for fluid 60 FPS scrolling.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, `.jsx`)
- **Library**: React 18
- **Icons**: Lucide React
- **Styling**: Vanilla CSS3 Custom Properties (Adaptive Theme Tokens & CSS Grid)
- **Data & ML**: Python NumPy K-Means clustering pipeline & CIELAB color science

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/aviisharma238/Minimal-wall.git
cd Minimal-wall
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

MIT License. Designed with ♥ for minimalists.
