import { createSession, validateUser } from '$lib/server/auth';
import { passwordPattern, usernamePattern } from '$lib/stores/patterns';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export function load() {
  return {
    title: 'تسجيل الدخول',
  };
}

export const actions: Actions = {
  default: async ({ request, cookies }) => {
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

    const user = await validateUser(username as string, password as string);

    if (!user) {
      return fail(401, {
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة',
      });
    }

    createSession(user.id as number, cookies);

    throw redirect(303, '/');
  },
};
