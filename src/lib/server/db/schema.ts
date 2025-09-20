import { sqliteTable, index, integer, text, unique, real } from 'drizzle-orm/sqlite-core';

export const Wards = sqliteTable('Wards', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  floor: integer().notNull(),
});

export const Patient_dismissal_reasons = sqliteTable('Patient_dismissal_reasons', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const Patient_id_doc_type = sqliteTable('Patient_id_doc_type', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const Patient_wards = sqliteTable(
  'Patient_wards',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    patient_id: text()
      .notNull()
      .references(() => People_Patients.id),
    ward: integer()
      .notNull()
      .references(() => Wards.id),
    notes: text(),
    timestamp: integer({ mode: 'timestamp' }).notNull().default(new Date()),
  },
  (table) => [index('trans_patient_id_link_idx').on(table.patient_id)]
);

export const People = sqliteTable('People', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  id_doc_type: integer({ mode: 'number' }).references(() => Patient_id_doc_type.id),
  id_doc_num: text(),
  gender: integer({ mode: 'boolean' }),
  birthdate: integer({ mode: 'timestamp' }),
  health_insurance: integer({ mode: 'boolean' }),
});

export const People_Patients = sqliteTable('People_Patients', {
  id: text().notNull().primaryKey(),
  person_id: integer({ mode: 'number' })
    .notNull()
    .references(() => People.id),
  diagnosis: text(),
  admission_date: integer({ mode: 'timestamp' }).notNull().default(new Date()),
  admission_notes: text(),
  dismissal_date: integer({ mode: 'timestamp' }),
  dismissal_reason: integer().references(() => Patient_dismissal_reasons.id),
  dismissal_notes: text(),
});

export const Drugs_unit = sqliteTable('Drugs_unit', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const Drugs_category = sqliteTable('Drugs_category', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const Drugs_page_number = sqliteTable('Drugs_page_number', {
  drug_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Ph_InEco_Stock.id),
  record_id: integer({ mode: 'number' }).notNull(), // رقم الدفتر
  record_page_number: integer().notNull(),
});

export const Drugs_amb_name = sqliteTable('Drugs_amb_name', {
  drug_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Drugs.id),
  sound_like_id: integer({ mode: 'number' })
    .notNull()
    .references(() => Drugs.id),
});

export const Drugs_amb_look = sqliteTable('Drugs_amb_look', {
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
    .references(() => Drugs_unit.id),
  category: integer()
    .notNull()
    .references(() => Drugs_category.id),
  smc_code: integer(),
  cat_strategy: integer({ mode: 'boolean' }),
  cat_high_concentration_electrolyte: integer({ mode: 'boolean' }),
  cat_dangerous: integer({ mode: 'boolean' }),
  cat_upa_quota: integer({ mode: 'boolean' }),
});

export const Ph_InEco_Stock = sqliteTable(
  'Ph_InEco_Stock',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    drug_id: integer({ mode: 'number' })
      .notNull()
      .references(() => Drugs.id),
    amount: integer({ mode: 'number' }).notNull().default(0),
    price_purchase: real().notNull(),
    expiry_date: integer({ mode: 'timestamp' }),
    batch_number: text(),
  },
  (table) => [index('drug_id_stock_link').on(table.drug_id)]
);

export const Ph_InEco_Transactions = sqliteTable(
  'Ph_InEco_Transactions',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    timestamp: integer({ mode: 'timestamp' }).notNull().default(new Date()),
    item_id: integer({ mode: 'number' })
      .notNull()
      .references(() => Ph_InEco_Stock.id),
    amount: integer().notNull(),
    patient_id: text()
      .notNull()
      .references(() => People_Patients.id),
    user_id: integer()
      .notNull()
      .references(() => Sys_Users.id),
    pb_key_id: integer({ mode: 'number' })
      .notNull()
      .references(() => Sys_Sec_pb_key.id),
    signature: text().notNull(),
  },
  (table) => [
    index('item_id_tx_link_idx').on(table.item_id),
    index('patient_id_tx_link').on(table.patient_id),
    index('user_id_tx_link').on(table.user_id),
    index('user_pb_key_id_tx_link').on(table.pb_key_id),
  ]
);

export const Sys_Users = sqliteTable(
  'Sys_Users',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    username: text().notNull(),
    hashed_pw: text().notNull(),
    name: text().notNull(),
    phone_number: text().notNull(),
    email: text(),
    national_id: text(),
    role: integer().notNull(),
    created_at: integer({ mode: 'timestamp' }).notNull().default(new Date()),
    active: integer({ mode: 'boolean' }).notNull().default(false),
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
    index('pb_key_for_user_link').on(table.pb_key_id),
    index('pv_key_for_user_link').on(table.pv_key_id),
  ]
);

export const Sys_Sessions = sqliteTable(
  'Sys_Sessions',
  {
    id: text().primaryKey(),
    user_id: integer({ mode: 'number' })
      .notNull()
      .references(() => Sys_Users.id),
    expires_at: integer({ mode: 'timestamp' })
      .notNull()
      .default(new Date(new Date().getTime() + 60 * 60 * 1000 * 6)),
  },
  (table) => [index('sessions_user_link').on(table.user_id)]
);

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

export const Invoice = sqliteTable(
  'Invoice',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    patient_id: text()
      .notNull()
      .references(() => People_Patients.id),
    created_by: integer({ mode: 'number' })
      .notNull()
      .references(() => Sys_Users.id),
    created_at: integer({ mode: 'timestamp' }).notNull().default(new Date()),
    from: integer({ mode: 'timestamp' }).notNull(),
    till: integer({ mode: 'timestamp' }).notNull(),
    total: real().notNull(),
    pb_key_id: integer({ mode: 'number' })
      .notNull()
      .references(() => Sys_Sec_pb_key.id),
    signature: text().notNull(),
  },
  (table) => [
    index('invoice_creator_link').on(table.created_by),
    index('invoice_patient_link').on(table.patient_id),
    index('invoice_pb_key_link').on(table.pb_key_id),
  ]
);

export const Invoice_Items = sqliteTable(
  'Invoice_Items',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    invoice_id: integer({ mode: 'number' })
      .notNull()
      .references(() => Invoice.id),
    item_id: integer({ mode: 'number' })
      .notNull()
      .references(() => Ph_InEco_Stock.id),
    amount: integer({ mode: 'number' }).notNull().default(1),
    unit_price: real().notNull(),
  },
  (table) => [
    index('invoice_items_link').on(table.item_id),
    index('invoice_invoice_id_link').on(table.invoice_id),
  ]
);
