import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '$lib/server/db/schema';
import * as relations from '$lib/server/db/relations';

export const db = drizzle({
  connection: { url: 'file:data.db' },
  schema: { ...schema, ...relations },
});
