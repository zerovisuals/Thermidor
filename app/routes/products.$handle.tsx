import {useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {Pimg, Swatch} from '~/components/Site';
import {PRODUCTS, euro, getProduct} from '~/lib/catalog';
import {useBag} from '~/lib/bag';
import {SITE, seo} from '~/lib/site';

export async function loader({params}: Route.LoaderArgs) {
  const p = getProduct(params.handle ?? '');
  if (!p) throw new Response('Not found', {status: 404});
  return {handle: p.handle};
}
export const meta: Route.MetaFunction = ({data}) => {
  const p = data && getProduct(data.handle);
  if (!p) return seo({title: 'Product'});
  return [
    ...seo({title: p.title, description: p.description, path: `/products/${p.handle}`, type: 'product'}),
    {property: 'product:price:amount', content: String(p.price)},
    {property: 'product:price:currency', content: 'EUR'},
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.title,
        description: p.description,
        brand: {'@type': 'Brand', name: SITE.name},
        material: p.material,
        color: p.colours.map((c) => c.name).join(', '),
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'EUR',
          url: `${SITE.url}/products/${p.handle}`,
          availability: 'https://schema.org/PreOrder',
        },
      },
    },
  ];
};

/* W5: the gallery on the left, a narrow buying column on the right; reassurance where the hesitation is */
export default function ProductPage() {
  const {handle} = useLoaderData<typeof loader>();
  const p = getProduct(handle)!;
  const bag = useBag();
  const [colour, setColour] = useState(p.colours[0].name);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [nudge, setNudge] = useState(false);
  const [openAcc, setOpenAcc] = useState<number | null>(null);
  const look = PRODUCTS.filter((x) => x.handle !== p.handle).slice(0, 3);

  const add = () => {
    if (!size) {
      setNudge(true);
      return;
    }
    bag.add({handle: p.handle, colour, size});
  };

  const acc = [
    {t: 'Details & composition', b: <ul>{p.details.map((d) => <li key={d}>{d}</li>)}</ul>},
    {t: 'Shipping & returns', b: <p>Free shipping in the EU over €150. Returns within 30 days, collected from your door.</p>},
    {t: 'Care', b: <p>Wash cool, inside out. Dry in the sun. The colours are meant to fade the way a beach club does.</p>},
  ];

  return (
    <section className="pdp" key={p.handle}>
      <div className="pdp-gal">
        {p.shots.map((_, i) => (
          <div className="pdp-shot" key={i} data-reveal="clip" data-delay={String(i * 0.08)}>
            <Pimg product={{...p, colours: [p.colours.find((c) => c.name === colour) ?? p.colours[0]]}} shot={i} />
          </div>
        ))}
        <i className="pdp-dots" aria-hidden="true">
          {p.shots.map((_, i) => <b key={i} />)}
        </i>
      </div>
      <aside className="pdp-buy">
        <div className="pdp-stick">
          {p.isNew && <span className="kick" data-reveal="up">New in</span>}
          <div className="pdp-t">
            <h1 data-reveal="lines">{p.title}</h1>
            <div className="pdp-price" data-reveal="up">{euro(p.price)}</div>
          </div>
          <div data-reveal="stagger" className="pdp-form">
            <div>
              <div className="pdp-lab">
                <span>Colour</span>
                <b>{colour}</b>
              </div>
              <div className="pdp-sw" role="radiogroup" aria-label="Colour">
                {p.colours.map((c) => (
                  <button key={c.name} type="button" role="radio" aria-checked={colour === c.name} aria-label={c.name} onClick={() => setColour(c.name)}>
                    <Swatch c={c} on={colour === c.name} size={26} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="pdp-lab">
                <span>Size</span>
                <Link to="/pages/size-guide" className="u">Size guide</Link>
              </div>
              <div className={`pdp-sizes ${nudge && !size ? 'nudge' : ''}`} role="radiogroup" aria-label="Size" data-n={p.sizes.length}>
                {p.sizes.map((s) => {
                  const out = p.soldOut?.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={size === s}
                      disabled={out}
                      className={`${size === s ? 'on' : ''} ${out ? 'out' : ''}`}
                      onClick={() => {
                        setSize(s);
                        setNudge(false);
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {nudge && !size && <p className="pdp-nudge" role="alert">Pick a size first.</p>}
            </div>
            <div className="pdp-buybar">
              <button type="button" className="btn-ink" onClick={add}>
                {size ? 'Add to bag' : 'Select a size'}
              </button>
            </div>
            <p className="pdp-note">{p.fit}</p>
            <p className="pdp-desc">{p.description}</p>
            <div className="pdp-acc">
              {acc.map((a, i) => (
                <div key={a.t} className={openAcc === i ? 'open' : ''}>
                  <button type="button" aria-expanded={openAcc === i} onClick={() => setOpenAcc(openAcc === i ? null : i)}>
                    {a.t}
                  </button>
                  <div className="pdp-acc-b">
                    <div>{a.b}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pdp-look">
              <span className="kick">Complete the look</span>
              <div>
                {look.map((x) => (
                  <Link key={x.handle} to={`/products/${x.handle}`} aria-label={x.title}>
                    <Pimg product={x} label={false} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
