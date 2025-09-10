'use client';

import { PageActions } from './page-actions';
import { usePageContent } from '../hooks/use-page-content';

export function PageActionsWrapper() {
  const { content, title, loading, error } = usePageContent();

  // Always render the button, but pass loading state
  return (
    <PageActions 
      content={content}
      title={title}
      url={typeof window !== 'undefined' ? window.location.href : ''}
      loading={loading}
      error={error}
    />
  );
}