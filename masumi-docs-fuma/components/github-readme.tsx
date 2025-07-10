'use client';

import { useEffect, useState } from 'react';

interface GitHubReadmeProps {
  owner: string;
  repo: string;
  branch?: string;
}

export function GitHubReadme({ owner, repo, branch = 'main' }: GitHubReadmeProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReadme() {
      try {
        // Fetch README content from GitHub API
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/readme`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3.raw',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch README: ${response.statusText}`);
        }

        const markdownContent = await response.text();
        setContent(markdownContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch README');
      } finally {
        setLoading(false);
      }
    }

    fetchReadme();
  }, [owner, repo, branch]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
        <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 rounded-lg p-4 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">Error loading README: {error}</p>
        <p className="text-sm text-red-500 dark:text-red-500 mt-2">
          <a 
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on GitHub →
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="github-readme">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">README</h2>
        <a
          href={`https://github.com/${owner}/${repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View on GitHub →
        </a>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
}