import { createUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import {
  People_contact_information,
  People_identifying_documents,
  Sys_Users,
} from '$lib/server/schema';
import {
  arabicNamePattern,
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

    let first_name = formData.get('first-name');
    let father_name = formData.get('father-name');
    let grandfather_name = formData.get('grandfather-name');
    let family_name = formData.get('family-name');
    let national_id = formData.get('national-id');
    let username = formData.get('username');
    let phone_number = formData.get('phone-number');
    let email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    first_name = (first_name as string)?.trim();
    father_name = (father_name as string)?.trim();
    grandfather_name = (grandfather_name as string)?.trim();
    family_name = (family_name as string)?.trim();
    national_id = (national_id as string)?.trim();
    username = (username as string)?.trim();
    phone_number = (phone_number as string)?.trim();
    email = (email as string)?.trim();

    const failWithMessage = failWithFormFieldsAndMessageBuilder({
      first_name,
      father_name,
      grandfather_name,
      family_name,
      national_id,
      username,
      phone_number,
      email,
    });

    if (
      !username ||
      !password ||
      !confirmPassword ||
      !first_name ||
      !father_name ||
      !grandfather_name ||
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
        'كلمة المرور بصيغة غير صحيحة. أحرف وأرقام ورموز (@$!%*?&) فقط. ومن 8 أحرف على الأقل.'
      );
    }

    if (password !== confirmPassword) {
      return failWithMessage('كلمة السر وتأكيدها غير متطابقان');
    }

    if (
      !arabicNamePattern.test(first_name) ||
      !arabicNamePattern.test(father_name) ||
      !arabicNamePattern.test(grandfather_name)
    ) {
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
      await db
        .select()
        .from(People_contact_information)
        .where(eq(People_contact_information.contact_string, email))
    ).length;

    if (usersWithSameEmail) {
      return failWithMessage('البريد الإلكتروني مسجل مسبقا.');
    }

    // phone-number registered before?
    const usersWithSamePhone_number = (
      await db
        .select()
        .from(People_contact_information)
        .where(eq(People_contact_information.contact_string, phone_number))
    ).length;

    if (usersWithSamePhone_number) {
      return failWithMessage('رقم الهاتف مسجل مسبقا.');
    }

    // national id registered before?
    const usersWithSameNationalId = (
      await db
        .select()
        .from(People_identifying_documents)
        .where(eq(People_identifying_documents.document_number, national_id))
    ).length;

    if (usersWithSameNationalId) {
      return failWithMessage('الرقم القومي مسجل مسبقا.');
    }

    // EXECUTE Registration
    const registrationResult = await createUser({
      username,
      password: password as string,
      first_name,
      father_name,
      grandfather_name,
      family_name,
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
