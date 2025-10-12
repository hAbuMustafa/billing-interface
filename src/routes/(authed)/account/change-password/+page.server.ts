import { validateLogin } from '$lib/server/db/operations/auth.js';
import { changePassword } from '$lib/server/db/operations/users.js';
import { passwordPattern } from '$lib/stores/patterns.js';
import { fail } from '@sveltejs/kit';

export function load() {
  return {
    title: 'تغيير كلمة السر',
  };
}

export const actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();

    const oldPassword = data.get('old_password');
    const newPassword = data.get('new_password');
    const confirmNewPassword = data.get('confirm_new_password');

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return fail(401, {
        message: 'جميع الحقول مطلوبة',
      });
    }

    if (newPassword !== confirmNewPassword)
      return fail(401, { message: 'كلمة السر الجديدة لا تطابق تأكيدها' });

    const userData = await validateLogin(locals.user?.username!, oldPassword as string);

    if (!userData) return fail(401, { message: 'كلمة السر القديمة غير صحيحة' });

    if (!passwordPattern.test(newPassword as string))
      return fail(401, {
        message:
          'كلمة السر ضعيفة جدا. يجب أن تحتوي على أحرف وأرقام وأحد الرموز (@$!%*?&)، وأن تكون على الأقل من 8 محارف',
      });

    const result = await changePassword(locals.user?.id!, newPassword as string);

    if (!result.success) return fail(401, { message: 'حدث خطأ غير متوقع' });

    locals.user!.password_reset_required = false;

    return {
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
    };
  },
};
