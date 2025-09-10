'use client';

import { DocsPage } from 'fumadocs-ui/page';
import { PageActionsWrapper } from './page-actions-wrapper';
import type { ReactNode } from 'react';

interface CustomDocsPageProps {
  children: ReactNode;
  toc?: any; // TOC type from fumadocs
  full?: boolean;
}

export function CustomDocsPage({ children, toc, full }: CustomDocsPageProps) {
  return (
    <DocsPage 
      toc={toc} 
      full={full}
      tableOfContent={{
        header: (
          <div className="mb-4">
            <PageActionsWrapper />
          </div>
        ),
        style: 'clerk'
      }}
    >
      {children}
    </DocsPage>
  );
}