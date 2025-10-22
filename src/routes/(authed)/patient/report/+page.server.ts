import { new_Wards } from '$lib/server/db/menus.js';

export async function load({ fetch }) {
  const currentInpatient = await fetch('/api/patients/current-inpatient').then((d) =>
    d.json()
  );

  return {
    title: 'بيان الإشغال',
    wards: new_Wards,
    patients: currentInpatient.map(
      (p: {
        id: string;
        name: string;
        admission_date: string;
        recent_ward: number;
        diagnosis: string;
      }) => ({
        ...p,
        admission_date: new Date(p.admission_date),
      })
    ),
  };
}
