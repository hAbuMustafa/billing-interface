import { validateLogin } from '$lib/server/db/operations/auth';
import { db } from '$lib/server/db';
import { Sys_Sessions, Sys_Users } from '$lib/server/db/schema.js';
import { usernamePattern } from '$lib/stores/patterns';
import { fail, redirect, type Actions } from '@sveltejs/kit';

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

    const userData = await validateLogin(username, password);

    if (!userData) {
      return fail(401, {
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة',
      });
    }

    if (!userData.active) {
      return fail(401, {
        message: 'حسابك لم يتم تفعيله بعد',
      });
    }

    // create session
    const sessionId = crypto.randomUUID();
    const [newSessionData] = await db
      .insert(Sys_Sessions)
      .values({
        id: sessionId,
        user_id: userData.id,
      })
      .returning();

    cookies.set('session_id', sessionId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: newSessionData.expires_at,
    });

    // update user's last_login field
    try {
      await db.update(Sys_Users).set({ last_login: new Date() });
    } catch (error) {
      console.error(error);
    }

    throw redirect(303, '/');
  },
};
