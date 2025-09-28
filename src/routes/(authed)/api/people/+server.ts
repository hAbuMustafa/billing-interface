import { db } from '$lib/server/db/';
import { People } from '$lib/server/db/schema.js';
import { regexp } from '$lib/utils/drizzle.js';
import { eq } from 'drizzle-orm';
import { getRegexString } from 'extend-arabic-query';

export async function GET({ url }) {
  // receive patient name in a request
  let query = url.searchParams.get('q') || '';
  query = query.trim();

  if (query === '') return new Response('Bad request', { status: 401 });

  const isIdNumber = /\d/g.test(query);

  let matchedPeople: any[];

  if (isIdNumber) {
    matchedPeople = await db
      .select({
        id: People.id,
        name: People.name,
        national_id: People.id_doc_num,
        birthdate: People.birthdate,
      })
      .from(People)
      .where(eq(People.id_doc_num, query));
  } else {
    let regexifiedPersonName = new RegExp(
      getRegexString(query)
        .replaceAll('?:', '')
        .replaceAll(' ', '.*')
        .replaceAll('؟', '.')
    );

    // perform database fuzzy search using extend-arabic-query on `People` table
    matchedPeople = await db
      .select({
        id: People.id,
        name: People.name,
        national_id: People.id_doc_num,
        birthdate: People.birthdate,
      })
      .from(People)
      .where(regexp('name', regexifiedPersonName));
  }

  // return id, name, and national_id for every patient
  return new Response(JSON.stringify(matchedPeople), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
