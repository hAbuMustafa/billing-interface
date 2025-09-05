import { sql } from 'drizzle-orm';
import {
  mysqlTable,
  type AnyMySqlColumn,
  index,
  foreignKey,
  primaryKey,
  int,
  bigint,
  serial,
  decimal,
  varchar,
  longtext,
  tinyint,
  date,
  text,
  unique,
  datetime,
  timestamp,
  char,
} from 'drizzle-orm/mysql-core';

export const S_pb_keys = mysqlTable('S_pb_keys', {
  id: serial().primaryKey(),
  key: text().notNull(),
  since: timestamp().notNull().defaultNow(),
});

export const S_pv_keys = mysqlTable('S_pv_keys', {
  id: serial().primaryKey(),
  key: text().notNull(),
  since: timestamp().notNull().defaultNow(),
});

export const Wards = mysqlTable('Wards', {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 10 }).notNull(),
  floor: int().notNull(),
});

export const D_AC_use = mysqlTable(
  'D_AC_use',
  {
    ac_id: bigint({ mode: 'bigint', unsigned: true }).references(() => D_AC.id),
    use_id: bigint({ mode: 'bigint', unsigned: true }).references(() => D_Uses.id),
  },
  (table) => [
    index('ingredient_link_idx').on(table.ac_id),
    index('use_link_idx').on(table.use_id),
  ]
);

export const D_AC = mysqlTable('D_AC', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  name_ar: varchar({ length: 100 }).notNull(),
  alias: varchar({ length: 45 }),
});

export const D_BrandNames = mysqlTable(
  'D_BrandNames',
  {
    id: serial().primaryKey(),
    formulary_id: bigint({ mode: 'bigint', unsigned: true }).references(
      () => D_Formulary.id
    ),
    name: varchar({ length: 45 }).notNull(),
    name_ar: varchar({ length: 45 }),
    size: decimal().notNull(),
    size_unit: varchar({ length: 15 }).notNull(),
    producer: varchar({ length: 45 }),
  },
  (table) => [index('brand_name_formulary_link_idx').on(table.formulary_id)]
);

export const D_Formulary = mysqlTable('D_Formulary', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  volume_in_ml: decimal({ precision: 5, scale: 2 }),
});

export const D_formulary_roa = mysqlTable(
  'D_formulary_roa',
  {
    formulary_id: bigint({ mode: 'bigint', unsigned: true }).references(
      () => D_Formulary.id
    ),
    roa: int()
      .notNull()
      .references(() => D_ROA.id),
  },
  (table) => [
    index('formulary_name_link_idx').on(table.formulary_id),
    index('formulary_routes_link_idx').on(table.roa),
  ]
);

export const D_Formulations = mysqlTable(
  'D_Formulations',
  {
    id: serial().primaryKey(),
    formulary_id: bigint({ mode: 'bigint', unsigned: true }).references(
      () => D_Formulary.id
    ),
    ac_id: bigint({ mode: 'bigint', unsigned: true }).references(() => D_AC.id),
    amount: decimal({ precision: 10, scale: 5 }).notNull(),
    amount_unit: varchar({ length: 5 }).notNull(),
    role: varchar({ length: 45 }).notNull(),
    role_target: bigint({ mode: 'bigint', unsigned: true }),
  },
  (table) => [
    index('ac_link_idx').on(table.ac_id),
    index('ac_role_target_link_idx').on(table.role_target),
    index('formulary_link_idx').on(table.formulary_id),
    foreignKey({
      columns: [table.role_target],
      foreignColumns: [table.id],
      name: 'ac_role_target_link',
    }),
  ]
);

export const D_ROA = mysqlTable('D_ROA', {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 15 }).notNull(),
});

export const D_Uses = mysqlTable('D_Uses', {
  id: serial().primaryKey(),
  use: varchar({ length: 45 }).notNull(),
});

export const Diagnoses = mysqlTable(
  'Diagnoses',
  {
    id: serial().primaryKey(),
    patient_id: bigint({ mode: 'bigint', unsigned: true }).references(() => Patients.id),
    diagnosis_time: datetime({ mode: 'string' }).notNull(),
    diagnosis: varchar({ length: 45 }).notNull(),
    diagnosis_icd11: varchar({ length: 45 }),
    diagnosing_phys: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People_Staff.id),
    type: varchar({ length: 45 }),
  },
  (table) => [
    index('diagnosing_phys_link_idx').on(table.diagnosing_phys),
    index('patient_diagnosis_link_idx').on(table.patient_id),
  ]
);

export const Patient_admissions = mysqlTable(
  'Patient_admissions',
  {
    timestamp: datetime({ mode: 'string' }).notNull(),
    patient_id: bigint({ mode: 'bigint', unsigned: true }).references(() => Patients.id),
    admission_notes: longtext(),
    admitted_from: varchar({ length: 45 }).notNull(),
    admitting_phys: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People_Staff.id),
    admitting_phys_signature: varchar({ length: 256 }).notNull(),
    admitting_phys_sign_key_id: bigint({ mode: 'bigint', unsigned: true }).references(
      () => S_pb_keys.id
    ),
    registrar: bigint({ mode: 'bigint', unsigned: true }).references(
      () => People_Staff.id
    ),
  },
  (table) => [
    index('admission_patient_id_link_idx').on(table.patient_id),
    index('admission_phys_id_link_idx').on(table.admitting_phys),
    index('admitting_phys_sign_key_id_link_idx').on(table.admitting_phys_sign_key_id),
    index('admitting_registrar_id_link_idx').on(table.registrar),
  ]
);

export const Patient_Exit_Orders = mysqlTable(
  'Patient_Exit_Orders',
  {
    id: serial().primaryKey(),
    patient_id: bigint({ mode: 'bigint', unsigned: true }).references(() => Patients.id),
    notes: longtext(),
    phys_id: bigint({ mode: 'bigint', unsigned: true }).references(() => People_Staff.id),
    phys_signature: varchar({ length: 256 }).notNull(),
    phys_sign_key: bigint({ mode: 'bigint', unsigned: true }).references(
      () => S_pb_keys.id
    ),
    timestamp: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('patient_exit_orders_patient_id_link_idx').on(table.patient_id),
    index('patient_exit_orders_phys_sign_key_id_link_idx').on(table.phys_sign_key),
    index('patient_exit_orders_phys_id_link_idx').on(table.phys_id),
  ]
);

export const Patient_exit_reasons = mysqlTable('Patient_exit_reasons', {
  id: int().autoincrement().primaryKey(),
  reason: varchar({ length: 15 }).notNull(),
});

export const Patient_Exit = mysqlTable(
  'Patient_Exit',
  {
    id: serial().primaryKey(),
    patient_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => Patients.id),
    exit_order_id: bigint({ mode: 'bigint', unsigned: true }).references(
      () => Patient_Exit_Orders.id
    ),
    timestamp: datetime({ mode: 'string' }).notNull(),
    exit_reason: int()
      .notNull()
      .references(() => Patient_exit_reasons.id),
    notes: longtext(),
    registrar: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People_Staff.id),
    registrar_signature: varchar({ length: 256 }).notNull(),
    registrar_sign_key: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => S_pb_keys.id),
  },
  (table) => [
    index('patient_exit_exit_order_id_link_idx').on(table.exit_order_id),
    index('patient_exit_patient_id_link_idx').on(table.patient_id),
    index('patient_exit_reason_id_link_idx').on(table.exit_reason),
    index('patient_exit_registrar_id_link_idx').on(table.registrar),
    index('patient_exit_registrar_sign_key_id_link_idx').on(table.registrar_sign_key),
  ]
);

export const People_Insurance = mysqlTable(
  'People_Insurance',
  {
    person_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People.id),
    insurance_number: varchar({ length: 45 }).notNull(),
    insurance_entity: varchar({ length: 45 }).notNull(),
    type: varchar({ length: 45 }).notNull(),
    valid_from_date: date({ mode: 'date' }).notNull(),
    expiration_date: date({ mode: 'date' }).notNull(),
    stay: varchar({ length: 45 }),
    medication_deductible_percent: decimal().default('1').notNull(),
    lab_deductible_percent: decimal().default('1').notNull(),
    radiology_deductible_percent: decimal().default('1').notNull(),
    dental_deductible_percent: decimal().default('1').notNull(),
    maternal_deductible_percent: decimal().default('1').notNull(),
  },
  (table) => [index('person_insurance_link_idx').on(table.person_id)]
);

export const Patient_trans_orders = mysqlTable(
  'Patient_trans_orders',
  {
    id: serial().primaryKey(),
    patient_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => Patients.id),
    ward: int()
      .notNull()
      .references(() => Wards.id),
    notes: longtext(),
    phys_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People_Staff.id),
    phys_signature: varchar({ length: 256 }).notNull(),
    phys_sign_key_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => S_pb_keys.id),
    timestamp: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('trans_order_patient_id_link_idx').on(table.patient_id),
    index('trans_order_phys_id_link_idx').on(table.phys_id),
    index('trans_order_phys_sign_id_link_idx').on(table.phys_sign_key_id),
    index('trans_order_ward_id_link_idx').on(table.ward),
  ]
);

export const Patient_trans = mysqlTable(
  'Patient_trans',
  {
    id: serial().primaryKey(),
    patient_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => Patients.id),
    notes: longtext(),
    nurse_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People.id),
    nurse_signature: varchar({ length: 256 }).notNull(),
    nurse_sign_key_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => S_pb_keys.id),
    timestamp: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('trans_order_nurse_id_link_idx').on(table.nurse_id),
    index('trans_order_nurse_sign_key_id_link_idx').on(table.nurse_sign_key_id),
    index('trans_patient_id_link_idx').on(table.patient_id),
  ]
);

export const Patients = mysqlTable(
  'Patients',
  {
    id: serial().primaryKey(),
    person_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People.id),
    meal_type: varchar({ length: 45 }).notNull(),
    ward: int()
      .notNull()
      .references(() => Wards.id),
  },
  (table) => [
    index('patients_person_id_link_idx').on(table.person_id),
    index('patients_ward_link_idx').on(table.ward),
  ]
);

export const People_contact_information = mysqlTable(
  'People_contact_information',
  {
    id: serial().primaryKey(),
    contact_string: varchar({ length: 100 }).notNull(),
    contact_type: varchar({ length: 45 }).notNull(),
    person_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People.id),
    is_verified: tinyint().notNull(),
  },
  (table) => [
    index('contact_person_link_idx').on(table.person_id),
    unique('contact_string_UNIQUE').on(table.contact_string),
    unique('id_contact_information_UNIQUE').on(table.id),
  ]
);

export const People_identifying_documents = mysqlTable(
  'People_identifying_documents',
  {
    id: serial().primaryKey(),
    document_number: varchar({ length: 45 }).notNull(),
    document_type: varchar({ length: 20 }).notNull(),
    person_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People.id),
  },
  (table) => [index('document_person_link_idx').on(table.person_id)]
);

export const People = mysqlTable('People', {
  id: serial().primaryKey(),
  first_name: varchar({ length: 45 }).notNull(),
  father_name: varchar({ length: 45 }).notNull(),
  grandfather_name: varchar({ length: 45 }).notNull(),
  family_name: varchar({ length: 45 }),
  birthdate: date({ mode: 'date' }),
  race: varchar({ length: 16 }),
  marital_status: tinyint(),
  gender: tinyint(),
  religion: varchar({ length: 15 }),
  occupation: varchar({ length: 45 }),
});

export const People_relationships = mysqlTable(
  'People_relationships',
  {
    person_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People.id),
    related_to_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People.id),
    relationship: varchar({ length: 45 }).notNull(),
  },
  (table) => [
    index('people_relations_link_idx').on(table.person_id, table.related_to_id),
    index('person_relations_reference_idx').on(table.person_id),
    index('person_relative_reference_idx').on(table.related_to_id),
  ]
);

export const People_Staff = mysqlTable(
  'People_Staff',
  {
    id: serial().primaryKey(),
    job: varchar({ length: 45 }).notNull(),
    qualification: varchar({ length: 45 }).notNull(),
    major: varchar({ length: 45 }).notNull(),
    department: varchar({ length: 45 }).notNull(),
    employment_date: date({ mode: 'date' }).notNull(),
    manager_id: bigint({ mode: 'bigint', unsigned: true }).notNull(),
    person_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People.id),
  },
  (table) => [
    index('staff_manager_link_idx').on(table.manager_id),
    index('staff_person_link_idx').on(table.person_id),
    foreignKey({
      columns: [table.manager_id],
      foreignColumns: [table.id],
      name: 'staff_manager_link',
    }),
  ]
);

export const Ph_InEco = mysqlTable(
  'Ph_InEco',
  {
    id: serial().primaryKey(),
    brand_name_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => D_BrandNames.id),
    amount: int().notNull(),
    unit_price: decimal({ precision: 10, scale: 5 }).notNull(),
    expiry_date: date({ mode: 'date' }),
    batch_number: varchar({ length: 32 }),
  },
  (table) => [index('drug_id_link_idx').on(table.brand_name_id)]
);

export const Ph_InEco_Transactions = mysqlTable(
  'Ph_InEco_Transactions',
  {
    id: serial().primaryKey(),
    timestamp: datetime({ mode: 'string' }).notNull(),
    item_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => Ph_InEco.id),
    amount: int().notNull(),
    pharm_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People_Staff.id),
    pharm_signature: varchar({ length: 256 }).notNull(),
    pharm_sign_key: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => S_pb_keys.id),
    med_plan_id: bigint({ mode: 'bigint', unsigned: true }).references(() => MedPlan.id),
    dispensing_nurse_id: bigint({ mode: 'bigint', unsigned: true }).references(
      () => People_Staff.id
    ),
  },
  (table) => [
    index('dispensing_pharm_id_link_idx').on(table.pharm_id),
    index('item_id_link_idx').on(table.item_id),
    index('med_plan_link_idx').on(table.med_plan_id),
    index('nurse_id_link_idx').on(table.dispensing_nurse_id),
    index('sign_key_link_idx').on(table.pharm_sign_key),
  ]
);

export const MedPlan = mysqlTable(
  'MedPlan',
  {
    id: serial().primaryKey(),
    timestamp: datetime({ mode: 'string' }).notNull(),
    patient_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => Patients.id),
    medication_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => D_Formulary.id),
    amount: decimal({ precision: 10, scale: 2 }).notNull(),
    amount_unit: varchar({ length: 15 }).notNull(),
    frequency: decimal({ precision: 10, scale: 2 }).notNull(),
    duration_days: decimal({ precision: 10, scale: 2 }).notNull(),
    mixed_with: bigint({ mode: 'bigint', unsigned: true }),
    discontinued_at: datetime({ mode: 'string' }),
    discontinue_phys_id: bigint({ mode: 'bigint', unsigned: true }).references(
      () => People_Staff.id
    ),
    discontinue_phys_signature: varchar({ length: 256 }),
    discontinue_phys_sign_key_id: bigint({ mode: 'bigint', unsigned: true }).references(
      () => S_pb_keys.id
    ),
  },
  (table) => [
    index('dc_phy_sign_key_id_link_idx').on(table.discontinue_phys_sign_key_id),
    index('hold_phys_id_link_idx').on(table.discontinue_phys_id),
    index('medication_id_link_idx').on(table.medication_id),
    index('med_plan_patient_id_idx').on(table.patient_id),
    index('mixture_link_idx').on(table.mixed_with),
    foreignKey({
      columns: [table.mixed_with],
      foreignColumns: [table.id],
      name: 'mixture_link',
    }),
  ]
);

export const MedPlan_notes = mysqlTable(
  'MedPlan_notes',
  {
    id: serial().primaryKey(),
    timestamp: datetime({ mode: 'string' }).notNull(),
    med_plan_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => MedPlan.id),
    note: longtext().notNull(),
    note_type: int()
      .notNull()
      .references(() => MedPlan_NoteTypes.id),
    author_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People_Staff.id),
    author_signature: varchar({ length: 256 }).notNull(),
    author_sign_key_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => S_pb_keys.id),
  },
  (table) => [
    index('author_link_idx').on(table.author_id),
    index('author_sign_key_id_link_idx').on(table.author_sign_key_id),
    index('note_type_link_idx').on(table.note_type),
    index('treatment_plan_link_idx').on(table.med_plan_id),
  ]
);

export const MedPlan_NoteTypes = mysqlTable('MedPlan_NoteTypes', {
  id: int().autoincrement().primaryKey(),
  type: text().notNull(),
});

export const MedPlan_sign_nurse = mysqlTable(
  'MedPlan_sign_nurse',
  {
    med_plan_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => MedPlan.id),
    nurse_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People_Staff.id),
    nurse_signature: varchar({ length: 256 }).notNull(),
    nurse_sign_key_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => S_pb_keys.id),
    signature_time: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('med_plan_id_nurse_sign_link_idx').on(table.med_plan_id),
    index('nurse_id_mp_link_idx').on(table.nurse_id),
    index('pharm_sign_key_id_mp_link_idx').on(table.nurse_sign_key_id),
  ]
);

export const MedPlan_sign_pharm = mysqlTable(
  'MedPlan_sign_pharm',
  {
    med_plan_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => MedPlan.id),
    pharm_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People_Staff.id),
    pharm_signature: varchar({ length: 256 }).notNull(),
    pharm_signature_key_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => S_pb_keys.id),
    signature_time: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('med_plan_id_pharm_sign_link_idx').on(table.med_plan_id),
    index('pharm_sign_key_id_mp_link_idx').on(table.pharm_signature_key_id),
    index('phys_id_mp_link_idx').on(table.pharm_id),
  ]
);

export const MedPlan_sign_phys = mysqlTable(
  'MedPlan_sign_phys',
  {
    med_plan_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => MedPlan.id),
    phys_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People_Staff.id),
    phys_signature: varchar({ length: 256 }).notNull(),
    phys_signature_key_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => S_pb_keys.id),
    signature_time: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('med_plan_id_link_idx').on(table.med_plan_id),
    index('phys_id_mp_link_idx').on(table.phys_id),
    index('phys_sign_key_id_mp_link_idx').on(table.phys_signature_key_id),
  ]
);

export const People_Users = mysqlTable(
  'People_Users',
  {
    id: serial().primaryKey(),
    username: varchar({ length: 45 }).notNull(),
    hashed_pw: longtext().notNull(),
    role: int().notNull(),
    person_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People.id),
    staff_id: bigint({ mode: 'bigint', unsigned: true }).references(
      () => People_Staff.id
    ),
    public_key: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => S_pb_keys.id),
    private_key: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => S_pv_keys.id),
    created_at: timestamp().notNull().defaultNow(),
    active: tinyint().notNull().default(0),
    last_login: timestamp(),
  },
  (table) => [
    index('person_link_idx').on(table.person_id),
    index('public_key_link_idx').on(table.public_key),
    index('user_staff_id_link_idx').on(table.staff_id),
    unique('username_UNIQUE').on(table.username),
  ]
);

export const Sys_Sessions = mysqlTable(
  'Sys_Sessions',
  {
    id: char({ length: 36 }).primaryKey(),
    user_id: bigint({ mode: 'bigint', unsigned: true })
      .notNull()
      .references(() => People_Users.id),
    expires_at: timestamp()
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP + INTERVAL 2 HOUR)`),
  },
  (table) => [index('sessions_user_link').on(table.user_id)]
);
