import {
  mysqlTable,
  serial,
  varchar,
  bigint,
  int,
  text,
  date,
  tinyint,
} from 'drizzle-orm/mysql-core';

export const Person = mysqlTable('Person', {
  id: serial().primaryKey(),
  first_name: varchar({ length: 45 }).notNull(),
  father_name: varchar({ length: 45 }).notNull(),
  grandfather_name: varchar({ length: 45 }).notNull(),
  family_name: varchar({ length: 45 }),
  gender: tinyint(),
  birthdate: date({ mode: 'date' }),
  race: varchar({ length: 16 }),
  marital_status: tinyint(),
  religion: varchar({ length: 15 }),
  occupation: varchar({ length: 45 }),
});

export const Contact_type = mysqlTable('Contact_type', {
  id: int().primaryKey(),
  name: varchar({ length: 15 }).notNull(),
});

export const People_contact_information = mysqlTable('People_contact_information', {
  id: serial().primaryKey(),
  person_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Person.id),
  contact_type: int()
    .notNull()
    .references(() => Contact_type.id),
  contact_string: varchar({ length: 100 }).notNull().unique(),
  is_verified: tinyint().default(0),
});

export const IdDoc_type = mysqlTable('IdDoc_type', {
  id: int().primaryKey(),
  name: text().notNull(),
});

export const Person_IdDoc = mysqlTable('Person_IdDoc', {
  id: serial().primaryKey(),
  document_number: varchar({ length: 45 }).notNull().unique(),
  document_type: int().references(() => IdDoc_type.id),
  person_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Person.id),
});

export const Person_relationship = mysqlTable('Person_relationship', {
  person_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Person.id),
  related_to_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Person.id),
  relationship: varchar({ length: 45 }).notNull(),
});
