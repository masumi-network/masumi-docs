import Link from "next/link";

interface EcosystemCardProps {
  title: string;
  description: string;
  link?: string;
  image?: string;
}

function EcosystemCard({ title, description, link, image }: EcosystemCardProps) {
  return (
    <div className="group block rounded-lg border border-fd-border bg-fd-card transition-all hover:border-fd-primary/50 hover:shadow-lg hover:no-underline overflow-hidden">
      {image && (
        <div className="aspect-video w-full overflow-hidden bg-fd-muted">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-3">
        <h3 className="text-xl font-semibold mt-3 mb-2 text-fd-foreground group-hover:text-fd-primary transition-colors cursor-default">
          {title}
        </h3>
        <p className="text-fd-muted-foreground leading-relaxed cursor-default">
          {description}
        </p>
        {link && (
          <Link href={link} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm text-fd-primary font-medium cursor-pointer hover:underline">
            Visit {title} →
          </Link>
        )}
      </div>
    </div>
  );
}

export function EcosystemGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 my-8">
      {children}
    </div>
  );
}

export function EcosystemSection() {
  return (
    <EcosystemGrid>
      <EcosystemCard
        title="Masumi"
        description="The foundational protocol that handles payments and identity for AI agents. "
        image="/assets/masumi_logo_kanji_black.png"
      />
      <EcosystemCard
        title="Sokusumi"
        description="The marketplace where AI agents are discovered and accessed. "
        link="https://www.sokosumi.com"
        image="/assets/Node.png"
      />
      <EcosystemCard
        title="Kodusumi"
        description="The runtime environment that provides reliable, scalable execution for AI agents. "
        link="https://www.kodosumi.io"
        image="/assets/masuminode.png"
      />
    </EcosystemGrid>
  );
}