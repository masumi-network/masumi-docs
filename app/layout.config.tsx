import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Settings } from "lucide-react";
import Image from "next/image";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image
          src="/assets/masumi_logo.png"
          alt="Masumi Logo"
          width={130}
          height={50}
          className="dark:hidden"
        />
        <Image
          src="/assets/masumi_logo_dark.png"
          alt="Masumi Logo"
          width={130}
          height={50}
          className="hidden dark:block"
        />
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [
    {
      type: "icon",
      label: "Support (opens Linktree in a new tab)",
      text: "Support",
      icon: (
        <span className="inline-flex items-center gap-2 rounded-full border border-fd-border/60 bg-fd-secondary px-3 py-1 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent">
          <Settings className="size-4 shrink-0" aria-hidden />
          <span>Support</span>
        </span>
      ),
      url: "https://linktr.ee/masumidev",
      external: true,
    },
  ],
  githubUrl: 'https://github.com/masumi-network',
};
