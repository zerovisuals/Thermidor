import {Link} from 'react-router';
import {Sky} from '~/components/Site';

/* 404: the lobster has gone for lunch. The sky shows through where it should be. */
export function NotFound({status = 404, detail}: {status?: number; detail?: string}) {
  const lost = status === 404;
  return (
    <section className="nf">
      <Sky name="web1" eager />
      <svg className="nf-mark" viewBox="0 0 982 582" aria-hidden="true">
        <use href="#mark" width="982" height="582" />
      </svg>
      <div className="nf-body">
        <span className="kick">{status}</span>
        <h1 data-reveal="lines">{lost ? 'Gone for a long lunch.' : 'Something went overboard.'}</h1>
        <p data-reveal="up">{lost ? 'This page isn’t at the club. It may have moved, or never had a table.' : detail || 'Give it a moment and try again.'}</p>
        <div className="nf-cta" data-reveal="up">
          <Link to="/" className="pill solid">Back to the club</Link>
          <Link to="/collections/all" className="u">Shop the first drop</Link>
        </div>
      </div>
    </section>
  );
}
