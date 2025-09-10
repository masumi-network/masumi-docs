import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { ImageCard, ImageCards } from '@/components/image-card';
import { Banner } from '@/components/banner';
import { APIPage } from 'fumadocs-openapi/ui';
import { openapi } from '@/lib/source';
import type { MDXComponents } from 'mdx/types';
import {Mermaid}  from '@/components/mermaid';
import * as icons from "lucide-react"

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...(icons as unknown as MDXComponents),
    img: (props) => <ImageZoom {...(props as any)} className="rounded-lg" />,
    APIPage: (props) => <APIPage {...openapi.getAPIPageProps(props)} />,
    ImageCard,
    ImageCards,
    Banner,
    Mermaid,
    ...components,
  };
}
