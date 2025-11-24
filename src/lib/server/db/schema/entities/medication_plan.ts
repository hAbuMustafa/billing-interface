import {
  mysqlTable,
  serial,
  varchar,
  foreignKey,
  bigint,
  int,
  decimal,
  longtext,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { InPatient } from './patients';
import { Formulary } from './pharmacy';
import { Staff } from './hospital';
import { Sec_pb_key } from './system';

export const MedPlan = mysqlTable(
  'MedPlan',
  {
    id: serial().primaryKey(),
    timestamp: timestamp({ mode: 'date' }).notNull(),
    patient_id: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => InPatient.id),
    medication_id: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => Formulary.id),
    amount: decimal({ precision: 10, scale: 2 }).notNull(),
    amount_unit: varchar({ length: 15 }).notNull(),
    frequency: decimal({ precision: 10, scale: 2 }).notNull(),
    duration_days: decimal({ precision: 10, scale: 2 }).notNull(),
    mixed_with: bigint({ mode: 'number', unsigned: true }),
    discontinued_at: timestamp({ mode: 'date' }),
    discontinue_phys_id: int().references(() => Staff.id),
    discontinue_phys_signature: varchar({ length: 256 }),
    discontinue_phys_sign_key_id: bigint({ mode: 'number', unsigned: true }).references(
      () => Sec_pb_key.id
    ),
  },
  (table) => [
    foreignKey({
      columns: [table.mixed_with],
      foreignColumns: [table.id],
      name: 'mixture_link',
    }),
  ]
);

export const MedPlan_note = mysqlTable('MedPlan_note', {
  id: serial().primaryKey(),
  timestamp: timestamp({ mode: 'date' }).notNull(),
  med_plan_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => MedPlan.id),
  note: longtext().notNull(),
  note_type: int()
    .notNull()
    .references(() => MedPlan_note_type.id),
  author_id: int()
    .notNull()
    .references(() => Staff.id),
  author_signature: varchar({ length: 256 }).notNull(),
  author_sign_key_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Sec_pb_key.id),
});

export const MedPlan_note_type = mysqlTable('MedPlan_note_type', {
  id: int().primaryKey(),
  type: text().notNull(),
});

export const MedPlan_sign_nurse = mysqlTable('MedPlan_sign_nurse', {
  med_plan_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => MedPlan.id),
  nurse_id: int()
    .notNull()
    .references(() => Staff.id),
  nurse_signature: varchar({ length: 256 }).notNull(),
  nurse_sign_key_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Sec_pb_key.id),
  signature_time: timestamp({ mode: 'date' }).notNull(),
});

export const MedPlan_sign_pharm = mysqlTable('MedPlan_sign_pharm', {
  med_plan_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => MedPlan.id),
  pharm_id: int()
    .notNull()
    .references(() => Staff.id),
  pharm_signature: varchar({ length: 256 }).notNull(),
  pharm_signature_key_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Sec_pb_key.id),
  signature_time: timestamp({ mode: 'date' }).notNull(),
});

export const MedPlan_sign_phys = mysqlTable('MedPlan_sign_phys', {
  med_plan_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => MedPlan.id),
  phys_id: int()
    .notNull()
    .references(() => Staff.id),
  phys_signature: varchar({ length: 256 }).notNull(),
  phys_signature_key_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Sec_pb_key.id),
  signature_time: timestamp({ mode: 'date' }).notNull(),
});
