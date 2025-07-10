import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { ImageCard, ImageCards } from '@/components/image-card';
import { Banner } from '@/components/banner';
import type { MDXComponents } from 'mdx/types';

// Temporary placeholder for OpenAPI component
const OpenAPI = ({ spec, path, method }: { spec: string; path: string; method: string }) => (
  <div className="border rounded-lg p-4 my-4">
    <h4 className="font-semibold mb-2">{method.toUpperCase()} {path}</h4>
    <p className="text-sm text-gray-600">
      API Documentation: <a href={spec} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View OpenAPI Spec</a>
    </p>
  </div>
);

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props) => <ImageZoom {...(props as any)} />,
    OpenAPI,
    ImageCard,
    ImageCards,
    Banner,
    ...components,
  };
}
