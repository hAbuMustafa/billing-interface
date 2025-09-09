import { validateUser } from '$lib/server/auth';
import { db } from '$lib/server/db.js';
import { Sys_Sessions, Sys_Users } from '$lib/server/schema.js';
import { passwordPattern, usernamePattern } from '$lib/stores/patterns';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

export function load({ locals }) {
  if (locals.user) return redirect(303, '/');

  return {
    title: 'تسجيل الدخول',
  };
}

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      return fail(400, {
        message: 'برجاء إدخال اسم المستخدم وكلمة المرور',
      });
    }

    if (
      !usernamePattern.test(username) ||
      !(password.length > 6 || password.length < 33)
    ) {
      return fail(401, {
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة',
      });
    }

    const userData = await validateUser(username, password);

    if (!userData) {
      return fail(401, {
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة',
      });
    }

    // create session
    const sessionId = crypto.randomUUID();
    await db.insert(Sys_Sessions).values({
      id: sessionId,
      user_id: userData.id,
    });

    const [newSessionData] = await db
      .select()
      .from(Sys_Sessions)
      .where(eq(Sys_Sessions.id, sessionId));

    cookies.set('session_id', sessionId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: newSessionData.expires_at,
    });

    // update user's last_login field
    try {
      await db.update(Sys_Users).set({ last_login: sql`CURRENT_TIMESTAMP` });
    } catch (error) {
      console.error(error);
    }

    throw redirect(303, '/');
  },
};
