// The first drop, as local mock data. Shape mirrors what we'll read from the Storefront API later
// (product → options → variants), so swapping to Shopify only changes where this comes from.

export type Colour = {name: string; hex: string};
export type Product = {
  handle: string;
  title: string;
  price: number;
  category: 'polos' | 'henleys' | 'hoodies' | 'belts';
  material: string;
  colours: Colour[];
  sizes: string[];
  soldOut?: string[];
  fit: string;
  description: string;
  details: string[];
  shots: string[]; // placeholder labels until the shoot
  isNew?: boolean;
};

export const PALM: Colour = {name: 'Palm', hex: '#0F4230'};
export const WHITE: Colour = {name: 'White', hex: '#FFFFFF'};
export const RED: Colour = {name: 'Cabana Red', hex: '#E2422C'};
export const BLUE: Colour = {name: 'Riviera Blue', hex: '#489DD8'};
export const STRIPE: Colour = {name: 'The stripe', hex: 'stripe'};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const PRODUCTS: Product[] = [
  {
    handle: 'club-polo',
    title: 'Club Polo',
    price: 145,
    category: 'polos',
    material: 'Boxy piqué',
    colours: [PALM, WHITE, RED],
    sizes: SIZES,
    soldOut: ['XXL'],
    fit: 'Boxy fit, cut short. Take your usual size. Model is 185 cm and wears M.',
    description: 'The club polo, cut the way it was in 1962 and worn a little louder: a heavy piqué, a short boxy body, and the crest where your hand goes.',
    details: ['100% cotton piqué, 240 gsm', 'Three-button placket, mother-of-pearl', 'Embroidered crest, 2.5 cm', 'Made in Portugal'],
    shots: ['front', 'back crest', 'detail'],
    isNew: true,
  },
  {
    handle: 'riviera-henley',
    title: 'Riviera Henley',
    price: 110,
    category: 'henleys',
    material: 'Waffle knit',
    colours: [WHITE, BLUE],
    sizes: SIZES,
    fit: 'Relaxed fit, long sleeve. Take your usual size. Model is 185 cm and wears M.',
    description: 'A waffle-knit henley for the walk back from the beach. Soft, open, and a size looser than you expect.',
    details: ['100% cotton waffle, 280 gsm', 'Four-button placket', 'Woven label at the hem', 'Made in Portugal'],
    shots: ['front', 'back', 'detail'],
    isNew: true,
  },
  {
    handle: 'club-hoodie',
    title: 'Club Hoodie',
    price: 190,
    category: 'hoodies',
    material: 'Heavyweight fleece',
    colours: [RED, PALM],
    sizes: SIZES,
    soldOut: ['XS'],
    fit: 'Oversized, dropped shoulder. Size down for a closer fit. Model is 185 cm and wears M.',
    description: 'Heavyweight brushed fleece with the crest gone big on the back. The one you keep in the car.',
    details: ['100% cotton fleece, 480 gsm', 'Double-layer hood', 'Crest print on the back, 28 cm', 'Made in Portugal'],
    shots: ['back', 'front', 'detail'],
    isNew: true,
  },
  {
    handle: 'cabana-belt',
    title: 'Cabana Belt',
    price: 85,
    category: 'belts',
    material: 'Woven webbing',
    colours: [STRIPE],
    sizes: ['One size'],
    fit: 'One size, adjustable to 110 cm.',
    description: 'The stripe, 3:2, woven into a canvas belt with a fringe of loose threads at the tip. Red 30, white 20, repeat.',
    details: ['Cotton webbing, 35 mm', 'Brass D-ring', 'Fringed tip', 'Made in Italy'],
    shots: ['flat', 'worn', 'detail'],
  },
];

export const CATEGORIES = [
  {handle: 'polos', title: 'Polos'},
  {handle: 'henleys', title: 'Henleys'},
  {handle: 'hoodies', title: 'Hoodies'},
  {handle: 'belts', title: 'Belts'},
] as const;

/** Men / Women carry the same unisex drop for now; the split is the edit, not the stock. */
export const COLLECTIONS: Record<string, {title: string; kicker: string; filter: (p: Product) => boolean}> = {
  all: {title: 'Arrière-saison', kicker: 'Chapter 1', filter: () => true},
  men: {title: 'Men', kicker: 'Chapter 1 · Arrière-saison', filter: () => true},
  women: {title: 'Women', kicker: 'Chapter 1 · Arrière-saison', filter: () => true},
  ...Object.fromEntries(
    CATEGORIES.map((c) => [c.handle, {title: c.title, kicker: 'SS27', filter: (p: Product) => p.category === c.handle}]),
  ),
};

export const getProduct = (handle: string) => PRODUCTS.find((p) => p.handle === handle);
export const euro = (n: number) => `€${n}`;

/** Collection handles from the menu like "men-polos" resolve to the category. */
export function resolveCollection(handle: string) {
  if (COLLECTIONS[handle]) return {handle, ...COLLECTIONS[handle]};
  const m = handle.match(/^(men|women)-(\w+)$/);
  if (m && COLLECTIONS[m[2]]) return {handle: m[2], ...COLLECTIONS[m[2]], kicker: m[1] === 'men' ? 'Men' : 'Women'};
  return null;
}
