import {seo} from '~/lib/site';
import type {Route} from './+types/account';
import {NewsForm} from '~/components/Site';

export const meta: Route.MetaFunction = () => [...seo({title: 'Account', path: '/account'}), {name: 'robots', content: 'noindex'}];

/* placeholder until Shopify customer accounts are connected */
export default function Account() {
  return (
    <section className="txt">
      <span className="kick" data-reveal="up">Account</span>
      <h1 data-reveal="lines">Members only, soon.</h1>
      <div className="txt-b" data-reveal="up">
        <p>Accounts open with the first drop. Join the club now and your invitation will be waiting.</p>
      </div>
      <div data-reveal="up" className="txt-form">
        <NewsForm source="account" />
      </div>
    </section>
  );
}
