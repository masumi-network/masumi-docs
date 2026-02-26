import { source } from '@/lib/source';
import { NextResponse } from 'next/server';

// CORS headers for LLM access
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Markdown Index - Main guide for LLMs/bots to discover all available markdown endpoints
 * Accessible at: /md-index or /md-index.md
 */
export async function GET() {
  try {
    const pages = source.getPages();
    const baseUrl = 'https://docs.masumi.network';

    // Group pages by their top-level section
    const pagesBySection = new Map<string, typeof pages>();
    pages.forEach((page) => {
      const section = page.url.split('/')[1] || 'root';
      if (!pagesBySection.has(section)) {
        pagesBySection.set(section, []);
      }
      pagesBySection.get(section)!.push(page);
    });

    // Build the markdown index
    const sections: string[] = [
      '# Masumi Documentation - Markdown Index',
      '',
      '**Welcome to the Masumi Documentation Markdown Index!**',
      '',
      'This page provides a complete guide to all available documentation pages in markdown format.',
      'Each page can be accessed by appending `.md` to any documentation URL.',
      '',
      '## How to Use',
      '',
      '**URL Pattern:**',
      '```',
      `${baseUrl}/<path>.md`,
      '```',
      '',
      '**Examples:**',
      `- HTML: ${baseUrl}/documentation/get-started/installation`,
      `- Markdown: ${baseUrl}/documentation/get-started/installation.md`,
      '',
      `- HTML: ${baseUrl}/api-reference/payment-service/post-registry`,
      `- Markdown: ${baseUrl}/api-reference/payment-service/post-registry.md`,
      '',
      '## Available Documentation Pages',
      '',
      `Total pages: ${pages.length}`,
      '',
    ];

    // Add each section
    Array.from(pagesBySection.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([section, sectionPages]) => {
        sections.push(`### ${section.charAt(0).toUpperCase() + section.slice(1)}`);
        sections.push('');

        sectionPages
          .sort((a, b) => a.url.localeCompare(b.url))
          .forEach((page) => {
            const title = page.data.title || page.url;
            const description = page.data.description ? ` - ${page.data.description}` : '';
            sections.push(`- **${title}**${description}`);
            sections.push(`  - URL: \`${baseUrl}${page.url}.md\``);
            sections.push(`  - Path: \`${page.url}\``);
            sections.push('');
          });

        sections.push('');
      });

    // Add footer information
    sections.push(
      '---',
      '',
      '## Additional Resources',
      '',
      '### Complete Documentation in One File',
      `- **llms.txt**: ${baseUrl}/llms.txt`,
      '  - Contains all documentation pages combined into a single file',
      '  - Updated periodically for comprehensive LLM consumption',
      '',
      '### Individual Page Access',
      '- Use the URLs listed above to access individual pages',
      '- Append `.md` to any documentation URL',
      '- All pages return clean markdown without HTML/JSX',
      '',
      '### API Access',
      '- All markdown endpoints support CORS',
      '- Content-Type: `text/markdown; charset=utf-8`',
      '- Cache-Control: 1 hour (browser + CDN)',
      '',
      '## About Masumi Network',
      '',
      'Masumi Network enables Agent-to-Agent Payments and unlocks the Agentic Economy',
      'through decentralized AI agent interactions.',
      '',
      '**Official Links:**',
      '- Documentation: https://docs.masumi.network',
      '- GitHub: https://github.com/masumi-network',
      '- Website: https://masumi.network',
      '',
      `---`,
      '',
      `*Generated on: ${new Date().toISOString()}*`
    );

    const content = sections.join('\n');

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        // Cache for 1 hour browser, 6 hours CDN, serve stale for 7 days while revalidating
        'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=604800',
        'X-Robots-Tag': 'all',
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error('Error generating markdown index:', error);
    return new NextResponse('Error generating markdown index', {
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

// HEAD request for checking availability (same headers as GET per HTTP spec)
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=604800',
      'X-Robots-Tag': 'all',
      ...CORS_HEADERS,
    },
  });
}
