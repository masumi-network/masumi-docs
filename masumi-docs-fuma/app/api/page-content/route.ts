import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
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
    } else if (!filePath.endsWith('.mdx')) {
      filePath = `${filePath}.mdx`;
    }
    
    // Construct the full file path
    const contentDir = join(process.cwd(), 'content', 'docs');
    const fullPath = join(contentDir, filePath);
    
    try {
      const content = await readFile(fullPath, 'utf-8');
      
      // Extract title from frontmatter
      const titleMatch = content.match(/^title:\s*(.+)$/m);
      const title = titleMatch ? titleMatch[1].replace(/['"]/g, '') : 'Documentation Page';
      
      return NextResponse.json({
        content,
        title,
        path: filePath,
      });
    } catch (fileError) {
      // If direct path doesn't work, try some common patterns
      const possiblePaths = [
        `${filePath}/index.mdx`,
        `${filePath}.mdx`,
        `_${filePath}.mdx`,
      ];
      
      for (const possiblePath of possiblePaths) {
        try {
          const fullPossiblePath = join(contentDir, possiblePath);
          const content = await readFile(fullPossiblePath, 'utf-8');
          
          const titleMatch = content.match(/^title:\s*(.+)$/m);
          const title = titleMatch ? titleMatch[1].replace(/['"]/g, '') : 'Documentation Page';
          
          return NextResponse.json({
            content,
            title,
            path: possiblePath,
          });
        } catch {
          continue;
        }
      }
      
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}