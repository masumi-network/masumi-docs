import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkStringify from 'remark-stringify';
import stripMarkdown from 'strip-markdown';
import type { Page } from 'fumadocs-core/source';
import { readFile } from 'fs/promises';
import { llmTextCache, fileReadCache } from './cache';

// Shared remark processor instance (reusable, more memory efficient)
let sharedProcessor: any = null;

function getSharedProcessor() {
  if (!sharedProcessor) {
    sharedProcessor = remark()
      .use(remarkGfm)
      .use(remarkMdx)
      .use(stripMarkdown)
      .use(remarkStringify);
  }
  return sharedProcessor;
}

/**
 * Clean the processed text by removing imports and JSX tags
 */
function cleanText(text: string): string {
  return text
    // Remove import statements
    .replace(/^import\s+.*?;?\s*$/gm, '')
    // Remove JSX self-closing tags: <Card ... />
    .replace(/<[A-Z][a-zA-Z0-9]*\s+[^>]*\/>/g, '')
    // Remove JSX opening tags: <Cards>
    .replace(/<[A-Z][a-zA-Z0-9]*\s*[^>]*>/g, '')
    // Remove JSX closing tags: </Cards>
    .replace(/<\/[A-Z][a-zA-Z0-9]*>/g, '')
    // Remove multiple blank lines
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Trim whitespace
    .trim();
}

export async function getLLMText(page: Page): Promise<string> {
  // Check cache first
  const cacheKey = `llm-text:${page.absolutePath}:${page.url}`;
  const cached = llmTextCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Check file read cache
  let rawContent = fileReadCache.get(page.absolutePath);
  if (!rawContent) {
    rawContent = await readFile(page.absolutePath, 'utf-8');
    fileReadCache.set(page.absolutePath, rawContent);
  }

  // Use shared processor instance (reusable, more memory efficient)
  const processor = getSharedProcessor();

  const processed = await processor.process({
    path: page.absolutePath,
    value: rawContent,
  });

  // Clean the processed text (remove imports and JSX)
  const cleanedText = cleanText(processed.value as string);

  const result = `# ${page.data.title}
URL: ${page.url}

${page.data.description}

${cleanedText}`;

  // Cache the result
  llmTextCache.set(cacheKey, result);

  return result;
}