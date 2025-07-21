import { getSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  event.locals.user = getSession(event.cookies);
  if (!event.locals.user && event.route.id?.startsWith('/(authed)')) {
    return redirect(303, '/login');
  }

  return await resolve(event);
}
