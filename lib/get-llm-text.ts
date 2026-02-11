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
 * Clean the processed text by removing imports and ALL JSX/HTML tags
 */
function cleanText(text: string): string {
  return text
    // Remove import statements
    .replace(/^import\s+.*?;?\s*$/gm, '')
    // Remove ALL HTML/JSX tags (both self-closing and paired)
    .replace(/<[^>]+>/g, '')
    // Remove multiple blank lines
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Trim whitespace
    .trim();
}

export async function getLLMText(page: Page): Promise<string> {
  const absolutePath = page.absolutePath;
  if (!absolutePath) {
    throw new Error(`Page "${page.url}" has no absolutePath`);
  }

  // Check cache first
  const cacheKey = `llm-text:${absolutePath}:${page.url}`;
  const cached = llmTextCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Check file read cache
  let rawContent: string = fileReadCache.get(absolutePath) ?? '';
  if (!rawContent) {
    rawContent = await readFile(absolutePath, 'utf-8');
    fileReadCache.set(absolutePath, rawContent);
  }

  // Use shared processor instance (reusable, more memory efficient)
  const processor = getSharedProcessor();

  const processed = await processor.process({
    path: absolutePath,
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