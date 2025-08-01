import { redirect } from '@sveltejs/kit';

export function GET({ cookies }) {
  // todo: delete session data from db first

  cookies.delete('session_id', {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return redirect(303, '/');
}
