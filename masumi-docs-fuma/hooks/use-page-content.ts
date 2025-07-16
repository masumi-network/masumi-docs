'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageContent {
  content: string;
  title: string;
  loading: boolean;
  error: string | null;
}

export function usePageContent(): PageContent {
  const [pageContent, setPageContent] = useState<PageContent>({
    content: '',
    title: '',
    loading: true,
    error: null,
  });
  const pathname = usePathname();

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setPageContent(prev => ({ ...prev, loading: true, error: null }));
        
        // Fetch the raw markdown content from our API
        const response = await fetch(`/api/page-content?path=${encodeURIComponent(pathname)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setPageContent({
          content: data.content,
          title: data.title,
          loading: false,
          error: null,
        });
      } catch (error) {
        setPageContent(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch content',
        }));
      }
    };

    fetchPageContent();
  }, [pathname]);

  return pageContent;
}