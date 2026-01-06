import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkStringify from 'remark-stringify';
import stripMarkdown from 'strip-markdown';
import type { Page } from 'fumadocs-core/source';
import { readFile } from 'fs/promises';
import { llmTextCache, fileReadCache } from './cache';

// Shared remark processor instance (reusable, more memory efficient)
let sharedProcessor: ReturnType<typeof remark> | null = null;

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

  const result = `# ${page.data.title}
URL: ${page.url}

${page.data.description}

${processed.value}`;

  // Cache the result
  llmTextCache.set(cacheKey, result);
  
  return result;
}