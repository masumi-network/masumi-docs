import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*', // all dynamic routes
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store', // prevents DO or any CDN from caching streamed HTML
          },
        ],
      },
    ];
  },
};

export default withMDX(config);
