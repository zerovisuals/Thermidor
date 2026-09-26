import type {Route} from './+types/_index';
import {SITE, seo} from '~/lib/site';
import {CategoryScroller, ClubInvite, FirstDrop, Hero, Manifesto} from '~/components/Sections';

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
      <Hero />
      <Manifesto />
      <FirstDrop />
      <CategoryScroller />
      <ClubInvite />
    </>
  );
}
