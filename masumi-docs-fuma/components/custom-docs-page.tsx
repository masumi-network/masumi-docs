'use client';

import { DocsPage } from 'fumadocs-ui/page';
import { PageActionsWrapper } from './page-actions-wrapper';
import type { ReactNode } from 'react';
import type { TableOfContents } from 'fumadocs-core/toc';

interface CustomDocsPageProps {
  children: ReactNode;
  toc?: TableOfContents;
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
      }}
    >
      {children}
    </DocsPage>
  );
}