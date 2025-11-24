import {
  mysqlTable,
  serial,
  varchar,
  foreignKey,
  bigint,
  int,
  decimal,
  tinyint,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { InPatient } from './patients';
import { Sec_pb_key, User } from './system';

export const ActiveIngredient = mysqlTable('ActiveIngredient', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  name_ar: varchar({ length: 100 }).notNull(),
  alias: varchar({ length: 45 }),
});

// Represents only ISO Units (liter, Gram, .. etc) without modifiers (milli-, Kilo-)
export const ActiveIngredient_Unit = mysqlTable('ActiveIngredient_Unit', {
  id: int().primaryKey(),
  name: varchar({ length: 15 }),
  name_ar: varchar({ length: 15 }),
});

// (Bottle, Tablet, .. etc)
export const DosageForm_SizeUnit = mysqlTable('DosageForm_SizeUnit', {
  id: int().primaryKey(),
  name: varchar({ length: 15 }),
  name_ar: varchar({ length: 15 }),
});

export const ActiveIngredient_Use = mysqlTable('ActiveIngredient_Use', {
  ac_id: bigint({ mode: 'number', unsigned: true }).references(() => ActiveIngredient.id),
  use_id: int().references(() => Use.id),
});

export const BrandName = mysqlTable('BrandName', {
  id: serial().primaryKey(),
  formulary_id: bigint({ mode: 'number', unsigned: true }).references(() => Formulary.id),
  name: varchar({ length: 45 }).notNull(),
  name_ar: varchar({ length: 45 }),
  size: decimal({ precision: 10, scale: 5 }),
  size_unit: int().references(() => DosageForm_SizeUnit.id),
  unit_representation: varchar({ length: 3 }),
  is_imported: tinyint(),
  modifier: varchar({ length: 20 }), // (eg. ROM or With Rubber Cap)
  smc_code: int(),
  producer: varchar({ length: 45 }),
});

export const DosageUnit_look_like = mysqlTable('DosageUnit_look_like', {
  brand_name_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => BrandName.id),
  look_like_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => BrandName.id),
});

export const Formulary = mysqlTable('Formulary', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  cat_strategy: tinyint().default(0),
  cat_high_concentration_electrolyte: tinyint().default(0),
  cat_dangerous: tinyint().default(0),
  upa_code: bigint({ mode: 'number', unsigned: true }),
});

export const Formulary_ROA = mysqlTable('Formulary_ROA', {
  formulary_id: bigint({ mode: 'number', unsigned: true }).references(() => Formulary.id),
  roa: int()
    .notNull()
    .references(() => RouteOfAdministration.id),
});

export const Formulation = mysqlTable(
  'Formulation',
  {
    id: serial().primaryKey(),
    formulary_id: bigint({ mode: 'number', unsigned: true }).references(
      () => Formulary.id
    ),
    ac_id: bigint({ mode: 'number', unsigned: true }).references(
      () => ActiveIngredient.id
    ),
    amount: decimal({ precision: 10, scale: 5 }).notNull(),
    amount_unit: int()
      .notNull()
      .references(() => ActiveIngredient_Unit.id),
    unit_representation: varchar({ length: 3 }).notNull(), // Modifier for parts (nano, micro, milli-, centi-, deci-) and multipliers (Kilo-, Mega-, Giga-)
    role: varchar({ length: 45 }).notNull(),
    role_target: bigint({ mode: 'number', unsigned: true }),
  },
  (table) => [
    foreignKey({
      columns: [table.role_target],
      foreignColumns: [table.id],
      name: 'ac_role_target_link',
    }),
  ]
);

export const RouteOfAdministration = mysqlTable('RouteOfAdministration', {
  id: int().primaryKey(),
  name: varchar({ length: 15 }).notNull(),
});

export const DosageForm = mysqlTable('DosageForm', {
  id: int().primaryKey(),
  name: varchar({ length: 15 }).notNull(),
});

export const StockCategory = mysqlTable('StockCategory', {
  id: int().primaryKey(),
  name: varchar({ length: 15 }).notNull(),
});

export const Use = mysqlTable('Use', {
  id: int().primaryKey(),
  use: varchar({ length: 45 }).notNull(),
});

export const Invoice = mysqlTable('Invoice', {
  id: serial().primaryKey(),
  patient_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => InPatient.id),
  created_by: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => User.id),
  created_at: timestamp().notNull().default(new Date()),
  from: timestamp().notNull(),
  till: timestamp().notNull(),
  total: decimal({ precision: 10, scale: 5 }).notNull(),
  creator_pb_key_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Sec_pb_key.id),
  creator_signature: varchar({ length: 256 }),
});

// TEMPLATE: for all Pharmacies
/*
export const Invoice_Items = mysqlTable('Invoice_Items', {
  id: serial().primaryKey(),
  invoice_id: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => Invoice.id),
  item_id: int()
    .notNull()
    .references(() => Ph_InEco_Stock.id),
  amount: int().notNull().default(1),
  unit_price: decimal({ precision: 10, scale: 5 }).notNull(),
});

  export const Ph_InEco = mysqlTable('Ph_InEco', {
   id: serial().primaryKey(),
   brand_name_id: bigint({ mode: 'number', unsigned: true })
     .notNull()
     .references(() => BrandNames.id),
   amount: int().notNull(),
   unit_price: decimal({ precision: 10, scale: 5 }).notNull(),
   expiry_date: date({ mode: 'date' }),
   batch_number: varchar({ length: 32 }),
   stock_category: int().reference(()=>StockCategory.id),
 });

 export const Ph_InEco_Transaction = mysqlTable('Ph_InEco_Transaction', {
   id: serial().primaryKey(),
   timestamp: timestamp({ mode: 'date' }).notNull(),
   item_id: bigint({ mode: 'number', unsigned: true })
     .notNull()
     .references(() => Ph_InEco.id),
   amount: int().notNull(),
   pharm_id: int()
     .notNull()
     .references(() => Staff.id),
   pharm_signature: varchar({ length: 256 }).notNull(),
   pharm_sign_key: bigint({ mode: 'number', unsigned: true })
     .notNull()
     .references(() => Sec_pb_key.id),
   med_plan_id: bigint({ mode: 'number', unsigned: true }).references(() => MedPlan.id),
   dispensing_nurse_id: int().references(() => Staff.id),
 });
*/
