import './globals.css';

export const metadata = {
  title: 'minimal.wall — Adaptive Minimal Wallpaper Collection',
  description:
    'An image-first, minimal wallpaper gallery with adaptive light/dark themes, color-science filtering, and live device mockup previews.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
