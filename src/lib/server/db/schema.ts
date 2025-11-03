import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text, unique, real } from 'drizzle-orm/sqlite-core';

export const Wards = sqliteTable('Wards', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  floor: integer().notNull(),
});

export const Patient_discharge_reasons = sqliteTable('Patient_discharge_reasons', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const Patient_id_doc_type = sqliteTable('Patient_id_doc_type', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const Patient_wards = sqliteTable('Patient_wards', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  patient_id: text()
    .notNull()
    .references(() => Patients.id),
  ward: integer()
    .notNull()
    .references(() => Wards.id),
  notes: text(),
  timestamp: integer({ mode: 'timestamp' }).notNull().default(new Date()),
});

export const People = sqliteTable('People', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  id_doc_type: integer({ mode: 'number' }).references(() => Patient_id_doc_type.id),
  id_doc_num: text(),
  gender: integer({ mode: 'boolean' }),
  birthdate: integer({ mode: 'timestamp' }),
});

export const Patients = sqliteTable('Patients', {
  id: text().notNull().primaryKey(),
  person_id: integer({ mode: 'number' })
    .notNull()
    .references(() => People.id),
  admission_date: integer({ mode: 'timestamp' }).notNull().default(new Date()),
  admission_notes: text(),
  admission_ward: integer()
    .notNull()
    .references(() => Wards.id),
  referred_from: text(),
  recent_ward: integer().references(() => Wards.id),
  discharge_date: integer({ mode: 'timestamp' }),
  discharge_reason: integer().references(() => Patient_discharge_reasons.id),
  discharge_notes: text(),
  health_insurance: integer({ mode: 'boolean' }),
  security_status: integer({ mode: 'boolean' }).notNull().default(false),
});

export const Diagnoses = sqliteTable('Diagnoses', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  icd11: text(),
});

export const Patient_Diagnoses = sqliteTable('Patient_diagnoses', {
  patient_id: text()
    .notNull()
    .references(() => Patients.id),
  diagnosis_id: integer()
    .notNull()
    .references(() => Diagnoses.id),
  timestamp: integer({ mode: 'timestamp' }).notNull(),
  // diagnosing_physician_id:integer().references(()=>Staff.id),
  // diagnosing_physician_signature:text()
});

export const Drug_units = sqliteTable('Drug_units', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const Drug_categories = sqliteTable('Drug_categories', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const Drug_page_numbers = sqliteTable('Drug_page_numbers', {
  drug_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Ph_InEco_Stock.id),
  record_id: integer({ mode: 'number' }).notNull(), // رقم الدفتر
  record_page_number: integer().notNull(),
});

export const Drug_name_like = sqliteTable('Drug_name_like', {
  drug_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Drugs.id),
  sound_like_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Drugs.id),
});

export const Drug_look_like = sqliteTable('Drug_look_like', {
  drug_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Drugs.id),
  look_like_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Drugs.id),
});

export const Drugs = sqliteTable('Drugs', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name_ar: text().notNull(),
  name_en: text().notNull(),
  trade_name_ar: text(),
  trade_name_en: text(),
  unit: integer({ mode: 'number' })
    .notNull()
    .references(() => Drug_units.id),
  category: integer()
    .notNull()
    .references(() => Drug_categories.id),
  smc_code: integer(),
  cat_strategy: integer({ mode: 'boolean' }),
  cat_high_concentration_electrolyte: integer({ mode: 'boolean' }),
  cat_dangerous: integer({ mode: 'boolean' }),
  cat_upa_quota: integer({ mode: 'boolean' }),
});

export const Ph_InEco_Stock = sqliteTable('Ph_InEco_Stock', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  drug_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Drugs.id),
  amount: integer({ mode: 'number' }).notNull().default(0),
  price_purchase: real().notNull(),
  expiry_date: integer({ mode: 'timestamp' }),
  batch_number: text(),
});

export const Ph_InEco_Transactions = sqliteTable('Ph_InEco_Transactions', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  timestamp: integer({ mode: 'timestamp' }).notNull().default(new Date()),
  item_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Ph_InEco_Stock.id),
  amount: integer().notNull(),
  patient_id: text()
    .notNull()
    .references(() => Patients.id),
  user_id: integer()
    .notNull()
    .references(() => Users.id),
  pb_key_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Sys_Sec_pb_key.id),
  signature: text().notNull(),
});

export const Users = sqliteTable(
  'Users',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    username: text().notNull(),
    hashed_pw: text().notNull(),
    name: text().notNull(),
    phone_number: text().notNull(),
    email: text(),
    national_id: text(),
    role: integer().notNull().default(0),
    created_at: integer({ mode: 'timestamp' }).notNull().default(new Date()),
    password_reset_required: integer({ mode: 'boolean' }).default(false).notNull(),
    last_login: integer({ mode: 'timestamp' }),
    pb_key_id: integer({ mode: 'number' })
      .notNull()
      .references(() => Sys_Sec_pb_key.id),
    pv_key_id: integer({ mode: 'number' })
      .notNull()
      .references(() => Sys_Sec_pv_key.id),
  },
  (table) => [
    unique('username_UNIQUE').on(table.username),
    unique('user_mobile_UNIQUE').on(table.phone_number),
    unique('user_email_UNIQUE').on(table.email),
    unique('user_national_id_UNIQUE').on(table.national_id),
  ]
);

export const RefreshTokens = sqliteTable('RefreshTokens', {
  id: text().primaryKey(),
  user_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Users.id),
  token_hash: text().notNull(),
  created_at: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  expires_at: integer({ mode: 'timestamp' }).notNull(),
  last_used_at: integer({ mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const Sys_Sec_pb_key = sqliteTable('Sys_Sec_pb_key', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  key: text().notNull(),
  timestamp: integer({ mode: 'timestamp' }).notNull().default(new Date()),
});

export const Sys_Sec_pv_key = sqliteTable('Sys_Sec_pv_key', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  key: text().notNull(),
  timestamp: integer({ mode: 'timestamp' }).notNull().default(new Date()),
});

export const Invoice = sqliteTable('Invoice', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  patient_id: text()
    .notNull()
    .references(() => Patients.id),
  created_by: integer({ mode: 'number' })
    .notNull()
    .references(() => Users.id),
  created_at: integer({ mode: 'timestamp' }).notNull().default(new Date()),
  from: integer({ mode: 'timestamp' }).notNull(),
  till: integer({ mode: 'timestamp' }).notNull(),
  total: real().notNull(),
  pb_key_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Sys_Sec_pb_key.id),
  signature: text().notNull(),
});

export const Invoice_Items = sqliteTable('Invoice_Items', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  invoice_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Invoice.id),
  item_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Ph_InEco_Stock.id),
  amount: integer({ mode: 'number' }).notNull().default(1),
  unit_price: real().notNull(),
});
