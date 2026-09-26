import {seo} from '~/lib/site';
import type {Route} from './+types/cart';
import {BagLines, Checkout} from '~/components/Site';
import {useBag} from '~/lib/bag';

export const meta: Route.MetaFunction = () => [...seo({title: 'Bag', path: '/cart'}), {name: 'robots', content: 'noindex'}];

/* the bag as a page (m2): the drawer's contents, for links and small screens */
export default function Cart() {
  const bag = useBag();
  return (
    <section className="bagp">
      <h1 data-reveal="up">
        Bag<sup>{String(bag.count).padStart(2, '0')}</sup>
      </h1>
      <BagLines />
      <Checkout />
    </section>
  );
}
