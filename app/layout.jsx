import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://minimal-wall.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'minimal.wall — Adaptive Minimal Wallpaper Collection',
    template: '%s | minimal.wall',
  },
  description:
    'An image-first, minimal wallpaper gallery with adaptive light/dark themes, color-science filtering, and live device mockup previews.',
  keywords: [
    'minimalist wallpaper',
    'minimal wallpaper 4k',
    'aesthetic desktop wallpaper',
    'phone wallpaper minimal',
    'dark mode wallpaper',
    'clean wallpaper',
    'AMOLED wallpaper',
  ],
  authors: [{ name: 'minimal.wall' }],
  creator: 'minimal.wall',
  openGraph: {
    title: 'minimal.wall — Adaptive Minimal Wallpaper Collection',
    description:
      'Curated 4K minimalist wallpapers with adaptive themes and color-matching science.',
    url: SITE_URL,
    siteName: 'minimal.wall',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'minimal.wall — Adaptive Minimal Wallpaper Collection',
    description:
      'Curated 4K minimalist wallpapers with adaptive themes and color-matching science.',
  },
  verification: {
    google: '_7G1NUWgOwXSuWaLUTHBPgRccGOGBfatjnuMfRpiMIo',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  if (stored) {
                    document.documentElement.setAttribute('data-theme', stored);
                  } else {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
