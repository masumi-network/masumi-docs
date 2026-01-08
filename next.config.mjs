import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone', // Required for Docker deployment
  reactStrictMode: true,
  // Optimize memory usage
  experimental: {
    // Reduce memory usage during builds
    optimizePackageImports: ['fumadocs-ui', 'lucide-react'],
  },
  // Enable compression to reduce memory usage
  compress: true,
  async headers() {
    return [
      {
        // Dynamic HTML pages - no caching (ISR handles this)
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store', // prevents DO or any CDN from caching streamed HTML
          },
        ],
      },
      {
        // Static assets - long cache
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API routes - short cache
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=900', // 5 min browser, 15 min CDN
          },
        ],
      },
      {
        // llms.txt - long cache (static file, generated at build time)
        source: '/llms.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400', // 1 hour browser, 24 hours CDN
          },
        ],
      },
    ];
  },
};

export default withMDX(config);
