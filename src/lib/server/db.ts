import { drizzle } from 'drizzle-orm/mysql2';
import { DATABASE_Connection_PW } from '$env/static/private';
import * as schema from './schema';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: DATABASE_Connection_PW,
  database: `J23rdHospital${import.meta.env.DEV ? '_TEST' : ''}`,
});

export const db = drizzle({ client: connection, schema, mode: 'default' });
