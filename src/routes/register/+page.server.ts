import { createSession, createUser, isUniqueUser, validateUser } from '$lib/server/auth';
import {
  arabicTetradicNamesPattern,
  egyptianMobileNumberPattern,
  passwordPattern,
  usernamePattern,
} from '$lib/stores/patterns';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export function load() {
  return {
    title: 'إنشاء حساب',
  };
}

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const name = formData.get('name');
    const mobile = formData.get('mobile');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    if (!username || !password || !name || !mobile || !confirmPassword) {
      return fail(400, {
        message: 'برجاء إدخال جميع البيانات المطلوبة',
      });
    }

    if (!usernamePattern.test(username as string)) {
      return fail(401, {
        message:
          'اسم المستخدم بصيغة غير صحيحة. يمكنك استخدام الأحرف والشرطات (-) فقط. ويجب أن يكون من 5 أحرف على الأقل',
      });
    }

    if (!passwordPattern.test(password as string)) {
      return fail(401, {
        message:
          'كلمة المرور بصيغة غير صحيحة. أحرف وأرقام ورموز (@$!%*?&) فقط. ومن 8 أحرف على الأقل.',
      });
    }

    if (password !== confirmPassword) {
      return fail(401, {
        message: 'كلمة السر وتأكيدها غير متطابقان',
      });
    }

    if (!arabicTetradicNamesPattern.test(name as string)) {
      return fail(401, {
        message: 'اسم الموظف بصيغة غير صحيحة. يجب أن يكون اسما ثلاثيا على الأقل',
      });
    }

    if (!egyptianMobileNumberPattern.test(mobile as string)) {
      return fail(401, {
        message: 'رقم الموبايل بصيغة غير صحيحة',
      });
    }

    const isUnique = await isUniqueUser(username as string, fetch);

    if (!isUnique) {
      return fail(401, {
        message: 'المستخدم مسجل مسبقا',
      });
    }

    return redirect(303, '/');
  },
};
