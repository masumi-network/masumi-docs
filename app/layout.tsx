import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { SiteFooter } from '@/components/site-footer';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Masumi Documentation',
  description: 'Documentation for Masumi Network',
  icons: {
    icon: '/favicon-docs.svg',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <Script
          defer
          data-domain="docs.masumi.network"
          src="https://plausible.io/js/script.hash.outbound-links.pageview-props.tagged-events.js"
        />
        <Script id="plausible-init">
          {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
        </Script>
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <SiteFooter />
        {/* Fixed Kanji on the right */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50  pointer-events-none">
          <img 
            src="/assets/masumi-kanji-black.png" 
            alt="Masumi Kanji" 
            className="h-[40px] w-auto dark:hidden"
          />
          <img 
            src="/assets/masumi-kanji-white.png" 
            alt="Masumi Kanji" 
            className="h-[40px] w-auto hidden dark:block"
          />
        </div>
      </body>
    </html>
  );
}
