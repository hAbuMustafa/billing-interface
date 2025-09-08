import { createUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { People_contact_information, Sys_Users } from '$lib/server/schema';
import {
  arabicNamePattern,
  egyptianMobileNumberPattern,
  emailPattern,
  passwordPattern,
  usernamePattern,
} from '$lib/stores/patterns';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
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

    const failWithMessage = failWithFormFieldsAndMessageBuilder({
      first_name,
      father_name,
      grandfather_name,
      family_name,
      username,
      phoneNumber,
      email,
    });

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

    // username used before?
    const usersWithSameUsername = (
      await db.select().from(Sys_Users).where(eq(Sys_Users.username, username))
    ).length;

    if (usersWithSameUsername) {
      return failWithMessage('اسم المستخدم مسجل مسبقا.');
    }

    // email registered before?
    const usersWithSameEmail = (
      await db
        .select()
        .from(People_contact_information)
        .where(eq(People_contact_information.contact_string, email))
    ).length;

    if (usersWithSameEmail) {
      return failWithMessage('البريد الإلكتروني مسجل مسبقا.');
    }

    // phone-number registered before?
    const usersWithSamePhoneNumber = (
      await db
        .select()
        .from(People_contact_information)
        .where(eq(People_contact_information.contact_string, phoneNumber))
    ).length;

    if (usersWithSamePhoneNumber) {
      return failWithMessage('رقم الهاتف مسجل مسبقا.');
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
      return failWithMessage(
        (registrationResult.error as DrizzleQueryError).cause!.message.split(' for ')[0]
      );
    }

    return redirect(303, '/');
  },
};

function failWithFormFieldsAndMessageBuilder(fields: { [k: string]: string | number }) {
  return (failMessage: string) =>
    fail(401, {
      message: failMessage,
      ...fields,
    });
}
