import { promises as fs } from 'fs';
import { readFileSync } from 'fs';
import path from 'path';

// Load .env file manually (Node.js doesn't auto-load it like Next.js does)
try {
  const envPath = path.resolve(process.cwd(), '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  // .env file not found, continue without it
}



const REPOS = [
  {
    owner: 'masumi-network',
    repo: 'agentic-service-wrapper',
    outputPath: './content/docs/documentation/get-started/_agentic-service-wrapper.mdx',
    isTabContent: true
  },
  {
    owner: 'masumi-network',
    repo: 'masumi-mcp-server',
    outputPath: './content/docs/documentation/technical-documentation/_masumi-mcp-server.mdx',
    isTabContent: false,
    customTitle: 'Masumi MCP Server',
    customIcon: 'Server'
  },
  // Integration branches
  {
    owner: 'masumi-network',
    repo: 'agentic-service-wrapper',
    branch: 'n8n',
    outputPath: './content/docs/documentation/integrations/agentic-service-wrapper/_n8n.mdx',
    isTabContent: false,
    customTitle: 'n8n'
  },
  {
    owner: 'masumi-network',
    repo: 'agentic-service-wrapper',
    branch: 'langchain',
    outputPath: './content/docs/documentation/integrations/agentic-service-wrapper/_langchain.mdx',
    isTabContent: false,
    customTitle: 'LangChain'
  },
  {
    owner: 'masumi-network',
    repo: 'agentic-service-wrapper',
    branch: 'crewai',
    outputPath: './content/docs/documentation/integrations/agentic-service-wrapper/_crewai.mdx',
    isTabContent: false,
    customTitle: 'CrewAI'
  },
  // MIPs
  {
    owner: 'masumi-network',
    repo: 'masumi-improvement-proposals',
    outputPath: './content/docs/mips/index.mdx',
    isTabContent: false
  },
  {
    owner: 'masumi-network',
    repo: 'masumi-improvement-proposals',
    filePath: 'MIPs/MIP-001/MIP-001.md',
    outputPath: './content/docs/mips/_mip-001.mdx',
    isTabContent: false,
    customTitle: 'MIP-001: Masumi Improvement Proposal (MIP) Process'
  },
  {
    owner: 'masumi-network',
    repo: 'masumi-improvement-proposals',
    filePath: 'MIPs/MIP-002/MIP-002.md',
    outputPath: './content/docs/mips/_mip-002.mdx',
    isTabContent: false,
    customTitle: 'MIP-002: On-Chain Metadata Standard for Registered Agentic Services'
  },
  {
    owner: 'masumi-network',
    repo: 'masumi-improvement-proposals',
    filePath: 'MIPs/MIP-003/MIP-003.md',
    outputPath: './content/docs/mips/_mip-003.mdx',
    isTabContent: false,
    customTitle: 'MIP-003: Agentic Service API Standard'
  },
  {
    owner: 'masumi-network',
    repo: 'masumi-improvement-proposals',
    filePath: 'MIPs/MIP-003/MIP-003-Attachement-01.md',
    outputPath: './content/docs/mips/_mip-003-attachment-01.mdx',
    isTabContent: false,
    customTitle: 'MIP-003 Attachment 01: Input Validation Schema Format'
  },
  {
    owner: 'masumi-network',
    repo: 'masumi-improvement-proposals',
    filePath: 'MIPs/MIP-004/MIP-004.md',
    outputPath: './content/docs/mips/_mip-004.mdx',
    isTabContent: false,
    customTitle: 'MIP-004: A Hashing Standard for Input and Output Data Integrity'
  },
  {
    owner: 'masumi-network',
    repo: 'pip-masumi',
    branch: 'main',
    filePath: 'QUICKSTART.md',
    outputPath: './content/docs/documentation/how-to-guides/_quickstart.mdx',
    isTabContent: false,
    customTitle: 'Build an Agent',
    customIcon: 'Bot',
    preserveImports: true
  },
  // n8n node
  {
    owner: 'masumi-network',
    repo: 'n8n-nodes-masumi-payment',
    outputPath: './content/docs/n8n-node/index.mdx',
    isTabContent: false,
    customTitle: 'N8N Node',
    customIcon: 'Workflow',
  }
];

async function fetchReadme(owner, repo, branch = 'main', filePath = null) {
  try {
    let url;
    if (filePath) {
      // Fetch specific file
      url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    } else {
      // Fetch README using GitHub API
      url = `https://api.github.com/repos/${owner}/${repo}/readme?ref=${branch}`;
    }

    const authHeader = process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {};

    const response = await fetch(url, {
      headers: filePath
        ? authHeader // raw URLs also accept Auth; ok to send
        : {
            'Accept': 'application/vnd.github.v3.raw',
            ...authHeader,
          },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching file for ${owner}/${repo} (branch: ${branch}, filePath: ${filePath}):`, error);
    return null;
  }
}

async function fetchImage(url, localPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    await fs.writeFile(localPath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`Error fetching image ${url}:`, error);
    return false;
  }
}

async function syncImages(readmeContent, owner, repo, branch = 'main') {
  const imagesDir = `./public/synced-images/${owner}/${repo}`;
  
  // Ensure images directory exists
  await fs.mkdir(imagesDir, { recursive: true });
  
  let updatedContent = readmeContent;
  
  // Find all image sources: markdown, img tags, and source tags with srcset
  const imageRegexes = [
    /!\[[^\]]*\]\(([^)]+)\)/g, // markdown images
    /<img[^>]+src=["']([^"']+)["'][^>]*>/g, // img tags
    /<source[^>]+srcset=["']([^"']+)["'][^>]*>/g // source tags with srcset
  ];
  
  for (const regex of imageRegexes) {
    let match;
    while ((match = regex.exec(readmeContent)) !== null) {
      const imagePath = match[1];
      
      // Skip if it's already a full URL
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        continue;
      }
      
      // Convert relative path to GitHub raw URL
      const cleanPath = imagePath.replace(/^\.\//, '');
      const githubUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanPath}`;
      
      // Create local file path
      const fileName = path.basename(imagePath);
      const localPath = path.join(imagesDir, fileName);
      const publicPath = `/synced-images/${owner}/${repo}/${fileName}`;
      
      // Fetch and save the image
      console.log(`📸 Fetching image: ${githubUrl}`);
      const success = await fetchImage(githubUrl, localPath);
      
      if (success) {
        // Replace the path in content - use global replace to catch all occurrences
        updatedContent = updatedContent.replaceAll(imagePath, publicPath);
        console.log(`✅ Synced image: ${fileName}`);
      } else {
        console.log(`❌ Failed to sync image: ${fileName}`);
      }
    }
  }
  
  return updatedContent;
}

function parseAttributes(attributesString) {
  const attributes = {};
  const attributeRegex = /([\w-]+)=["']([^"]*)["']/g;
  let match;
  while ((match = attributeRegex.exec(attributesString)) !== null) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}

function transformMipsLinks(content) {
  // Transform MIPs links from GitHub format to local page format
  // Example: MIPs/MIP-001/MIP-001.md -> mips/_mip-001
  return content.replace(/\[([^\]]*)\]\(MIPs\/MIP-(\d+)\/MIP-\d+\.md\)/g, '[$1](mips/_mip-$2)');
}

function transformMip003AttachmentLinks(content) {
  // Transform MIP-003 attachment links from GitHub format to local page format
  // Example: ./MIP-003-Attachement-01.md -> /mips/_mip-003-attachment-01
  return content.replace(/\[([^\]]*)\]\(\.\/MIP-003-Attachement-01\.md\)/g, '[$1](/mips/_mip-003-attachment-01)');
}

function convertHtmlToJsx(content) {
  let updatedContent = content;

  // First, handle problematic Unicode characters
  updatedContent = updatedContent.replace(/–/g, '-'); // em-dash to regular dash
  updatedContent = updatedContent.replace(/—/g, '-'); // em-dash to regular dash
  updatedContent = updatedContent.replace(/'/g, "'"); // smart quote to regular quote
  updatedContent = updatedContent.replace(/'/g, "'"); // smart quote to regular quote
  updatedContent = updatedContent.replace(/"/g, '"'); // smart quote to regular quote
  updatedContent = updatedContent.replace(/"/g, '"'); // smart quote to regular quote

  // Handle HTML br tags properly
  updatedContent = updatedContent.replace(/<br\s*\/?>/gi, '<br />');

  // Escape curly braces but preserve them in code blocks
  // Split content to handle code blocks separately
  const codeBlockRegex = /(```[\s\S]*?```|`[^`]+`)/g;
  const parts = updatedContent.split(codeBlockRegex);
  
  updatedContent = parts.map((part, index) => {
    // If this part is a code block (odd indices after split), preserve it
    if (codeBlockRegex.test(part)) {
      return part;
    }
    // Otherwise, escape curly braces
    return part.replace(/\{/g, '\\{').replace(/\}/g, '\\}');
  }).join('');

  // Convert <picture> elements with dark mode variants
  const pictureRegex = /<picture[^>]*>\s*<source[^>]*media=\"\s*\(\s*prefers-color-scheme:\s*dark\s*\)\"[^>]*srcset=\"([^\"]+)\"[^>]*>\s*<img([^>]+)>\s*<\/picture>/gis;
  updatedContent = updatedContent.replace(pictureRegex, (match, darkSrc, imgTag) => {
    const imgAttributes = parseAttributes(imgTag);
    const lightSrc = imgAttributes.src;
    const altText = imgAttributes.alt || '';
    const existingClass = imgAttributes.class || '';

    // Filter out attributes that will be explicitly set or handled
    const sharedAttrs = Object.entries(imgAttributes)
      .filter(([key]) => !['src', 'alt', 'class', 'width', 'height'].includes(key))
      .map(([key, value]) => `${key}=\"${value}\"`)
      .join(' ');

    // Note the use of template literals for className to combine existing and new classes
    return `<div>
      <ImageZoom src=\"${lightSrc}\" alt=\"${altText}\" width={1200} height={800} className={\`${existingClass} w-full h-auto block dark:hidden\`} ${sharedAttrs} />
      <ImageZoom src=\"${darkSrc}\" alt=\"${altText}\" width={1200} height={800} className={\`${existingClass} w-full h-auto hidden dark:block\`} ${sharedAttrs} />
    </div>`;
  });

  // Convert standalone <img> tags
  const imgRegex = /<img([^>]+)>/gi;
  updatedContent = updatedContent.replace(imgRegex, (match, attributesString) => {
    // If the img tag is inside a div that we just created, skip it.
    if (match.includes('dark:hidden') || match.includes('hidden dark:block')) {
        return match;
    }

    const attributes = parseAttributes(attributesString);
    const isGif = attributes.src && attributes.src.toLowerCase().endsWith('.gif');
    const Component = isGif ? 'img' : 'ImageZoom';
    const existingClass = attributes.class || '';

    // Filter out attributes that will be explicitly set or handled
    const attrsForJsx = Object.entries(attributes)
        .filter(([key]) => !['class', 'width', 'height'].includes(key))
        .map(([key, value]) => {
            const jsxKey = key === 'class' ? 'className' : key;
            return `${jsxKey}=\"${value}\"`;
        }).join(' ');

    return `<${Component} ${attrsForJsx} width={1200} height={800} className={\`${existingClass} w-full h-auto\`} />`;
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

function convertReadmeToTabContent(readmeContent, owner, repo, branch) {
  // Add callout with repository link
  const branchInfo = branch && branch !== 'main' && branch !== 'master' ? ` (branch: ${branch})` : '';
  const callout = `<Callout type="info">
  This content is automatically synced from the <a href="https://github.com/${owner}/${repo}" target="_blank" rel="noopener noreferrer">${owner}/${repo}</a>${branchInfo} repository.
</Callout>

`;
  return callout + readmeContent;
}

async function generateReadmePages() {
  console.log('📚 Fetching README files...');
  
  for (const { owner, repo, branch, filePath, outputPath, isTabContent, customTitle, customIcon, preserveImports, customDescription } of REPOS) {
    const fileDescription = filePath ? `${filePath}` : 'README';
    console.log(`Fetching ${owner}/${repo} ${fileDescription} (branch: ${branch || 'main'})...`);
    
    const readmeContent = await fetchReadme(owner, repo, branch, filePath);
    
    if (!readmeContent) {
      console.error(`❌ Failed to fetch ${fileDescription} for ${owner}/${repo}`);
      continue;
    }

    // Sync images and update paths
    console.log(`📸 Syncing images for ${owner}/${repo}...`);
    const contentWithSyncedImages = await syncImages(readmeContent, owner, repo, branch);

    // Transform MIPs links for the MIPs index page
    let contentWithTransformedLinks = contentWithSyncedImages;
    if (outputPath.includes('/mips/index.mdx')) {
      console.log(`🔗 Transforming MIPs links for ${owner}/${repo}...`);
      contentWithTransformedLinks = transformMipsLinks(contentWithSyncedImages);
    }

    // Transform MIP-003 attachment links specifically for MIP-003
    if (outputPath.includes('/mips/_mip-003.mdx')) {
      console.log(`🔗 Transforming MIP-003 attachment links for ${owner}/${repo}...`);
      contentWithTransformedLinks = transformMip003AttachmentLinks(contentWithTransformedLinks);
    }

    // Convert HTML attributes to JSX
    console.log(`🔄 Converting HTML to JSX for ${owner}/${repo}...`);
    let contentWithJsxAttributes = convertHtmlToJsx(contentWithTransformedLinks);

    // Restore escaped JSX attribute expressions like items={...}
    contentWithJsxAttributes = contentWithJsxAttributes.replace(/=\\\{([\s\S]*?)\\\}/g, '={$1}');

    const needsTabsImport = /<Tabs\b/i.test(contentWithJsxAttributes) || /<Tab\b/i.test(contentWithJsxAttributes);
    const needsFilesImport = /<Files\b/i.test(contentWithJsxAttributes) || /<File\b/i.test(contentWithJsxAttributes);

    let fullContent;
    
    if (isTabContent) {
      // Generate tab content format - just add minimal frontmatter
      const title = customTitle || repo.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ').replace(/\bMcp\b/g, 'MCP'); // Fix MCP capitalization
      
      const imports = [
        `import { Callout } from 'fumadocs-ui/components/callout';`,
        `import { ImageZoom } from 'fumadocs-ui/components/image-zoom';`
      ];

      if (needsTabsImport) {
        imports.push(`import { Tabs, Tab } from 'fumadocs-ui/components/tabs';`);
      }

      if (needsFilesImport) {
        imports.push(`import { File, Files } from 'fumadocs-ui/components/files';`);
      }

      const frontmatter = `---
title: "${title}"
description: Content from ${owner}/${repo} repository
${customIcon ? `icon: ${customIcon}` : ''}
---

${imports.join('\n')}

`;
      const processedContent = convertReadmeToTabContent(contentWithJsxAttributes, owner, repo, branch || 'main');
      fullContent = frontmatter + processedContent;
    } else if (preserveImports) {
      // Special handling for files that need to preserve existing imports
      const title = customTitle || repo.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ').replace(/\bMcp\b/g, 'MCP');
      
      const imports = [
        `import { Callout } from 'fumadocs-ui/components/callout';`,
        `import { Steps, Step } from 'fumadocs-ui/components/steps';`,
        `import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';`
      ];

      if (needsTabsImport) {
        imports.push(`import { Tabs, Tab } from 'fumadocs-ui/components/tabs';`);
      }

      const frontmatter = `---
title: "${title}"
${customDescription ? `description: "${customDescription}"` : ''}
${customIcon ? `icon: ${customIcon}` : ''}
---

${imports.join('\n')}

<Callout type="info">
  This content is automatically synced from the <a href="https://github.com/${owner}/${repo}" target="_blank" rel="noopener noreferrer">${owner}/${repo}</a> repository.
</Callout>

`;
      fullContent = frontmatter + contentWithJsxAttributes;
    } else {
      // Generate standalone page format
      const branchInfo = branch && branch !== 'main' && branch !== 'master' ? ` (branch: ${branch})` : '';
      const title = customTitle || repo.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ').replace(/\bMcp\b/g, 'MCP'); // Fix MCP capitalization
      
      const imports = [
        `import { Callout } from 'fumadocs-ui/components/callout';`,
        `import { ImageZoom } from 'fumadocs-ui/components/image-zoom';`
      ];

      if (needsTabsImport) {
        imports.push(`import { Tabs, Tab } from 'fumadocs-ui/components/tabs';`);
      }

      const frontmatter = `---
title: "${title}"
${customIcon ? `icon: ${customIcon}` : ''}
---

${imports.join('\n')}

<Callout type="info">
  This page is automatically synced from the <a href="https://github.com/${owner}/${repo}" target="_blank" rel="noopener noreferrer">${owner}/${repo}</a>${branchInfo} repository README.
</Callout>

`;
      fullContent = frontmatter + contentWithJsxAttributes;
    }
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });
    
    // Write the file
    await fs.writeFile(outputPath, fullContent);
    
    console.log(`✅ Generated ${outputPath}`);
  }
  
  console.log('✅ All README files fetched successfully!');
}

await generateReadmePages().catch((e) => {
  console.error('Failed to fetch README files', e);
});