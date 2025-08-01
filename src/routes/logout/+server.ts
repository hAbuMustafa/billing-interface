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

    await fetch('/api/sheets/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spreadsheetId: PUBLIC_users_spreadsheetId,
        sheetName: 'sessions',
        sheetRange: 'A:C',
        columnIndex: 0,
        targetValue: currentSessionId,
      }),
    });
  }

  return redirect(303, '/');
}
