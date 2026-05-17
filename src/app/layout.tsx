import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://artem-ai-resume.vercel.app';
const description =
  'Evidence-grounded AI resume for Artem Tarasenko, a senior full-stack and platform engineer with Amazon and Oracle experience.';
const themeInitScript = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem('artem-resume-theme');
    const theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.colorScheme = 'dark';
  }
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Artem Tarasenko | AI Queryable Portfolio',
  description,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/site-icon.svg',
  },
  openGraph: {
    title: 'Artem Tarasenko | AI Queryable Portfolio',
    description,
    url: '/',
    siteName: 'Artem AI Resume',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Artem Tarasenko AI-queryable resume portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artem Tarasenko | AI Queryable Portfolio',
    description,
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
