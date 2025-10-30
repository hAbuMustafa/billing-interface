import { fail, redirect } from '@sveltejs/kit';

export function load() {
  return {
    title: 'عرض إحصائية الدخول والخروج لشهر',
  };
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const month = data.get('month');
    const year = data.get('year');

    if (!month || !year) {
      return fail(401, {
        message: 'يجب اختيار شهر وسنة',
      });
    }

    return redirect(303, `/patient/monthly-report/${year}/${month}/`);
  },
};
