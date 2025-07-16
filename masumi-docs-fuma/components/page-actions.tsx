'use client';

import { useState } from 'react';
import { Copy, FileText, MessageSquare, MoreHorizontal, Check, ExternalLink, Bot, Eye } from 'lucide-react';

interface PageActionsProps {
  content: string;
  title: string;
  url: string;
  loading?: boolean;
  error?: string | null;
}

export function PageActions({ content, title, url, loading = false, error }: PageActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewMarkdown = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Clean up the URL after a delay to ensure it opens
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleOpenChatGPT = () => {
    const prompt = `Please read and analyze this documentation page:

Title: ${title}
URL: ${url}

Content:
${content}

Please provide a summary and answer any questions I might have about this content.`;
    
    const encodedPrompt = encodeURIComponent(prompt);
    const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`;
    window.open(chatGPTUrl, '_blank');
  };

  const handleOpenClaude = () => {
    const prompt = `Please read and analyze this documentation page:

Title: ${title}
URL: ${url}

Content:
${content}

Please provide a summary and answer any questions I might have about this content.`;
    
    // Claude doesn't support direct URL parameters for prompts yet,
    // so we'll copy the prompt to clipboard and open Claude
    handleCopy(prompt, 'claude-prompt');
    window.open('https://claude.ai/new', '_blank');
  };

  return (
    <div className="relative inline-flex">
      <div className="flex items-center border border-fd-border rounded-md overflow-hidden">
        {/* Main copy button */}
        <button
          onClick={() => !loading && !error && handleCopy(content, 'markdown')}
          disabled={loading || !!error}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors ${
            loading || error 
              ? 'text-fd-muted-foreground/50 cursor-not-allowed' 
              : 'text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/10'
          }`}
          aria-label="Copy page content"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : copiedStates.markdown ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{loading ? 'Loading...' : 'Copy page'}</span>
        </button>
        
        {/* Divider */}
        <div className="w-px h-6 bg-fd-border" />
        
        {/* Dropdown trigger */}
        <button
          onClick={() => !loading && !error && setIsOpen(!isOpen)}
          disabled={loading || !!error}
          className={`flex items-center px-2 py-1.5 transition-colors ${
            loading || error 
              ? 'text-fd-muted-foreground/50 cursor-not-allowed' 
              : 'text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/10'
          }`}
          aria-label="More actions"
          aria-expanded={isOpen}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {isOpen && !loading && !error && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 w-56 bg-fd-card border border-fd-border rounded-lg shadow-lg z-50 p-1">
            <button
              onClick={() => {
                handleViewMarkdown();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-fd-foreground hover:bg-fd-accent/10 rounded-md transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View as Markdown</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
            </button>

            <button
              onClick={() => {
                handleDownloadMarkdown();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-fd-foreground hover:bg-fd-accent/10 rounded-md transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Download Markdown</span>
            </button>

            <button
              onClick={() => {
                handleOpenChatGPT();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-fd-foreground hover:bg-fd-accent/10 rounded-md transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask ChatGPT</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
            </button>

            <button
              onClick={() => {
                handleOpenClaude();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-fd-foreground hover:bg-fd-accent/10 rounded-md transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Claude</span>
              {copiedStates['claude-prompt'] ? (
                <Check className="w-3 h-3 ml-auto text-green-500" />
              ) : (
                <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}