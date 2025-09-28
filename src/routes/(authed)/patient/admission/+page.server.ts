import { db } from '$lib/server/db/index.js';
import { floors, new_id_doc_type, new_Wards } from '$lib/server/db/menus';
import { People_Patients } from '$lib/server/db/schema.js';

export async function load() {
  // todo: make sure submitted data are not stale when manually changing derived fields from a national id. Or when changing id doc type.
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
  );

  return {
    title: 'تسجيل دخول مريض',
    id_doc_type_list: new_id_doc_type,
    wards_list: new_Wards,
    floors_list: floors,
    diagnoses_list,
  };
}

export const actions = {
  default: () => {},
};
