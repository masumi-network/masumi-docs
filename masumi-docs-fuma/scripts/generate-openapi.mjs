import { generateFiles } from 'fumadocs-openapi';
import { rimraf } from 'rimraf';

const paymentSpecUrl = 'https://raw.githubusercontent.com/masumi-network/masumi-payment-service/5fccf58b0f30873085b59ee540c67b4ae8433cd0/src/utils/generator/swagger-generator/openapi-docs.json';
const registrySpecUrl = 'https://raw.githubusercontent.com/masumi-network/masumi-registry-service/refs/heads/main/src/utils/swagger-generator/openapi-docs.json';

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
      includeDescription: false,
    }).then(() => console.log('✅ Registry Service API generated'))
  ]);

  console.log('✅ All OpenAPI documentation generated successfully!');
}

await generateDocs().catch((e) => {
  console.error('Failed to generate OpenAPI documentation', e);
});
