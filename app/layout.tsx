import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexusCreative | Amesha Rawat — Full Stack Developer & AI Creator',
  description:
    'Portfolio of Amesha Rawat — Full Stack Web Developer and AI Creator. Building scalable web applications and AI-generated films, advertisements, and visuals.',
  keywords: ['full stack developer', 'AI creator', 'AI filmmaker', 'AI advertisements', 'web developer', 'Next.js', 'React', 'NexusCreative'],
  authors: [{ name: 'Amesha Rawat' }],
  openGraph: {
    title: 'NexusCreative | Amesha Rawat',
    description: 'Where engineering meets imagination.',
    type: 'website',
    url: 'https://nexuscreative.vercel.app',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexusCreative | Amesha Rawat',
    description: 'Where engineering meets imagination.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
