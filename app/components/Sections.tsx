import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {NewsForm, ProductCard, Sky, StripeEdit} from '~/components/Site';
import {CATEGORIES, PRODUCTS} from '~/lib/catalog';
import {parasol, stripeArt} from '~/lib/art';
import {EASE, reducedMotion, registerMotion} from '~/lib/motion';

const afterFonts = (fn: () => void) => {
  let live = true;
  document.fonts.ready.then(() => live && fn());
  return () => (live = false);
};

/* ============ 01 HERO: the red ground, the sky seen through the lobster, the name beside it ============ */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    registerMotion();
    const el = root.current;
    if (!el || reducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const stop = afterFonts(() => {
      ctx = gsap.context(() => {
        const word = SplitText.create('.hero-word', {type: 'chars', mask: 'chars'});
        gsap
          .timeline({delay: 0.1})
          .from('.hero-art.d .hero-mark', {scale: 1.18, rotate: -4, svgOrigin: '1000 380', duration: 1.8, ease: EASE.arrive}, 0)
          .from('.hero-art.m .hero-mark', {scale: 1.18, rotate: -4, svgOrigin: '240 356', duration: 1.8, ease: EASE.arrive}, 0)
          .from('.hero-skyimg', {y: 90, duration: 2.2, ease: EASE.arrive}, 0)
          .from(word.chars, {yPercent: 110, duration: 1.1, ease: EASE.arrive, stagger: 0.045}, 0.25)
          .from('.hero-foot > *', {y: 18, opacity: 0, duration: 0.9, ease: EASE.arrive, stagger: 0.08}, 0.35);
        // scroll away: the lobster lifts slower than the page, the name faster
        gsap.to('.hero-art', {yPercent: 14, ease: 'none', scrollTrigger: {trigger: el, start: 'top top', end: 'bottom top', scrub: true}});
        gsap.to('.hero-word', {yPercent: -60, ease: 'none', scrollTrigger: {trigger: el, start: 'top top', end: 'bottom top', scrub: true}});
      }, el);
    });
    return () => {
      stop();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={root} className="hero">
      <svg className="hero-art d" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <mask id="hero-m">
            <rect width="1600" height="900" fill="#000" />
            <use className="hero-mark" href="#mark" x="263" y="-70" width="1474" height="874" style={{color: '#fff'}} />
          </mask>
        </defs>
        <g mask="url(#hero-m)">
          <image className="hero-skyimg" href="/sky/hero-wide.webp" x="0" y="-60" width="1600" height="1020" preserveAspectRatio="xMidYMid slice" />
        </g>
      </svg>
      <svg className="hero-art m" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <mask id="hero-mm">
            <rect width="390" height="844" fill="#000" />
            <use className="hero-mark" href="#mark" x="-40" y="190" width="560" height="332" style={{color: '#fff'}} />
          </mask>
        </defs>
        <g mask="url(#hero-mm)">
          <image className="hero-skyimg" href="/sky/web1-tall.webp" x="0" y="-40" width="390" height="924" preserveAspectRatio="xMidYMid slice" />
        </g>
      </svg>
      <h1 className="hero-word wm">THERMIDOR</h1>
      <div className="hero-foot">
        <span className="hero-cap">Chapter 1 &middot; Arri&egrave;re-saison &middot; Out now</span>
        <div className="hero-pills">
          <Link to="/collections/men" className="pill glass">Shop Men</Link>
          <Link to="/collections/women" className="pill glass">Shop Women</Link>
        </div>
      </div>
    </section>
  );
}

/* ============ 02 THE HOUSE: told once, quietly; the sky dissolves in from the corner ============ */
export function Manifesto({kicker = false}: {kicker?: boolean}) {
  return (
    <section className="mani-s">
      <div className="mani-bleed" data-parallax="-10">
        <img src="/sky/bleed-wide.webp" alt="" decoding="async" />
      </div>
      <div className="mani">
        {kicker && <span className="kick" data-reveal="up">The house</span>}
        <p data-reveal="lines">
          Riviera sportswear for long lunches, short sleeves and making things for no reason. Club cuts from the 1960s, worn boxier and a little&nbsp;louder.
        </p>
        <p className="red" data-reveal="lines" data-delay="0.15">
          Everyone&rsquo;s&nbsp;invited.
        </p>
      </div>
    </section>
  );
}

/* ============ W3 on the home page: the drop, with the stripe breaking the grid ============ */
/* ============ reassurance at the moment of hesitation: right under the products ============ */
export function TrustStrip() {
  return (
    <ul className="trust" data-reveal="stagger">
      <li><b>Free EU shipping</b> over &euro;150</li>
      <li><b>30-day returns</b>, collected from your door</li>
      <li><b>Made in Portugal</b> &amp; Italy</li>
      <li><b>Boxy fit</b>, take your usual size</li>
    </ul>
  );
}

export function FirstDrop() {
  const [polo, henley, hoodie] = PRODUCTS;
  return (
    <section className="drop">
      <div className="drop-h">
        <h2 data-reveal="lines">
          Arri&egrave;re-saison<sup>04</sup>
        </h2>
        <Link to="/collections/all" className="pill solid drop-cta" data-reveal="up">
          Shop all 04
        </Link>
      </div>
      <div className="pgrid" data-reveal="stagger">
        <ProductCard product={polo} />
        <ProductCard product={henley} />
        <StripeEdit id="home-ed" />
        <ProductCard product={hoodie} />
      </div>
    </section>
  );
}

/* ============ W4: a pinned list; the ground changes under it as you scroll through ============ */
export function CategoryScroller() {
  const root = useRef<HTMLElement>(null);
  const [on, setOn] = useState(0);
  const n = CATEGORIES.length;
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.handle, PRODUCTS.filter((p) => p.category === c.handle).length]));

  useEffect(() => {
    registerMotion();
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => `+=${innerHeight * 0.45 * n}`,
        pin: true,
        onUpdate: (s) => {
          setOn(Math.min(n - 1, Math.floor(s.progress * n)));
          el.style.setProperty('--p', s.progress.toFixed(4));
        },
      });
    }, el);
    return () => ctx.revert();
  }, [n]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>('.cs-bg').forEach((b, i) =>
      gsap.to(b, {opacity: i === on ? 1 : 0, scale: i === on ? 1 : 1.06, duration: reducedMotion() ? 0 : 0.9, ease: EASE.glide, overwrite: true}),
    );
  }, [on]);

  return (
    <section ref={root} className="cs" data-on={on}>
      <div className="cs-bg" style={{opacity: 1}}><Sky name="web4" /></div>
      <div className="cs-bg"><Sky name="web1" /></div>
      <div className="cs-bg"><Sky name="hero" /></div>
      <div className="cs-bg cs-stripe">
        <div dangerouslySetInnerHTML={{__html: stripeArt({W: 1600, H: 900, id: 'cs-st', band: 190, drop: 0.52, angle: -7, fringeLen: 60, fringeStep: 3.6, fringeW: 2.6})}} />
      </div>
      <ul className="cs-list">
        {CATEGORIES.map((c, i) => (
          <li key={c.handle} className={i === on ? 'on' : ''}>
            <Link to={`/collections/${c.handle}`}>
              {c.title}
              <sup>{String(counts[c.handle]).padStart(2, '0')}</sup>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/collections/all" className="pill solid cs-pill">
        Shop all
      </Link>
      <div className="rail" aria-hidden="true">
        <span>{on + 1}</span>
        <i>
          <b />
        </i>
        <span>{n}</span>
      </div>
    </section>
  );
}

/* ============ W6: the invitation. A parasol overhead, the sky dissolving into the page ============ */
export function ClubInvite({as = 'section'}: {as?: 'section' | 'div'}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    registerMotion();
    const el = root.current;
    if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      // the parasol opens down over you as you arrive, then keeps a slow sea-breeze sway
      gsap.fromTo('.club-psol', {yPercent: -22}, {yPercent: 0, ease: 'none', scrollTrigger: {trigger: el, start: 'top bottom', end: 'top 10%', scrub: true}});
      gsap.to('.sway.d', {rotation: 0.7, svgOrigin: '680 -1030', duration: 4.6, ease: 'sine.inOut', yoyo: true, repeat: -1});
      gsap.to('.sway.m', {rotation: 1.1, svgOrigin: '330 -640', duration: 4.6, ease: 'sine.inOut', yoyo: true, repeat: -1});
    }, el);
    return () => ctx.revert();
  }, []);
  const Tag = as as 'section';
  return (
    <Tag ref={root} className="club">
      <Sky name="slot" className="club-sky" />
      <div className="club-psol">
        <svg
          className="d"
          viewBox="0 0 1280 720"
          preserveAspectRatio="xMidYMin slice"
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html: `<g class="sway d">${parasol({ax: 680, ay: -1030, rx: 1830, ry: 1290, rot: -6, U: 2.6, fr: 28, frStep: 2.3, frW: 1.7, poleW: 16, H: 720, id: 'cl'})}</g>`,
          }}
        />
        <svg
          className="m"
          viewBox="0 0 390 844"
          preserveAspectRatio="xMidYMin slice"
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html: `<g class="sway m">${parasol({ax: 330, ay: -640, rx: 900, ry: 930, rot: -6, U: 3.6, fr: 22, frStep: 2.2, frW: 1.6, poleW: 12, H: 844, id: 'clm'})}</g>`,
          }}
        />
      </div>
      <div className="club-body">
        <h2 data-reveal="lines">
          See you
          <br />
          at the club.
        </h2>
        <p data-reveal="up">First look at every drop, and a seat at the long lunch. Bring something you&nbsp;made.</p>
        <div data-reveal="up" data-delay="0.1">
          <NewsForm source="home-club" />
        </div>
      </div>
    </Tag>
  );
}
