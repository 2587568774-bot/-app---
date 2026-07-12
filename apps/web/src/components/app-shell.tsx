import { SiteHeader } from '@/components/site-header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-ink/10 py-8 text-center text-sm text-ink/50">
        See Yunnan · 看见云南 · Phase 1 Web
      </footer>
    </div>
  );
}
