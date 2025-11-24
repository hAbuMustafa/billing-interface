import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { MySQL_Connection_String } from '$env/static/private';

const connection = await mysql.createConnection({
  uri: `${MySQL_Connection_String}${
    process.env.NODE_ENV !== 'production' ? '_TEST' : ''
  }`,
});

export const db = drizzle({
  client: connection,
});
