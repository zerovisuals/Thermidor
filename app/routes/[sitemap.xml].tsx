import type {Route} from './+types/[sitemap.xml]';
import {CATEGORIES, PRODUCTS} from '~/lib/catalog';

// Built from the local catalog for now; swap for Hydrogen's getSitemapIndex once Shopify holds the products.
const PAGES = [
  '/',
  '/collections',
  '/collections/all',
  '/collections/men',
  '/collections/women',
  '/pages/the-house',
  '/pages/the-club',
  '/pages/journal',
  '/pages/contact',
  '/pages/shipping',
  '/pages/returns',
  '/pages/size-guide',
  '/pages/privacy',
  '/pages/legal',
];

export function loader({request}: Route.LoaderArgs) {
  const origin = new URL(request.url).origin;
  const urls = [...PAGES, ...CATEGORIES.map((c) => `/collections/${c.handle}`), ...PRODUCTS.map((p) => `/products/${p.handle}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${origin}${u}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, {headers: {'Content-Type': 'application/xml', 'Cache-Control': `max-age=${60 * 60 * 24}`}});
}
