import { db } from '$lib/server/db/index.js';
import { floors, new_id_doc_type, new_Wards } from '$lib/server/db/menus';
import { createPatient } from '$lib/server/db/operations/patients.js';
import { People_Patients } from '$lib/server/db/schema.js';
import { failWithFormFieldsAndMessageBuilder } from '$lib/utils/form-actions.js';
import { fail } from 'assert';
import { DrizzleQueryError, like } from 'drizzle-orm';

export async function load() {
  const diagnoses = await db
    .select({ diagnosis: People_Patients.diagnosis })
    .from(People_Patients);
  const diagnoses_list = Array.from(
    new Set(
      diagnoses
        .map((d) => d.diagnosis)
        .map((d) => d?.split('+').map((c) => c.trim()))
        .flat()
        .sort()
    )
  ); // todo: got to move this to a queryable table for efficiency

  const lastMedicalNumber = (
    await db
      .select({ mId: People_Patients.id })
      .from(People_Patients)
      .where(
        like(People_Patients.id, `${new Date().getFullYear().toString().slice(2, 4)}/%`)
      )
  )
    .map((mn) => Number(mn?.mId.split('/')[1] || '0'))
    .sort((a, b) => a - b)
    .pop();

  return {
    title: 'تسجيل دخول مريض',
    id_doc_type_list: new_id_doc_type,
    wards_list: new_Wards,
    floors_list: floors,
    diagnoses_list,
    nextMedicalNumber: (lastMedicalNumber || 0) + 1,
  };
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    // Person Data
    let personId = data.get('person_id') as unknown as number;
    const patientName = data.get('name') as unknown as string;
    let idDocType = data.get('id_doc_type') as unknown as number;
    const idDocNum = data.get('id_doc_num') as unknown as string;
    let gender = data.get('gender') as unknown as boolean;
    let birthdate = data.get('birthdate') as unknown as Date;
    let heathInsurance = data.get('health_insurance') as unknown as boolean;

    // Patient Data
    let medicalNumber = data.get('medical_number') as unknown as number;
    let admissionWard = data.get('admission_ward') as unknown as number;
    let admissionDate = data.get('admission_date') as unknown as Date;
    let diagnosis = data.getAll('diagnosis') as unknown as string[];
    let admissionNotes = data.get('admission_notes') as unknown as string;

    const failWithMessage = failWithFormFieldsAndMessageBuilder({
      medicalNumber,
      patientName,
      idDocType,
      idDocNum,
      gender,
      birthdate,
      heathInsurance,
      diagnosis,
      admissionWard,
      admissionDate,
      personId,
      admissionNotes,
    });

    if (!medicalNumber) return failWithMessage('الرقم الطبي مطلوب');
    if (!patientName) return failWithMessage(' اسم المريض مطلوب');
    if (!idDocType) return failWithMessage('نوع الهوية مطلوبة');
    if (!idDocNum && idDocType != 6) return failWithMessage('رقم الهوية مطلوب');
    if (!gender) return failWithMessage('الجنس/النوع مطلوب');
    if (!birthdate) return failWithMessage('تاريخ الميلاد مطلوب');
    if (!heathInsurance) return failWithMessage('موقف المريض من التأمين الصحي مطلوب');
    if (!diagnosis.length)
      return failWithMessage('التشخيص مطلوب. يلزم كتابة تشخيص واحد على الأقل');
    if (!admissionWard) return failWithMessage('يلزم تحديد قسم الدخول');
    if (!admissionDate) return failWithMessage('تاريخ الدخول مطلوب');
    if (!admissionNotes && idDocType == 6)
      return failWithMessage('يلزم الإفادة بملاحظات حال لم يتم كتابة رقم هوية');

    try {
      personId = Number(personId);
      medicalNumber = Number(medicalNumber);
      idDocType = Number(idDocType);
      admissionWard = Number(admissionWard);

      gender = Boolean(Number(gender));
      heathInsurance = Boolean(Number(heathInsurance));

      birthdate = new Date(birthdate);
      admissionDate = new Date(admissionDate);
    } catch (e) {
      console.error(JSON.stringify(data, null, 4));
      fail('خطأ في طبيعة البيانات المدخلة (أرقام أو تواريخ).');
    }

    const result = await createPatient({
      id: [admissionDate.getFullYear().toString().slice(2, 4), medicalNumber].join('/'),
      name: patientName.trim(),
      id_doc_type: idDocType,
      id_doc_num: idDocNum.trim(),
      admission_ward: admissionWard,
      admission_date: admissionDate,
      admission_notes: admissionNotes,
      diagnosis: diagnosis.map((d) => d.trim()).join(' + '),
    });

    if (
      !result.success &&
      (result.error as DrizzleQueryError).cause?.message!.includes(
        'UNIQUE constraint failed'
      )
    ) {
      return failWithMessage(`الرقم الطبي ${medicalNumber} مسجل مسبقا`);
    }
  },
};
