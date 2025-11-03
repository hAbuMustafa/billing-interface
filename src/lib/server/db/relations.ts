import { relations } from 'drizzle-orm/relations';
import {
  Drugs,
  Drug_look_like,
  Drug_name_like,
  Ph_InEco_Stock,
  Drug_page_numbers,
  Drug_categories,
  Drug_units,
  Sys_Sec_pb_key,
  Invoice,
  Users,
  Patients,
  Invoice_Items,
  Diagnoses,
  Patient_Diagnoses,
  Wards,
  Patient_wards,
  Patient_discharge_reasons,
  People,
  Patient_id_doc_type,
  Ph_InEco_Transactions,
  RefreshTokens,
  Sys_Sec_pv_key,
} from './schema';

export const Drug_look_likeRelations = relations(Drug_look_like, ({ one }) => ({
  Drug_look_like_id: one(Drugs, {
    fields: [Drug_look_like.look_like_id],
    references: [Drugs.id],
    relationName: 'Drug_look_like_look_like_id_Drugs_id',
  }),
  Drug_drug_id: one(Drugs, {
    fields: [Drug_look_like.drug_id],
    references: [Drugs.id],
    relationName: 'Drug_look_like_drug_id_Drugs_id',
  }),
}));

export const DrugsRelations = relations(Drugs, ({ one, many }) => ({
  Drug_look_likes_look_like_id: many(Drug_look_like, {
    relationName: 'Drug_look_like_look_like_id_Drugs_id',
  }),
  Drug_look_likes_drug_id: many(Drug_look_like, {
    relationName: 'Drug_look_like_drug_id_Drugs_id',
  }),
  Drug_name_likes_sound_like_id: many(Drug_name_like, {
    relationName: 'Drug_name_like_sound_like_id_Drugs_id',
  }),
  Drug_name_likes_drug_id: many(Drug_name_like, {
    relationName: 'Drug_name_like_drug_id_Drugs_id',
  }),
  Drug_category: one(Drug_categories, {
    fields: [Drugs.category],
    references: [Drug_categories.id],
  }),
  Drug_unit: one(Drug_units, {
    fields: [Drugs.unit],
    references: [Drug_units.id],
  }),
  Ph_InEco_Stocks: many(Ph_InEco_Stock),
}));

export const Drug_name_likeRelations = relations(Drug_name_like, ({ one }) => ({
  Drug_sound_like_id: one(Drugs, {
    fields: [Drug_name_like.sound_like_id],
    references: [Drugs.id],
    relationName: 'Drug_name_like_sound_like_id_Drugs_id',
  }),
  Drug_drug_id: one(Drugs, {
    fields: [Drug_name_like.drug_id],
    references: [Drugs.id],
    relationName: 'Drug_name_like_drug_id_Drugs_id',
  }),
}));

export const Drug_page_numbersRelations = relations(Drug_page_numbers, ({ one }) => ({
  Ph_InEco_Stock: one(Ph_InEco_Stock, {
    fields: [Drug_page_numbers.drug_id],
    references: [Ph_InEco_Stock.id],
  }),
}));

export const Ph_InEco_StockRelations = relations(Ph_InEco_Stock, ({ one, many }) => ({
  Drug_page_numbers: many(Drug_page_numbers),
  Invoice_Items: many(Invoice_Items),
  Drug: one(Drugs, {
    fields: [Ph_InEco_Stock.drug_id],
    references: [Drugs.id],
  }),
  Ph_InEco_Transactions: many(Ph_InEco_Transactions),
}));

export const Drug_categoriesRelations = relations(Drug_categories, ({ many }) => ({
  Drugs: many(Drugs),
}));

export const Drug_unitsRelations = relations(Drug_units, ({ many }) => ({
  Drugs: many(Drugs),
}));

export const InvoiceRelations = relations(Invoice, ({ one, many }) => ({
  Sys_Sec_pb_key: one(Sys_Sec_pb_key, {
    fields: [Invoice.pb_key_id],
    references: [Sys_Sec_pb_key.id],
  }),
  User: one(Users, {
    fields: [Invoice.created_by],
    references: [Users.id],
  }),
  Patient: one(Patients, {
    fields: [Invoice.patient_id],
    references: [Patients.id],
  }),
  Invoice_Items: many(Invoice_Items),
}));

export const Sys_Sec_pb_keyRelations = relations(Sys_Sec_pb_key, ({ many }) => ({
  Invoices: many(Invoice),
  Ph_InEco_Transactions: many(Ph_InEco_Transactions),
  Users: many(Users),
}));

export const UsersRelations = relations(Users, ({ one, many }) => ({
  Invoices: many(Invoice),
  Ph_InEco_Transactions: many(Ph_InEco_Transactions),
  RefreshTokens: many(RefreshTokens),
  Sys_Sec_pv_key: one(Sys_Sec_pv_key, {
    fields: [Users.pv_key_id],
    references: [Sys_Sec_pv_key.id],
  }),
  Sys_Sec_pb_key: one(Sys_Sec_pb_key, {
    fields: [Users.pb_key_id],
    references: [Sys_Sec_pb_key.id],
  }),
}));

export const PatientsRelations = relations(Patients, ({ one, many }) => ({
  Invoices: many(Invoice),
  Patient_diagnoses: many(Patient_Diagnoses),
  Patient_wards: many(Patient_wards),
  Patient_discharge_reason: one(Patient_discharge_reasons, {
    fields: [Patients.discharge_reason],
    references: [Patient_discharge_reasons.id],
  }),
  Ward_recent_ward: one(Wards, {
    fields: [Patients.recent_ward],
    references: [Wards.id],
    relationName: 'Patients_recent_ward_Wards_id',
  }),
  Ward_admission_ward: one(Wards, {
    fields: [Patients.admission_ward],
    references: [Wards.id],
    relationName: 'Patients_admission_ward_Wards_id',
  }),
  Person: one(People, {
    fields: [Patients.person_id],
    references: [People.id],
  }),
  Ph_InEco_Transactions: many(Ph_InEco_Transactions),
}));

export const Invoice_ItemsRelations = relations(Invoice_Items, ({ one }) => ({
  Ph_InEco_Stock: one(Ph_InEco_Stock, {
    fields: [Invoice_Items.item_id],
    references: [Ph_InEco_Stock.id],
  }),
  Invoice: one(Invoice, {
    fields: [Invoice_Items.invoice_id],
    references: [Invoice.id],
  }),
}));

export const Patient_diagnosesRelations = relations(Patient_Diagnoses, ({ one }) => ({
  Diagnosis: one(Diagnoses, {
    fields: [Patient_Diagnoses.diagnosis_id],
    references: [Diagnoses.id],
  }),
  Patient: one(Patients, {
    fields: [Patient_Diagnoses.patient_id],
    references: [Patients.id],
  }),
}));

export const DiagnosesRelations = relations(Diagnoses, ({ many }) => ({
  Patient_diagnoses: many(Patient_Diagnoses),
}));

export const Patient_wardsRelations = relations(Patient_wards, ({ one }) => ({
  Ward: one(Wards, {
    fields: [Patient_wards.ward],
    references: [Wards.id],
  }),
  Patient: one(Patients, {
    fields: [Patient_wards.patient_id],
    references: [Patients.id],
  }),
}));

export const WardsRelations = relations(Wards, ({ many }) => ({
  Patient_wards: many(Patient_wards),
  Patients_recent_ward: many(Patients, {
    relationName: 'Patients_recent_ward_Wards_id',
  }),
  Patients_admission_ward: many(Patients, {
    relationName: 'Patients_admission_ward_Wards_id',
  }),
}));

export const Patient_discharge_reasonsRelations = relations(
  Patient_discharge_reasons,
  ({ many }) => ({
    Patients: many(Patients),
  })
);

export const PeopleRelations = relations(People, ({ one, many }) => ({
  Patients: many(Patients),
  Patient_id_doc_type: one(Patient_id_doc_type, {
    fields: [People.id_doc_type],
    references: [Patient_id_doc_type.id],
  }),
}));

export const Patient_id_doc_typeRelations = relations(
  Patient_id_doc_type,
  ({ many }) => ({
    People: many(People),
  })
);

export const Ph_InEco_TransactionsRelations = relations(
  Ph_InEco_Transactions,
  ({ one }) => ({
    Sys_Sec_pb_key: one(Sys_Sec_pb_key, {
      fields: [Ph_InEco_Transactions.pb_key_id],
      references: [Sys_Sec_pb_key.id],
    }),
    User: one(Users, {
      fields: [Ph_InEco_Transactions.user_id],
      references: [Users.id],
    }),
    Patient: one(Patients, {
      fields: [Ph_InEco_Transactions.patient_id],
      references: [Patients.id],
    }),
    Ph_InEco_Stock: one(Ph_InEco_Stock, {
      fields: [Ph_InEco_Transactions.item_id],
      references: [Ph_InEco_Stock.id],
    }),
  })
);

export const RefreshTokensRelations = relations(RefreshTokens, ({ one }) => ({
  User: one(Users, {
    fields: [RefreshTokens.user_id],
    references: [Users.id],
  }),
}));

export const Sys_Sec_pv_keyRelations = relations(Sys_Sec_pv_key, ({ many }) => ({
  Users: many(Users),
}));
