import { promises as fs } from 'fs';
import path from 'path';

const REPOS = [
  {
    owner: 'masumi-network',
    repo: 'agentic-service-wrapper',
    branch: 'docs-prepare', // specify the branch to fetch from
    outputPath: './content/docs/documentation/get-started/_agentic-service-wrapper.mdx',
    isTabContent: true
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

    let fullContent;
    
    if (isTabContent) {
      // Generate tab content format - just add minimal frontmatter
      const frontmatter = `---
title: ${repo.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join(' ')}
description: Content from ${owner}/${repo} repository
---

import { Callout } from 'fumadocs-ui/components/callout';

`;
      const processedContent = convertReadmeToTabContent(readmeContent, owner, repo, branch);
      fullContent = frontmatter + processedContent;
    } else {
      // Generate standalone page format
      const branchInfo = branch && branch !== 'main' && branch !== 'master' ? ` (branch: ${branch})` : '';
      const frontmatter = `---
title: ${repo.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join(' ')}
description: README from ${owner}/${repo} repository
---

import { Callout } from 'fumadocs-ui/components/callout';

# ${repo.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join(' ')}

<Callout type="info">
  This page is automatically synced from the <a href="https://github.com/${owner}/${repo}" target="_blank" rel="noopener noreferrer">${owner}/${repo}</a>${branchInfo} repository README.
</Callout>

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