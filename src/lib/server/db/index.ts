import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '$lib/server/db/schema';

export const db = drizzle({
  connection: { url: 'file:data.db' },
  schema,
});
