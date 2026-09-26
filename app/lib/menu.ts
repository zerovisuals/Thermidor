// The tile menu. Four doors into the house; each tile carries one piece of the brand's visual language.
// Placeholder routes until the Shopify collections exist.

export type TileArt = 'sky' | 'window' | 'parasol' | 'stripe' | 'palm';

export type MenuTile = {
  label: string;
  to: string;
  art: TileArt;
  tone: 'ink' | 'white';
  links: {label: string; to: string}[];
};

export const MENU_TILES: MenuTile[] = [
  {
    label: 'Men',
    to: '/collections/men',
    art: 'sky',
    tone: 'ink',
    links: [
      {label: 'New in', to: '/collections/men'},
      {label: 'Polos', to: '/collections/men-polos'},
      {label: 'Henleys', to: '/collections/men-henleys'},
      {label: 'Hoodies', to: '/collections/men-hoodies'},
      {label: 'Belts', to: '/collections/men-belts'},
    ],
  },
  {
    label: 'Women',
    to: '/collections/women',
    art: 'window',
    tone: 'ink',
    links: [
      {label: 'New in', to: '/collections/women'},
      {label: 'Polos', to: '/collections/women-polos'},
      {label: 'Henleys', to: '/collections/women-henleys'},
      {label: 'Hoodies', to: '/collections/women-hoodies'},
      {label: 'Belts', to: '/collections/women-belts'},
    ],
  },
  {
    label: 'The Club',
    to: '/pages/the-club',
    art: 'parasol',
    tone: 'ink',
    links: [
      {label: 'Join the club', to: '/pages/the-club'},
      {label: 'The long lunch', to: '/pages/journal'},
    ],
  },
  {
    label: 'The House',
    to: '/pages/the-house',
    art: 'palm',
    tone: 'white',
    links: [
      {label: 'About', to: '/pages/the-house'},
      {label: 'Journal', to: '/pages/journal'},
      {label: 'Contact', to: '/pages/contact'},
    ],
  },
];
