import { createUser } from '$lib/server/db/operations/users';
import { db } from '$lib/server/db';
import { Sys_Users } from '$lib/server/db/schema'; // todo: isolate db processes into 'operations/users'
import {
  arabicTriadicNamesPattern,
  egyptianMobileNumberPattern,
  emailPattern,
  nationalIdPattern,
  passwordPattern,
  usernamePattern,
} from '$lib/stores/patterns';
import { redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { failWithFormFieldsAndMessageArrayBuilder } from '$lib/utils/form-actions';

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

    const failWithMessages = failWithFormFieldsAndMessageArrayBuilder({
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
      return failWithMessages(['برجاء إدخال جميع البيانات المطلوبة']);
    }

    const failMessages = [];

    if (!usernamePattern.test(username as string)) {
      failMessages.push(
        'اسم المستخدم بصيغة غير صحيحة. يمكنك استخدام الأحرف والشرطات (-) فقط. ويجب أن يكون من 4 أحرف على الأقل أو 16 حرفا بحد أقصى'
      );
    }

    if (!passwordPattern.test(password as string)) {
      failMessages.push(
        'كلمة المرور بصيغة غير صحيحة. أحرف وأرقام ورموز (@$!%*?&) فقط. ومن 7 أحرف على الأقل.'
      );
    }

    if (password !== confirmPassword) {
      failMessages.push('كلمة السر وتأكيدها غير متطابقان');
    }

    if (!arabicTriadicNamesPattern.test(name)) {
      failMessages.push(
        'اسم الموظف بصيغة غير صحيحة. يجب أن يكون اسما ثلاثيا على الأقل بحروف عربية فقط'
      );
    }

    if (!egyptianMobileNumberPattern.test(phone_number)) {
      failMessages.push('رقم الموبايل بصيغة غير صحيحة');
    }

    if (!emailPattern.test(email)) {
      failMessages.push('البريد الإلكتروني بصيغة غير صحيحة');
    }

    if (!nationalIdPattern.test(national_id)) {
      failMessages.push('الرقم القومي غير صحيح');
    }

    // username used before?
    const usersWithSameUsername = (
      await db.select().from(Sys_Users).where(eq(Sys_Users.username, username))
    ).length;

    if (usersWithSameUsername) {
      failMessages.push('اسم المستخدم مسجل مسبقا.');
    }

    // email registered before?
    const usersWithSameEmail = (
      await db.select().from(Sys_Users).where(eq(Sys_Users.email, email))
    ).length;

    if (usersWithSameEmail) {
      failMessages.push('البريد الإلكتروني مسجل مسبقا.');
    }

    // phone-number registered before?
    const usersWithSamePhone_number = (
      await db.select().from(Sys_Users).where(eq(Sys_Users.phone_number, phone_number))
    ).length;

    if (usersWithSamePhone_number) {
      failMessages.push('رقم الهاتف مسجل مسبقا.');
    }

    // national id registered before?
    const usersWithSameNationalId = (
      await db.select().from(Sys_Users).where(eq(Sys_Users.national_id, national_id))
    ).length;

    if (usersWithSameNationalId) {
      failMessages.push('الرقم القومي مسجل مسبقا.');
    }

    if (failMessages.length) return failWithMessages(failMessages);

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
      return failWithMessages(['حدث خطأ غير متوقع']);
    }

    return {
      messages: [
        { message: `تم إنشاء حسابك ${username} بنجاح`, type: 'success' },
        { message: 'يلزم التواصل مع مدير النظام لتفعيل حسابك!', type: 'info' },
      ],
      redirect: redirect(303, '/'),
    };
  },
};
