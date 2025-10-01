import { db } from '$lib/server/db/index.js';
import { floors, new_id_doc_type, new_Wards } from '$lib/server/db/menus';
import { People_Patients } from '$lib/server/db/schema.js';
import { like } from 'drizzle-orm';

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
    // todo: implement
  },
};
