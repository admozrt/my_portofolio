// Cloudflare Pages Worker — inject OG meta tags per-route for bot crawlers
const BASE_URL = "https://admoz.pages.dev";

const WEDDING_META = {
  title: "Undangan Pernikahan Ajie & Alya 💍",
  description:
    "Dengan penuh rasa syukur, kami mengundang Anda untuk hadir menyaksikan pernikahan kami. Ahad, 7 Juni 2026 · Tapin, Kalimantan Selatan",
  image: `${BASE_URL}/ajie/MAL08420.jpg`,
  url: `${BASE_URL}/ajie&alya`,
};

const PORTFOLIO_META = {
  title: "Adi Rakhmatullah Ma'arif - Pengembang Full Stack",
  description:
    "Pengembang Full Stack berpengalaman yang mengkhususkan diri dalam Laravel, React, dan teknologi web modern.",
  image: `${BASE_URL}/assets/profile-og.jpg`,
  url: BASE_URL,
};

function buildOGTags(meta) {
  return `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${meta.image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${meta.url}" />
    <meta property="og:locale" content="id_ID" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${meta.image}" />
    <meta name="description" content="${meta.description}" />
    <title>${meta.title}</title>`.trim();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname);

    // Detect bot/crawler user agents
    const ua = request.headers.get("user-agent") || "";
    const isBot =
      /facebookexternalhit|WhatsApp|Twitterbot|TelegramBot|Slackbot|LinkedInBot|Discordbot|curl|python-requests|Googlebot|bingbot/i.test(
        ua
      );

    // Only intercept HTML page requests (skip assets)
    const isPageRequest =
      !path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map|json|txt|mp3|wav)$/);

    if (isPageRequest) {
      const isWedding =
        path === "/ajie&alya" ||
        path === "/ajie%26alya" ||
        path.startsWith("/ajie&alya") ||
        path.startsWith("/ajie%26alya");

      const meta = isWedding ? WEDDING_META : PORTFOLIO_META;
      const ogTags = buildOGTags(meta);

      // Fetch the original index.html
      const indexRequest = new Request(`${url.origin}/index.html`, request);
      const response = await env.ASSETS.fetch(indexRequest);
      const html = await response.text();

      // Replace the <title> and inject OG tags before </head>
      const patched = html
        .replace(/<title>.*?<\/title>/i, "")
        .replace("</head>", `${ogTags}\n  </head>`);

      return new Response(patched, {
        status: response.status,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": isBot ? "no-store" : "public, max-age=60",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
