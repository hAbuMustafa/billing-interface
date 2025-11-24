import { drizzle } from 'drizzle-orm/node-postgres';
import { NODE_ENV, PSQL_CONNECTION_STRING } from '$env/static/private';

export const db = drizzle(
  `${PSQL_CONNECTION_STRING}${NODE_ENV !== 'production' ? '_TEST' : ''}`
);
