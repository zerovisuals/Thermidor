import type {Route} from './+types/_index';
import {SITE, seo} from '~/lib/site';
import {CategoryScroller, ClubInvite, FirstDrop, Hero, Manifesto, TrustStrip} from '~/components/Sections';

export const meta: Route.MetaFunction = () => [
  ...seo(),
  {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/og/mark-512.png`,
      email: SITE.email,
      sameAs: Object.values(SITE.social),
    },
  },
];
export const handle = {header: 'onred', club: true};

export default function Home() {
  return (
    <>
      {/* sell first: the drop within one scroll, reassurance under it, the brand after */}
      <Hero />
      <FirstDrop />
      <TrustStrip />
      <CategoryScroller />
      <Manifesto />
      <ClubInvite />
    </>
  );
}
