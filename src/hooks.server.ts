import { getUserFromSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  if (event.url.pathname.startsWith('/api')) return await resolve(event);

  const sessionId = event.cookies.get('session_id');
  if (!sessionId && !event.route.id?.startsWith('/(authed)')) return await resolve(event);

  if (!sessionId) return redirect(303, '/login');

  const user = await getUserFromSession(sessionId, event.fetch);

  if (!user) return redirect(303, '/login');

  event.locals.user = user;

  return await resolve(event);
}
