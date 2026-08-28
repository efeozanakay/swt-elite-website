# SWT Elite Corporate Website

The production website for [SWT Elite](https://swtelite.com), a tourism and destination management company providing ground operations, transportation and destination services across Türkiye.

This repository is presented as a portfolio case study of a real corporate website. SWT Elite branding and public business information remain the property of their respective owner.

## Business context

The site introduces SWT Elite to international travel partners and supports partnership enquiries. Its content is structured around operational credibility: the services delivered on the ground, fleet capabilities, destination coverage, operational coordination and partner relationships.

## Website features

- Full-screen video hero with responsive image fallback
- Ground handling, transportation, destination services, and groups and MICE capability sections
- Operational journey and 24/7 operations-centre presentation
- Fleet categories for VIP, minivan, minibus, and coach transportation
- Schematic coverage presentation for Antalya, Istanbul, Izmir, Bodrum, Dalaman, and Cappadocia
- Partner-logo section and company introduction
- Email-based partnership calls to action
- Responsive navigation, layouts, typography, and media treatment
- Reduced-motion support, visible keyboard focus styles, and semantic image descriptions
- Open Graph and Twitter sharing metadata

## Tech stack

- Next.js 14 with the App Router
- React 18
- TypeScript
- Tailwind CSS
- Next.js image and font tooling

## Architecture

```text
app/          Application shell, metadata, page composition, and global styles
components/   Reusable page sections and UI components
lib/          Shared client-side utilities
public/       SWT Elite brand, partner, image, and video assets used by the site
```

The homepage is composed from focused section components. The project uses static export mode, with unoptimized images for compatibility with static hosting.

## Local development

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

Useful checks:

```bash
npm run lint
npm run build
```

The current code does not require runtime environment variables. If external services are added later, keep real values in ignored local environment files and commit only placeholder examples.

## Deployment

`next.config.mjs` configures a static export. Running `npm run build` generates the deployable output in `out/`, which is intentionally excluded from version control. The production website is available at [swtelite.com](https://swtelite.com).

## Partnership enquiry form

The primary CTAs open an in-site drawer rather than a `mailto:` link. It
posts to `POST /api/enquiry`, a Cloudflare Pages Function in
`functions/api/`, which validates the submission and sends it on through
Resend. Validation rules live in `lib/enquiry.ts` and are shared by the
browser and the Function so the two cannot drift apart.

Pages Functions are the mechanism here because `next.config.mjs` sets
`output: 'export'`, which rules out Next.js API routes. `functions/` sits
at the repository root and Cloudflare picks it up at deploy;
`public/_routes.json` limits the Worker to `/api/*` so static assets are
served directly.

`next dev` does not run Pages Functions, so `/api/enquiry` returns 404
locally and the drawer shows its error state. Test the full path against
a Cloudflare preview deployment, or with `wrangler pages dev out`.

See `.env.example` for the required variables. Secrets belong in the
Pages project as encrypted variables and must never be committed.

## Project status

The website is live and maintained as the SWT Elite corporate presence. This repository contains the implemented single-page marketing experience; it does not include a booking engine, customer portal, database, analytics dashboard, or content-management system.

## Author

**Efe Akay — AI Automation & Digital Product Builder**
