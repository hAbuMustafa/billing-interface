import { db } from '$lib/server/db';
import {
  Patient_discharge_reasons,
  Patient_id_doc_type,
  Patient_wards,
  People,
  Patients,
  Wards,
  Diagnoses,
  Patient_Diagnoses,
} from '$lib/server/db/schema';
import { verifyEgyptianNationalId } from '$lib/utils/id-number-validation/egyptian-national-id';
import { and, eq, isNull, like } from 'drizzle-orm';

export async function createWard(ward: typeof Wards.$inferInsert) {
  try {
    const [new_ward] = await db.insert(Wards).values(ward).returning();

    return {
      success: true,
      data: new_ward,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function createIdDocType(docType: typeof Patient_id_doc_type.$inferInsert) {
  try {
    const [new_id_doc_type] = await db
      .insert(Patient_id_doc_type)
      .values(docType)
      .returning();

    return { success: true, data: new_id_doc_type };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function createDischargeReason(
  dischargeReason: typeof Patient_discharge_reasons.$inferInsert
) {
  try {
    const [new_discharge_reason] = await db
      .insert(Patient_discharge_reasons)
      .values(dischargeReason)
      .returning();

    return {
      success: true,
      data: new_discharge_reason,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function createDiagnosis(
  diagnosis: string | { name: string; icd11: string },
  tx: any
) {
  const conn = tx || db;

  try {
    const [newDiagnosis] = await conn
      .insert(Diagnoses)
      .values(typeof diagnosis === 'string' ? { name: diagnosis } : diagnosis)
      .returning();

    return {
      success: true,
      data: newDiagnosis,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function isAdmitted(idDocType: number, idDocNum: string) {
  const [foundAdmitted] = await db
    .select({
      name: People.name,
      recent_ward_name: Patients.recent_ward,
    })
    .from(Patients)
    .leftJoin(People, eq(Patients.person_id, People.id))
    .leftJoin(Wards, eq(Patients.recent_ward, Wards.id))
    .where(
      and(
        eq(People.id_doc_type, idDocType),
        eq(People.id_doc_num, idDocNum),
        isNull(Patients.discharge_date)
      )
    );

  return foundAdmitted;
}

type newPatientT = {
  id: string;
  name: string;
  id_doc_type: number;
  id_doc_num: string;
  admission_ward: number;
  admission_date: Date;
  admission_notes: string;
  diagnosis: string[];
  security_status: boolean;
  referred_from: string;
  person_id?: number;
};
export async function createPatient(patient: newPatientT) {
  try {
    const new_patient = await db.transaction(async (tx) => {
      let foundPerson: typeof People.$inferSelect | null = null;

      if (!patient.person_id) {
        if (patient.id_doc_num) {
          [foundPerson] = await tx
            .select()
            .from(People)
            .where(eq(People.id_doc_num, patient.id_doc_num));
        }

        if (!foundPerson) {
          const { id: droppedPatientId, ...restOfPatientData } = patient;
          [foundPerson] = await tx.insert(People).values(restOfPatientData).returning();
        }

        patient.person_id = foundPerson.id;
      }

      const [newPatient] = await tx
        .insert(Patients)
        .values({ ...patient, recent_ward: patient.admission_ward } as App.Require<
          newPatientT,
          'person_id'
        >)
        .returning();

      await tx.insert(Patient_wards).values({
        patient_id: newPatient.id,
        ward: patient.admission_ward,
        timestamp: patient.admission_date,
        notes: 'admission',
      });

      for (let i = 0; i < patient.diagnosis.length; i++) {
        const currentDiagnosisText = patient.diagnosis[i];

        let diagnosis: typeof Diagnoses.$inferSelect;

        const [foundDiagnosis] = await tx
          .select()
          .from(Diagnoses)
          .where(eq(Diagnoses.name, currentDiagnosisText));

        if (foundDiagnosis) {
          diagnosis = foundDiagnosis;
        } else {
          const newRow = await createDiagnosis(currentDiagnosisText, tx);

          if (newRow.success) {
            diagnosis = newRow.data;
          } else {
            console.error(
              'failed creating diagnosis',
              currentDiagnosisText,
              'for patient',
              newPatient.id,
              foundPerson?.name
            );
            continue;
          }
        }

        await tx.insert(Patient_Diagnoses).values({
          patient_id: newPatient.id,
          diagnosis_id: diagnosis.id,
          timestamp: patient.admission_date,
        });
      }

      return newPatient;
    });

    return {
      success: true,
      data: new_patient,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function createPatientFromSeed(patient: App.CustomTypes['PatientSeedT']) {
  try {
    const new_patient = await db.transaction(async (tx) => {
      let foundPerson: typeof People.$inferSelect | null = null;

      if (!patient.person_id) {
        if (patient.id_doc_num) {
          [foundPerson] = await tx
            .select()
            .from(People)
            .where(eq(People.id_doc_num, patient.id_doc_num!));
        }

        if (!foundPerson) {
          let numberValidity;

          if (patient.id_doc_type === 1 && patient.id_doc_num) {
            try {
              numberValidity = verifyEgyptianNationalId(patient.id_doc_num);
              if (!numberValidity) patient.id_doc_num = patient.id_doc_num + ' INVALID';
            } catch (e) {
              patient.id_doc_num = patient.id_doc_num + ' INVALID';
            }
          }

          const { id: droppedPatientId, ...restOfPatientData } = patient;
          [foundPerson] = await tx.insert(People).values(restOfPatientData).returning();
        }

        patient.person_id = foundPerson.id;
      }

      if (patient.admission_notes?.includes('مسجون')) {
        patient.security_status = true;
        patient.admission_notes?.replace('مسجون', '');
      }

      const [newPatient] = await tx
        .insert(Patients)
        .values({
          ...patient,
          recent_ward: patient.admission_ward,
        } as App.Require<App.CustomTypes['PatientSeedT'], 'person_id'>)
        .returning();

      await tx.insert(Patient_wards).values({
        patient_id: newPatient.id,
        ward: patient.admission_ward,
        timestamp: patient.admission_date,
        notes: 'admission',
      });

      const pDiagnoses = patient.diagnosis.split('+').map((d) => d.trim());

      for (let i = 0; i < pDiagnoses.length; i++) {
        const currentDiagnosisText = pDiagnoses[i];

        let diagnosis: typeof Diagnoses.$inferSelect;

        const [foundDiagnosis] = await tx
          .select()
          .from(Diagnoses)
          .where(eq(Diagnoses.name, currentDiagnosisText));

        if (foundDiagnosis) {
          diagnosis = foundDiagnosis;
        } else {
          const newRow = await createDiagnosis(currentDiagnosisText, tx);

          if (newRow.success) {
            diagnosis = newRow.data;
          } else {
            console.error(
              'failed creating diagnosis',
              currentDiagnosisText,
              'for patient',
              newPatient.id,
              foundPerson?.name
            );
            continue;
          }
        }

        await tx.insert(Patient_Diagnoses).values({
          patient_id: newPatient.id,
          diagnosis_id: diagnosis.id,
          timestamp: patient.admission_date,
        });
      }

      return newPatient;
    });

    return {
      success: true,
      data: new_patient,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function transferPatient(transfer: typeof Patient_wards.$inferInsert) {
  try {
    const new_transfer = await db.transaction(async (tx) => {
      const [transferInsert] = await tx
        .insert(Patient_wards)
        .values(transfer)
        .returning();

      await tx
        .update(Patients)
        .set({ recent_ward: transfer.ward })
        .where(eq(Patients.id, transfer.patient_id));

      return transferInsert;
    });

    return {
      success: true,
      data: new_transfer,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function dischargePatient(patientDischarge: {
  id: string;
  discharge_reason: number;
  discharge_date: Date;
  discharge_notes?: string;
}) {
  try {
    const [patient] = await db
      .update(Patients)
      .set({
        discharge_date: patientDischarge.discharge_date,
        discharge_reason: patientDischarge.discharge_reason,
        discharge_notes: patientDischarge.discharge_notes ?? null,
      })
      .where(eq(Patients.id, patientDischarge.id))
      .returning({ id: Patients.id, person_id: Patients.person_id });

    const [person] = await db
      .select()
      .from(People)
      .where(eq(People.id, patient.person_id));

    return {
      success: true,
      data: { id: patient.id, name: person.name },
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function getLastMedicalNumber() {
  const num = (
    await db
      .select({ mId: Patients.id })
      .from(Patients)
      .where(like(Patients.id, `${new Date().getFullYear().toString().slice(2, 4)}/%`))
  )
    .map((mn) => Number(mn?.mId.split('/')[1] || '0'))
    .sort((a, b) => a - b)
    .pop();

  return num || 0;
}

export async function getDiagnoses() {
  const diagnoses_list = await db.select().from(Diagnoses);

  return diagnoses_list.map((d) => d.name) || [];
}
