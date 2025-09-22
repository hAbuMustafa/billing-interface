import { transfers } from '$lib/server/db/seed/data/patient_transfers';

export function load() {
  return {
    table: transfers,
  };
}
