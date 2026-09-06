// Post-build prerender. Renders each route in PRERENDERED_ROUTES with
// react-dom/server and writes dist/<path>/index.html using dist/index.html
// as the template, so /privacy, /terms and /enterprise return their full
// text in the server-delivered HTML (no JS required). The client bundle
// then hydrates the markup (see src/main.tsx).
//
// Runs after `vite build` (client) and `vite build --ssr` (this entry):
//   npm run build
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const dist = resolve("dist");
const ssrDir = resolve("dist-ssr");
const template = readFileSync(join(dist, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: dist/index.html has no empty <div id="root"></div> to fill');
}

const { render, PRERENDERED_ROUTES, ROUTE_META, ROUTE_PATHS } = await import(
  join(ssrDir, "entry.js")
);

const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const setAttr = (html, selector, value) =>
  html.replace(selector, (m) => m.replace(/content="[^"]*"/, `content="${escapeAttr(value)}"`));

for (const route of PRERENDERED_ROUTES) {
  const path = ROUTE_PATHS[route];
  const { title, description } = ROUTE_META[route];
  const url = `https://userada.dev${path === "/" ? "/" : path}`;

  // react-dom/server hoists resource hints (e.g. <link rel="preload"
  // as="image"> for the logo) to the front of the output because the
  // rendered tree has no <head>. Leaving them inside #root breaks
  // hydration, so lift them into the document head where they belong.
  const hints = [];
  const body = render(route).replace(/^(?:<link\b[^>]*>)+/, (m) => {
    hints.push(m);
    return "";
  });

  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace("</head>", `${hints.join("")}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  for (const sel of [/<meta\s+name="description"[^>]*>/, /<meta property="og:description"[^>]*>/, /<meta name="twitter:description"[^>]*>/]) {
    html = setAttr(html, sel, description);
  }
  for (const sel of [/<meta property="og:title"[^>]*>/, /<meta name="twitter:title"[^>]*>/]) {
    html = setAttr(html, sel, title);
  }
  html = setAttr(html, /<meta property="og:url"[^>]*>/, url);

  const outFile = path === "/" ? join(dist, "index.html") : join(dist, path, "index.html");
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  console.log(`prerendered ${path} → ${outFile.replace(dist, "dist")}`);
}

rmSync(ssrDir, { recursive: true, force: true });
