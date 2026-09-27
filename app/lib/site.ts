// One place for the things that describe the site to the outside world.
export const SITE = {
  name: 'Thermidor',
  url: 'https://thermidor.club',
  tagline: 'Riviera sportswear',
  description:
    'Riviera sportswear for long lunches, short sleeves and making things for no reason.',
  email: 'hello@thermidor.club',
  social: {
    instagram: 'https://instagram.com/thermidorclub',
    tiktok: 'https://tiktok.com/@thermidorclub',
    x: 'https://x.com/thermidorclub',
  },
  /** Footer credit: fill in to sign the site, e.g. {name: 'Your Name', url: 'https://yourportfolio.com'}. */
  credit: {name: 'Hypha', url: 'https://hypha.studio'} as null | {name: string; url: string},
};

type Seo = {title?: string; description?: string; path?: string; image?: string; type?: string};

/** Title, description, canonical and share cards for a route's meta export. */
export function seo({title, description = SITE.description, path = '/', image = '/og/og-default.jpg', type = 'website'}: Seo = {}) {
  const full = title ? `${title} · ${SITE.name}` : SITE.name;
  const url = SITE.url + path;
  const img = image.startsWith('http') ? image : SITE.url + image;
  return [
    {title: full},
    {name: 'description', content: description},
    {tagName: 'link', rel: 'canonical', href: url},
    {property: 'og:site_name', content: SITE.name},
    {property: 'og:type', content: type},
    {property: 'og:title', content: full},
    {property: 'og:description', content: description},
    {property: 'og:url', content: url},
    {property: 'og:image', content: img},
    {property: 'og:image:width', content: '1200'},
    {property: 'og:image:height', content: '630'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: '@thermidorclub'},
    {name: 'twitter:title', content: full},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: img},
  ];
}
