import { checkIfUnique, updateUser } from '$lib/server/db/operations/users.js';
import { arabicTriadicNamesPattern, usernamePattern } from '$lib/stores/patterns.js';
import { fail } from '@sveltejs/kit';

export function load() {
  return {
    title: 'تعديل بيانات الحساب',
  };
}

export const actions = {
  username: async ({ request, locals }) => {
    const data = await request.formData();

    let username = data.get('username') as unknown as string;

    if (!username) return fail(401, { message: 'اسم المستخدم لا يمكن أن يكون فارغا' });

    username = username.trim().replace(/\s+/g, ' ');

    if (!usernamePattern.test(username))
      return fail(401, {
        message:
          'صيغة اسم المستخدم غير صحيحة. ينبغي أن تكون حروف انجليزية فقط أو شرطة "-"',
      });

    if (username === locals.user?.username)
      return fail(401, { message: 'غيرت إيه انت كدة؟ 🤷🏻‍♂️' });

    const isUnique = await checkIfUnique('username', username);

    if (!isUnique)
      return fail(401, {
        message: 'اسم المستخدم يخص مستخدم آخر.',
      });

    const result = await updateUser(locals.user!.id, { username });

    if (!result.success) return fail(401, { message: 'حدث خطأ غير متوقع.' });

    const oldUsername = locals.user?.username;

    locals.user!.username = username;

    return {
      success: true,
      message: `تم تغيير اسم المستخدم من ${oldUsername} إلى ${username}`,
    };
  },
  name: async ({ request, locals }) => {
    const data = await request.formData();

    let name = data.get('name') as unknown as string;

    if (!name) return fail(401, { message: 'اسم الموظف لا يمكن أن يكون فارغا' });

    name = name.trim().replace(/\s+/g, ' ');

    if (!arabicTriadicNamesPattern.test(name))
      return fail(401, {
        message: 'صيغة اسم الموظف غير صحيحة. ينبغي أن يكون اسما ثلاثيا عربيا',
      });

    if (name === locals.user?.name) return fail(401, { message: 'غيرت إيه انت كدة؟ 🤷🏻‍♂️' });

    const result = await updateUser(locals.user!.id, { name });

    if (!result.success) return fail(401, { message: 'حدث خطأ غير متوقع.' });

    const oldName = locals.user?.name;

    locals.user!.name = name;

    return {
      success: true,
      message: `تم تغيير اسم الموظف من ${oldName} إلى ${name}`,
    };
  },
};
