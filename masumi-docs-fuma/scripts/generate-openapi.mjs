import { generateFiles } from 'fumadocs-openapi';
import { rimraf } from 'rimraf';
import { promises as fs } from 'fs';
import path from 'path';

const paymentSpecUrl = 'https://raw.githubusercontent.com/masumi-network/masumi-payment-service/5fccf58b0f30873085b59ee540c67b4ae8433cd0/src/utils/generator/swagger-generator/openapi-docs.json';
const registrySpecUrl = 'https://raw.githubusercontent.com/masumi-network/masumi-registry-service/refs/heads/main/src/utils/swagger-generator/openapi-docs.json';

async function createMetaJsonFiles() {
  const generatedPath = './content/docs/api-reference/(generated)';
  
  // Create meta.json for (generated) folder
  await fs.writeFile(
    path.join(generatedPath, 'meta.json'),
    JSON.stringify({
      title: "API Reference",
      pages: ["payment-service", "registry-service"]
    }, null, 2)
  );

  // Create meta.json for payment-service
  const paymentServicePath = path.join(generatedPath, 'payment-service');
  const paymentDirs = await fs.readdir(paymentServicePath);
  const paymentPages = paymentDirs.filter(dir => !dir.startsWith('.')).sort();
  
  await fs.writeFile(
    path.join(paymentServicePath, 'meta.json'),
    JSON.stringify({
      title: "Payment Service",
      pages: paymentPages
    }, null, 2)
  );

  // Create meta.json for registry-service
  const registryServicePath = path.join(generatedPath, 'registry-service');
  const registryDirs = await fs.readdir(registryServicePath);
  const registryPages = registryDirs.filter(dir => !dir.startsWith('.')).sort();
  
  await fs.writeFile(
    path.join(registryServicePath, 'meta.json'),
    JSON.stringify({
      title: "Registry Service",
      pages: registryPages
    }, null, 2)
  );

  // Create meta.json for subdirectories with multiple operations
  for (const servicePath of [paymentServicePath, registryServicePath]) {
    const dirs = await fs.readdir(servicePath);
    for (const dir of dirs) {
      if (dir.startsWith('.') || dir === 'meta.json') continue;
      
      const dirPath = path.join(servicePath, dir);
      const stat = await fs.stat(dirPath);
      
      if (stat.isDirectory()) {
        const files = await fs.readdir(dirPath);
        const mdxFiles = files.filter(f => f.endsWith('.mdx'));
        
        if (mdxFiles.length > 1) {
          // This directory has multiple operations
          const operations = mdxFiles.map(f => f.replace('.mdx', '')).sort();
          await fs.writeFile(
            path.join(dirPath, 'meta.json'),
            JSON.stringify({
              title: dir.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' '),
              pages: operations
            }, null, 2)
          );
        }
      }
    }
  }
  
  console.log('✅ Meta.json files created successfully!');
}

export async function generateDocs() {
  console.log('🧹 Cleaning generated directories...');
  await rimraf('./content/docs/api-reference/(generated)');

  console.log('🔄 Generating OpenAPI documentation...');
  
  // Generate both payment and registry docs in parallel
  await Promise.all([
    // Payment Service API
    generateFiles({
      input: [paymentSpecUrl],
      output: './content/docs/api-reference/(generated)/payment-service',
      per: 'operation',
      includeDescription: true,
    }).then(() => console.log('✅ Payment Service API generated')),
    
    // Registry Service API
    generateFiles({
      input: [registrySpecUrl],
      output: './content/docs/api-reference/(generated)/registry-service',
      per: 'operation',
      includeDescription: true,
    }).then(() => console.log('✅ Registry Service API generated'))
  ]);

  // Create meta.json files after generation
  await createMetaJsonFiles();

  console.log('✅ All OpenAPI documentation generated successfully!');
}

await generateDocs().catch((e) => {
  console.error('Failed to generate OpenAPI documentation', e);
});
