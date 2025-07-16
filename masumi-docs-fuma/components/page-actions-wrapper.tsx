'use client';

import { PageActions } from './page-actions';
import { usePageContent } from '../hooks/use-page-content';

export function PageActionsWrapper() {
  const { content, title, loading, error } = usePageContent();

  if (loading || error || !content) {
    return null;
  }

  return (
    <PageActions 
      content={content}
      title={title}
      url={typeof window !== 'undefined' ? window.location.href : ''}
    />
  );
}