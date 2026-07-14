'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function GuideApplyForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations('guides');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t('submitFailed'));
      setMsg(t('submitted'));
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('submitFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="display_name" label={t('displayName')} required />
        <Input name="contact_email" label={t('contactEmail')} type="email" required />
        <Input name="headline" label={t('headline')} required className="md:col-span-2" />
        <Textarea name="bio" label={t('bio')} required className="md:col-span-2" />
        <Input name="years_experience" label={t('yearsExperience')} type="number" />
        <Input name="languages" label={t('languagesComma')} placeholder="en, zh-Hans" />
        <Input
          name="service_region_slugs"
          label={t('serviceRegions')}
          placeholder="dali, dali-city"
          className="md:col-span-2"
        />
        <Input
          name="specialties"
          label={t('specialties')}
          placeholder="food, culture, hiking"
          className="md:col-span-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-plateau px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? t('submitting') : t('submitApplication')}
      </button>
      <p className="text-xs text-ink/50">{t('applyNote')}</p>
      {msg ? <p className="text-sm text-ink/70">{msg}</p> : null}
    </form>
  );
}

function Input({
  name,
  label,
  type = 'text',
  required,
  placeholder,
  className = '',
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1 block font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-ink/15 px-3 py-2"
      />
    </label>
  );
}

function Textarea({
  name,
  label,
  required,
  className = '',
}: {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1 block font-medium">{label}</span>
      <textarea name={name} required={required} rows={4} className="w-full rounded-xl border border-ink/15 px-3 py-2" />
    </label>
  );
}
