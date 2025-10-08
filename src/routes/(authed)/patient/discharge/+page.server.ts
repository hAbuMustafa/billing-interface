import { db } from '$lib/server/db/index';
import { new_Patient_discharge_reasons } from '$lib/server/db/menus';
import { People_Patients } from '$lib/server/db/schema.js';
import { failWithFormFieldsAndMessageBuilder } from '$lib/utils/form-actions';
import { eq } from 'drizzle-orm';

export function load() {
  return {
    title: 'تسجيل خروج مريض',
    discharge_reasons: new_Patient_discharge_reasons.filter((r) => r.id !== 8),
  };
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const patientId = data.get('patient_id') as unknown as string;
    let dischargeDate = data.get('discharge_date') as unknown as Date;
    let dischargeReason = data.get('discharge_reason') as unknown as number;
    const dischargeNotes = data.get('discharge_notes') as unknown as string;

    const failWithMessage = failWithFormFieldsAndMessageBuilder({
      patientId,
      dischargeDate,
      dischargeReason,
      dischargeNotes,
    });

    if (
      !patientId ||
      !dischargeDate ||
      !dischargeReason ||
      ([3, 9].some((r) => dischargeReason === r) && !dischargeNotes)
    )
      failWithMessage('جميع الحقول مطلوبة');

    try {
      dischargeDate = new Date(dischargeDate);
      dischargeReason = Number(dischargeReason);
    } catch (error) {
      failWithMessage('البيانات المدخلة غير صحيحة');
    }

    await db
      .update(People_Patients)
      .set({
        discharge_date: dischargeDate,
        discharge_reason: dischargeReason,
        discharge_notes: dischargeNotes ?? null,
      })
      .where(eq(People_Patients.id, patientId))
      .returning()
      .catch(() => failWithMessage('حدث خطأ غير متوقع. حاول مرة أخرى'));
  },
};
