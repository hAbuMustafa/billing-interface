import {
  mysqlTable,
  varchar,
  foreignKey,
  bigint,
  int,
  text,
  date,
} from 'drizzle-orm/mysql-core';
import { Person } from './people';

export const Ward = mysqlTable('Ward', {
  id: int().primaryKey(),
  name: varchar({ length: 10 }).notNull(),
  floor: int().notNull(),
  capacity: int().default(0),
  tags: text(),
});

export const Staff = mysqlTable(
  'Staff',
  {
    id: int().primaryKey(),
    job: varchar({ length: 45 }).notNull(),
    qualification: varchar({ length: 45 }).notNull(),
    major: varchar({ length: 45 }).notNull(),
    department: varchar({ length: 45 }).notNull(),
    employment_date: date({ mode: 'date' }).notNull(),
    manager_id: int().notNull(),
    person_id: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => Person.id),
  },
  (table) => [
    foreignKey({
      columns: [table.manager_id],
      foreignColumns: [table.id],
      name: 'staff_manager_link',
    }),
  ]
);
