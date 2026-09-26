import {data} from 'react-router';
import type {Route} from './+types/api.subscribe';

/*
 * "Join the club": one endpoint for every sign-up form on the site.
 * Subscribes the email to a Klaviyo list with the visitor's answer (Men / Women / Both) and the form
 * it came from as profile properties. Uses Klaviyo's client subscriptions API, so only the public key
 * is needed, and Klaviyo handles double opt-in and consent records.
 *
 * Until PUBLIC_KLAVIYO_COMPANY_ID and KLAVIYO_LIST_ID are set: in development it logs and succeeds,
 * in production it says so honestly instead of pretending the sign-up worked.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SEGMENTS = new Set(['Men', 'Women', 'Both']);

export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') return data({ok: false, error: 'Method not allowed'}, {status: 405});
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const segment = String(form.get('segment') ?? '');
  const source = String(form.get('source') ?? 'site').slice(0, 40);

  // bots fill every field; people never see this one
  if (form.get('company')) return data({ok: true});
  if (!EMAIL.test(email) || email.length > 254) {
    return data({ok: false, error: 'That email doesn’t look right.'}, {status: 400});
  }

  const {PUBLIC_KLAVIYO_COMPANY_ID: company, KLAVIYO_LIST_ID: list} = context.env;
  if (!company || !list) {
    if (import.meta.env.DEV) {
      console.log(`[club] would subscribe ${email} (${segment || 'no segment'}, from ${source})`);
      return data({ok: true});
    }
    return data({ok: false, error: 'The list opens soon. Try again in a little while.'}, {status: 503});
  }

  const res = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(company)}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', revision: '2024-10-15'},
    body: JSON.stringify({
      data: {
        type: 'subscription',
        attributes: {
          custom_source: `thermidor.club · ${source}`,
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email,
                properties: {...(SEGMENTS.has(segment) ? {club_segment: segment} : {}), club_source: source},
              },
            },
          },
        },
        relationships: {list: {data: {type: 'list', id: list}}},
      },
    }),
  });
  if (!res.ok) {
    console.error('[club] Klaviyo', res.status, await res.text().catch(() => ''));
    return data({ok: false, error: 'Something went wrong on our side. Try again?'}, {status: 502});
  }
  return data({ok: true});
}

export async function loader() {
  return new Response(null, {status: 404});
}
