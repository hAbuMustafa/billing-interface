import { db } from '$lib/server/db/';
import { People } from '$lib/server/db/schema.js';
import { regexp } from '$lib/utils/drizzle.js';
import { getRegexString, regexify } from 'extend-arabic-query';

export async function GET({ url }) {
  // receive patient name in a request
  const personName = url.searchParams.get('q') || '';

  if (personName.trim() === '') return new Response('Bad request', { status: 401 });

  const personPattern = regexify(personName);

  // perform database fuzzy search using extend-arabic-query on `People` table
  const matchedPeople = await db
    .select({
      id: People.id,
      name: People.name,
      national_id: People.id_doc_num,
      birthdate: People.birthdate,
    })
    .from(People)
    .where(regexp('name', personPattern));

  // return id, name, and national_id for every patient
  return new Response(JSON.stringify(matchedPeople), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
