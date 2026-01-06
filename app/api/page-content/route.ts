import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { apiResponseCache, fileReadCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `page-content:${path}`;
    const cached = apiResponseCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, max-age=900', // 15 minutes
        },
      });
    }

    // Convert URL path to file path
    let filePath = path;
    
    // Remove leading slash
    if (filePath.startsWith('/')) {
      filePath = filePath.slice(1);
    }
    
    // Handle different path patterns
    if (filePath === '' || filePath === '/') {
      filePath = 'index.mdx';
    }
    
    // Construct the full file path
    const contentDir = join(process.cwd(), 'content', 'docs');
    
    // Try different possible paths in order of preference
    const possiblePaths = [];
    
    if (filePath.endsWith('.mdx')) {
      possiblePaths.push(filePath);
    } else {
      // For paths like "documentation" or "core-concepts", try index first
      possiblePaths.push(`${filePath}/index.mdx`);
      possiblePaths.push(`${filePath}.mdx`);
      possiblePaths.push(`_${filePath}.mdx`);
    }
    
    // Try each possible path
    for (const possiblePath of possiblePaths) {
      try {
        const fullPath = join(contentDir, possiblePath);
        
        // Check file read cache
        let content = fileReadCache.get(fullPath);
        if (!content) {
          content = await readFile(fullPath, 'utf-8');
          fileReadCache.set(fullPath, content);
        }
        
        // Extract title from frontmatter
        const titleMatch = content.match(/^title:\s*(.+)$/m);
        const title = titleMatch ? titleMatch[1].replace(/['"]/g, '') : 'Documentation Page';
        
        const result = {
          content,
          title,
          path: possiblePath,
        };
        
        // Cache the result
        apiResponseCache.set(cacheKey, result);
        
        return NextResponse.json(result, {
          headers: {
            'Cache-Control': 'public, max-age=900', // 15 minutes
          },
        });
      } catch {
        continue;
      }
    }
    
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}