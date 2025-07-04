import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { BookOpen, Brain, Rocket, Code } from "lucide-react";

// Icon mapping
const iconMap = {
  Brain,
  BookOpen,
  Rocket,
  Code,
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions}
      sidebar={{
        defaultOpenLevel: 0,
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node);
            
            // Define colors for different sections
            const colors = {
              '/documentation': 'var(--documentation-color, #10b981)', // green for documentation
              '/core-concepts': 'var(--concepts-color, #8b5cf6)', // purple for concepts
            };
            
            const path = (node as any).url || '/';
            const color = (colors as any)[path] || 'var(--color-fd-foreground)';
            
            // Get icon from meta or use default
            let IconComponent = null;
            const iconName = (meta as any)?.data?.icon || (meta as any)?.icon;
            
            if (iconName && typeof iconName === 'string' && iconName in iconMap) {
              IconComponent = iconMap[iconName as keyof typeof iconMap];
            } else if ((node as any).icon) {
              IconComponent = () => (node as any).icon;
            }
            
            if (!IconComponent) return option;

            return {
              ...option,
              icon: (
                <div
                  className="flex items-center justify-center w-5 h-5 rounded-lg text-[var(--tab-color)] max-md:bg-[var(--tab-color)]/10 max-md:border max-md:border-[var(--tab-color)]/20 max-md:p-1.5 transition-all duration-200 hover:bg-[var(--tab-color)]/5"
                  style={
                    {
                      '--tab-color': color,
                    } as React.CSSProperties
                  }
                >
                  <IconComponent className="w-4 h-4" />
                </div>
              ),
            };
          },
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
