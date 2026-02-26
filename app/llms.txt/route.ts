import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { source } from '@/lib/source';
import { getLLMText } from '@/lib/get-llm-text';

// In-memory cache for the generated content (persists across requests)
let cachedContent: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

// CORS headers for LLM/cross-origin access (matches md-index and mdx routes)
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function generateLLMsTxtContent(): Promise<string> {
  const pages = source.getPages();
  const MAX_CONCURRENT = 10;
  
  const scanned: string[] = [];
  for (let i = 0; i < pages.length; i += MAX_CONCURRENT) {
    const batch = pages.slice(i, i + MAX_CONCURRENT);
    const batchResults = await Promise.all(batch.map(getLLMText));
    scanned.push(...batchResults);
  }
  
  return [
    '# Masumi Network Documentation - Complete Version',
    '',
    'This file contains the complete Masumi Network documentation for LLM consumption.',
    `Generated on: ${new Date().toISOString()}`,
    'Website: https://docs.masumi.network',
    '',
    '## About Masumi Network',
    'Masumi Network enables Agent-to-Agent Payments and unlocks the Agentic Economy through decentralized AI agent interactions.',
    '',
    '## How to Access Individual Pages as Markdown',
    '',
    '**This documentation is fully LLM-enabled!** Each page is available in markdown format.',
    '',
    '### URL Pattern:',
    '```',
    'https://docs.masumi.network/<any-path>.md',
    '```',
    '',
    '### Examples:',
    '- https://docs.masumi.network/documentation/get-started/installation.md',
    '- https://docs.masumi.network/api-reference/payment-service/post-registry.md',
    '- https://docs.masumi.network/documentation/how-to-guides/how-to-enable-agent-collaboration.md',
    '',
    '### Markdown Index:',
    'For a complete list of all available markdown pages, visit:',
    '- https://docs.masumi.network/md-index',
    '- https://docs.masumi.network/md-index.md',
    '',
    '### Benefits:',
    '- Clean markdown without HTML/JSX',
    '- CORS-enabled for API access',
    '- Cached for fast access',
    '- Bot-friendly (bypasses Cloudflare protection)',
    '',
    '---',
    '',
    '## Complete Documentation Below',
    '',
    ...scanned,
  ].join('\n');
}

/**
 * Serves the llms.txt file, generating it on-demand if needed.
 * Uses in-memory caching to avoid regenerating on every request.
 * This approach:
 * - Reduces build time (file not generated at build)
 * - Faster deployments (smaller bundle size)
 * - Still fast responses (cached in memory)
 * - CDN-friendly caching headers
 */
export async function GET() {
  try {
    // Check in-memory cache first
    const now = Date.now();
    if (cachedContent && (now - cacheTimestamp) < CACHE_TTL) {
      return new NextResponse(cachedContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          // Cache aggressively: 24 hours browser, 7 days CDN, serve stale for 30 days while revalidating
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
          ...CORS_HEADERS,
        },
      });
    }

    // Try to read from disk cache (if it exists from previous generation)
    const filePath = join(process.cwd(), 'public', 'llms.txt');
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      // Update in-memory cache
      cachedContent = fileContent;
      cacheTimestamp = now;
      
      return new NextResponse(fileContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
          ...CORS_HEADERS,
        },
      });
    } catch (fileError) {
      // File doesn't exist, generate it
      console.log('📝 Generating llms.txt on-demand...');
    }

    // Generate content on-demand
    const content = await generateLLMsTxtContent();
    
    // Update in-memory cache
    cachedContent = content;
    cacheTimestamp = now;
    
    // Optionally write to disk for persistence (non-blocking)
    writeFile(filePath, content, 'utf-8').catch((err) => {
      console.warn('Failed to write llms.txt to disk (non-critical):', err);
    });
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error('❌ Error generating/serving llms.txt:', error);
    return new NextResponse('Error generating llms.txt', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        ...CORS_HEADERS,
      },
    });
  }
}

// Handle CORS preflight requests (required for cross-origin fetch from browsers)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
      ...CORS_HEADERS,
    },
  });
}