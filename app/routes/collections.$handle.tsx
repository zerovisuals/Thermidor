import {useState} from 'react';
import {NavLink, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {ClubFrame, ProductCard, StripeEdit} from '~/components/Site';
import {CATEGORIES, PRODUCTS, resolveCollection} from '~/lib/catalog';
import {seo} from '~/lib/site';

export async function loader({params}: Route.LoaderArgs) {
  const c = resolveCollection(params.handle ?? '');
  if (!c) throw new Response('Not found', {status: 404});
  return {handle: c.handle, title: c.title, kicker: c.kicker};
}
export const meta: Route.MetaFunction = ({data, params}) =>
  seo({
    title: data?.title ?? 'Shop',
    path: `/collections/${params.handle}`,
    description: `${data?.title ?? 'Arrière-saison'}: Riviera sportswear from Thermidor. Polos, henleys, hoodies and the Cabana Belt.`,
  });

export default function Collection() {
  const {handle, title} = useLoaderData<typeof loader>();
  const c = resolveCollection(handle)!;
  const items = PRODUCTS.filter(c.filter);
  const [dense, setDense] = useState(4);
  const [sort, setSort] = useState<'new' | 'low' | 'high'>('new');
  const sorted = [...items].sort((a, b) => (sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0));
  const withEdit = items.length > 2;
  const cards = sorted.map((p) => <ProductCard key={p.handle} product={p} />);
  if (withEdit) cards.splice(2, 0, <StripeEdit key="ed" id={`ed-${handle}`} />);
  // never leave an orphan row: the invitation takes whatever the last row has left
  const left = (dense - (cards.length % dense)) % dense;
  if (left) cards.push(<ClubFrame key="club" span={left} id={`cf-${handle}-${dense}`} />);

  return (
    <section className="shop">
      <nav className="chips" aria-label="Categories">
        <NavLink to="/collections/all" className={({isActive}) => (isActive || ['men', 'women'].includes(handle) ? 'on' : '')}>
          All<sup>{String(PRODUCTS.length).padStart(2, '0')}</sup>
        </NavLink>
        {CATEGORIES.map((k) => (
          <NavLink key={k.handle} to={`/collections/${k.handle}`} className={({isActive}) => (isActive ? 'on' : '')}>
            {k.title}
          </NavLink>
        ))}
      </nav>
      <div className="shop-title">
        <h1 data-reveal="lines">
          {title}
          <sup>{String(items.length).padStart(2, '0')}</sup>
        </h1>
        <div className="shop-tools" data-reveal="up">
          <label className="sort">
            <span>Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
              <option value="new">New in</option>
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
            </select>
          </label>
          <span className="dens" role="group" aria-label="Grid density">
            {[2, 4].map((d) => (
              <button key={d} type="button" className={dense === d ? 'on' : ''} aria-pressed={dense === d} onClick={() => setDense(d)}>
                {d}
              </button>
            ))}
          </span>
        </div>
      </div>
      <div className={`pgrid d${dense}`} data-reveal="stagger">
        {cards}
      </div>
    </section>
  );
}
