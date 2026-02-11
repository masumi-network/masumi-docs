import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';
import { remarkMermaid } from '@theguild/remark-mermaid';
import { visit } from 'unist-util-visit';

// Extend the frontmatter schema to include banner
const extendedFrontmatterSchema = frontmatterSchema.extend({
  banner: z.string().optional(),
});

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: extendedFrontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

// Fix Mermaid components for fumadocs structure plugin
// The structure plugin expects components to have children, but Mermaid has a chart prop
function remarkFixMermaid() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'mdxJsxFlowElement' &&
        node.name === 'Mermaid' &&
        !node.children
      ) {
        node.children = [];
      }
    });
  };
}

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      remarkMermaid,
      remarkFixMermaid, // Fix Mermaid components after remarkMermaid runs
    ],
  },
});
