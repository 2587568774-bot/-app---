import { NextResponse } from 'next/server';
import { createGuideApplication, listApprovedGuides } from '@/lib/guides/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guides = listApprovedGuides({
    region: searchParams.get('region') || undefined,
    language: searchParams.get('language') || undefined,
    q: searchParams.get('q') || undefined,
    premiumBoost: searchParams.get('premium') === '1',
  });
  return NextResponse.json({ guides });
}

export async function POST(request: Request) {
  const body = await request.json();
  const required = ['display_name', 'headline', 'bio', 'contact_email'];
  for (const key of required) {
    if (!body?.[key] || String(body[key]).trim() === '') {
      return NextResponse.json({ error: `${key} required` }, { status: 400 });
    }
  }

  const languages = String(body.languages || 'en')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);
  const service_region_slugs = String(body.service_region_slugs || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);
  const specialties = String(body.specialties || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const guide = createGuideApplication({
    display_name: String(body.display_name).trim(),
    headline: String(body.headline).trim(),
    bio: String(body.bio).trim(),
    years_experience: Number(body.years_experience) || 0,
    languages: languages.length ? languages : ['en'],
    service_region_slugs,
    specialties,
    contact_email: String(body.contact_email).trim(),
  });

  return NextResponse.json({ ok: true, guide }, { status: 201 });
}