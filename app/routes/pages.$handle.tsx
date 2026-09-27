import {useEffect, useRef} from 'react';
import {Link, useLoaderData} from 'react-router';
import gsap from 'gsap';
import type {Route} from './+types/pages.$handle';
import {ClubInvite} from '~/components/Sections';
import {seo} from '~/lib/site';
import {EASE, reducedMotion, registerMotion} from '~/lib/motion';

type TextPage = {title: string; kicker: string; body: React.ReactNode};
const TEXT: Record<string, TextPage> = {
  contact: {
    kicker: 'Help',
    title: 'Contact',
    body: (
      <>
        <p>Write to us at <a className="u" href="mailto:hello@thermidor.club">hello@thermidor.club</a>. A person answers, usually within a day, never during lunch.</p>
        <p>Press and wholesale: <a className="u" href="mailto:press@thermidor.club">press@thermidor.club</a>.</p>
      </>
    ),
  },
  shipping: {
    kicker: 'Help',
    title: 'Shipping',
    body: (
      <>
        <p>Free shipping in the EU on orders over €150; €8 below that. Orders leave within two working days.</p>
        <p>UK, US and the rest of the world ship at checkout rates, duties included.</p>
      </>
    ),
  },
  returns: {
    kicker: 'Help',
    title: 'Returns',
    body: <p>Thirty days to change your mind. We collect from your door in the EU; refunds land within five working days of the parcel reaching us.</p>,
  },
  'size-guide': {
    kicker: 'Help',
    title: 'Size guide',
    body: (
      <>
        <p>Everything is cut boxy and a little short. Take your usual size for the intended fit; size down for a closer one.</p>
        <table className="sizes">
          <thead>
            <tr><th>Size</th><th>XS</th><th>S</th><th>M</th><th>L</th><th>XL</th><th>XXL</th></tr>
          </thead>
          <tbody>
            <tr><td>Chest, cm</td><td>104</td><td>110</td><td>116</td><td>122</td><td>128</td><td>134</td></tr>
            <tr><td>Length, cm</td><td>64</td><td>66</td><td>68</td><td>70</td><td>72</td><td>74</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  privacy: {
    kicker: 'House',
    title: 'Privacy',
    body: (
      <>
        <p>Before the first drop, the only personal data we collect is what you give us to join the club: your email address, and whether you&rsquo;re here for Men, Women or Both.</p>
        <p>We use it for one thing: to tell you about drops and club events. It is stored with our email provider, Klaviyo, and never sold or shared. Every email has an unsubscribe link, or write to <a className="u" href="mailto:hello@thermidor.club">hello@thermidor.club</a> and we&rsquo;ll delete it.</p>
        <p>Your bag is kept in your own browser (local storage) and never leaves your device until checkout opens. We don&rsquo;t use advertising or tracking cookies.</p>
        <p>A full privacy policy, covering orders and payments, will be published here before the shop opens.</p>
      </>
    ),
  },
  legal: {
    kicker: 'House',
    title: 'Legal',
    body: <p>Thermidor is a concept label in preparation. Terms of sale, privacy and cookie policies will be published here before the first drop opens.</p>,
  },
  journal: {
    kicker: 'The long lunch',
    title: 'Journal',
    body: <p>Postcards from the lobster’s summer: what it made, who it met, where lunch ran long. The first ones arrive with Chapter 1.</p>,
  },
};

export async function loader({params}: Route.LoaderArgs) {
  const h = params.handle ?? '';
  if (h !== 'the-club' && h !== 'the-house' && !TEXT[h]) throw new Response('Not found', {status: 404});
  // the club sits under a parasol: a solid header, as on the board
  // the house has the sky bleeding in top-right: the right-hand nav goes white over it (as on the board)
  return {handle: h, header: h === 'the-club' ? 'light' : h === 'the-house' ? 'bleed' : 'clear', club: h === 'the-club'};
}
export const meta: Route.MetaFunction = ({data}) => {
  const h = data?.handle ?? '';
  const t = h === 'the-club' ? 'The Club' : h === 'the-house' ? 'The House' : TEXT[h]?.title;
  const d =
    h === 'the-club'
      ? 'See you at the club. Everyone’s invited: first look at every Thermidor drop, and a seat at the long lunch.'
      : h === 'the-house'
        ? 'The lobster that walked off the menu: why Thermidor exists, and what it believes.'
        : undefined;
  return seo({title: t ?? 'Page', description: d, path: `/pages/${h}`});
};
export const handle = {header: 'clear'};

export default function Page() {
  const {handle} = useLoaderData<typeof loader>();
  if (handle === 'the-club') return <ClubInvite />;
  if (handle === 'the-house') return <House />;
  const t = TEXT[handle];
  return (
    <section className="txt">
      <span className="kick" data-reveal="up">{t.kicker}</span>
      <h1 data-reveal="lines">{t.title}</h1>
      <div className="txt-b" data-reveal="stagger">{t.body}</div>
      <Link to="/" className="u txt-back" data-reveal="up">Back to the club</Link>
    </section>
  );
}

/* ============ THE HOUSE: the manifesto (W2), the three sources, and the colours (tile 05) ============ */
function House() {
  return (
    <>
      <section className="house">
        <div className="mani-bleed" data-parallax="-10">
          <img src="/sky/bleed-wide.webp" alt="" decoding="async" />
        </div>
        <div className="house-body">
          <span className="kick" data-reveal="up">The house</span>
          <p className="house-lead" data-reveal="lines">
            Lobster Thermidor is the stiffest plate on a Riviera menu. Thermidor is also the name of high summer. One day the lobster on that plate decided it was done being dinner, walked out past the waiters, and spent the whole of Thermidor on the&nbsp;beach.
          </p>
          <p className="house-red" data-reveal="lines" data-delay="0.12">Everyone&rsquo;s invited. Bring something you&nbsp;made.</p>
        </div>
        <div className="house-cols" data-reveal="stagger">
          <div>
            <h3><i style={{background: 'var(--palm)'}} />Enjoy it</h3>
            <p>Long lunches, short sleeves. Take the day slowly and most things playfully.</p>
          </div>
          <div>
            <h3><i style={{background: 'var(--blue)'}} />Make things</h3>
            <p>Everyone is made to create. Sandcastles count. Do your own thing, not the thing next to you.</p>
          </div>
          <div>
            <h3><i style={{background: 'var(--red)'}} />No dress code</h3>
            <p>The Riviera&rsquo;s colours and stripes, without the velvet rope. Worn boxy, loud and a little sandy.</p>
          </div>
        </div>
      </section>
      <Domes />
    </>
  );
}

const DOMES: [string, string, string, string, number][] = [
  ['Riviera Blue', '#489DD8', 'oklch .67 .12 242', '#fff', 680],
  ['White', '#FFFFFF', 'oklch 1 0 0', '#14191E', 572],
  ['Haze', '#DFF2FD', 'oklch .95 .025 235', '#14191E', 464],
  ['Cabana Red', '#E2422C', 'oklch .61 .20 31', '#fff', 356],
  ['Palm', '#0F4230', 'oklch .34 .062 165', '#fff', 240],
  ['Ink', '#14191E', 'oklch .21 .012 250', '#fff', 122],
];

/** The palette as a parasol seen edge-on: each colour a band, each labelled along one spoke. */
function Domes() {
  const root = useRef<HTMLElement>(null);
  const cx = 565;
  const cy = 575;
  const a = (Math.PI * (180 + 52)) / 180;
  useEffect(() => {
    registerMotion();
    const el = root.current;
    if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({scrollTrigger: {trigger: el, start: 'top 70%', once: true}})
        .from('.dome', {scale: 0, svgOrigin: `${cx} ${cy}`, duration: 1.4, ease: EASE.arrive, stagger: {each: 0.08, from: 'end'}})
        .from('.dome-l', {opacity: 0, y: 8, duration: 0.8, ease: EASE.arrive, stagger: 0.06}, 0.5);
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="domes">
      <span className="kick domes-k">The colours</span>
      <svg viewBox="0 0 912 513" preserveAspectRatio="xMidYMid slice" role="img" aria-label="The Thermidor palette: Riviera Blue, White, Haze, Cabana Red, Palm, Ink">
        {DOMES.map(([n, hex, , , r]) => (
          <circle key={n} className="dome" cx={cx} cy={cy} r={r} fill={hex} stroke={hex === '#FFFFFF' ? 'rgba(20,25,30,.08)' : undefined} />
        ))}
        {DOMES.map(([n, hex, ok, fg, r], k) => {
          const inner = k < DOMES.length - 1 ? DOMES[k + 1][4] : 0;
          const rm = inner ? (r + inner) / 2 : 0;
          const x = rm ? cx + rm * Math.cos(a) - 44 : cx;
          const y = rm ? cy + rm * Math.sin(a) - 8 : cy - r + 30;
          return (
            <text key={n} className="dome-l" x={x} y={y} fill={fg} textAnchor={rm ? 'start' : 'middle'}>
              <tspan className="dn">{n}</tspan>
              <tspan className="dh" x={x} dy="13">{hex}</tspan>
              <tspan className="dh" x={x} dy="11">{ok}</tspan>
            </text>
          );
        })}
      </svg>
    </section>
  );
}
