import { db } from '$lib/server/db';
import {
  Patient_dismissal_reasons,
  Patient_id_doc_type,
  Patient_wards,
  People,
  People_Patients,
  Wards,
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function createWard(ward: typeof Wards.$inferInsert) {
  const [new_ward] = await db.insert(Wards).values(ward).returning();

  return new_ward;
}

export async function createIdDocType(docType: typeof Patient_id_doc_type.$inferInsert) {
  const [new_id_doc_type] = await db
    .insert(Patient_id_doc_type)
    .values(docType)
    .returning();

  return new_id_doc_type;
}

export async function createDismissalReason(
  dismissalReason: typeof Patient_dismissal_reasons.$inferInsert
) {
  const [new_dismissal_reason] = await db
    .insert(Patient_dismissal_reasons)
    .values(dismissalReason)
    .returning();

  return new_dismissal_reason;
}

export async function createPatient(
  patient: typeof People_Patients.$inferInsert & typeof People.$inferInsert
) {
  const [new_patient] = await db.transaction(async (tx) => {
    let foundPerson;

    if (!patient.person_id) {
      [foundPerson] = await db
        .select()
        .from(People)
        .where(eq(People.id_doc_num, patient.id_doc_num!));

      if (!foundPerson) {
        [foundPerson] = await db.insert(People).values(patient).returning();
      }

      patient.person_id = foundPerson.id;
    }

    return await db.insert(People_Patients).values(patient).returning();
  });

  return new_patient;
}

export async function transferPatient(transfer: typeof Patient_wards.$inferInsert) {
  const [new_transfer] = await db.insert(Patient_wards).values(transfer).returning();

  return new_transfer;
}
