import { db } from '$lib/server/db/index.js';
import { Patients } from '$lib/server/db/schema';
import { eq, ne } from 'drizzle-orm';

export async function GET({ url }) {
  const patient_id = url.searchParams.get('id');

  if (!patient_id || !/^\d{2}\/\d{1,}$/.test(patient_id))
    return new Response('Bad Request', { status: 401 });

  const patient_data = await db.query.Patients.findFirst({
    with: {
      Person: {
        with: {
          Patient_id_doc_type: true,
          Patients: {
            with: {
              Patient_discharge_reason: true,
            },
            where: ne(Patients.id, patient_id),
          },
        },
      },
      Patient_wards: {
        with: {
          Ward: true,
        },
      },
      Patient_diagnoses: {
        with: {
          Diagnosis: true,
        },
      },
      Patient_discharge_reason: true,
    },
    where: eq(Patients.id, patient_id),
  });

  if (!patient_data) return new Response('Bad Request', { status: 401 });

  return new Response(JSON.stringify(patient_data), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
