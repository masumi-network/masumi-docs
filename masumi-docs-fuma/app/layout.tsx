import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Masumi Documentation',
  description: 'Documentation for Masumi Network',
  icons: {
    icon: '/favicon.png',
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
      </body>
    </html>
  );
}
