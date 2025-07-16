import { source } from '@/lib/source';
import { getLLMText } from '@/lib/get-llm-text';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pages = source.getPages();
    const scan = pages.map(getLLMText);
    const scanned = await Promise.all(scan);
    
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
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating LLM content:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}