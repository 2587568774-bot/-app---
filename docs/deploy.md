# Deploy See Yunnan (public search)

Goal: put the site on a public HTTPS URL so people (and Google) can find it.

## Recommended: Vercel (free for personal projects)

### A. One-click from GitHub (easiest)

1. Push this repo to GitHub (already linked: `origin`).
2. Open [https://vercel.com/new](https://vercel.com/new) and sign in with GitHub.
3. Import repository `2587568774-bot/-app---` (or your fork).
4. **Root Directory**: set to `apps/web`  
   OR leave monorepo root and use install/build:
   - Install: `npm install`
   - Build: `npm run build --workspace=apps/web`
5. Environment variables (optional for pure local JSON mode):
   - `NEXT_PUBLIC_SITE_URL` = `https://your-project.vercel.app` (set after first deploy)
   - `DATA_SOURCE` = `local` (public browse without Supabase)
   - Later: Supabase keys if you enable cloud data
6. Deploy. You get a URL like `https://see-yunnan-xxx.vercel.app`.
7. Re-deploy after setting `NEXT_PUBLIC_SITE_URL` so sitemap/robots use the real domain.

### B. CLI

```bash
npm i -g vercel
cd see-yunnan
vercel login
vercel --prod
```

## After go-live (so search engines can find you)

1. Open `https://YOUR_DOMAIN/robots.txt` and `https://YOUR_DOMAIN/sitemap.xml` — both should work.
2. Google Search Console: [https://search.google.com/search-console](https://search.google.com/search-console)
   - Add property (URL prefix)
   - Submit sitemap: `https://YOUR_DOMAIN/sitemap.xml`
3. Optional Bing Webmaster Tools: submit the same sitemap.
4. Custom domain (optional): Vercel → Project → Settings → Domains.

## Notes

- **Public pages** (home, cities, places, guides, pricing, map) work from built-in JSON + promo images.
- **Admin writes** (grant premium, upload drafts) use local files on disk — on Vercel these do **not** persist across serverless instances. Use Supabase or re-grant after deploy for production admin.
- Payment QR codes are served from `/uploads/payment/*`.

## Local production smoke test

```bash
npm run build
npm run start --workspace=apps/web
# open http://localhost:3000/en
```

## If git push fails (GitHub timeout)

In mainland China, `github.com:443` sometimes times out. Options:

1. Turn on VPN / system proxy, then run:
   ```
   cd E:\无尽的\see-yunnan
   git push origin main
   ```
2. Or open GitHub Desktop / browser login and push from there.
3. After push, open https://vercel.com/new → import `2587568774-bot/-app---`
   - **Root Directory**: `apps/web`  (recommended)
   - Env: `DATA_SOURCE=local`
   - Env: `NEXT_PUBLIC_SITE_URL=https://YOUR_PROJECT.vercel.app` (after first deploy, re-deploy once)
4. Confirm:
   - `https://YOUR_DOMAIN/zh-Hans` opens
   - `https://YOUR_DOMAIN/robots.txt`
   - `https://YOUR_DOMAIN/sitemap.xml`
5. Google Search Console → submit `sitemap.xml`

Local smoke (already verified):
- `/zh-Hans` `/zh-Hans/cities` `/zh-Hans/account` `/en` all 200
- Header links: 探索 → cities, 我的 → account
