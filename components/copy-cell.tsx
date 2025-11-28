'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

type CopyCellProps = {
  value: string;
  label?: string;
};

export function CopyCell({ value, label = 'Copy value' }: CopyCellProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy value', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-300 bg-neutral-50 text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
        aria-label={label}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <code className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-neutral-100 px-2 py-1 text-sm dark:bg-neutral-900">
        {value}
      </code>
    </div>
  );
}

