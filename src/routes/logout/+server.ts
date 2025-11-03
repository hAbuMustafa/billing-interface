import {
  ACCESS_COOKIE_NAME,
  COOKIE_OPTIONS,
  REFRESH_COOKIE_NAME,
} from '$lib/utils/auth/jwt';
import { logoutUser } from '$lib/server/db/operations/auth';

import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {
  const refreshToken = cookies.get(REFRESH_COOKIE_NAME);

  if (refreshToken) {
    await logoutUser(refreshToken);

    cookies.delete(ACCESS_COOKIE_NAME, COOKIE_OPTIONS);
    cookies.delete(REFRESH_COOKIE_NAME, COOKIE_OPTIONS);
  }

  return redirect(303, '/');
}
