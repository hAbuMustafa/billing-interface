import { db } from '$lib/server/db';
import { People, People_Patients, Wards } from '$lib/server/db/schema';
import { regexp } from '$lib/utils/drizzle';
import { regexifiedPersonName } from '$lib/utils/querying';
import { and, desc, eq, isNull, like, or } from 'drizzle-orm';

export async function GET({ url }) {
  let query = url.searchParams.get('q') || '';
  query = query.trim();

  if (query === '') return new Response('Bad request', { status: 401 });

  const isNumber = /\d/g.test(query);

  const matchedPeople = await db
    .select({
      id: People_Patients.id,
      name: People.name,
      id_doc_num: People.id_doc_num,
      admission_date: People_Patients.admission_date,
      recent_ward: Wards.name,
    })
    .from(People_Patients)
    .leftJoin(People, eq(People_Patients.person_id, People.id))
    .leftJoin(Wards, eq(People_Patients.recent_ward, Wards.id))
    .where(
      and(
        isNull(People_Patients.discharge_date),
        isNumber
          ? or(
              like(People_Patients.id, `%${query}%`),
              like(People.id_doc_num, `%${query}%`)
            )
          : regexp(`"People"."name"`, regexifiedPersonName(query))
      )
    )
    .orderBy(desc(People_Patients.admission_date));

  return new Response(JSON.stringify(matchedPeople), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
