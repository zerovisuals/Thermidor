import {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useLocation, useMatches} from 'react-router';
import type {CartApiQueryFragment, FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {MarkSprite} from '~/components/Brand';
import {SiteHeader, type HeaderMode} from '~/components/SiteHeader';
import {TileMenu} from '~/components/TileMenu';
import {BagDrawer, SiteFooter} from '~/components/Site';
import {BagProvider, useBag} from '~/lib/bag';
import {useReveals, useSmoothScroll} from '~/lib/motion';

interface PageLayoutProps {
  cart?: Promise<CartApiQueryFragment | null>;
  footer?: Promise<FooterQuery | null>;
  header?: HeaderQuery;
  isLoggedIn?: Promise<boolean>;
  publicStoreDomain?: string;
  children?: React.ReactNode;
}

const useIsoLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function PageLayout({children = null}: PageLayoutProps) {
  return (
    <BagProvider>
      <Shell>{children}</Shell>
    </BagProvider>
  );
}

function Shell({children}: {children: React.ReactNode}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = useCallback(() => setMenuOpen((o) => !o), []);
  const close = useCallback(() => setMenuOpen(false), []);
  const {pathname} = useLocation();
  const bag = useBag();
  const matches = useMatches();
  // a route picks its header mode in its handle, or per page in its loader data
  const pick = (m: (typeof matches)[number]) =>
    (m.data as {header?: HeaderMode} | undefined)?.header ?? (m.handle as {header?: HeaderMode} | undefined)?.header;
  const mode = [...matches].reverse().map(pick).find(Boolean) ?? 'light';
  const bare = matches.some((m) => (m.handle as {bare?: boolean})?.bare);
  const hasClub = matches.some((m) => (m.handle as {club?: boolean})?.club || (m.data as {club?: boolean} | undefined)?.club);

  // any navigation closes the menu and the bag
  useEffect(() => {
    setMenuOpen(false);
    bag.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // hide the incoming page before paint; useReveals brings it in
  useIsoLayout(() => {
    const m = document.getElementById('main');
    if (m && !matchMedia('(prefers-reduced-motion: reduce)').matches) m.style.opacity = '0';
  }, [pathname]);
  useSmoothScroll();
  useReveals(pathname);

  return (
    <>
      <MarkSprite />
      {/* #page goes inert while the menu is open */}
      <div id="page" className={`hdr-${mode}`}>
        <SiteHeader mode={mode} menuOpen={menuOpen} onMenu={toggle} />
        <main id="main">
          {/* one wrapper per route, keyed: ScrollTrigger pins and SplitText rewrite the DOM inside it,
              so React only ever removes this node, which nothing else has touched */}
          <div className="route" key={pathname}>
            {children}
          </div>
        </main>
        {!bare && <SiteFooter news={!hasClub} />}
      </div>
      <TileMenu open={menuOpen} onClose={close} bagCount={bag.count} />
      <BagDrawer />
    </>
  );
}
