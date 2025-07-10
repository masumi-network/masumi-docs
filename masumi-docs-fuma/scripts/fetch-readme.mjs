import { promises as fs } from 'fs';
import path from 'path';

const REPOS = [
  {
    owner: 'masumi-network',
    repo: 'agentic-service-wrapper',
    outputPath: './content/docs/documentation/get-started/_agentic-service-wrapper.mdx',
    isTabContent: true
  }
];

async function fetchReadme(owner, repo) {
  try {
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

    return await response.text();
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error);
    return null;
  }
}

function convertReadmeToTabContent(readmeContent, owner, repo) {
  // Simply return the raw content - let the repo control formatting
  return readmeContent;
}

async function generateReadmePages() {
  console.log('📚 Fetching README files...');
  
  for (const { owner, repo, outputPath, isTabContent } of REPOS) {
    console.log(`Fetching ${owner}/${repo}...`);
    
    const readmeContent = await fetchReadme(owner, repo);
    
    if (!readmeContent) {
      console.error(`❌ Failed to fetch README for ${owner}/${repo}`);
      continue;
    }

    let fullContent;
    
    if (isTabContent) {
      // Generate tab content format - just add minimal frontmatter
      const frontmatter = `---
title: ${repo.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join(' ')}
description: Content from ${owner}/${repo} repository
---

`;
      const processedContent = convertReadmeToTabContent(readmeContent, owner, repo);
      fullContent = frontmatter + processedContent;
    } else {
      // Generate standalone page format
      const frontmatter = `---
title: ${repo.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join(' ')}
description: README from ${owner}/${repo} repository
---

# ${repo.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join(' ')}

<div className="mb-4 p-4 border rounded-lg bg-muted/50">
  <p className="text-sm text-muted-foreground">
    This page is automatically synced from the{' '}
    <a 
      href="https://github.com/${owner}/${repo}" 
      target="_blank" 
      rel="noopener noreferrer"
      className="underline"
    >
      ${owner}/${repo}
    </a>{' '}
    repository README.
  </p>
</div>

`;
      fullContent = frontmatter + readmeContent;
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