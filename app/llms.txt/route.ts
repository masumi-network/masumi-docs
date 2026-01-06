import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Serves the statically generated llms.txt file.
 * The file is generated at build time by scripts/generate-llms-txt.mjs
 * This approach provides:
 * - Zero runtime processing
 * - Unlimited scalability
 * - CDN-friendly caching
 * - No memory usage
 */
export async function GET() {
  try {
    // Serve the statically generated file from public directory
    const filePath = join(process.cwd(), 'public', 'llms.txt');
    const content = await readFile(filePath, 'utf-8');
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400', // 1 hour browser, 24 hours CDN
      },
    });
  } catch (error) {
    // Fallback: If file doesn't exist (e.g., first build), return 404
    // This should not happen in production after first successful build
    console.error('Error serving llms.txt (file may not be generated yet):', error);
    return new NextResponse('File not found. Please run build to generate llms.txt', { 
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}