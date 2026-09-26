// Brand art as SVG strings, ported from the brand board generators (src/web.js).
// Deterministic (seeded) so server and client render the same markup.

export const RED = '#E2422C';
const WHITE = '#FFFFFF';

function seeded(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const f = (n: number) => Math.round(n * 10) / 10;

/** Fringe threads hanging from a stripe edge; each takes the colour of the band it hangs from. */
function fringe(
  x0: number,
  x1: number,
  y: number,
  len: number,
  {step = 2.2, w = 1.5, band = 50, red = 30, seed = 42} = {},
) {
  const rnd = seeded(seed);
  let out = '';
  for (let x = x0; x <= x1; x += step) {
    const L = len * (0.86 + rnd() * 0.24);
    const a = (rnd() - 0.5) * 0.18;
    const m = (((x - x0) % band) + band) % band;
    out += `<line x1="${f(x)}" y1="${f(y - 1)}" x2="${f(x + Math.sin(a) * L)}" y2="${f(y + Math.cos(a) * L)}" stroke="${m < red ? RED : WHITE}" stroke-width="${w}" stroke-linecap="round"/>`;
  }
  return out;
}

/** The stripe as an awning: red/white bands (3:2), fringed, dropping in from the top at an angle. */
export function stripeArt({
  W = 1000,
  H = 1400,
  id = 'st',
  band = 150,
  drop = 0.46,
  angle = -9,
  fringeLen = 70,
  fringeStep = 4.2,
  fringeW = 2.8,
} = {}) {
  const red = band * 0.6;
  const y = H * drop;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><pattern id="${id}" width="${band}" height="10" patternUnits="userSpaceOnUse"><rect width="${red}" height="10" fill="${RED}"/><rect x="${red}" width="${band - red}" height="10" fill="${WHITE}"/></pattern></defs>
<g transform="rotate(${angle} ${W / 2} 0)" style="filter:drop-shadow(0 ${H * 0.016}px ${H * 0.016}px rgba(18,52,110,.25))">
<rect x="${-W * 0.4}" y="${-H * 0.2}" width="${W * 1.8}" height="${y + H * 0.2}" fill="url(#${id})"/>
<g>${fringe(-W * 0.4, W * 1.4, y, fringeLen, {step: fringeStep, w: fringeW, band, red})}</g>
</g></svg>`;
}

type ParasolOpts = {
  ax: number;
  ay: number;
  rx: number;
  ry: number;
  rot?: number;
  U?: number;
  fr?: number;
  frStep?: number;
  frW?: number;
  poleW?: number;
  H: number;
  id: string;
};

/** A parasol seen from below: 3:2 panels converging on a hub above the frame, fringed rim, palm pole. */
export function parasol(o: ParasolOpts) {
  const {ax, ay, rx, ry, rot = -6, U = 3.1, fr = 24, frStep = 2.1, frW = 1.5, poleW = 14, H, id} = o;
  const rnd = seeded(7);
  const seq: [string, number][] = [
    [RED, 3],
    [WHITE, 2],
  ];
  const wedges: [number, number, string][] = [];
  let panels = '';
  let seams = '';
  for (let a = 4, i = 0; a < 176; i++) {
    const [c, w] = seq[i % 2];
    const a2 = a + w * U;
    wedges.push([a, a2, c]);
    const P = (d: number) => [ax + Math.cos((d * Math.PI) / 180) * 6000, ay + Math.sin((d * Math.PI) / 180) * 6000];
    const [x1, y1] = P(a);
    const [x2, y2] = P(a2);
    panels += `<path d="M${ax} ${ay}L${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}Z" fill="${c}"/>`;
    seams += `<line x1="${ax}" y1="${ay}" x2="${f(x1)}" y2="${f(y1)}" stroke="rgba(20,25,30,.16)" stroke-width="1.2"/>`;
    a = a2;
  }
  let threads = '';
  for (let x = ax - rx; x <= ax + rx; x += frStep) {
    const y = ay + ry * Math.sqrt(Math.max(0, 1 - ((x - ax) / rx) ** 2));
    if (y < -40) continue;
    const ang = (Math.atan2(y - ay, x - ax) * 180) / Math.PI;
    const w = wedges.find(([a1, a2]) => ang >= a1 && ang < a2);
    const L = fr * (0.85 + rnd() * 0.25);
    const t = (rnd() - 0.5) * 0.16;
    threads += `<line x1="${f(x)}" y1="${f(y - 2)}" x2="${f(x + Math.sin(t) * L)}" y2="${f(y + L)}" stroke="${w ? w[2] : WHITE}" stroke-width="${frW}" stroke-linecap="round"/>`;
  }
  const y1 = H + 60;
  return `<defs><clipPath id="${id}rim"><ellipse cx="${ax}" cy="${ay}" rx="${rx}" ry="${ry}"/></clipPath>
<radialGradient id="${id}sh" cx="${ax}" cy="${ay}" r="${ry}" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
<g style="filter:drop-shadow(0 16px 22px rgba(18,52,110,.38))" transform="rotate(${rot} ${ax} 0)">
<g clip-path="url(#${id}rim)">${panels}<ellipse cx="${ax}" cy="${ay}" rx="${rx}" ry="${ry}" fill="url(#${id}sh)"/>${seams}</g>
<g>${threads}</g>
<path d="M${ax - 1.5} ${ay} L${ax + 1.5} ${ay} L${ax + poleW} ${y1} L${ax - poleW} ${y1} Z" fill="#0F4230"/>
<path d="M${ax} ${ay} L${ax + 1.5} ${ay} L${ax + poleW} ${y1} L${ax + poleW * 0.35} ${y1} Z" fill="rgba(255,255,255,.14)"/>
</g>`;
}
