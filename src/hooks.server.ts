import { getSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  if (event.route.id?.startsWith('/(authed)')) {
    event.locals.user = await getSession(event.cookies, event.fetch);
    if (!event.locals.user) return redirect(303, '/login');
  }

  return await resolve(event);
}
