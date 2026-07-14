import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

/** Safety net: if middleware does not rewrite `/`, still land on default locale. */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
