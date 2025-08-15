export function SiteFooter() {
  return (
    <footer className="border-t bg-card/50 py-8 mt-auto">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Masumi
          </p>
          <nav className="flex gap-6">
            <a 
              href="https://www.masumi.network/imprint" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Imprint
            </a>
            <a 
              href="https://www.house-of-communication.com/de/en/footer/privacy-policy.html" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}