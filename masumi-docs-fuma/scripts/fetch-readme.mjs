import { promises as fs } from 'fs';
import path from 'path';



const REPOS = [
  {
    owner: 'masumi-network',
    repo: 'agentic-service-wrapper',
    branch: 'docs-prepare',
    outputPath: './content/docs/documentation/get-started/_agentic-service-wrapper.mdx',
    isTabContent: true
  },
  {
    owner: 'masumi-network',
    repo: 'masumi-mcp-server',
    outputPath: './content/docs/documentation/technical-documentation/_masumi-mcp-server.mdx',
    isTabContent: false
  }
];

async function fetchReadme(owner, repo, branch = 'main') {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme?ref=${branch}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch README: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo} (branch: ${branch}):`, error);
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

function convertHtmlToJsx(content) {
  let updatedContent = content;

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
  
  for (const { owner, repo, branch, outputPath, isTabContent } of REPOS) {
    console.log(`Fetching ${owner}/${repo} (branch: ${branch || 'main'})...`);
    
    const readmeContent = await fetchReadme(owner, repo, branch);
    
    if (!readmeContent) {
      console.error(`❌ Failed to fetch README for ${owner}/${repo}`);
      continue;
    }

    // Sync images and update paths
    console.log(`📸 Syncing images for ${owner}/${repo}...`);
    const contentWithSyncedImages = await syncImages(readmeContent, owner, repo, branch);
    
    // Convert HTML attributes to JSX
    console.log(`🔄 Converting HTML to JSX for ${owner}/${repo}...`);
    const contentWithJsxAttributes = convertHtmlToJsx(contentWithSyncedImages);

    let fullContent;
    
    if (isTabContent) {
      // Generate tab content format - just add minimal frontmatter
      const title = repo.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ').replace(/\bMcp\b/g, 'MCP'); // Fix MCP capitalization
      
      const frontmatter = `---
title: ${title}
description: Content from ${owner}/${repo} repository
---

import { Callout } from 'fumadocs-ui/components/callout';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';

`;
      const processedContent = convertReadmeToTabContent(contentWithJsxAttributes, owner, repo, branch || 'main');
      fullContent = frontmatter + processedContent;
    } else {
      // Generate standalone page format
      const branchInfo = branch && branch !== 'main' && branch !== 'master' ? ` (branch: ${branch})` : '';
      const title = repo.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ').replace(/\bMcp\b/g, 'MCP'); // Fix MCP capitalization
      
      const frontmatter = `---
title: ${title}
---

import { Callout } from 'fumadocs-ui/components/callout';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';

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