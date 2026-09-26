import {useEffect, useState} from 'react';
import {Link, NavLink} from 'react-router';
import {Lockup} from '~/components/Brand';
import {useBag} from '~/lib/bag';

export type HeaderMode = 'light' | 'dark' | 'clear' | 'onred' | 'bleed';

type Props = {mode?: HeaderMode; menuOpen: boolean; onMenu: () => void};

/**
 * The header from the brand board: nav left, lockup centred, utilities right.
 * Over a picture it takes that page's mode (ink on red, white on sky); once you scroll it turns
 * solid white, tucks away while you read down, and comes back the moment you scroll up.
 */
export function SiteHeader({mode = 'light', menuOpen, onMenu}: Props) {
  const bag = useBag();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = scrollY;
    const on = () => {
      const y = scrollY;
      setSolid(y > 24);
      setHidden(y > 240 && y > last + 2 ? true : y < last - 2 ? false : (h) => h);
      last = y;
    };
    on();
    addEventListener('scroll', on, {passive: true});
    return () => removeEventListener('scroll', on);
  }, []);

  const m = solid ? 'light' : mode;
  return (
    <header className={`sh ${m} ${hidden && !menuOpen ? 'tucked' : ''}`}>
      <nav className="sh-nav" aria-label="Primary">
        <button id="menu-toggle" type="button" className="sh-burger" aria-expanded={menuOpen} aria-haspopup="dialog" onClick={onMenu}>
          <i aria-hidden="true" />
          <span className="sr-only">Menu</span>
        </button>
        <NavLink to="/collections/men" className="sh-hide-m ul">Men</NavLink>
        <NavLink to="/collections/women" className="sh-hide-m ul">Women</NavLink>
        <NavLink to="/pages/the-club" className="sh-hide-m ul">The Club</NavLink>
      </nav>
      <Link to="/" className="sh-lock" aria-label="Thermidor, home">
        <Lockup />
      </Link>
      <nav className="sh-nav r" aria-label="Utility">
        <NavLink to="/search" className="sh-hide-m ul">Search</NavLink>
        <NavLink to="/account" className="sh-hide-m ul">Account</NavLink>
        <button type="button" className="ul" onClick={bag.open}>
          Bag ({bag.count})
        </button>
      </nav>
    </header>
  );
}
