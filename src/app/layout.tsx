'use client';

import ScrollToTop from '@/components/ScrollToTop';
import { Syne, Outfit } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import 'node_modules/react-modal-video/css/modal-video.css';
import '../styles/index.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
});
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-outfit',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <GoogleAnalytics gaId="G-K5DQ259S4B" />
      </head>
      <body className="w-full h-full overflow-y-scroll">
        <Providers>
          {children}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from './providers';
import { ColorSchemeScript } from '@mantine/core';
