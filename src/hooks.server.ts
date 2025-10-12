import { getUserFromSession } from '$lib/server/db/operations/auth';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  if (event.locals.user) console.log(event.locals.user);

  const sessionId = event.cookies.get('session_id');

  const authedOnly = event.route.id?.startsWith('/(authed)');

  if (event.url.pathname.startsWith('/api') && !authedOnly) return await resolve(event);
  if (event.url.pathname.startsWith('/log')) return await resolve(event);

  if (!sessionId && !authedOnly) return await resolve(event);

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

  if (
    event.locals.user.password_reset_required &&
    !event.url.pathname.startsWith('/account/change-password')
  ) {
    return redirect(307, '/account/change-password');
  }

  if (
    (!event.locals.user.email ||
      !event.locals.user.phone_number ||
      !event.locals.user.national_id) &&
    !event.url.pathname.startsWith('/account')
  ) {
    return redirect(307, '/account');
  }

  return await resolve(event);
}
