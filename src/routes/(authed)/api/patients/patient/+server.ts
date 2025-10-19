import { db } from '$lib/server/db/index.js';
import {
  Diagnoses,
  Patient_Diagnoses,
  Patient_wards,
  Patients,
  People,
  Wards,
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ url }) {
  const patient_id = url.searchParams.get('id');

  if (!patient_id || !/^\d{2}\/\d{1,}$/.test(patient_id))
    return new Response('Bad Request', { status: 401 });

  const patient_data = await db
    .select()
    .from(Patients)
    .where(eq(Patients.id, patient_id))
    .leftJoin(People, eq(Patients.person_id, People.id))
    .leftJoin(Patient_wards, eq(Patients.id, Patient_wards.patient_id))
    .leftJoin(Wards, eq(Patient_wards.ward, Wards.id))
    .leftJoin(Patient_Diagnoses, eq(Patient_Diagnoses.patient_id, patient_id))
    .leftJoin(Diagnoses, eq(Patient_Diagnoses.diagnosis_id, Diagnoses.id));

  return new Response(JSON.stringify(patient_data), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
