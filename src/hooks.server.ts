import { getUserFromSession } from '$lib/server/db/operations/auth';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  if (event.url.pathname.startsWith('/api') && !event.route.id?.startsWith('/(authed)'))
    return await resolve(event);
  if (event.url.pathname.startsWith('/log')) return await resolve(event);

  const sessionId = event.cookies.get('session_id');
  if (!sessionId && !event.route.id?.startsWith('/(authed)')) return await resolve(event);

  const redirectURL = new URL('/login', event.url.origin);

  if (!event.url.pathname.startsWith('/login') && event.url.pathname !== '/')
    redirectURL.searchParams.set('redirectTo', event.url.pathname);

  if (!sessionId) return redirect(303, redirectURL);

  const user = await getUserFromSession(sessionId);

  if (!user) {
    event.cookies.delete('session_id', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return redirect(303, redirectURL);
  }

  event.locals.user = user;

  return await resolve(event);
}
