import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkStringify from 'remark-stringify';
import stripMarkdown from 'strip-markdown';
import type { Page } from 'fumadocs-core/source';
import { readFile } from 'fs/promises';

export async function getLLMText(page: Page): Promise<string> {
  // Read the raw content from the file system
  const rawContent = await readFile(page.absolutePath, 'utf-8');
  
  const processor = remark()
    .use(remarkGfm)
    .use(remarkMdx)
    .use(stripMarkdown)
    .use(remarkStringify);

  const processed = await processor.process({
    path: page.absolutePath,
    value: rawContent,
  });

  return `# ${page.data.title}
URL: ${page.url}

${page.data.description}

${processed.value}`;
}