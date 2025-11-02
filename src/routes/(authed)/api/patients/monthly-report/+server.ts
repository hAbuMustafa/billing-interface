import { db } from '$lib/server/db/index.js';
import { Patients } from '$lib/server/db/schema.js';
import { between } from 'drizzle-orm';

export async function GET({ url }) {
  const year = url.searchParams.get('year');
  const month = url.searchParams.get('month');

  if (!month || !year) {
    return new Response('Bad Request', { status: 401 });
  }

  const castYear = Number(year);
  const castMonth = Number(month);

  const admissions = await db.query.Patients.findMany({
    with: {
      Person: true,
    },
    where: between(
      Patients.admission_date,
      new Date(castYear, castMonth - 1, 1),
      new Date(castYear, castMonth, 0)
    ),
  });

  const discharges = await db.query.Patients.findMany({
    with: {
      Person: true,
    },
    where: between(
      Patients.discharge_date,
      new Date(castYear, castMonth - 1, 1),
      new Date(castYear, castMonth, 0)
    ),
  });

  return new Response(JSON.stringify({ admissions, discharges }), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
