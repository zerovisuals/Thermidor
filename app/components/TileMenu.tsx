import {useEffect, useRef} from 'react';
import {Link} from 'react-router';
import gsap from 'gsap';
import {Lockup} from '~/components/Brand';
import {MENU_TILES, type MenuTile} from '~/lib/menu';
import {parasol, stripeArt} from '~/lib/art';

/*
 * Motion, measured from the reference (see thermidor-project memory):
 *   curtain  expo.out 0.8s, drops from the top
 *   tiles    expo.out 0.65s each, 85ms stagger, 70ms after the curtain
 *   hover    power3.inOut 0.55s width change; sub-links follow 0.1s later
 *   close    the same, reversed, at 0.6x with power2.in
 */
const T = {curtain: 0.8, tile: 0.65, stagger: 0.085, lag: 0.07, hover: 0.55, closeK: 0.6};
const GROW = 1.9;
const ZOOM = 1.08;
const DIM = 0.45;
const SPRING = 11; // natural frequency (rad/s): settles in ~0.55s, the measured hover duration
const BAR = 5.2; // half the gap between the burger's two lines
const SHUT = 'inset(0% 0% 100% 0%)';
const OPEN = 'inset(0% 0% 0% 0%)';

type Props = {open: boolean; onClose: () => void; bagCount?: number};

export function TileMenu({open, onClose, bagCount = 0}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const prevOpen = useRef(open);
  const hovered = useRef<number | null>(null);

  // open / close
  useEffect(() => {
    const el = root.current;
    // only act on a real change (this also swallows StrictMode's second mount run)
    if (!el || prevOpen.current === open) return;
    prevOpen.current = open;
    const q = gsap.utils.selector(el);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const page = document.getElementById('page');
    tl.current?.kill();

    if (open) {
      page?.setAttribute('inert', '');
      document.documentElement.classList.add('menu-lock');
      gsap.set(el, {visibility: 'visible'});
      hovered.current = null;
      q<HTMLElement>('.tm-tile').forEach((n) => (n.style.flexGrow = '1'));
      q<HTMLElement>('.tm-zoom').forEach((n) => (n.style.transform = ''));
      q<HTMLElement>('.tm-dim').forEach((n) => (n.style.opacity = '0'));
      q<HTMLElement>('.tm-copy').forEach((n) => n.removeAttribute('style'));
      gsap.set(q('.tm-sub'), {autoAlpha: 0, y: 10});
      if (reduced) {
        gsap.set([q('.tm-curtain'), q('.tm-clip')], {clipPath: OPEN});
        gsap.set([q('.tm-art'), q('.tm-label > span'), q('.tm-fade')], {clearProps: 'transform,opacity'});
        gsap.set(q('.tm-x b'), {y: 0, rotate: (j: number) => (j ? -45 : 45)});
        tl.current = gsap.timeline().fromTo(el, {opacity: 0}, {opacity: 1, duration: 0.2});
      } else {
        gsap.set(el, {opacity: 1});
        tl.current = gsap
          .timeline()
          .fromTo(q('.tm-curtain'), {clipPath: SHUT}, {clipPath: OPEN, duration: T.curtain, ease: 'expo.out'}, 0)
          .fromTo(q('.tm-clip'), {clipPath: SHUT}, {clipPath: OPEN, duration: T.tile, ease: 'expo.out', stagger: T.stagger}, T.lag)
          .fromTo(q('.tm-art'), {scale: 1.14}, {scale: 1, duration: T.tile * 1.6, ease: 'expo.out', stagger: T.stagger}, T.lag)
          .fromTo(q('.tm-label > span'), {yPercent: 105}, {yPercent: 0, duration: T.tile, ease: 'expo.out', stagger: T.stagger}, T.lag + 0.22)
          .fromTo(q('.tm-fade'), {autoAlpha: 0, y: 8}, {autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.03}, 0.28)
          .fromTo(q('.tm-x b'), {y: (j: number) => (j ? BAR : -BAR), rotate: 0}, {y: 0, rotate: (j: number) => (j ? -45 : 45), duration: 0.5, ease: 'power3.inOut'}, 0.08);
      }
      // focus the dialog itself: keyboard users Tab straight to Close, mouse users see no ring
      el.focus({preventScroll: true});
    } else {
      const done = () => {
        gsap.set(el, {visibility: 'hidden'});
        page?.removeAttribute('inert');
        document.documentElement.classList.remove('menu-lock');
        document.getElementById('menu-toggle')?.focus({preventScroll: true});
      };
      if (reduced) {
        tl.current = gsap.timeline({onComplete: done}).to(el, {opacity: 0, duration: 0.2});
      } else {
        const k = T.closeK;
        tl.current = gsap
          .timeline({onComplete: done})
          .to(q('.tm-sub'), {autoAlpha: 0, duration: 0.15, ease: 'power2.in'}, 0)
          .to(q('.tm-dim'), {opacity: 0, duration: 0.2, ease: 'power2.in'}, 0)
          .to(q('.tm-fade'), {autoAlpha: 0, duration: 0.2, ease: 'power2.in'}, 0)
          .to(q('.tm-clip'), {clipPath: SHUT, duration: T.tile * k, ease: 'power2.in', stagger: {each: T.stagger * k, from: 'end'}}, 0)
          .to(q('.tm-curtain'), {clipPath: SHUT, duration: T.curtain * k, ease: 'power2.in'}, T.stagger * k * 3)
          .to(q('.tm-x b'), {y: (j: number) => (j ? BAR : -BAR), rotate: 0, duration: 0.4, ease: 'power3.inOut'}, 0);
      }
    }
  }, [open]);

  // Escape, and keep Tab inside the dialog
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab' || !root.current) return;
      const f = [...root.current.querySelectorAll<HTMLElement>('a[href], button')].filter(
        (n) => n.offsetParent !== null && getComputedStyle(n).visibility !== 'hidden',
      );
      if (!f.length) return;
      const [a, z] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === a) (e.preventDefault(), z.focus());
      else if (!e.shiftKey && document.activeElement === z) (e.preventDefault(), a.focus());
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  /*
   * Hover layout. One spring system drives every tile at once: the hovered tile's share grows,
   * every other tile shrinks by the same amount, and the widths always sum to the row.
   * Critically damped springs (not restarted tweens) so a fast swipe just re-aims them:
   * velocity carries over, nothing snaps, nothing fights. The art inside each tile is a fixed
   * width, so a resize only moves the clip edge; nothing re-renders mid-motion.
   */
  useEffect(() => {
    const el = root.current;
    if (!open || !el || !matchMedia('(hover: hover) and (min-width: 768px)').matches) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const list = el.querySelector<HTMLElement>('.tm-tiles')!;
    const tiles = [...el.querySelectorAll<HTMLElement>('.tm-tile')].map((tile) => ({
      tile,
      zoom: tile.querySelector<HTMLElement>('.tm-zoom')!,
      dim: tile.querySelector<HTMLElement>('.tm-dim')!,
      copy: tile.querySelector<HTMLElement>('.tm-copy')!,
      ink: tile.classList.contains('tone-ink'),
      w: 1, wv: 0, z: 1, zv: 0, s: 0, sv: 0,
    }));
    const n = tiles.length;
    const sizeArt = () => list.style.setProperty('--art-w', `${Math.ceil((list.clientWidth * GROW) / (GROW + n - 1)) + 2}px`);
    sizeArt();
    addEventListener('resize', sizeArt);

    const K = SPRING * SPRING;
    const C = 2 * SPRING;
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20) / 4;
      last = now;
      const h = hovered.current;
      for (let i = 0; i < n; i++) {
        const o = tiles[i];
        const tw = h === i ? GROW : 1;
        const tz = h === i ? ZOOM : 1;
        const ts = h !== null && h !== i ? 1 : 0;
        if (reduced) {
          o.w = tw; o.z = tz; o.s = ts;
        } else {
          for (let k = 0; k < 4; k++) {
            o.wv += (K * (tw - o.w) - C * o.wv) * dt; o.w += o.wv * dt;
            o.zv += (K * 0.7 * (tz - o.z) - C * 0.84 * o.zv) * dt; o.z += o.zv * dt;
            o.sv += (K * (ts - o.s) - C * o.sv) * dt; o.s += o.sv * dt;
          }
        }
        o.tile.style.flexGrow = o.w.toFixed(5);
        o.zoom.style.transform = `scale(${o.z.toFixed(5)})`;
        o.dim.style.opacity = (Math.max(0, o.s) * DIM).toFixed(4);
        // ink labels would go muddy in the shade: they turn white while shaded
        const s = Math.min(1, Math.max(0, o.s));
        if (o.ink) {
          const c = (x: number) => Math.round(x + (255 - x) * s);
          o.copy.style.color = `rgb(${c(20)},${c(25)},${c(30)})`;
        }
        o.copy.style.opacity = (1 - s * 0.18).toFixed(3);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', sizeArt);
    };
  }, [open]);

  // which tile is hovered; the spring loop above does the rest. Sub-links follow 0.1s later.
  const setHover = (i: number | null) => {
    const el = root.current;
    if (!el || !open || hovered.current === i) return;
    if (!matchMedia('(hover: hover) and (min-width: 768px)').matches) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prev = hovered.current;
    hovered.current = i;
    const subs = (j: number | null) => (j === null ? [] : [...el.querySelectorAll(`.tm-tile:nth-child(${j + 1}) .tm-sub`)]);
    const out = subs(prev);
    const inn = subs(i);
    if (out.length) gsap.to(out, {autoAlpha: 0, y: 10, duration: 0.2, ease: 'power2.in', stagger: 0, overwrite: true});
    if (inn.length) gsap.to(inn, {autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.04, delay: reduced ? 0 : 0.1, overwrite: true});
  };

  return (
    <div
      ref={root}
      className="tm"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      tabIndex={-1}
      style={{visibility: 'hidden'}}
    >
      <div className="tm-curtain" />
      <div className="tm-bar">
        {/* sits exactly over the header burger; its two lines morph into the X */}
        <button type="button" className="tm-close" onClick={onClose}>
          <i className="tm-x" aria-hidden="true">
            <b />
            <b />
          </i>
          <span className="tm-fade">Close</span>
        </button>
        <Link to="/" className="tm-lock tm-fade" onClick={onClose} aria-label="Thermidor, home">
          <Lockup />
        </Link>
        <Link to="/cart" className="tm-bag tm-fade" onClick={onClose}>
          Bag ({bagCount})
        </Link>
      </div>
      <ul
        className="tm-tiles"
        onPointerOver={(e) => {
          const li = (e.target as HTMLElement).closest<HTMLElement>('.tm-tile');
          if (li) setHover(Number(li.dataset.i));
        }}
        onPointerLeave={() => setHover(null)}
      >
        {MENU_TILES.map((t, i) => (
          <li
            key={t.label}
            className={`tm-tile tone-${t.tone} art-${t.art}`}
            data-i={i}
            onFocus={() => setHover(i)}
          >
            <div className="tm-clip">
              <div className="tm-art">
                <div className="tm-zoom">
                  <TileArt tile={t} i={i} />
                </div>
              </div>
              <div className="tm-dim" aria-hidden="true" />
              <Link to={t.to} className="tm-hit" onClick={onClose} prefetch="intent" aria-label={t.label} />
              <div className="tm-copy">
                {t.links.length > 0 && (
                  <ul className="tm-subs">
                    {t.links.map((l) => (
                      <li key={l.label} className="tm-sub">
                        <Link to={l.to} onClick={onClose} tabIndex={open ? 0 : -1}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <span className="tm-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="tm-label" aria-hidden="true">
                  <span>{t.label}</span>
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="tm-foot">
        <a className="tm-fade" href="mailto:hello@thermidor.club">hello@thermidor.club</a>
        <span className="tm-fade">Riviera sportswear &middot; est. 2026</span>
        <span className="tm-social tm-fade">
          <a href="https://instagram.com/thermidorclub">Instagram</a>
          <a href="https://tiktok.com/@thermidorclub">TikTok</a>
          <a href="https://x.com/thermidorclub">X</a>
        </span>
      </div>
    </div>
  );
}

function TileArt({tile, i}: {tile: MenuTile; i: number}) {
  const id = `tm${i}`;
  switch (tile.art) {
    case 'sky':
      return <img src="/sky/hero-tall.webp" alt="" decoding="async" />;
    case 'window':
      // the hero tile: red ground, the sky seen through the lobster
      return (
        <svg viewBox="0 0 1000 1400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <mask id={`${id}m`}>
              <rect width="1000" height="1400" fill="#000" />
              {/* stood upright, claws up, so the lobster fills a tall tile */}
              <use href="#mark" x="0" y="340" width="1000" height="593" transform="rotate(90 500 636)" style={{color: '#fff'}} />
            </mask>
          </defs>
          <rect width="1000" height="1400" fill="#E2422C" />
          <image href="/sky/hero-tall.webp" width="1000" height="1500" preserveAspectRatio="xMidYMid slice" mask={`url(#${id}m)`} />
        </svg>
      );
    case 'parasol':
      return (
        <svg
          viewBox="0 0 1000 1400"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html:
              `<image href="/sky/hero2-tall.webp" width="1000" height="1500" preserveAspectRatio="xMidYMid slice"/>` +
              parasol({ax: 520, ay: -1500, rx: 2400, ry: 2060, rot: -6, U: 2.6, fr: 52, frStep: 4, frW: 3, poleW: 12, H: 1400, id}),
          }}
        />
      );
    case 'stripe':
      return <div className="tm-svg" dangerouslySetInnerHTML={{__html: stripeArt({id})}} />;
    case 'palm':
      return (
        <svg viewBox="0 0 1000 1400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="1000" height="1400" fill="#0F4230" />
          <use href="#mark" x="320" y="560" width="360" height="213" style={{color: '#fff'}} />
        </svg>
      );
  }
}
