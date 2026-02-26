import { source } from '@/lib/source';
import { getLLMText } from '@/lib/get-llm-text';
import { NextRequest, NextResponse } from 'next/server';

// CORS headers for LLM access
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const page = source.getPage(slug);
    
    if (!page) {
      return new NextResponse('Page not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          ...CORS_HEADERS,
        },
      });
    }
    
    // getLLMText now has built-in caching, so this is already optimized
    const content = await getLLMText(page);
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        // Aggressive caching: 24 hours browser, 7 days CDN, serve stale for 30 days while revalidating
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
        'X-Robots-Tag': 'all', // Allow indexing
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error('Error generating MDX content:', error);
    return new NextResponse('Internal server error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        ...CORS_HEADERS,
      },
    });
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// HEAD request: same semantics as GET, no body (for CORS and availability checks)
export async function HEAD(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const page = source.getPage(slug);
    if (!page) {
      return new NextResponse(null, {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          ...CORS_HEADERS,
        },
      });
    }
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
        'X-Robots-Tag': 'all',
        ...CORS_HEADERS,
      },
    });
  } catch {
    return new NextResponse(null, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        ...CORS_HEADERS,
      },
    });
  }
}