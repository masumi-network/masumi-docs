import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { source } from '@/lib/source';
import { getLLMText } from '@/lib/get-llm-text';

// In-memory cache for the generated content (persists across requests)
let cachedContent: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

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
    '---',
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
          'Cache-Control': 'public, max-age=3600, s-maxage=86400', // 1 hour browser, 24 hours CDN
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
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
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
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('❌ Error generating/serving llms.txt:', error);
    return new NextResponse('Error generating llms.txt', { 
      status: 500,
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