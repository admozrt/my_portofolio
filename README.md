# adrama-portfolio

Personal portfolio and client project showcase for **Adi Rakhmatullah Ma'arif** — Software Engineer.

Beyond the portfolio itself, this repository hosts several production sub-products: an
institutional solutions page, a POS product landing page, and a collection of digital wedding
invitations built as standalone, fully themed pages.

**Live:** [dirakhmat.app](https://dirakhmat.app)

---

## Tech Stack

| Area | Stack |
|---|---|
| Framework | Create React App (`react-scripts` 5) — **not** Next.js |
| UI | React 19, TypeScript 4.9 |
| Routing | `react-router-dom` 7 (`BrowserRouter`, client-side) |
| Styling | Tailwind CSS 3 (portfolio pages) + plain co-located CSS (wedding invitations) |
| Animation | Framer Motion 12, GSAP 3 (ScrollTrigger) |
| Icons | `lucide-react`, `react-icons`, FontAwesome 7 |
| Fonts | `@fontsource-variable/geist`, `geist-mono` |
| Hosting | Cloudflare Pages + Pages Functions |

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
npm install
```

```bash
npm start
```

Runs the dev server at `http://localhost:3000`.

```bash
npm run build
```

Outputs the production bundle to `build/`.

```bash
npm test
```

Runs the test runner in watch mode.

> **Note:** `package.json` still contains `predeploy` / `deploy` scripts targeting `gh-pages`.
> These are legacy leftovers — `gh-pages` is not installed and deployment is handled by
> Cloudflare Pages (see [Deployment](#deployment)). Running `npm run deploy` will fail.

---

## Project Structure

```
src/
├── App.tsx                    # All routes defined here (no file-based routing)
├── pages/
│   ├── PortfolioPage.tsx      # Homepage — "control room" UI
│   ├── WeddingProjectsPage.tsx# Showcase index of all wedding invitations
│   ├── InstitutionalSolutionsPage.tsx
│   ├── CorePOSPage.tsx
│   └── wedding/               # One self-contained .tsx + .css per invitation
├── components/
│   ├── control-room/          # Homepage widgets (monitor wall, system log, …)
│   ├── institutional/         # Institutional page sections
│   ├── layout/                # Navigation, Footer, SplashScreen, ThemeToggle
│   ├── providers/             # Theme provider + context
│   ├── sections/              # Hero / About / Experience / Project / Partner
│   └── ui/                    # ProjectCard, ProjectModal, SEOHead, TechMarquee, …
├── data/                      # Single source of truth for all site content
│   ├── project.ts             #   10 projects with status, metrics, log entries
│   ├── partner.ts             #   9 clients & tech communities
│   ├── experience.ts          #   Work history
│   ├── skill.tsx              #   Skills with proficiency levels
│   ├── complianceCards.ts     #   Institutional compliance cards
│   ├── transformationChapters.ts
│   ├── systemLog.ts           #   Derived from experience achievements
│   ├── contact.ts
│   └── seoData.ts
├── hooks/                     # useActiveSection, useBeep, useCountUp, useMagnetic, useTheme
└── types/index.ts             # Shared interfaces

functions/
└── [[path]].js                # Cloudflare Pages Function (redirects + bot meta)

public/
├── _redirects                 # SPA fallback: /* /index.html 200
├── sitemap.xml, robots.txt, manifest.json
└── <couple>/                  # Per-invitation assets (photos, audio, RSVP README)
```

Site content lives in `src/data/` rather than a CMS — editing those files is how you update
projects, clients, experience, and skills.

---

## Routes

| Path | Page |
|---|---|
| `/` | Portfolio homepage |
| `/project-wedding` | Wedding invitation showcase index |
| `/solusi-digital` | Institutional solutions |
| `/corepos` | Core POS product page |
| `/ajie-alya` | Wedding — Ajie & Alya |
| `/anggi-rezza` | Wedding — Anggi & Rezza |
| `/tito-wina` | Wedding — Tito & Wina |
| `/dimas-laila` | Wedding — Dimas & Laila |
| `/arya-sekar` | Wedding — Arya & Sekar |
| `/reza-kirana` | Wedding — Reza & Kirana |
| `/bagas-nadira` | Wedding — Bagas & Nadira |
| `/wisnu-ratih` | Wedding — Wisnu & Ratih |

---

## Wedding Invitation System

Each invitation is a **self-contained page** — one `.tsx` plus one co-located `.css` with a
unique class prefix (e.g. `titowed-`, `wrwed-`). They deliberately do not share components, so
one couple's theme can never break another's.

Every invitation supports guest personalization via query string:

```
/tito-wina?to=Nama%20Tamu
```

Falls back to `"Tamu Undangan"` when the parameter is absent.

Themes currently shipped include classic gold, dark mauve, a smartphone-simulation UI, a
YouTube-style "content creator" layout, a glassmorphism "digital heirloom", and a Javanese
dark-and-moody design with an animated gapura opening.

### Adding a new invitation

1. Create `src/pages/wedding/WeddingPage<Name>.tsx` + `WeddingPage<Name>.css`
   (pick a unique class prefix).
2. Drop assets into `public/<slug>/` and reference them as absolute paths (`/slug/photo.webp`).
3. Register the route in `src/App.tsx`.
4. Add an entry to the `weddings[]` array in `src/pages/WeddingProjectsPage.tsx` so it appears
   in the showcase.
5. Add the new path to `public/sitemap.xml`.

### RSVP & guest messages

Invitations with an RSVP form persist data to **Google Sheets via a Google Apps Script Web App** —
no backend server required. Each couple gets their own endpoint so data never mixes.

Setup instructions and the Apps Script source live alongside each invitation's assets, e.g.
`public/tito/README-google-sheets.md`. After deploying the script, paste the `/exec` URL into the
`SHEETS_ENDPOINT` constant at the top of that invitation's `.tsx`.

> While `SHEETS_ENDPOINT` is empty the form still works, but submissions are **not persisted** —
> they only appear on that guest's screen and vanish on refresh. Fill it in before sharing the
> invitation.

---

## Deployment

Deployed to **Cloudflare Pages**.

```toml
# wrangler.toml
name = "adrakhmat"
pages_build_output_dir = "build"
```

- **Build command:** `npm run build` → output directory `build`
- **SPA routing:** `public/_redirects` contains `/* /index.html 200` so client-side routes
  resolve on direct access and refresh.
- **`functions/[[path]].js`** is a Cloudflare Pages Function handling two jobs:
  1. A 301 redirect from the legacy `admoz.pages.dev` domain to `dirakhmat.app`.
  2. Per-route Open Graph / meta injection **for crawlers only** (Facebook, WhatsApp, Twitter,
     Telegram, Slack, LinkedIn, Discord, Google, Bing). Regular visitors are passed straight
     through to the SPA. This gives correct link previews per route despite the app being
     client-rendered.

---

## Author

**Adi Rakhmatullah Ma'arif** — Software Engineer

Over 6 years building digital solutions, currently developing a Hospital Management Information
System (SIMRSGOS) at RSJ Sambang Lihum, South Kalimantan, alongside independent client work.

**Skills used across this repository and client projects**

- **Backend:** PHP, Laravel, Laminas, CodeIgniter, Golang, Goravel
- **Frontend:** React, React Native, TypeScript, JavaScript, jQuery, HTML5, CSS3, TailwindCSS, Bootstrap
- **Database:** MySQL, Oracle
- **Tools:** Docker, Git, GitHub, NPM, Expo

**Education**

- Bachelor of Computer Science, University of Kalimantan, 2017 – 2021

**Contact**

- Website: [dirakhmat.app](https://dirakhmat.app)
- Email: [adrakhmat996@gmail.com](mailto:adrakhmat996@gmail.com)
- WhatsApp: [+62 895-3622-60101](https://wa.me/62895362260101)
- LinkedIn: [Adi Rakhmatullah Ma'arif](https://www.linkedin.com/in/adi-rakhmatullah-ma-arif-145b3723b)
- GitHub: [@admozrt](https://github.com/admozrt)
