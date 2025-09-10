import Link from 'next/link';

interface ImageCardProps {
  title: string;
  description: string;
  image: string;
  href?: string;
  className?: string;
}

export function ImageCard({ title, description, image, href, className }: ImageCardProps) {
  const cardClasses = `group relative overflow-hidden rounded-lg border border-fd-border bg-fd-card transition-all hover:border-fd-primary/50 hover:shadow-lg ${className || ''}`;

  const cardContent = (
    <>
      <div className="aspect-video w-full overflow-hidden bg-fd-muted">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 not-prose !rounded-none"
        />
      </div>
      <div className="p-6">

        {href ? <Link href={href} className=" mt-0 text-lg font-semibold text-fd-foreground">{title}</Link> : 
        <p className="mt-0 mb-0 text-lg font-semibold text-fd-foreground">{title}</p>
        }
        <p className="mb-0 text-sm text-fd-muted-foreground">{description}</p>
      </div>
    </>
  );


  return (
    <div className={cardClasses}>
      {cardContent}
    </div>
  );
}

export function ImageCards({ children, className }: { children: React.ReactNode; className?: string }) {
  const gridClasses = `grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className || ''}`;
  
  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}