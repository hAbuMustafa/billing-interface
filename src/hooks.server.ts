import { refreshAccessToken } from '$lib/server/db/operations/auth';
import {
  ACCESS_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
  COOKIE_OPTIONS,
  REFRESH_COOKIE_NAME,
  verifyAccessToken,
} from '$lib/utils/auth/jwt';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  const accessToken = event.cookies.get(ACCESS_COOKIE_NAME);

  const authedOnly = event.route.id?.startsWith('/(authed)');

  if (event.url.pathname.startsWith('/api') && !authedOnly) return await resolve(event);
  if (event.url.pathname.startsWith('/log')) return await resolve(event);

  if (!accessToken && !authedOnly) return await resolve(event);

  const redirectURL = new URL('/login', event.url.origin);

  if (!event.url.pathname.startsWith('/login') && event.url.pathname !== '/')
    redirectURL.searchParams.set('redirectTo', event.url.pathname);

  if (!accessToken) return redirect(303, redirectURL);

  let userPayload = await verifyAccessToken(accessToken);

  if (!userPayload) {
    const refreshToken = event.cookies.get(REFRESH_COOKIE_NAME);
    if (!refreshToken) {
      event.cookies.delete(ACCESS_COOKIE_NAME, COOKIE_OPTIONS);
      event.locals.user = null;
      return redirect(303, redirectURL);
    }

    try {
      const { accessToken: newAccessToken, user } = await refreshAccessToken(
        refreshToken,
        accessToken
      );

      event.cookies.set(ACCESS_COOKIE_NAME, newAccessToken, {
        ...COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });

      userPayload = user;
    } catch (error) {
      event.cookies.delete(ACCESS_COOKIE_NAME, { path: '/' });
      event.cookies.delete(REFRESH_COOKIE_NAME, { path: '/' });
      return redirect(303, redirectURL);
    }
  }

  event.locals.user = userPayload;

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
