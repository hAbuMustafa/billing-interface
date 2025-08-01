import { createSession, validateUser } from '$lib/server/auth';
import { passwordPattern, usernamePattern } from '$lib/stores/patterns';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export function load({ locals }) {
  if (locals.user) return redirect(303, '/');

  return {
    title: 'تسجيل الدخول',
  };
}

export const actions: Actions = {
  default: async ({ request, cookies, fetch }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || !password) {
      return fail(400, {
        message: 'برجاء إدخال اسم المستخدم وكلمة المرور',
      });
    }

    if (
      !usernamePattern.test(username as string) ||
      !passwordPattern.test(password as string)
    ) {
      return fail(401, {
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة',
      });
    }

    const userId = await validateUser(username as string, password as string, fetch);

    if (!userId) {
      return fail(401, {
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة',
      });
    }

    await createSession(userId as string, cookies, fetch);

    throw redirect(303, '/');
  },
};
