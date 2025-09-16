import { db } from '$lib/server/db';
import { Sys_Sessions } from '$lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function GET({ cookies }) {
  const currentSessionId = cookies.get('session_id');

  if (currentSessionId) {
    await db.delete(Sys_Sessions).where(eq(Sys_Sessions.id, currentSessionId));

    cookies.delete('session_id', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  return redirect(303, '/');
}
