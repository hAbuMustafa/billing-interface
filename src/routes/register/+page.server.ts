import { createUser } from '$lib/server/db/operations/auth';
import { db } from '$lib/server/db';
import { Sys_Users } from '$lib/server/db/schema';
import {
  arabicTetradicNamesPattern,
  egyptianMobileNumberPattern,
  emailPattern,
  nationalIdPattern,
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

    let name = formData.get('name') as string;
    let national_id = formData.get('national-id') as string;
    let username = formData.get('username') as string;
    let phone_number = formData.get('phone-number') as string;
    let email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    name = name?.trim();
    national_id = national_id?.trim();
    username = username?.trim();
    phone_number = phone_number?.trim();
    email = email?.trim();

    const failWithMessage = failWithFormFieldsAndMessageBuilder({
      name,
      national_id,
      username,
      phone_number,
      email,
    });

    if (
      !username ||
      !password ||
      !confirmPassword ||
      !name ||
      !national_id ||
      !phone_number ||
      !email
    ) {
      return failWithMessage('برجاء إدخال جميع البيانات المطلوبة');
    }

    if (!usernamePattern.test(username as string)) {
      return failWithMessage(
        'اسم المستخدم بصيغة غير صحيحة. يمكنك استخدام الأحرف والشرطات (-) فقط. ويجب أن يكون من 4 أحرف على الأقل أو 16 حرفا بحد أقصى'
      );
    }

    if (!passwordPattern.test(password as string)) {
      return failWithMessage(
        'كلمة المرور بصيغة غير صحيحة. أحرف وأرقام ورموز (@$!%*?&) فقط. ومن 7 أحرف على الأقل.'
      );
    }

    if (password !== confirmPassword) {
      return failWithMessage('كلمة السر وتأكيدها غير متطابقان');
    }

    if (!arabicTetradicNamesPattern.test(name)) {
      return failWithMessage(
        'اسم الموظف بصيغة غير صحيحة. يجب أن يكون اسما ثلاثيا على الأقل بحروف عربية فقط'
      );
    }

    if (!egyptianMobileNumberPattern.test(phone_number)) {
      return failWithMessage('رقم الموبايل بصيغة غير صحيحة');
    }

    if (!emailPattern.test(email)) {
      return failWithMessage('البريد الإلكتروني بصيغة غير صحيحة');
    }

    if (!nationalIdPattern.test(national_id)) {
      return failWithMessage('الرقم القومي غير صحيح');
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
      await db.select().from(Sys_Users).where(eq(Sys_Users.email, email))
    ).length;

    if (usersWithSameEmail) {
      return failWithMessage('البريد الإلكتروني مسجل مسبقا.');
    }

    // phone-number registered before?
    const usersWithSamePhone_number = (
      await db.select().from(Sys_Users).where(eq(Sys_Users.phone_number, phone_number))
    ).length;

    if (usersWithSamePhone_number) {
      return failWithMessage('رقم الهاتف مسجل مسبقا.');
    }

    // national id registered before?
    const usersWithSameNationalId = (
      await db.select().from(Sys_Users).where(eq(Sys_Users.national_id, national_id))
    ).length;

    if (usersWithSameNationalId) {
      return failWithMessage('الرقم القومي مسجل مسبقا.');
    }

    // EXECUTE Registration
    const registrationResult = await createUser({
      username,
      password: password as string,
      name,
      national_id,
      email,
      phone_number,
    });

    if (!registrationResult.success) {
      return failWithMessage(
        (registrationResult.error as DrizzleQueryError).cause!.message.split(' for ')[0]
      );
    }

    return redirect(303, '/');
  },
};

function failWithFormFieldsAndMessageBuilder<T extends Record<string, string | number>>(
  fields: T
) {
  return (failMessage: string) =>
    fail(401, {
      message: failMessage,
      ...fields,
    });
}
