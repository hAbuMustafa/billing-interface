import { db } from '$lib/server/db';
import {
  Patient_dismissal_reasons,
  Patient_id_doc_type,
  Patient_wards,
  Patients,
  Wards,
} from '$lib/server/db/schema';

export async function createWard(ward: typeof Wards.$inferInsert) {
  const ins = await db.insert(Wards).values(ward).returning();

  return ins[0];
}

export async function createIdDocType(docType: typeof Patient_id_doc_type.$inferInsert) {
  const ins = await db.insert(Patient_id_doc_type).values(docType).returning();

  return ins[0];
}

export async function createDismissalReason(
  dismissalReason: typeof Patient_dismissal_reasons.$inferInsert
) {
  const ins = await db
    .insert(Patient_dismissal_reasons)
    .values(dismissalReason)
    .returning();

  return ins[0];
}

export async function createPatient(patient: typeof Patients.$inferInsert) {
  const ins = await db.insert(Patients).values(patient).returning();

  return ins[0];
}

export async function transferPatient(transfer: typeof Patient_wards.$inferInsert) {
  const ins = await db.insert(Patient_wards).values(transfer).returning();

  return ins[0];
}
