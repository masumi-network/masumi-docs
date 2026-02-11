import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';
import { rimraf } from 'rimraf';
import { promises as fs } from 'fs';
import path from 'path';

const paymentSpecUrl = 'https://raw.githubusercontent.com/masumi-network/masumi-payment-service/5fccf58b0f30873085b59ee540c67b4ae8433cd0/src/utils/generator/swagger-generator/openapi-docs.json';
const registrySpecUrl = 'https://raw.githubusercontent.com/masumi-network/masumi-registry-service/refs/heads/main/src/utils/swagger-generator/openapi-docs.json';

async function processDirectory(dirPath, basePath, tempPath, parentEndpoint = '') {
  const items = await fs.readdir(dirPath);
  
  for (const item of items) {
    if (item.startsWith('.') || item === 'meta.json') continue;
    
    const itemPath = path.join(dirPath, item);
    const stat = await fs.stat(itemPath);
    
    if (stat.isDirectory()) {
      // This is a subdirectory, recurse into it
      const currentEndpoint = parentEndpoint ? `${parentEndpoint}-${item}` : item;
      await processDirectory(itemPath, basePath, tempPath, currentEndpoint);
    } else if (item.endsWith('.mdx')) {
      // This is an MDX file
      const method = item.replace('.mdx', '').toUpperCase();
      const endpoint = parentEndpoint || path.relative(basePath, dirPath);
      
      // Create new filename: method-endpoint.mdx (replace slashes with dashes)
      const cleanEndpoint = endpoint.replace(/\//g, '-');
      const newFileName = `${method.toLowerCase()}-${cleanEndpoint}.mdx`;
      
      // Read the original file
      const content = await fs.readFile(itemPath, 'utf-8');
      
      // Update the title in the frontmatter to use the endpoint with dashes preserved
      const updatedContent = content.replace(
        /title: .+[\s\S]*?(?=\n[a-zA-Z_])/,
        `title: "/${endpoint}"\n`
      );
      
      // Write to temp directory with new name
      await fs.writeFile(path.join(tempPath, newFileName), updatedContent);
    }
  }
}

async function reorganizeGeneratedFiles() {
  const generatedPath = './content/docs/api-reference/(generated)';
  
  // Process both services
  for (const service of ['payment-service', 'registry-service']) {
    const servicePath = path.join(generatedPath, service);
    const tempPath = path.join(generatedPath, `${service}-temp`);
    
    // Create temp directory
    await fs.mkdir(tempPath, { recursive: true });
    
    // Process all directories and files recursively
    await processDirectory(servicePath, servicePath, tempPath);
    
    // Remove old service directory
    await rimraf(servicePath);
    
    // Rename temp to service directory
    await fs.rename(tempPath, servicePath);
  }
  
  console.log('✅ Files reorganized into flat structure!');
}

async function createMetaJsonFiles() {
  const generatedPath = './content/docs/api-reference/(generated)';
  const apiReferencePath = './content/docs/api-reference';
  
  // Get files from both services to create flat structure in main meta.json
  const paymentServicePath = path.join(generatedPath, 'payment-service');
  const registryServicePath = path.join(generatedPath, 'registry-service');
  
  // Function to get all files recursively from a directory
  async function getAllFiles(dir, basePath = dir) {
    const items = await fs.readdir(dir);
    let files = [];
    
    for (const item of items) {
      if (item.startsWith('.') || item === 'meta.json') continue;
      
      const itemPath = path.join(dir, item);
      const stat = await fs.stat(itemPath);
      
      if (stat.isDirectory()) {
        const subFiles = await getAllFiles(itemPath, basePath);
        files = files.concat(subFiles);
      } else if (item.endsWith('.mdx')) {
        const relativePath = path.relative(basePath, itemPath);
        files.push(relativePath);
      }
    }
    
    return files;
  }
  
  // Get all payment service files
  const paymentFiles = await getAllFiles(paymentServicePath);
  const paymentPaths = paymentFiles
    .map(file => `./(generated)/payment-service/${file}`)
    .sort((a, b) => {
      // Extract method and endpoint from file path
      const fileA = a.split('/').pop().replace('.mdx', ''); // get filename without extension
      const fileB = b.split('/').pop().replace('.mdx', '');
      
      const [methodA, ...endpointPartsA] = fileA.split('-');
      const [methodB, ...endpointPartsB] = fileB.split('-');
      const endpointA = endpointPartsA.join('-');
      const endpointB = endpointPartsB.join('-');
      
      // First sort by endpoint
      if (endpointA !== endpointB) {
        return endpointA.localeCompare(endpointB);
      }
      
      // Then sort by method order: GET, POST, PATCH, DELETE
      const methodOrder = ['get', 'post', 'patch', 'put', 'delete'];
      return methodOrder.indexOf(methodA) - methodOrder.indexOf(methodB);
    });
  
  // Get all registry service files  
  const registryFiles = await getAllFiles(registryServicePath);
  const registryPaths = registryFiles
    .map(file => `./(generated)/registry-service/${file}`)
    .sort((a, b) => {
      // Extract method and endpoint from file path
      const fileA = a.split('/').pop().replace('.mdx', ''); // get filename without extension
      const fileB = b.split('/').pop().replace('.mdx', '');
      
      const [methodA, ...endpointPartsA] = fileA.split('-');
      const [methodB, ...endpointPartsB] = fileB.split('-');
      const endpointA = endpointPartsA.join('-');
      const endpointB = endpointPartsB.join('-');
      
      // First sort by endpoint
      if (endpointA !== endpointB) {
        return endpointA.localeCompare(endpointB);
      }
      
      // Then sort by method order: GET, POST, PATCH, DELETE
      const methodOrder = ['get', 'post', 'patch', 'put', 'delete'];
      return methodOrder.indexOf(methodA) - methodOrder.indexOf(methodB);
    });
  
  // Create the main API Reference meta.json with flat structure using relative paths
  const pages = [
    "---Payment Service API---",
    ...paymentPaths,
    "---Registry Service API---",
    ...registryPaths
  ];
  
  await fs.writeFile(
    path.join(apiReferencePath, 'meta.json'),
    JSON.stringify({
      title: "API Reference",
      root: true,
      pages: pages,
      icon: "ChevronsLeftRightEllipsis"
    }, null, 2)
  );
  
  // Still create the service-level meta.json files for consistency
  const paymentServiceFiles = await fs.readdir(paymentServicePath);
  const paymentPages = paymentServiceFiles
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace('.mdx', ''))
    .sort();
  
  await fs.writeFile(
    path.join(paymentServicePath, 'meta.json'),
    JSON.stringify({
      title: "Payment Service API",
      pages: paymentPages
    }, null, 2)
  );
  
  const registryServiceFiles = await fs.readdir(registryServicePath);
  const registryPages = registryServiceFiles
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace('.mdx', ''))
    .sort();
  
  await fs.writeFile(
    path.join(registryServicePath, 'meta.json'),
    JSON.stringify({
      title: "Registry Service API", 
      pages: registryPages
    }, null, 2)
  );
  
  console.log('✅ Meta.json files created successfully!');
}

async function generateServiceDocs(specUrl, outputPath, serviceName) {
  const input = createOpenAPI({ input: [specUrl] });
  await generateFiles({
    input,
    output: outputPath,
    per: 'operation',
    includeDescription: true,
  });
  console.log(`✅ ${serviceName} API generated`);
}

export async function generateDocs() {
  console.log('🧹 Cleaning generated directories...');
  await rimraf('./content/docs/api-reference/(generated)');

  console.log('🔄 Generating OpenAPI documentation...');
  
  // Generate both payment and registry docs in parallel
  await Promise.all([
    generateServiceDocs(
      paymentSpecUrl,
      './content/docs/api-reference/(generated)/payment-service',
      'Payment Service'
    ),
    generateServiceDocs(
      registrySpecUrl,
      './content/docs/api-reference/(generated)/registry-service',
      'Registry Service'
    ),
  ]);

  // Reorganize files into flat structure
  await reorganizeGeneratedFiles();

  // Create meta.json files after reorganization
  await createMetaJsonFiles();

  console.log('✅ All OpenAPI documentation generated successfully!');
}

await generateDocs().catch((e) => {
  console.error('Failed to generate OpenAPI documentation', e);
});
