import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { GuideApplyForm } from '@/components/guide-apply-form';

export default async function GuideApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-ink/50">
          <Link href={`/${locale}/guides`} className="hover:text-plateau">
            Guides
          </Link>
          <span> / Apply</span>
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Become a local guide</h1>
        <p className="mt-2 text-ink/65">
          Open application. After admin approval, your profile appears publicly and can receive inquiries.
        </p>
      </div>
      <GuideApplyForm locale={locale} />
    </div>
  );
}