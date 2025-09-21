import { new_Wards } from '$lib/server/db/menus.js';

export function load() {
  return {
    table: new_Wards,
  };
}
