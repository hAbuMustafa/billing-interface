import {
  ACCESS_COOKIE_NAME,
  COOKIE_OPTIONS,
  REFRESH_COOKIE_NAME,
} from '$lib/utils/auth/jwt';
import { logoutAllDevices } from '$lib/server/db/operations/auth';

import { redirect } from '@sveltejs/kit';

export async function GET({ cookies, locals }) {
  console.log('deleting all sessions');
  console.log({ user: locals.user });

  if (locals.user) {
    await logoutAllDevices(locals.user.id);
  }

  cookies.delete(ACCESS_COOKIE_NAME, COOKIE_OPTIONS);
  cookies.delete(REFRESH_COOKIE_NAME, COOKIE_OPTIONS);

  return redirect(303, '/');
}
