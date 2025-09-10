interface BannerProps {
  src: string;
  alt?: string;
  className?: string;
}

export function Banner({ src, alt = "Banner", className }: BannerProps) {
  return (
    <div className={`w-full  -mx-6 md:-mx-8 lg:-mx-12 ${className || ''}`}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-auto object-cover"
      />
    </div>
  );
}