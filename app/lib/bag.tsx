import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {getProduct} from '~/lib/catalog';

// Local bag until the Shopify cart is wired: same operations the Cart API gives us (add, update, remove).
export type BagLine = {handle: string; colour: string; size: string; qty: number};

type Bag = {
  lines: BagLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: Omit<BagLine, 'qty'>, qty?: number) => void;
  setQty: (i: number, qty: number) => void;
};

const Ctx = createContext<Bag | null>(null);
const KEY = 'thermidor.bag';

export function BagProvider({children}: {children: React.ReactNode}) {
  const [lines, setLines] = useState<BagLine[]>([]);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (Array.isArray(saved)) setLines((saved as BagLine[]).filter((l) => getProduct(l.handle)));
    } catch {}
  }, []);
  const save = useCallback((next: BagLine[]) => {
    setLines(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const add = useCallback<Bag['add']>(
    (line, qty = 1) => {
      const i = lines.findIndex((l) => l.handle === line.handle && l.colour === line.colour && l.size === line.size);
      save(i >= 0 ? lines.map((l, j) => (j === i ? {...l, qty: l.qty + qty} : l)) : [...lines, {...line, qty}]);
      setOpen(true);
    },
    [lines, save],
  );
  const setQty = useCallback<Bag['setQty']>(
    (i, qty) => save(qty <= 0 ? lines.filter((_, j) => j !== i) : lines.map((l, j) => (j === i ? {...l, qty} : l))),
    [lines, save],
  );

  const value = useMemo<Bag>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * (getProduct(l.handle)?.price ?? 0), 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQty,
    }),
    [lines, isOpen, add, setQty],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBag() {
  const b = useContext(Ctx);
  if (!b) throw new Error('useBag outside BagProvider');
  return b;
}
