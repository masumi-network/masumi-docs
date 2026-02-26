import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check if URL ends with .md or .markdown
  const mdMatch = pathname.match(/^(.+)\.(md|markdown)$/);

  if (mdMatch) {
    const pathWithoutExtension = mdMatch[1];

    // Special case: /md-index.md → rewrite to /md-index (served by app/md-index/route.ts)
    if (pathWithoutExtension === '/md-index') {
      const url = request.nextUrl.clone();
      url.pathname = '/md-index';
      url.search = search;
      return NextResponse.rewrite(url);
    }

    // Remove leading slash and build slug for /mdx/[...slug]
    const slug = pathWithoutExtension.replace(/^\//, '');

    // Rewrite to /mdx/[...slug] route
    const url = request.nextUrl.clone();
    url.pathname = `/mdx/${slug}`;
    url.search = search;

    return NextResponse.rewrite(url);
  }

  // Continue with normal request
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  // Match all routes except static files, _next, and api routes
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (already have their own handlers)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (public files)
     * - llms.txt (served by app route)
     * - mdx/ (internal rewrite target)
     * - md-index and md-index/* (plain path served by app/md-index; md-index.md is rewritten in middleware)
     */
    '/((?!api/|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|llms.txt|mdx/|md-index(?:/|$)).*)',
  ],
};
