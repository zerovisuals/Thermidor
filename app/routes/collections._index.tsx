import type {Route} from './+types/collections._index';
import {seo} from '~/lib/site';
import {CategoryScroller} from '~/components/Sections';

export const meta: Route.MetaFunction = () => seo({title: 'Collections', path: '/collections'});
export const handle = {header: 'dark'};

export default function Collections() {
  return <CategoryScroller />;
}
