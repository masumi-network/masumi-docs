import { config } from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

// Load environment variables from .env
config(); 

// Constants
const IMAGE_DEFAULT_WIDTH = 1200;
const IMAGE_DEFAULT_HEIGHT = 800;
const IMAGE_FETCH_TIMEOUT_MS = 30000; // 30 seconds

// Configuration - REPLACE THESE WITH YOUR VALUES
const NOTION_PAGES = [
  {
    pageId: '28cf3c5366cb80b5bc1bcb72e8749b84', // The Notion page ID (32 char hex string at the end of the page URL)
    outputPath: './content/docs/documentation/technical-documentation/_agent-description-standard.mdx',
    customTitle: 'Agent Description Standard',
    customIcon: 'ScrollText',
  },
  // Add more pages as needed:
  // {
  //   pageId: '[ANOTHER_NOTION_PAGE_ID]',
  //   outputPath: './content/docs/documentation/technical-documentation/_another-page.mdx',
  //   customTitle: 'Another Page Title',
  //   customIcon: 'FileText',
  // },
];

async function fetchImage(url, localPath, authToken = null) {
  try {
    const headers = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    // Timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Request timeout after ${IMAGE_FETCH_TIMEOUT_MS / 1000} seconds`)), IMAGE_FETCH_TIMEOUT_MS);
    });
    
    const fetchPromise = fetch(url, { headers }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      await fs.writeFile(localPath, Buffer.from(buffer));
      return true;
    });
    
    // Race between fetch and timeout
    await Promise.race([fetchPromise, timeoutPromise]);
    return true;
  } catch (error) {
    console.error(`Error fetching image ${url}:`, error.message || error);
    return false;
  }
}

async function syncNotionImages(markdownContent, pageId, authToken) {
  const imagesDir = `./public/synced-images/notion/${pageId}`;
  
  // Ensure images directory exists
  await fs.mkdir(imagesDir, { recursive: true });
  
  let updatedContent = markdownContent;
  
  // Find all image sources: markdown images and img tags
  // Create regex patterns once (recreate instances for each use since exec() mutates global regexes)
  const markdownImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  const imgTagRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  
  const imageRegexes = [
    markdownImageRegex,
    imgTagRegex,
  ];
  
  for (const regexPattern of imageRegexes) {
    const matches = [];
    
    // Collect all matches first (create new regex instance to avoid mutation issues with global regexes)
    const regex = new RegExp(regexPattern.source, regexPattern.flags);
    let match;
    while ((match = regex.exec(markdownContent)) !== null) {
      matches.push(match);
    }
    
    // Process each match
    for (const match of matches) {
      const imageUrl = match[1];
      
      // Skip if it's already a local path
      if (imageUrl.startsWith('/synced-images/')) {
        continue;
      }
      
      // Extract file extension or use default
      try {
        const urlObj = new URL(imageUrl);
        const hostname = urlObj.hostname;

        // Skip if it's not a Notion image URL (strict hostname check)
        const isNotionHost =
          hostname === 'notion.so' ||
          hostname === 'www.notion.so' ||
          hostname.endsWith('.notion.so') ||
          hostname === 'notion-static.com' ||
          hostname.endsWith('.notion-static.com');

        if (!isNotionHost) {
          continue;
        }

        const urlPath = urlObj.pathname;
        const fileName = path.basename(urlPath) || `image-${Date.now()}.png`;
        const localPath = path.join(imagesDir, fileName);
        const publicPath = `/synced-images/notion/${pageId}/${fileName}`;
        
        // Fetch and save the image with auth token
        console.log(`📸 Fetching image: ${imageUrl}`);
        const success = await fetchImage(imageUrl, localPath, authToken);
        
        if (success) {
          // Replace the URL in content - replace all occurrences
          // Use split/join pattern for compatibility (works in all Node versions)
          updatedContent = updatedContent.split(imageUrl).join(publicPath);
          console.log(`✅ Synced image: ${fileName}`);
        } else {
          console.log(`❌ Failed to sync image: ${fileName}`);
        }
      } catch (urlError) {
        console.error(`❌ Invalid image URL: ${imageUrl}`, urlError.message);
        continue;
      }
    }
  }
  
  return updatedContent;
}

function parseAttributes(attributesString) {
  const attributes = {};
  const attributeRegex = /([\w-]+)=["']([^"']*)["']/g;
  let match;
  while ((match = attributeRegex.exec(attributesString)) !== null) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}

function convertHtmlToJsx(content) {
  let updatedContent = content;

  // First, handle problematic Unicode characters
  updatedContent = updatedContent.replace(/–/g, '-'); // en-dash to regular dash
  updatedContent = updatedContent.replace(/—/g, '-'); // em-dash to regular dash
  updatedContent = updatedContent.replace(/[\u2018\u2019\u2032]/g, "'"); // smart single quote/apostrophe to regular quote
  updatedContent = updatedContent.replace(/[\u201C\u201D\u2033]/g, '"'); // smart double quote to regular quote

  // Handle HTML br tags properly
  updatedContent = updatedContent.replace(/<br\s*\/?>/gi, '<br />');

  // Escape curly braces but preserve them in code blocks
  const codeBlockRegex = /(```[\s\S]*?```|`[^`]+`)/g;
  const parts = updatedContent.split(codeBlockRegex);
  
  updatedContent = parts.map((part, index) => {
    // If this part is a code block (odd indices after split), preserve it
    if (index % 2 === 1) {
      return part;
    }
    // Otherwise, escape backslashes and curly braces
    return part
      .replace(/\\/g, '\\\\')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}');
  }).join('');

  // Convert <picture> elements with dark mode variants
  const pictureRegex = /<picture[^>]*>\s*<source[^>]*media=\"\s*\(\s*prefers-color-scheme:\s*dark\s*\)\"[^>]*srcset=\"([^\"]+)\"[^>]*>\s*<img([^>]+)>\s*<\/picture>/gis;
  updatedContent = updatedContent.replace(pictureRegex, (match, darkSrc, imgTag) => {
    const imgAttributes = parseAttributes(imgTag);
    const lightSrc = imgAttributes.src;
    const altText = imgAttributes.alt || '';
    const existingClass = imgAttributes.class || '';

    const sharedAttrs = Object.entries(imgAttributes)
      .filter(([key]) => !['src', 'alt', 'class', 'width', 'height'].includes(key))
      .map(([key, value]) => `${key}=\"${value}\"`)
      .join(' ');

    return `<div>
      <ImageZoom src=\"${lightSrc}\" alt=\"${altText}\" width={${IMAGE_DEFAULT_WIDTH}} height={${IMAGE_DEFAULT_HEIGHT}} className={\`${existingClass} w-full h-auto block dark:hidden\`} ${sharedAttrs} />
      <ImageZoom src=\"${darkSrc}\" alt=\"${altText}\" width={${IMAGE_DEFAULT_WIDTH}} height={${IMAGE_DEFAULT_HEIGHT}} className={\`${existingClass} w-full h-auto hidden dark:block\`} ${sharedAttrs} />
    </div>`;
  });

  // Convert standalone <img> tags
  const imgRegex = /<img([^>]+)>/gi;
  updatedContent = updatedContent.replace(imgRegex, (match, attributesString) => {
    if (match.includes('dark:hidden') || match.includes('hidden dark:block')) {
      return match;
    }

    const attributes = parseAttributes(attributesString);
    const isGif = attributes.src && attributes.src.toLowerCase().endsWith('.gif');
    const Component = isGif ? 'img' : 'ImageZoom';
    const existingClass = attributes.class || '';

    const attrsForJsx = Object.entries(attributes)
      .filter(([key]) => !['class', 'width', 'height'].includes(key))
      .map(([key, value]) => {
        const jsxKey = key === 'class' ? 'className' : key;
        return `${jsxKey}=\"${value}\"`;
      }).join(' ');

    return `<${Component} ${attrsForJsx} width={${IMAGE_DEFAULT_WIDTH}} height={${IMAGE_DEFAULT_HEIGHT}} className={\`${existingClass} w-full h-auto\`} />`;
  });

  // Convert common HTML attributes to JSX equivalents
  const attributeMap = {
    'srcset': 'srcSet',
    'crossorigin': 'crossOrigin',
    'tabindex': 'tabIndex',
    'readonly': 'readOnly',
    'maxlength': 'maxLength',
    'cellpadding': 'cellPadding',
    'cellspacing': 'cellSpacing',
    'rowspan': 'rowSpan',
    'colspan': 'colSpan',
    'usemap': 'useMap',
    'frameborder': 'frameBorder',
    'contenteditable': 'contentEditable',
    'spellcheck': 'spellCheck'
  };

  for (const [htmlAttr, jsxAttr] of Object.entries(attributeMap)) {
    const regex = new RegExp(`\\b${htmlAttr}=`, 'gi');
    updatedContent = updatedContent.replace(regex, `${jsxAttr}=`);
  }

  return updatedContent;
}

async function generateNotionPages() {
  // Allow token to be passed via environment variable (takes precedence)
  const authToken = process.env.NOTION_TOKEN;
  
  // Validate token - if not set, skip Notion fetching but don't fail the build
  if (!authToken) {
    console.warn('⚠️  NOTION_TOKEN not set, skipping Notion page fetching');
    console.warn('   Set NOTION_TOKEN in .env file to enable Notion fetching');
    return;
  }
  
  // Validate that we have pages to fetch
  if (!NOTION_PAGES || NOTION_PAGES.length === 0) {
    console.warn('⚠️  No Notion pages configured, skipping Notion page fetching');
    return;
  }

  // Initialize Notion client
  const notion = new Client({
    auth: authToken,
  });

  // Initialize NotionToMarkdown
  const notionToMarkdown = new NotionToMarkdown({ notionClient: notion });

  console.log('📚 Fetching Notion pages...');
  
  for (const { pageId, outputPath, customTitle, customIcon } of NOTION_PAGES) {
    // Validate page ID - skip if not configured but don't fail
    if (!pageId) {
      console.warn(`⚠️  Skipping ${outputPath || 'unknown'}: Notion page ID not configured`);
      continue;
    }
    
    // Validate outputPath - skip if not configured but don't fail
    if (!outputPath) {
      console.warn(`⚠️  Skipping page ${pageId}: outputPath not configured`);
      continue;
    }

    console.log(`Fetching Notion page ${pageId}...`);
    
    try {
      // Fetch page content and convert to markdown
      const mdBlocks = await notionToMarkdown.pageToMarkdown(pageId);
      const markdownContent = notionToMarkdown.toMarkdownString(mdBlocks);

      if (!markdownContent || !markdownContent.parent) {
        console.error(`❌ Failed to fetch content for page ${pageId}`);
        continue;
      }

      // Sync images and update paths (pass auth token for image fetching)
      console.log(`📸 Syncing images for page ${pageId}...`);
      const contentWithSyncedImages = await syncNotionImages(markdownContent.parent, pageId, authToken);

      // Convert HTML attributes to JSX
      console.log(`🔄 Converting HTML to JSX for page ${pageId}...`);
      let contentWithJsxAttributes = convertHtmlToJsx(contentWithSyncedImages);

      // Restore escaped JSX attribute expressions like items={...}
      contentWithJsxAttributes = contentWithJsxAttributes.replace(/=\\\{([\s\S]*?)\\\}/g, '={$1}');

      // Check if tabs are needed
      const needsTabsImport = /<Tabs\b/i.test(contentWithJsxAttributes) || /<Tab\b/i.test(contentWithJsxAttributes);

      // Build imports
      const imports = [
        `import { Callout } from 'fumadocs-ui/components/callout';`,
        `import { ImageZoom } from 'fumadocs-ui/components/image-zoom';`
      ];

      if (needsTabsImport) {
        imports.push(`import { Tabs, Tab } from 'fumadocs-ui/components/tabs';`);
      }

      // Generate frontmatter in the same format as fetch-readme.mjs
      const title = customTitle || 'Untitled';
      const frontmatter = `---
title: "${title}"
${customIcon ? `icon: ${customIcon}` : ''}
---

${imports.join('\n')}

<Callout type="info">
  This page is automatically synced from Notion.
</Callout>

`;
      const fullContent = frontmatter + contentWithJsxAttributes;
      
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      await fs.mkdir(dir, { recursive: true });
      
      // Write the file
      await fs.writeFile(outputPath, fullContent);
      
      console.log(`✅ Generated ${outputPath}`);
    } catch (error) {
      console.error(`❌ Error processing page ${pageId}:`, error.message);
      if (error.message.includes('API token') || error.message.includes('Unauthorized')) {
        console.error('   Make sure your NOTION_TOKEN is valid and has access to the page');
      } else if (error.message.includes('Could not find page') || error.message.includes('not found')) {
        console.error('   Make sure the page ID is correct and the integration has access');
      }
      continue;
    }
  }
  
  console.log('✅ All Notion pages fetched successfully!');
}

await generateNotionPages().catch((e) => {
  console.error('❌ Failed to fetch Notion pages:', e.message || e);
  console.warn('⚠️  Continuing build despite Notion fetch failure...');
  // Don't exit - let the build continue
});

