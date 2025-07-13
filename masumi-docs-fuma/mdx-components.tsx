import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { ImageCard, ImageCards } from '@/components/image-card';
import { Banner } from '@/components/banner';
import { EcosystemSection  } from '@/components/ecosystem';
import { APIPage } from 'fumadocs-openapi/ui';
import { openapi } from '@/lib/source';
import type { MDXComponents } from 'mdx/types';
import {Mermaid}  from '@/components/mermaid';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props) => <ImageZoom {...(props as any)} />,
    APIPage: (props) => <APIPage {...openapi.getAPIPageProps(props)} />,
    ImageCard,
    ImageCards,
    Banner,
    EcosystemSection,
    Mermaid,
    ...components,
  };
}
