import {useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import Lenis from 'lenis';

/*
 * One motion vocabulary for the whole site (measured from the reference):
 *   arrive  expo.out       things entering
 *   glide   power3.inOut   on-screen A→B
 *   leave   power2.in      things leaving
 * Markup opts in with data attributes; nothing animates that didn't ask to.
 *   data-reveal="lines"    text rises line by line from behind a mask
 *   data-reveal="up"       fades up
 *   data-reveal="clip"     wipes open from the top, its picture settles from 1.12
 *   data-reveal="stagger"  children fade up one after another
 *   data-parallax="-12"    drifts that many % of its height across the viewport
 */
export const EASE = {arrive: 'expo.out', glide: 'power3.inOut', leave: 'power2.in'};

let registered = false;
export function registerMotion() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

export const reducedMotion = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/** Smooth scroll on desktop pointers only; touch keeps native momentum. */
export function useSmoothScroll() {
  useEffect(() => {
    registerMotion();
    if (reducedMotion() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    lenis = new Lenis({duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4)});
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // the menu and the bag lock the page; Lenis has to stop with it
    const lock = new MutationObserver(() =>
      document.documentElement.classList.contains('menu-lock') ? lenis?.stop() : lenis?.start(),
    );
    lock.observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
    return () => {
      lock.disconnect();
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

/** Re-scans the page for data-reveal / data-parallax on every route. */
export function useReveals(key: string) {
  useEffect(() => {
    registerMotion();
    const root = document.getElementById('main');
    const page = document.getElementById('page');
    if (!root || !page) return;
    lenis?.scrollTo(0, {immediate: true});
    if (reducedMotion()) {
      root.style.opacity = '';
      return;
    }
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    // lines must be measured in the real font
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const st = (el: Element, start = 'top 88%') => ({trigger: el, start, once: true});

        gsap.fromTo(root, {opacity: 0, y: 14}, {opacity: 1, y: 0, duration: 0.7, ease: EASE.arrive, clearProps: 'transform'});

        page.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
          const split = SplitText.create(el, {type: 'lines', mask: 'lines', linesClass: 'ln'});
          gsap.from(split.lines, {yPercent: 110, duration: 1, ease: EASE.arrive, stagger: 0.08, delay: Number(el.dataset.delay || 0), scrollTrigger: st(el)});
        });
        page.querySelectorAll<HTMLElement>('[data-reveal="up"]').forEach((el) => {
          gsap.from(el, {y: 24, opacity: 0, duration: 0.9, ease: EASE.arrive, delay: Number(el.dataset.delay || 0), scrollTrigger: st(el)});
        });
        page.querySelectorAll<HTMLElement>('[data-reveal="stagger"]').forEach((el) => {
          gsap.from(el.children, {y: 24, opacity: 0, duration: 0.9, ease: EASE.arrive, stagger: 0.07, scrollTrigger: st(el)});
        });
        page.querySelectorAll<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
          const tl = gsap.timeline({scrollTrigger: st(el, 'top 92%'), delay: Number(el.dataset.delay || 0)});
          tl.fromTo(el, {clipPath: 'inset(0% 0% 100% 0%)'}, {clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: EASE.arrive});
          const pic = el.firstElementChild;
          if (pic) tl.fromTo(pic, {scale: 1.12}, {scale: 1, duration: 1.4, ease: EASE.arrive}, 0);
        });
        page.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          const amt = Number(el.dataset.parallax);
          gsap.fromTo(el, {yPercent: -amt / 2}, {yPercent: amt / 2, ease: 'none', scrollTrigger: {trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true}});
        });
      }, page);
      ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [key]);
}
