import { getTranslations } from 'next-intl/server';
import { SiteHeader } from '@/components/site-header';

export async function AppShell({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('common');
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-ink/10 py-8 text-center text-sm text-ink/50">
        {t('footer')}
      </footer>
    </div>
  );
}
