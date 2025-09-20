import { new_id_doc_type, new_Wards } from '$lib/server/db/menus';

export function load() {
  return {
    title: 'تسجيل دخول مريض',
    id_doc_type_list: new_id_doc_type,
    wards_list: new_Wards,
  };
}
