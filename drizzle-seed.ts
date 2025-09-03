import { mysqlTable, int, text, datetime } from 'drizzle-orm/mysql-core';
import { drizzle } from 'drizzle-orm/mysql2';
import { seed } from 'drizzle-seed';
import { createConnection } from 'mysql2';

const people = mysqlTable('People', {
  id: int().primaryKey(),
  first_name: text().notNull(),
  father_name: text().notNull(),
  grandfather_name: text().notNull(),
});
const pubKeys = mysqlTable('S_pb_key', {
  id: int().primaryKey(),
  key: text().notNull(),
  since: datetime().notNull(),
});
const users = mysqlTable('People_Users', {
  id: int().primaryKey(),
  username: text().notNull(),
  hashed_pw: text().notNull(),
  role: int().notNull(),
  person_id: int()
    .notNull()
    .references(() => people.id),
  public_key: int()
    .notNull()
    .references(() => pubKeys.id),
});

async function seeder() {
  const db = drizzle(
    createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: process.env.DATABASE_Connection_PW,
      database: 'J23rdHospital_TEST',
    })
  );
  await seed(db, { people, pubKeys, users });
}

seeder();
