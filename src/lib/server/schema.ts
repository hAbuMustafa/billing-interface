import {
  mysqlTable,
  mysqlSchema,
  type AnyMySqlColumn,
  index,
  foreignKey,
  primaryKey,
  int,
  decimal,
  varchar,
  longtext,
  tinyint,
  date,
  text,
  unique,
  datetime,
  type MySqlTableWithColumns,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const pb_key = mysqlTable(
  'pb_key',
  {
    id: int().autoincrement().notNull(),
    user_id: int()
      .notNull()
      .references(() => Users.id),
    key: varchar({ length: 256 }).notNull(),
    since: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('user_id_pb_key_link_idx').on(table.user_id),
    primaryKey({ columns: [table.id], name: 'pb_key_id' }),
  ]
);

export const pv_keys = mysqlTable(
  'pv_keys',
  {
    id: int().autoincrement().notNull(),
    user_id: int()
      .notNull()
      .references(() => Users.id),
    key: varchar({ length: 256 }).notNull(),
    since: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('user_id_link_idx').on(table.user_id),
    primaryKey({ columns: [table.id], name: 'pv_keys_id' }),
  ]
);

export const Wards = mysqlTable(
  'Wards',
  {
    id: int().notNull(),
    name: varchar({ length: 10 }).notNull(),
    floor: int().notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'Wards_id' })]
);

export const active_ingredient_therapeutic_use = mysqlTable(
  'active_ingredient_therapeutic_use',
  {
    active_ingredient_id: int()
      .notNull()
      .references(() => ActiveIngredients.id),
    therapeutic_use_id: int()
      .notNull()
      .references(() => TherapeuticUse.id),
  },
  (table) => [
    index('ingredient_link_idx').on(table.active_ingredient_id),
    index('use_link_idx').on(table.therapeutic_use_id),
  ]
);

export const ActiveIngredients = mysqlTable(
  'ActiveIngredients',
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 100 }).notNull(),
    name_ar: varchar({ length: 100 }).notNull(),
    alias: varchar({ length: 45 }),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'ActiveIngredients_id' })]
);

export const BrandNames = mysqlTable(
  'BrandNames',
  {
    id: int().autoincrement().notNull(),
    formulary_id: int()
      .notNull()
      .references(() => Formulary.id),
    name: varchar({ length: 45 }).notNull(),
    name_ar: varchar({ length: 45 }),
    size: decimal().notNull(),
    size_unit: varchar({ length: 15 }).notNull(),
    producer: varchar({ length: 45 }),
  },
  (table) => [
    index('brand_name_formulary_link_idx').on(table.formulary_id),
    primaryKey({ columns: [table.id], name: 'BrandNames_id' }),
  ]
);

export const Formulary = mysqlTable(
  'Formulary',
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 100 }).notNull(),
    volume_in_ml: decimal({ precision: 5, scale: 2 }),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'Formulary_id' })]
);

export const formulary_routes_of_administration = mysqlTable(
  'formulary_routes_of_administration',
  {
    formulary_id: int()
      .notNull()
      .references(() => Formulary.id),
    route_of_administration: int()
      .notNull()
      .references(() => RoutesOfAdministration.id),
  },
  (table) => [
    index('formulary_name_link_idx').on(table.formulary_id),
    index('formulary_routes_link_idx').on(table.route_of_administration),
  ]
);

export const Formulations = mysqlTable(
  'Formulations',
  {
    id: int().autoincrement().notNull(),
    formulary_id: int()
      .notNull()
      .references(() => Formulary.id),
    active_ingredient_id: int()
      .notNull()
      .references(() => ActiveIngredients.id),
    amount: decimal({ precision: 10, scale: 5 }).notNull(),
    amount_unit: varchar({ length: 5 }).notNull(),
    role: varchar({ length: 45 }).notNull(),
    role_target: int(),
  },
  (table) => [
    index('active_ingredient_link_idx').on(table.active_ingredient_id),
    index('active_ingredient_role_target_link_idx').on(table.role_target),
    index('formulary_link_idx').on(table.formulary_id),
    foreignKey({
      columns: [table.role_target],
      foreignColumns: [table.id],
      name: 'active_ingredient_role_target_link',
    }),
    primaryKey({ columns: [table.id], name: 'Formulations_id' }),
  ]
);

export const RoutesOfAdministration = mysqlTable(
  'RoutesOfAdministration',
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 15 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'RoutesOfAdministration_id' })]
);

export const TherapeuticUse = mysqlTable(
  'TherapeuticUse',
  {
    id: int().notNull(),
    use: varchar({ length: 45 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'TherapeuticUse_id' })]
);

export const diagnoses = mysqlTable(
  'diagnoses',
  {
    id: int().autoincrement().notNull(),
    patient_id: int()
      .notNull()
      .references(() => Patients.id),
    diagnosis_time: datetime({ mode: 'string' }).notNull(),
    diagnosis: varchar({ length: 45 }).notNull(),
    diagnosis_icd11: varchar({ length: 45 }),
    diagnosing_physician: int()
      .notNull()
      .references(() => Staff.id),
    type: varchar({ length: 45 }),
  },
  (table) => [
    index('diagnosing_physician_link_idx').on(table.diagnosing_physician),
    index('patient_diagnosis_link_idx').on(table.patient_id),
    primaryKey({ columns: [table.id], name: 'diagnoses_id' }),
  ]
);

export const Patient_admissions = mysqlTable(
  'Patient_admissions',
  {
    timestamp: datetime({ mode: 'string' }).notNull(),
    patient_id: int()
      .notNull()
      .references(() => Patients.id),
    admission_notes: longtext(),
    admitted_from: varchar({ length: 45 }).notNull(),
    admitting_physician: int()
      .notNull()
      .references(() => Staff.id),
    admitting_physician_signature: varchar({ length: 256 }).notNull(),
    admitting_physician_sign_key_id: int()
      .notNull()
      .references(() => pb_key.id),
    registrar: int().references(() => Staff.id),
  },
  (table) => [
    index('admission_patient_id_link_idx').on(table.patient_id),
    index('admission_physician_id_link_idx').on(table.admitting_physician),
    index('admitting_physician_sign_key_id_link_idx').on(
      table.admitting_physician_sign_key_id
    ),
    index('admitting_registrar_id_link_idx').on(table.registrar),
  ]
);

export const Patient_Discharge_Orders = mysqlTable(
  'Patient_Discharge_Orders',
  {
    id: int().autoincrement().notNull(),
    patient_id: int()
      .notNull()
      .references(() => Patients.id),
    notes: longtext(),
    physician_id: int()
      .notNull()
      .references(() => Staff.id),
    physician_signature: varchar({ length: 256 }).notNull(),
    physician_sign_key: int()
      .notNull()
      .references(() => pb_key.id),
    timestamp: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('patient_discharge_orders_patient_id_link_idx').on(table.patient_id),
    index('patient_discharge_orders_physician_sign_key_id_link_idx').on(
      table.physician_sign_key
    ),
    index('patient_discharge_orders_pyhsician_id_link_idx').on(table.physician_id),
    primaryKey({ columns: [table.id], name: 'Patient_Discharge_Orders_id' }),
  ]
);

export const Patient_discharge_reasons = mysqlTable(
  'Patient_discharge_reasons',
  {
    id: int().autoincrement().notNull(),
    reason: varchar({ length: 15 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'Patient_discharge_reasons_id' })]
);

export const Patient_Discharges = mysqlTable(
  'Patient_Discharges',
  {
    id: int().autoincrement().notNull(),
    patient_id: int()
      .notNull()
      .references(() => Patients.id),
    discharge_order_id: int().references(() => Patient_Discharge_Orders.id),
    timestamp: datetime({ mode: 'string' }).notNull(),
    discharge_reason: int()
      .notNull()
      .references(() => Patient_discharge_reasons.id),
    notes: longtext(),
    registrar: int()
      .notNull()
      .references(() => Staff.id),
    registrar_signature: varchar({ length: 256 }).notNull(),
    registrar_sign_key: int()
      .notNull()
      .references(() => pb_key.id),
  },
  (table) => [
    index('patient_discharges_discharge_order_id_link_idx').on(table.discharge_order_id),
    index('patient_discharges_patient_id_link_idx').on(table.patient_id),
    index('patient_discharges_reason_id_link_idx').on(table.discharge_reason),
    index('patient_discharges_registrar_id_link_idx').on(table.registrar),
    index('patient_discharges_registrar_sign_key_id_link_idx').on(
      table.registrar_sign_key
    ),
    primaryKey({ columns: [table.id], name: 'Patient_Discharges_id' }),
  ]
);

export const Patient_Insurance = mysqlTable(
  'Patient_Insurance',
  {
    patient_id: int()
      .notNull()
      .references(() => Patients.id),
    insurance_number: varchar({ length: 45 }).notNull(),
    insurance_entity: varchar({ length: 45 }).notNull(),
    type: varchar({ length: 45 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    valid_from_date: date({ mode: 'string' }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    expiration_date: date({ mode: 'string' }).notNull(),
    stay: varchar({ length: 45 }),
    medication_deductible_percent: decimal().default('1').notNull(),
    lab_deductible_percent: decimal().default('1').notNull(),
    radiology_deductible_percent: decimal().default('1').notNull(),
    dental_deductible_percent: decimal().default('1').notNull(),
    maternal_deductible_percent: decimal().default('1').notNull(),
  },
  (table) => [index('patient_insurance_link_idx').on(table.patient_id)]
);

export const Patient_ward_assignment_orders = mysqlTable(
  'Patient_ward_assignment_orders',
  {
    id: int().notNull(),
    patient_id: int()
      .notNull()
      .references(() => Patients.id),
    ward: int()
      .notNull()
      .references(() => Wards.id),
    notes: longtext(),
    physician_id: int()
      .notNull()
      .references(() => Staff.id),
    physician_signature: varchar({ length: 256 }).notNull(),
    physician_sign_key_id: int()
      .notNull()
      .references(() => pb_key.id),
    timestamp: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('transfer_order_patient_id_link_idx').on(table.patient_id),
    index('transfer_order_physician_id_link_idx').on(table.physician_id),
    index('transfer_order_pyhsician_sign_id_link_idx').on(table.physician_sign_key_id),
    index('transfer_order_ward_id_link_idx').on(table.ward),
    primaryKey({ columns: [table.id], name: 'Patient_ward_assignment_orders_id' }),
  ]
);

export const Patient_ward_assignments = mysqlTable(
  'Patient_ward_assignments',
  {
    id: int().autoincrement().notNull(),
    patient_id: int()
      .notNull()
      .references(() => Patients.id),
    notes: longtext(),
    executing_nurse_id: int()
      .notNull()
      .references(() => People.id),
    executing_nurse_signature: varchar({ length: 256 }).notNull(),
    executing_nurse_sign_key_id: int()
      .notNull()
      .references(() => pb_key.id),
    timestamp: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('transfer_order_nurse_id_link_idx').on(table.executing_nurse_id),
    index('transfer_order_nurse_sign_key_id_link_idx').on(
      table.executing_nurse_sign_key_id
    ),
    index('transfer_patient_id_link_idx').on(table.patient_id),
    primaryKey({ columns: [table.id], name: 'Patient_ward_assignments_id' }),
  ]
);

export const Patients = mysqlTable(
  'Patients',
  {
    id: int().notNull(),
    person_id: int()
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
    primaryKey({ columns: [table.id], name: 'Patients_id' }),
  ]
);

export const contact_information = mysqlTable(
  'contact_information',
  {
    id: int().notNull(),
    contact_string: varchar({ length: 100 }).notNull(),
    contact_type: varchar({ length: 45 }).notNull(),
    person_id: int()
      .notNull()
      .references(() => People.id),
    is_verified: tinyint().notNull(),
  },
  (table) => [
    index('contact_person_link_idx').on(table.person_id),
    primaryKey({ columns: [table.id], name: 'contact_information_id' }),
    unique('contact_string_UNIQUE').on(table.contact_string),
    unique('idcontact_information_UNIQUE').on(table.id),
  ]
);

export const identifying_documents = mysqlTable(
  'identifying_documents',
  {
    id: int().notNull(),
    document_number: varchar({ length: 45 }).notNull(),
    document_type: varchar({ length: 20 }).notNull(),
    person_id: int()
      .notNull()
      .references(() => People.id),
  },
  (table) => [
    index('document_person_link_idx').on(table.person_id),
    primaryKey({ columns: [table.id], name: 'identifying_documents_id' }),
  ]
);

export const People = mysqlTable(
  'People',
  {
    id: int().autoincrement().notNull(),
    first_name: varchar({ length: 45 }).notNull(),
    father_name: varchar({ length: 45 }).notNull(),
    grandfather_name: varchar({ length: 45 }).notNull(),
    family_name: varchar({ length: 45 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    birthdate: date({ mode: 'string' }),
    race: varchar({ length: 16 }),
    marital_status: tinyint(),
    gender: tinyint(),
    religion: varchar({ length: 15 }),
    occupation: varchar({ length: 45 }),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'People_id' })]
);

export const people_relationships = mysqlTable(
  'people_relationships',
  {
    person_id: int()
      .notNull()
      .references(() => People.id),
    related_to_id: int()
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

export const Staff = mysqlTable(
  'Staff',
  {
    id: int().autoincrement().notNull(),
    job: varchar({ length: 45 }).notNull(),
    qualification: varchar({ length: 45 }).notNull(),
    major: varchar({ length: 45 }).notNull(),
    department: varchar({ length: 45 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    employment_date: date({ mode: 'string' }).notNull(),
    manager_id: int().notNull(),
    person_id: int()
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
    primaryKey({ columns: [table.id], name: 'Staff_id' }),
  ]
);

export const EconomyMedicationInpatientPharmacy = mysqlTable(
  'EconomyMedicationInpatientPharmacy',
  {
    id: int().autoincrement().notNull(),
    brand_name_id: int()
      .notNull()
      .references(() => BrandNames.id),
    amount: int().notNull(),
    unit_price: decimal({ precision: 10, scale: 5 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    expiry_date: date({ mode: 'string' }),
    batch_number: varchar({ length: 32 }),
  },
  (table) => [
    index('drug_id_link_idx').on(table.brand_name_id),
    primaryKey({ columns: [table.id], name: 'EconomyMedicationInpatientPharmacy_id' }),
  ]
);

export const EconomyMedicationInpatientPharmacy_Transactions = mysqlTable(
  'EconomyMedicationInpatientPharmacy_Transactions',
  {
    id: int().autoincrement().notNull(),
    timestamp: datetime({ mode: 'string' }).notNull(),
    item_id: int()
      .notNull()
      .references(() => EconomyMedicationInpatientPharmacy.id),
    amount: int().notNull(),
    pharmacist_id: int()
      .notNull()
      .references(() => Staff.id),
    pharmacist_signature: varchar({ length: 256 }).notNull(),
    pharmacist_sign_key: int()
      .notNull()
      .references(() => pb_key.id),
    medication_plan_id: int().references(() => MedicationPlan.id),
    dispensing_nurse_id: int().references(() => Staff.id),
  },
  (table) => [
    index('dispensing_pharmacist_id_link_idx').on(table.pharmacist_id),
    index('item_id_link_idx').on(table.item_id),
    index('medication_plan_link_idx').on(table.medication_plan_id),
    index('nurse_id_link_idx').on(table.dispensing_nurse_id),
    index('sign_key_link_idx').on(table.pharmacist_sign_key),
    primaryKey({
      columns: [table.id],
      name: 'EconomyMedicationInpatientPharmacy_Transactions_id',
    }),
  ]
);

export const MedicationPlan = mysqlTable(
  'MedicationPlan',
  {
    id: int().autoincrement().notNull(),
    timestamp: datetime({ mode: 'string' }).notNull(),
    patient_id: int()
      .notNull()
      .references(() => Patients.id),
    medication_id: int()
      .notNull()
      .references(() => Formulary.id),
    amount: decimal({ precision: 10, scale: 2 }).notNull(),
    amount_unit: varchar({ length: 15 }).notNull(),
    frequency: decimal({ precision: 10, scale: 2 }).notNull(),
    duration_days: decimal({ precision: 10, scale: 2 }).notNull(),
    mixed_with: int(),
    discontinued_at: datetime({ mode: 'string' }),
    discontinue_physician_id: int().references(() => Staff.id),
    discontinue_physician_signature: varchar({ length: 256 }),
    discontinue_physician_sign_key_id: int().references(() => pb_key.id),
  },
  (table) => [
    index('dc_phy_sign_key_id_link_idx').on(table.discontinue_physician_sign_key_id),
    index('hold_physician_id_link_idx').on(table.discontinue_physician_id),
    index('medication_id_link_idx').on(table.medication_id),
    index('medication_plan_patient_id_idx').on(table.patient_id),
    index('mixture_link_idx').on(table.mixed_with),
    foreignKey({
      columns: [table.mixed_with],
      foreignColumns: [table.id],
      name: 'mixture_link',
    }),
    primaryKey({ columns: [table.id], name: 'MedicationPlan_id' }),
  ]
);

export const MedicationPlan_notes = mysqlTable(
  'MedicationPlan_notes',
  {
    id: int().autoincrement().notNull(),
    timestamp: datetime({ mode: 'string' }).notNull(),
    medication_plan_id: int()
      .notNull()
      .references(() => MedicationPlan.id),
    note: longtext().notNull(),
    note_type: int()
      .notNull()
      .references(() => MedicationPlan_NoteTypes.id),
    author_id: int()
      .notNull()
      .references(() => Staff.id),
    author_signature: varchar({ length: 256 }).notNull(),
    author_sign_key_id: int()
      .notNull()
      .references(() => pb_key.id),
  },
  (table) => [
    index('author_link_idx').on(table.author_id),
    index('author_sign_key_id_link_idx').on(table.author_sign_key_id),
    index('note_type_link_idx').on(table.note_type),
    index('treatment_plan_link_idx').on(table.medication_plan_id),
    primaryKey({ columns: [table.id], name: 'MedicationPlan_notes_id' }),
  ]
);

export const MedicationPlan_NoteTypes = mysqlTable(
  'MedicationPlan_NoteTypes',
  {
    id: int().autoincrement().notNull(),
    type: text().notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'MedicationPlan_NoteTypes_id' })]
);

export const MedicationPlan_sign_nurse = mysqlTable(
  'MedicationPlan_sign_nurse',
  {
    medication_plan_id: int()
      .notNull()
      .references(() => MedicationPlan.id),
    nurse_id: int()
      .notNull()
      .references(() => Staff.id),
    nurse_signature: varchar({ length: 256 }).notNull(),
    nurse_sign_key_id: int()
      .notNull()
      .references(() => pb_key.id),
    signature_time: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('medication_plan_id_nurse_sign_link_idx').on(table.medication_plan_id),
    index('nurse_id_mp_link_idx').on(table.nurse_id),
    index('pharmacist_sign_key_id_mp_link_idx').on(table.nurse_sign_key_id),
  ]
);

export const MedicationPlan_sign_pharmacist = mysqlTable(
  'MedicationPlan_sign_pharmacist',
  {
    medication_plan_id: int()
      .notNull()
      .references(() => MedicationPlan.id),
    pharmacist_id: int()
      .notNull()
      .references(() => Staff.id),
    pharmacist_signature: varchar({ length: 256 }).notNull(),
    pharmacist_signature_key_id: int()
      .notNull()
      .references(() => pb_key.id),
    signature_time: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('medication_plan_id_phpharmacist_sign_link_idx').on(table.medication_plan_id),
    index('pharmacist_sign_key_id_mp_link_idx').on(table.pharmacist_signature_key_id),
    index('physician_id_mp_link_idx').on(table.pharmacist_id),
  ]
);

export const MedicationPlan_sign_physician = mysqlTable(
  'MedicationPlan_sign_physician',
  {
    medication_plan_id: int()
      .notNull()
      .references(() => MedicationPlan.id),
    physician_id: int()
      .notNull()
      .references(() => Staff.id),
    physician_signature: varchar({ length: 256 }).notNull(),
    physician_signature_key_id: int()
      .notNull()
      .references(() => pb_key.id),
    signature_time: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('medication_plan_id_link_idx').on(table.medication_plan_id),
    index('physician_id_mp_link_idx').on(table.physician_id),
    index('physician_sign_key_id_mp_link_idx').on(table.physician_signature_key_id),
  ]
);

export const Users = mysqlTable(
  'Users',
  {
    id: int().autoincrement().notNull(),
    username: varchar({ length: 45 }).notNull(),
    hashed_pw: longtext().notNull(),
    role: int().notNull(),
    person_id: int()
      .notNull()
      .references(() => People.id),
    staff_id: int().references(() => Staff.id),
    public_key: int()
      .notNull()
      .references((): AnyMySqlColumn => pb_key.id),
  },
  (table) => [
    index('person_link_idx').on(table.person_id),
    index('public_key_link_idx').on(table.public_key),
    index('user_staff_id_link_idx').on(table.staff_id),
    primaryKey({ columns: [table.id], name: 'Users_id' }),
    unique('username_UNIQUE').on(table.username),
  ]
);
