/**
 * Cloudflare Pages Function — per-route OG meta injection for bots/crawlers.
 *
 * SAFE: uses context.next() for regular users (zero overhead).
 * Only intercepts bot user-agents and injects the correct OG tags per route
 * before returning the index.html shell.
 *
 * This is different from _worker.js (advanced mode) — Pages Functions
 * sit alongside static serving and never replace it for normal users.
 */

const BASE = "https://admoz.pages.dev";

const ROUTES = {
  weddingAjie: {
    match: (path) => /ajie/i.test(path) || /alya/i.test(path),
    title: "Undangan Pernikahan Ajie & Alya 💍",
    description:
      "Dengan penuh rasa syukur, kami mengundang Anda untuk hadir menyaksikan pernikahan kami. Ahad, 7 Juni 2026 · Tapin, Kalimantan Selatan",
    image: BASE + "/ajie/Preview.jpeg",
    imageW: "1185",
    imageH: "1600",
    url: BASE + "/ajie-alya",
    siteName: "Undangan Pernikahan",
  },
  weddingAnggi: {
    match: (path) =>
      /anggi/i.test(path) || /rezza/i.test(path) || /zulfhanie/i.test(path),
    title: "Undangan Pernikahan Anggi & Rezza 💍",
    description:
      "Dengan penuh rasa syukur, kami mengundang Anda untuk hadir menyaksikan pernikahan kami. Minggu, 12 Juli 2026 · Banjarbaru, Kalimantan Selatan",
    image: BASE + "/anggi/preview.jpg",
    imageW: "1200",
    imageH: "919",
    url: BASE + "/anggi-rezza",
    siteName: "Undangan Pernikahan",
  },
  weddingIlmi: {
    match: (path) =>
      /ilmi/i.test(path) ||
      /zahro/i.test(path) ||
      /bahran/i.test(path) ||
      /fatimatul/i.test(path),
    title: "Undangan Pernikahan Ilmi & Zahra 💍",
    description:
      "Dengan penuh rasa syukur, kami mengundang Anda untuk hadir menyaksikan pernikahan kami. Minggu, 5 Juli 2026 · Banjarbaru, Kalimantan Selatan",
    image: BASE + "/ilmi/cover.jpeg",
    imageW: "800",
    imageH: "1200",
    url: BASE + "/ilmi-zahra",
    siteName: "Undangan Pernikahan",
  },
  portfolio: {
    match: () => true, // default
    title: "Adi Rakhmatullah Ma’arif – Pengembang Full Stack | Laravel & React",
    description:
      "Pengembang Full Stack berpengalaman dalam Laravel, React, dan teknologi web modern. Membangun aplikasi web yang scalable, responsif, dan sistem informasi.",
    image: BASE + "/my.png",
    imageW: "1024",
    imageH: "1278",
    url: BASE,
    siteName: "Admoz Portfolio",
  },
};

const BOT_PATTERN =
  /facebookexternalhit|facebookcatalog|Instagram|WhatsApp|Twitterbot|TelegramBot|Slackbot|LinkedInBot|Discordbot|Googlebot|Bingbot|DuckDuckBot|AhrefsBot|SemrushBot|MJ12bot|curl|python-requests|Scrapy/i;
const ASSET_EXT =
  /\.(js|css|png|jpe?g|gif|svg|ico|webp|woff2?|ttf|otf|eot|mp3|wav|ogg|mp4|webm|pdf|json|xml|txt|map|wasm)$/i;

function buildMetaTags(meta) {
  return [
    `<title>${meta.title}</title>`,
    `<meta name="description" content="${meta.description}" />`,
    `<link rel="canonical" href="${meta.url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${meta.siteName}" />`,
    `<meta property="og:title" content="${meta.title}" />`,
    `<meta property="og:description" content="${meta.description}" />`,
    `<meta property="og:image" content="${meta.image}" />`,
    `<meta property="og:image:secure_url" content="${meta.image}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="${meta.imageW}" />`,
    `<meta property="og:image:height" content="${meta.imageH}" />`,
    `<meta property="og:url" content="${meta.url}" />`,
    `<meta property="og:locale" content="id_ID" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${meta.title}" />`,
    `<meta name="twitter:description" content="${meta.description}" />`,
    `<meta name="twitter:image" content="${meta.image}" />`,
  ].join("\n    ");
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Pass through static asset requests immediately
  if (ASSET_EXT.test(url.pathname)) {
    return next();
  }

  const ua = request.headers.get("user-agent") || "";
  const isBot = BOT_PATTERN.test(ua);

  // Regular user → serve normally (zero overhead)
  if (!isBot) {
    return next();
  }

  // Determine route meta
  const path = decodeURIComponent(url.pathname);
  const route =
    Object.values(ROUTES).find(
      (r) => r !== ROUTES.portfolio && r.match(path),
    ) || ROUTES.portfolio;

  // Fetch the index.html from Pages assets
  let htmlRes;
  try {
    htmlRes = await env.ASSETS.fetch(
      new Request(url.origin + "/index.html", { method: "GET" }),
    );
  } catch {
    return next();
  }
  if (!htmlRes.ok) return next();

  // Strip existing duplicate tags, inject correct ones
  let html = await htmlRes.text();
  html = html
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace("</head>", `    ${buildMetaTags(route)}\n  </head>`);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      Vary: "User-Agent",
    },
  });
}
