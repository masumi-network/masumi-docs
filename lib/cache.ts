import { LRUCache } from 'lru-cache';

// Cache for processed LLM text results
export const llmTextCache = new LRUCache<string, string>({
  max: 500, // Cache up to 500 pages
  ttl: 1000 * 60 * 60 * 24, // 24 hours TTL
  updateAgeOnGet: true,
});

// Cache for file reads
export const fileReadCache = new LRUCache<string, string>({
  max: 1000, // Cache up to 1000 file reads
  ttl: 1000 * 60 * 60 * 24, // 24 hours TTL
  updateAgeOnGet: true,
});

// Cache for API responses
export const apiResponseCache = new LRUCache<string, any>({
  max: 200, // Cache up to 200 API responses
  ttl: 1000 * 60 * 15, // 15 minutes TTL
  updateAgeOnGet: true,
});
