import {redirect} from 'react-router';

// Standard Shopify account route. Customer accounts open with the first drop; until then, the account page.
export function loader() {
  return redirect('/account');
}
