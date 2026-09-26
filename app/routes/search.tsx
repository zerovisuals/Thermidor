import {useState} from 'react';
import {useSearchParams} from 'react-router';
import {seo} from '~/lib/site';
import type {Route} from './+types/search';
import {ProductCard} from '~/components/Site';
import {PRODUCTS} from '~/lib/catalog';

export const meta: Route.MetaFunction = () => [...seo({title: 'Search', path: '/search'}), {name: 'robots', content: 'noindex'}];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const term = q.trim().toLowerCase();
  const hits = term
    ? PRODUCTS.filter((p) => [p.title, p.category, p.material, ...p.colours.map((c) => c.name)].join(' ').toLowerCase().includes(term))
    : PRODUCTS;
  return (
    <section className="search">
      <h1 className="sr-only">Search</h1>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label className="sr-only" htmlFor="q">Search</label>
        <input
          id="q"
          autoFocus
          value={q}
          placeholder="Search"
          autoComplete="off"
          onChange={(e) => {
            setQ(e.target.value);
            setParams(e.target.value ? {q: e.target.value} : {}, {replace: true, preventScrollReset: true});
          }}
        />
        <span className="search-n" aria-live="polite">
          {hits.length} {hits.length === 1 ? 'piece' : 'pieces'}
        </span>
      </form>
      {hits.length ? (
        <div className="pgrid d4">
          {hits.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      ) : (
        <p className="search-none">Nothing by that name yet. Try &ldquo;polo&rdquo;, &ldquo;palm&rdquo; or &ldquo;stripe&rdquo;.</p>
      )}
    </section>
  );
}
