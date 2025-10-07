import { db } from '$lib/server/db';
import {
  Patient_discharge_reasons,
  Patient_id_doc_type,
  Patient_wards,
  People,
  People_Patients,
  Wards,
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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

export async function createPatient(patient: App.CustomTypes['PatientT']) {
  try {
    const new_patient = await db.transaction(async (tx) => {
      let foundPerson;

      if (!patient.person_id) {
        if (patient.id_doc_num) {
          [foundPerson] = await tx
            .select()
            .from(People)
            .where(eq(People.id_doc_num, patient.id_doc_num!));
        }

        if (!foundPerson) {
          const { id: droppedPatientId, ...restOfPatientData } = patient;
          [foundPerson] = await tx.insert(People).values(restOfPatientData).returning();
        }

        patient.person_id = foundPerson.id;
      }

      const [p] = await tx
        .insert(People_Patients)
        .values(patient as App.Require<App.CustomTypes['PatientT'], 'person_id'>)
        .returning();

      await tx.insert(Patient_wards).values({
        patient_id: p.id,
        ward: patient.admission_ward,
        timestamp: patient.admission_date,
        notes: 'admission',
      });

      return p;
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
        .update(People_Patients)
        .set({ recent_ward: transfer.ward })
        .where(eq(People_Patients.id, transfer.patient_id));

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
