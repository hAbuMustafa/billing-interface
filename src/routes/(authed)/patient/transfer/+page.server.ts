import { new_Wards } from '$lib/server/db/menus';
import { transferPatient } from '$lib/server/db/operations/patients.js';
import { failWithFormFieldsAndMessageArrayBuilder } from '$lib/utils/form-actions';

export function load() {
  return {
    title: 'تحويل مريض إلى قسم',
    wards: new_Wards,
  };
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const patientId = data.get('patient_id') as unknown as string;
    let selectedPatientRecentWardId = data.get(
      'patient_recent_ward'
    ) as unknown as number;
    const patientName = data.get('patient_name') as unknown as string;
    let transferDate = data.get('transfer_date') as unknown as Date;
    let transferTo = data.get('ward') as unknown as number;
    const transferNotes = data.get('transfer_notes') as unknown as string;

    const failMessages = [];

    const failWithMessages = failWithFormFieldsAndMessageArrayBuilder({
      patientId,
      patientName,
      selectedPatientRecentWardId,
      transferDate,
      transferTo,
      transferNotes,
    });

    if (!patientId) failMessages.push('لم يتم العثور على المريض');
    if (!transferDate) failMessages.push('يجب إدخال تاريخ ووقت التحويل');
    if (!transferTo) failMessages.push('يجب تحديد القسم المحول إليه');

    if (failMessages.length) return failWithMessages(failMessages);

    try {
      transferDate = new Date(transferDate);
      transferTo = Number(transferTo);
      selectedPatientRecentWardId = Number(selectedPatientRecentWardId);
    } catch (error) {
      return failWithMessages([{ message: 'البيانات المدخلة غير صحيحة', type: 'error' }]);
    }

    const result = await transferPatient({
      patient_id: patientId,
      ward: transferTo,
      timestamp: transferDate,
      notes: transferNotes,
    });

    if (!result.success) {
      console.error(result.error);
      return failWithMessages([
        { message: 'حدث خطأ غير متوقع. برجاء المحاولة مرة أخرى', type: 'error' },
      ]);
    }

    return {
      success: true,
      message: `تم تحويل المريض "${patientName}" من "${
        new_Wards.find((w) => w.id === selectedPatientRecentWardId)?.name
      }" إلى "${new_Wards.find((w) => w.id === transferTo)?.name}"`,
    };
  },
};
