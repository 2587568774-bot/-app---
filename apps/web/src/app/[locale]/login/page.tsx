import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LoginForm } from '@/components/login-form';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('login');
  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-semibold">{t('title')}</h1>
      <LoginForm
        labels={{
          email: t('email'),
          send: t('send'),
          google: t('google'),
          hint: t('hint'),
          magicSent: t('magicSent'),
          failed: t('failed'),
        }}
      />
    </div>
  );
}
