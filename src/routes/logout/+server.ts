import { PUBLIC_users_spreadsheetId } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export async function GET({ cookies, fetch }) {
  const currentSessionId = cookies.get('session_id');

  if (currentSessionId) {
    cookies.delete('session_id', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  return redirect(303, '/');
}
