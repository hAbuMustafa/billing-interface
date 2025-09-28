import { floors, new_id_doc_type, new_Wards } from '$lib/server/db/menus';

export function load() {
  // todo: make sure submitted data are not stale when manually changing derived fields from a national id. Or when changing id doc type.
  return {
    title: 'تسجيل دخول مريض',
    id_doc_type_list: new_id_doc_type,
    wards_list: new_Wards,
    floors_list: floors,
  };
}

export const actions = {
  default: () => {},
};
