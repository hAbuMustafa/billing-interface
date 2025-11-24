import {
  mysqlTable,
  serial,
  varchar,
  bigint,
  int,
  longtext,
  text,
  tinyint,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { Person } from './people';
import { Staff } from './hospital';

export const Sec_pb_key = mysqlTable('Sec_pb_key', {
  id: serial().primaryKey(),
  key: text().notNull(),
  timestamp: timestamp({ mode: 'date' }).defaultNow().notNull(),
});

export const Sec_pv_key = mysqlTable('Sec_pv_key', {
  id: serial().primaryKey(),
  key: text().notNull(),
  timestamp: timestamp({ mode: 'date' }).defaultNow().notNull(),
});

export const RefreshToken = mysqlTable('RefreshToken', {
  id: varchar({ length: 256 }).primaryKey(),
  user_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => User.id),
  token_hash: varchar({ length: 36 }).notNull(),
  created_at: timestamp({ mode: 'date' }).notNull().defaultNow(),
  expires_at: timestamp({ mode: 'date' }).notNull(),
  last_used_at: timestamp({ mode: 'date' }).defaultNow(),
});

export const User = mysqlTable('User', {
  id: serial().primaryKey(),
  username: varchar({ length: 45 }).notNull().unique(),
  hashed_pw: longtext().notNull(),
  role: int().notNull(),
  person_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Person.id),
  staff_id: int().references(() => Staff.id),
  pb_key_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Sec_pb_key.id),
  pv_key_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Sec_pv_key.id),
  created_at: timestamp({ mode: 'date' }).defaultNow().notNull(),
  active: tinyint().default(0).notNull(),
  last_login: timestamp({ mode: 'date' }),
  password_reset_required: tinyint().default(0).notNull(),
});
