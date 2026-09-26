import {useEffect, useRef, useState} from 'react';
import {Link, useFetcher} from 'react-router';
import gsap from 'gsap';
import {PRODUCTS, euro, getProduct, type Product} from '~/lib/catalog';
import {useBag} from '~/lib/bag';
import {SITE} from '~/lib/site';
import {parasol, stripeArt} from '~/lib/art';

/* ---------- sky: a rendered shader frame + live grain on top ---------- */
type SkyName = 'hero' | 'web1' | 'web4' | 'slot' | 'bleed';
const TALL: Partial<Record<SkyName, string>> = {hero: 'hero', web1: 'web1', web4: 'web4', slot: 'slot'};

export function Sky({name, className = '', grain = true, eager = false}: {name: SkyName; className?: string; grain?: boolean; eager?: boolean}) {
  const tall = TALL[name];
  return (
    <div className={`sky ${className}`} aria-hidden="true">
      <picture>
        {tall && <source media="(max-width: 767px)" srcSet={`/sky/${tall}-tall.webp`} />}
        <img src={`/sky/${name}-wide.webp`} alt="" decoding="async" loading={eager ? 'eager' : 'lazy'} />
      </picture>
      {grain && <i className="grain" />}
    </div>
  );
}

/* ---------- product photo placeholder: a studio sweep waiting for its shoot ---------- */
export function Pimg({product, shot = 0, className = '', label = true}: {product: Product; shot?: number; className?: string; label?: boolean}) {
  if (product.category === 'belts')
    return (
      <div className={`pimg belt-ph ${className}`}>
        <i className="belt-band" />
        {label && <span className="pimg-lab">Photo &middot; {product.title}, {product.shots[shot % product.shots.length]}</span>}
      </div>
    );
  return (
    <div className={`pimg ${className}`}>
      {label && (
        <span className="pimg-lab">
          Photo &middot; {product.title}, {product.colours[0].name.toLowerCase()}, {product.shots[shot % product.shots.length]}
        </span>
      )}
    </div>
  );
}

export function Swatch({c, on, size = 10}: {c: {hex: string; name: string}; on?: boolean; size?: number}) {
  return (
    <i
      className={`sw ${on ? 'on' : ''} ${c.hex === 'stripe' ? 'sw-stripe' : ''}`}
      style={{width: size, height: size, background: c.hex === 'stripe' ? undefined : c.hex}}
      title={c.name}
    />
  );
}

/* ---------- product card (w3) ---------- */
export function ProductCard({product}: {product: Product}) {
  const bag = useBag();
  return (
    <article className="pc">
      <Link to={`/products/${product.handle}`} className="pc-link" prefetch="intent">
        <div className="pc-img">
          <Pimg product={product} />
          <Pimg product={product} shot={1} className="pc-alt" />
          {product.isNew && <i className="badge-new">New in</i>}
        </div>
        <div className="pc-row">
          <span>{product.title}</span>
          <span>{euro(product.price)}</span>
        </div>
        <div className="pc-sw">
          {product.colours.map((c) => (
            <Swatch key={c.name} c={c} />
          ))}
          <span>{product.material}</span>
        </div>
      </Link>
      {/* quick add sits over the photo, outside the link (no button inside an anchor) */}
      <div className="pc-plus">
        <button
          type="button"
          className="plus"
          aria-label={`Add ${product.title} to bag`}
          onClick={() => bag.add({handle: product.handle, colour: product.colours[0].name, size: product.sizes.includes('M') ? 'M' : product.sizes[0]})}
        >
          +
        </button>
      </div>
    </article>
  );
}

/* ---------- the editorial frame that breaks the grid: the stripe, fringed ---------- */
export function StripeEdit({id, to = '/products/cabana-belt', caption = true}: {id: string; to?: string; caption?: boolean}) {
  return (
    <article className="pc ed">
      <Link to={to} className="pc-link" aria-label="The stripe, fringed. Shop the edit">
        <div className="pc-img ed-img">
          <Sky name="web4" />
          <div className="ed-stripe" dangerouslySetInnerHTML={{__html: stripeArt({W: 600, H: 800, id, band: 84, drop: 0.5, fringeLen: 34, fringeStep: 2.6, fringeW: 1.8})}} />
          {caption && (
            <span className="ed-cap">
              The stripe, fringed.
              <br />
              <u>Shop the edit</u>
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}

/* ---------- fills the last row of a grid: the invitation, under a parasol ---------- */
export function ClubFrame({span, id}: {span: number; id: string}) {
  return (
    <article className="pc club-frame" style={{gridColumn: `span ${span}`}}>
      <Link to="/pages/the-club" className="pc-link" aria-label="See you at the club. Join the club">
        <div className="cf-img">
          <Sky name="web1" />
          <svg
            viewBox="0 0 1280 720"
            preserveAspectRatio="xMidYMin slice"
            aria-hidden="true"
            dangerouslySetInnerHTML={{__html: parasol({ax: 900, ay: -1030, rx: 1830, ry: 1290, rot: -6, U: 2.6, fr: 28, frStep: 2.3, frW: 1.7, poleW: 16, H: 720, id})}}
          />
          <span className="cf-cap">
            See you at the club.
            <br />
            <u>Join the club</u>
          </span>
        </div>
      </Link>
    </article>
  );
}

/* ---------- newsletter: one tap to say what you're here for, then the email ---------- */
export function NewsForm({variant = 'pill', cta = 'Join the club', source = 'club'}: {variant?: 'pill' | 'footer'; cta?: string; source?: string}) {
  const fetcher = useFetcher<{ok: boolean; error?: string}>();
  const [seg, setSeg] = useState<string | null>(null);
  const busy = fetcher.state !== 'idle';
  const res = fetcher.data;
  if (res?.ok)
    return (
      <p className={`news-done ${variant}`} role="status">
        You&rsquo;re on the list. See you at the club.
      </p>
    );
  const shared = (
    <>
      <input type="hidden" name="source" value={source} />
      {seg && <input type="hidden" name="segment" value={seg} />}
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
    </>
  );
  const error = res && !res.ok ? <p className="news-err" role="alert">{res.error}</p> : null;
  const id = `news-${source}`;
  if (variant === 'footer')
    return (
      <fetcher.Form method="post" action="/api/subscribe" className="news-foot">
        {shared}
        <div className="news-opts" role="radiogroup" aria-label="What are you here for?">
          {['Men', 'Women', 'Both'].map((s) => (
            <button key={s} type="button" role="radio" aria-checked={seg === s} className={seg === s ? 'on' : ''} onClick={() => setSeg(s)}>
              {s}
            </button>
          ))}
        </div>
        <div className={`news-reveal ${seg ? 'open' : ''}`}>
          <div className="news-pill">
            <label className="sr-only" htmlFor={id}>Email address</label>
            <input id={id} name="email" type="email" placeholder="Email address" autoComplete="email" required tabIndex={seg ? 0 : -1} />
            <button type="submit" tabIndex={seg ? 0 : -1} disabled={busy}>{busy ? 'Joining…' : 'Join'}</button>
          </div>
        </div>
        {error}
      </fetcher.Form>
    );
  return (
    <fetcher.Form method="post" action="/api/subscribe">
      {shared}
      <div className="news-pill big">
        <label className="sr-only" htmlFor={id}>Email address</label>
        <input id={id} name="email" type="email" placeholder="Email address" autoComplete="email" required />
        <button type="submit" disabled={busy}>{busy ? 'Joining…' : cta}</button>
      </div>
      {error}
      <p className="news-legal">
        No spam, unsubscribe any time. <Link to="/pages/privacy" className="u">Privacy</Link>
      </p>
    </fetcher.Form>
  );
}

/* ---------- footer (w8) ---------- */
export function SiteFooter({news = true}: {news?: boolean}) {
  return (
    <footer className="ft">
      {news && (
      <section className="ft-news">
        <span className="kick" data-reveal="up">Newsletter</span>
        <h2 data-reveal="lines">Join the club.</h2>
        <p data-reveal="up">New drops first. What are you here&nbsp;for?</p>
        <NewsForm variant="footer" source="footer" />
      </section>
      )}
      <div className="ft-cols" data-reveal="stagger">
        <div>
          <h3>Help<sup>3</sup></h3>
          <Link to="/pages/contact">Contact</Link>
          <Link to="/pages/shipping">Shipping</Link>
          <Link to="/pages/returns">Returns</Link>
        </div>
        <div>
          <h3>Shop<sup>4</sup></h3>
          <Link to="/collections/polos">Polos</Link>
          <Link to="/collections/henleys">Henleys</Link>
          <Link to="/collections/hoodies">Hoodies</Link>
          <Link to="/collections/belts">Belts</Link>
        </div>
        <div>
          <h3>House<sup>3</sup></h3>
          <Link to="/pages/the-house">About</Link>
          <Link to="/pages/the-club">The Club</Link>
          <Link to="/pages/legal">Legal</Link>
        </div>
        <div>
          <h3>Social<sup>3</sup></h3>
          <a href="https://instagram.com/thermidorclub">Instagram</a>
          <a href="https://tiktok.com/@thermidorclub">TikTok</a>
          <a href="https://x.com/thermidorclub">X &middot; @thermidorclub</a>
        </div>
      </div>
      <div className="ft-sign" aria-hidden="true" data-parallax="-12">
        THERMIDOR
      </div>
      <div className="ft-base">
        <span>&copy; 2026 Thermidor</span>
        <Link to="/pages/privacy">Privacy</Link>
        {SITE.credit ? (
          <a href={SITE.credit.url}>Designed &amp; built by {SITE.credit.name}</a>
        ) : (
          <span>Riviera sportswear</span>
        )}
      </div>
    </footer>
  );
}

/* ---------- bag (w7): a drawer over whatever you were looking at ---------- */
export function BagLines({compact = false}: {compact?: boolean}) {
  const bag = useBag();
  if (!bag.lines.length)
    return (
      <div className="bag-empty">
        <p>Your bag is empty.</p>
        <Link to="/collections/all" className="u" onClick={bag.close}>
          Shop the first drop
        </Link>
      </div>
    );
  return (
    <ul className={`bag-lines ${compact ? 'compact' : ''}`}>
      {bag.lines.map((l, i) => {
        const p = getProduct(l.handle)!;
        return (
          <li className="dr-item" key={`${l.handle}-${l.colour}-${l.size}`}>
            <Link to={`/products/${p.handle}`} onClick={bag.close} className="dr-thumb">
              <Pimg product={p} label={false} />
            </Link>
            <div>
              <b>{p.title}</b>
              <span>
                {l.colour} &middot; {l.size}
              </span>
              <span className="qty">
                <button type="button" aria-label="One fewer" onClick={() => bag.setQty(i, l.qty - 1)}>&minus;</button>
                <output aria-live="polite">{l.qty}</output>
                <button type="button" aria-label="One more" onClick={() => bag.setQty(i, l.qty + 1)}>+</button>
              </span>
            </div>
            <em>{euro(p.price * l.qty)}</em>
          </li>
        );
      })}
    </ul>
  );
}

export function Checkout() {
  const bag = useBag();
  const [note, setNote] = useState(false);
  return (
    <div className="dr-foot">
      <div className="dr-sum">
        <span>Subtotal</span>
        <b>{euro(bag.subtotal)}</b>
      </div>
      <span className="dr-ship">Shipping calculated at checkout</span>
      <button type="button" className="btn-ink" disabled={!bag.lines.length} onClick={() => setNote(true)}>
        Checkout
      </button>
      {note && (
        <p className="dr-note" role="status">
          Checkout opens with the first drop.{' '}
          <Link to="/pages/the-club" onClick={bag.close} className="u">
            Join the club
          </Link>{' '}
          to hear first.
        </p>
      )}
    </div>
  );
}

export function BagDrawer() {
  const bag = useBag();
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (first.current && !bag.isOpen) return;
    first.current = false;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const q = gsap.utils.selector(el);
    gsap.killTweensOf([el, q('.drawer'), q('.scrim')]);
    if (bag.isOpen) {
      gsap.set(el, {visibility: 'visible'});
      document.documentElement.classList.add('menu-lock');
      gsap.fromTo(q('.scrim'), {opacity: 0}, {opacity: 1, duration: reduced ? 0.01 : 0.5, ease: 'power2.out'});
      gsap.fromTo(q('.drawer'), {xPercent: reduced ? 0 : 100}, {xPercent: 0, duration: reduced ? 0.01 : 0.8, ease: 'expo.out'});
      gsap.fromTo(q('.drawer > *'), {opacity: 0, x: reduced ? 0 : 30}, {opacity: 1, x: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05, delay: 0.08});
      q<HTMLElement>('.dr-close')[0]?.focus({preventScroll: true});
      const esc = (e: KeyboardEvent) => e.key === 'Escape' && bag.close();
      addEventListener('keydown', esc);
      return () => removeEventListener('keydown', esc);
    }
    gsap.to(q('.scrim'), {opacity: 0, duration: reduced ? 0.01 : 0.4, ease: 'power2.in'});
    gsap.to(q('.drawer'), {
      xPercent: reduced ? 0 : 100,
      duration: reduced ? 0.01 : 0.45,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(el, {visibility: 'hidden'});
        document.documentElement.classList.remove('menu-lock');
      },
    });
  }, [bag.isOpen]);

  const pair = PRODUCTS.find((p) => !bag.lines.some((l) => l.handle === p.handle));
  return (
    <div ref={root} className="bagd" style={{visibility: 'hidden'}} aria-hidden={!bag.isOpen}>
      <div className="scrim" onClick={bag.close} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Bag">
        <div className="dr-h">
          <h2>
            Bag<sup>{String(bag.count).padStart(2, '0')}</sup>
          </h2>
          <button type="button" className="dr-close u" onClick={bag.close}>
            Close
          </button>
        </div>
        <div className="dr-body">
          <BagLines />
          {pair && bag.lines.length > 0 && (
            <div className="dr-pair">
              <span className="kick">Pairs well with</span>
              <div className="dr-item sm">
                <Link to={`/products/${pair.handle}`} onClick={bag.close} className="dr-thumb">
                  <Pimg product={pair} label={false} />
                </Link>
                <div>
                  <b>{pair.title}</b>
                  <span>{euro(pair.price)}</span>
                </div>
                <button
                  type="button"
                  className="plus-s"
                  aria-label={`Add ${pair.title}`}
                  onClick={() => bag.add({handle: pair.handle, colour: pair.colours[0].name, size: pair.sizes.includes('M') ? 'M' : pair.sizes[0]})}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
        <Checkout />
      </aside>
    </div>
  );
}
