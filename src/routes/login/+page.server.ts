import { createSession, validateLogin } from '$lib/server/db/operations/auth';
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

    const redirectTo = formData.get('redirectTo');

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

    if (!userData.role) {
      return fail(401, {
        message: 'حسابك لم يتم تفعيله بعد',
      });
    }

    if (userData.role === -1) {
      return fail(401, {
        message: 'لقد تم تعطيل حسابك. إذا كنت تظن هذا خطأ، برجاء الرجوع لمدير النظام.',
      });
    }

    // create session
    const sessionId = crypto.randomUUID();
    const sessionMaxAge = getEndOfSessionTime();

    const result = await createSession(userData.id, sessionId, sessionMaxAge);

    if (!result.success)
      return fail(401, { message: 'حدث خطأ غير متوقع أثناء إثبات الجلسة' });

    cookies.set('session_id', sessionId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: sessionMaxAge,
    });

    if (!redirectTo) {
      return redirect(303, '/');
    } else {
      return redirect(303, redirectTo as string);
    }
  },
};

function getEndOfSessionTime(): Date {
  const now = new Date();
  const currentHour = now.getHours();
  const endOfSession = new Date(now);

  if (currentHour < 8) {
    endOfSession.setHours(8, 0, 0, 0);
  } else if (currentHour < 14) {
    endOfSession.setHours(14, 0, 0, 0);
  } else if (currentHour < 20) {
    endOfSession.setHours(20, 0, 0, 0);
  } else {
    endOfSession.setDate(endOfSession.getDate() + 1);
    endOfSession.setHours(8, 0, 0, 0);
  }

  return endOfSession;
}
