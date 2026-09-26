import {MARK, MARK_SMALL, MARK_VIEWBOX} from '~/lib/mark';

/** One inline sprite for the lobster; everything else points at it with <use>. Rendered once in the root layout. */
export function MarkSprite() {
  return (
    <svg width="0" height="0" style={{position: 'absolute'}} aria-hidden="true" focusable="false">
      <symbol id="mark" viewBox={MARK_VIEWBOX}>
        <path fill="currentColor" d={MARK} />
      </symbol>
      <symbol id="mark-sm" viewBox={MARK_VIEWBOX}>
        <path fill="currentColor" d={MARK_SMALL} />
      </symbol>
    </svg>
  );
}

/** The mark at any size. Under 32px it swaps to the closed-up small cut automatically when `small` is set. */
export function Mark({small = false, className}: {small?: boolean; className?: string}) {
  return (
    <svg className={className} viewBox="0 0 982 582" aria-hidden="true" focusable="false">
      <use href={small ? '#mark-sm' : '#mark'} width="982" height="582" />
    </svg>
  );
}

/** Mark + wordmark, as in the site header. */
export function Lockup({className = ''}: {className?: string}) {
  return (
    <span className={`lockup ${className}`}>
      <Mark small />
      <span className="lockup-word">THERMIDOR</span>
    </span>
  );
}
