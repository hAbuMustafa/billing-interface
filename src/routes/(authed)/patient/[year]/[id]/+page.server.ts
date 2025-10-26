type PatientDataT =
  | {
      id: string;
      person_id: number;
      admission_date: Date;
      admission_notes: string | null;
      admission_ward: number;
      recent_ward: number | null;
      discharge_date: Date | null;
      discharge_reason: number | null;
      discharge_notes: string | null;
      health_insurance: boolean | null;
      security_status: boolean | null;
      Patient_wards: {
        id: number;
        timestamp: Date;
        patient_id: string;
        ward: number;
        notes: string | null;
        Ward: {
          id: number;
          name: string;
          floor: number;
        };
      }[];
      Patient_diagnoses: {
        timestamp: Date;
        patient_id: string;
        diagnosis_id: number;
        Diagnosis: {
          id: number;
          name: string;
          icd11: string | null;
        };
      }[];
      Patient_discharge_reason: {
        id: number;
        name: string;
      } | null;
      Person: {
        id: number;
        name: string;
        id_doc_type: number | null;
        id_doc_num: string | null;
        gender: boolean | null;
        birthdate: Date | null;
        Patient_id_doc_type: {
          id: number;
          name: string;
        } | null;
        Patients:
          | {
              id: string;
              person_id: number;
              admission_date: Date;
              admission_notes: string | null;
              admission_ward: number;
              recent_ward: number | null;
              discharge_date: Date | null;
              discharge_reason: number | null;
              discharge_notes: string | null;
              health_insurance: boolean | null;
              security_status: boolean | null;
              Patient_discharge_reason: {
                id: number;
                name: string;
              } | null;
            }[]
          | null;
      };
    }
  | undefined;

export async function load({ fetch, params }) {
  const admission_year = params.year;
  const patientSerial = params.id;

  if (!patientSerial || !admission_year) {
    return { message: 'برجاء اختيار مريض أولا' };
  }

  if (!/^\d{2}$/.test(admission_year) || !/^\d+$/.test(patientSerial)) {
    return { message: 'برجاء إدخال أرقام صحيحة' };
  }

  const castYear = Number(admission_year);
  const castSerial = Number(patientSerial);
  const currentYear = Number(new Date().getFullYear().toString().slice(2, 4));

  if (castYear < 24 || castYear > currentYear || patientSerial.length > 5) {
    return { message: 'المريض غير موجود' };
  }

  const patientId = [castYear, castSerial].join('/');

  const patientData: PatientDataT = await fetch(
    `/api/patients/patient?id=${patientId}`
  ).then((r) => {
    if (r.ok) {
      return r.json();
    }
  });

  if (!patientData)
    return {
      title: `لا يوجد مريض بالرقم ${patientId}`,
    };

  return {
    title: patientData.Person.name,
    patient: patientData,
  };
}
