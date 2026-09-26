import type {Route} from './+types/$';
import {NotFound} from '~/components/NotFound';
import {seo} from '~/lib/site';

export async function loader({request}: Route.LoaderArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {status: 404});
}
export const meta: Route.MetaFunction = () => [...seo({title: 'Not found'}), {name: 'robots', content: 'noindex'}];
export const handle = {header: 'clear'};

export default function CatchAll() {
  return <NotFound />;
}
