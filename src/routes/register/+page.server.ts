import { createUser } from '$lib/server/auth';
import {
  arabicNamePattern,
  egyptianMobileNumberPattern,
  emailPattern,
  passwordPattern,
  usernamePattern,
} from '$lib/stores/patterns';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { DrizzleQueryError } from 'drizzle-orm/errors';

export function load() {
  return {
    title: 'إنشاء حساب',
  };
}

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    let first_name = formData.get('first-name');
    let father_name = formData.get('father-name');
    let grandfather_name = formData.get('grandfather-name');
    let family_name = formData.get('family-name');
    let username = formData.get('username');
    let phoneNumber = formData.get('phone-number');
    let email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    first_name = (first_name as string)?.trim();
    father_name = (father_name as string)?.trim();
    grandfather_name = (grandfather_name as string)?.trim();
    family_name = (family_name as string)?.trim();
    username = (username as string)?.trim();
    phoneNumber = (phoneNumber as string)?.trim();
    email = (email as string)?.trim();

    if (
      !username ||
      !password ||
      !confirmPassword ||
      !first_name ||
      !father_name ||
      !grandfather_name ||
      !phoneNumber ||
      !email
    ) {
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

    if (
      !arabicNamePattern.test(first_name) ||
      !arabicNamePattern.test(father_name) ||
      !arabicNamePattern.test(grandfather_name)
    ) {
      return fail(401, {
        message:
          'اسم الموظف بصيغة غير صحيحة. يجب أن يكون اسما ثلاثيا على الأقل بحروف عربية فقط',
      });
    }

    if (!egyptianMobileNumberPattern.test(phoneNumber)) {
      return fail(401, {
        message: 'رقم الموبايل بصيغة غير صحيحة',
      });
    }

    if (!emailPattern.test(email)) {
      return fail(401, {
        message: 'البريد الإلكتروني بصيغة غير صحيحة',
      });
    }

    const registrationResult = await createUser({
      username,
      password: password as string,
      first_name,
      father_name,
      grandfather_name,
      family_name,
      email,
      phoneNumber,
    });

    if (!registrationResult.success) {
      return fail(401, {
        message: (registrationResult.error as DrizzleQueryError).cause?.message.split(
          ' for '
        )[0],

        first_name,
        father_name,
        grandfather_name,
        family_name,
        username,
        phoneNumber,
        email,
      });
    }

    return redirect(303, '/');
  },
};
