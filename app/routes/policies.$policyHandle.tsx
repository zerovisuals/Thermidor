import {redirect} from 'react-router';
import type {Route} from './+types/policies.$policyHandle';

// Shopify checkout links to /policies/*; until the store's policies exist they land on our pages.
const MAP: Record<string, string> = {
  'privacy-policy': '/pages/privacy',
  'refund-policy': '/pages/returns',
  'shipping-policy': '/pages/shipping',
  'terms-of-service': '/pages/legal',
  'contact-information': '/pages/contact',
};

export function loader({params}: Route.LoaderArgs) {
  return redirect(MAP[params.policyHandle ?? ''] ?? '/pages/legal', 301);
}
