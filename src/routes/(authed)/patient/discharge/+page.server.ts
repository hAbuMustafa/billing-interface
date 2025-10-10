import { new_Patient_discharge_reasons } from '$lib/server/db/menus';
import { dischargePatient } from '$lib/server/db/operations/patients.js';
import { failWithFormFieldsAndMessageBuilder } from '$lib/utils/form-actions';

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

    if (!patientId) return failWithMessage('لم يتم العثور على المريض');
    if (!dischargeDate) return failWithMessage('وقت الخروج مطلوب');
    if (!dischargeReason) return failWithMessage('سبب الخروج مطلوب');
    if ([3, 9].some((r) => dischargeReason === r) && !dischargeNotes)
      return failWithMessage(
        'يلزم كتابة ملاحظات حال كان سبب الخروج خارج الاختيارات المذكورة، أو في حال تم تحويل المريض لمستشفى آخر؛ يلزم ذكر المستشفى في الملاحظات'
      );

    try {
      dischargeDate = new Date(dischargeDate);
      dischargeReason = Number(dischargeReason);
    } catch (error) {
      return failWithMessage('البيانات المدخلة غير صحيحة');
    }

    const result = await dischargePatient({
      id: patientId,
      discharge_date: dischargeDate,
      discharge_reason: dischargeReason,
      discharge_notes: dischargeNotes,
    });

    if (!result.success) {
      return failWithMessage('حدث خطأ غير متوقع. برجاء المحاولة مرة أخرى');
    }
  },
};
