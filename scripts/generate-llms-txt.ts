import { writeFile } from 'fs/promises';
import { join } from 'path';

async function generateLLMsTxt() {
  console.log('📝 Generating llms.txt at build time...');
  
  try {
    // Dynamic import to handle potential MDX import issues
    const { source } = await import('../lib/source');
    const { getLLMText } = await import('../lib/get-llm-text');
    
    const pages = source.getPages();
    const MAX_CONCURRENT = 10;
    
    console.log(`Processing ${pages.length} pages...`);
    
    const scanned: string[] = [];
    for (let i = 0; i < pages.length; i += MAX_CONCURRENT) {
      const batch = pages.slice(i, i + MAX_CONCURRENT);
      const batchResults = await Promise.allSettled(
        batch.map(async (page) => {
          try {
            return await getLLMText(page);
          } catch (error) {
            console.error(`⚠️ Error processing page: ${page.url}`, error);
            return `[Error processing page: ${page.url}]`;
          }
        })
      );
      const results = batchResults.map((result) => 
        result.status === 'fulfilled' ? result.value : result.reason
      );
      scanned.push(...results);
      console.log(`✅ Processed ${Math.min(i + MAX_CONCURRENT, pages.length)}/${pages.length} pages`);
    }
    
    const content = [
      '# Masumi Network Documentation - Complete Version',
      '',
      'This file contains the complete Masumi Network documentation for LLM consumption.',
      `Generated on: ${new Date().toISOString()}`,
      'Website: https://docs.masumi.network',
      '',
      '## About Masumi Network',
      'Masumi Network enables Agent-to-Agent Payments and unlocks the Agentic Economy through decentralized AI agent interactions.',
      '',
      '---',
      '',
      ...scanned,
    ].join('\n');
    
    const outputPath = join(process.cwd(), 'public', 'llms.txt');
    await writeFile(outputPath, content, 'utf-8');
    
    console.log('✅ llms.txt generated successfully at:', outputPath);
  } catch (error) {
    console.error('❌ Error generating llms.txt:', error);
    throw error;
  }
}

generateLLMsTxt().catch((e) => {
  console.error('Failed to generate llms.txt', e);
  process.exit(1);
});
