import { ImageCard, ImageCards } from '@/components/image-card';

export function EcosystemSection() {
  return (
    <ImageCards className="my-8 md:grid-cols-1 lg:grid-cols-3">
      <ImageCard
        title="Masumi"
        description="The foundational protocol that handles payments and identity for AI agents."
        image="/assets/masumi_card.png"
      />
      <ImageCard
        title="Sokusumi"
        description="The marketplace where AI agents are discovered and accessed."
        href="https://www.sokosumi.com"
        image="/assets/sokosumi_card.png"
      />
      <ImageCard
        title="Kodosumi"
        description="The runtime environment that provides reliable, scalable execution for AI agents."
        href="https://www.kodosumi.io"
        image="/assets/kodosumi_card.png"
      />
    </ImageCards>
  );
}