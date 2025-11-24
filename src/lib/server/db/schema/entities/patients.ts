import {
  mysqlTable,
  serial,
  varchar,
  bigint,
  int,
  decimal,
  longtext,
  date,
  tinyint,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { Staff, Ward } from './hospital';
import { Sec_pb_key } from './system';
import { Person } from './people';

export const InPatient = mysqlTable('InPatient', {
  id: serial().primaryKey(),
  person_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Person.id),
  meal_type: varchar({ length: 45 }),
  recent_ward: int()
    .notNull()
    .references(() => Ward.id),
  security_status: tinyint().default(0),
});

export const Insurance_Doc = mysqlTable('Insurance_Doc', {
  patient_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => InPatient.id),
  insurance_entity: varchar({ length: 45 }).notNull(),
  insurance_number: varchar({ length: 30 }),
  type: varchar({ length: 45 }),
  valid_from_date: date({ mode: 'date' }),
  expiration_date: date({ mode: 'date' }),
  stay: varchar({ length: 45 }),
  medication_deductible_percent: decimal(),
  lab_deductible_percent: decimal(),
  radiology_deductible_percent: decimal(),
  dental_deductible_percent: decimal(),
  maternal_deductible_percent: decimal(),
});

export const Diagnosis = mysqlTable('Diagnosis', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  icd11: varchar({ length: 45 }),
});

export const Patient_diagnosis = mysqlTable('Patient_diagnosis', {
  patient_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => InPatient.id),
  diagnosis_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Diagnosis.id),
  timestamp: timestamp({ mode: 'date' }).notNull(),
  type: varchar({ length: 45 }),
  diagnosing_phys_id: int().references(() => Staff.id),
  diagnosing_phys_signature: varchar({ length: 256 }),
  diagnosing_phys_sign_key_id: bigint({ mode: 'number', unsigned: true }).references(
    () => Sec_pb_key.id
  ),
});

export const Admission_Order = mysqlTable('Admission_Order', {
  id: serial().primaryKey(),
  person_id: bigint({ mode: 'number', unsigned: true })
    .references(() => Person.id)
    .notNull(),
  notes: longtext(),
  timestamp: timestamp({ mode: 'date' }).notNull().defaultNow(),
  referred_from: varchar({ length: 100 }).default('reception'),
  admitting_phys: int()
    .references(() => Staff.id)
    .notNull(),
  admitting_phys_signature: varchar({ length: 256 }).notNull(),
  admitting_phys_sign_key_id: bigint({ mode: 'number', unsigned: true })
    .references(() => Sec_pb_key.id)
    .notNull(),
});

export const Admission = mysqlTable('Admission', {
  id: varchar({ length: 8 }).primaryKey(), // Archive File Number
  patient_id: bigint({ mode: 'number', unsigned: true })
    .references(() => InPatient.id)
    .notNull(),
  admission_order_id: bigint({ mode: 'number', unsigned: true }).references(
    () => Admission_Order.id
  ),
  admission_notes: longtext(),
  timestamp: timestamp({ mode: 'date' }).notNull().defaultNow(),
  registrar: int().references(() => Staff.id),
});

export const Discharge_Reason = mysqlTable('Discharge_Reason', {
  id: int().primaryKey(),
  reason: varchar({ length: 15 }).notNull(),
});

export const Discharge_Order = mysqlTable('Discharge_Order', {
  id: serial().primaryKey(),
  patient_id: bigint({ mode: 'number', unsigned: true })
    .references(() => InPatient.id)
    .notNull(),
  notes: longtext(),
  phys_id: int()
    .references(() => Staff.id)
    .notNull(),
  phys_signature: varchar({ length: 256 }).notNull(),
  phys_sign_key: bigint({ mode: 'number', unsigned: true })
    .references(() => Sec_pb_key.id)
    .notNull(),
  timestamp: timestamp({ mode: 'date' }).notNull(),
});

export const Discharge = mysqlTable('Discharge', {
  id: serial().primaryKey(),
  patient_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => InPatient.id),
  discharge_order_id: bigint({ mode: 'number', unsigned: true }).references(
    () => Discharge_Order.id
  ),
  timestamp: timestamp({ mode: 'date' }).notNull(),
  discharge_reason: int()
    .notNull()
    .references(() => Discharge_Reason.id),
  notes: longtext(),
  registrar: int().references(() => Staff.id),
  registrar_signature: varchar({ length: 256 }),
  registrar_sign_key: bigint({ mode: 'number', unsigned: true }).references(
    () => Sec_pb_key.id
  ),
});

export const Transfer_Order = mysqlTable('Transfer_Order', {
  id: serial().primaryKey(),
  patient_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => InPatient.id),
  to_ward: int()
    .notNull()
    .references(() => Ward.id),
  notes: longtext(),
  phys_id: int()
    .notNull()
    .references(() => Staff.id),
  phys_signature: varchar({ length: 256 }).notNull(),
  phys_sign_key_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Sec_pb_key.id),
  timestamp: timestamp({ mode: 'date' }).notNull(),
});

export const Transfer = mysqlTable('Transfer', {
  id: serial().primaryKey(),
  patient_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => InPatient.id),
  from_ward_id: int().references(() => Ward.id),
  to_ward_id: int()
    .notNull()
    .references(() => Ward.id),
  transfer_order_id: bigint({ mode: 'number', unsigned: true }).references(
    () => Transfer_Order.id
  ),
  notes: longtext(),
  timestamp: timestamp({ mode: 'date' }).notNull(),
});
