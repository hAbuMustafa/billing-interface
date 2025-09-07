import { relations } from 'drizzle-orm/relations';
import {
  D_AC,
  D_AC_use,
  D_Uses,
  D_Formulary,
  D_BrandNames,
  D_formulary_roa,
  D_ROA,
  D_Formulations,
  People_Staff,
  Diagnoses,
  Patients,
  MedPlan,
  S_pb_keys,
  MedPlan_notes,
  MedPlan_NoteTypes,
  MedPlan_sign_nurse,
  MedPlan_sign_pharm,
  MedPlan_sign_phys,
  Patient_admissions,
  Patient_Exit_Orders,
  Patient_Exit,
  Patient_exit_reasons,
  People,
  Patient_trans,
  Patient_trans_orders,
  Wards,
  People_contact_information,
  People_identifying_documents,
  People_Insurance,
  People_relationships,
  Ph_InEco,
  Ph_InEco_Transactions,
  Sys_Users,
  Sys_Sessions,
  S_pv_keys,
} from './schema';

export const D_AC_useRelations = relations(D_AC_use, ({ one }) => ({
  D_AC: one(D_AC, {
    fields: [D_AC_use.ac_id],
    references: [D_AC.id],
  }),
  D_us: one(D_Uses, {
    fields: [D_AC_use.use_id],
    references: [D_Uses.id],
  }),
}));

export const D_ACRelations = relations(D_AC, ({ many }) => ({
  D_AC_uses: many(D_AC_use),
  D_Formulations: many(D_Formulations),
}));

export const D_UsesRelations = relations(D_Uses, ({ many }) => ({
  D_AC_uses: many(D_AC_use),
}));

export const D_BrandNamesRelations = relations(D_BrandNames, ({ one, many }) => ({
  D_Formulary: one(D_Formulary, {
    fields: [D_BrandNames.formulary_id],
    references: [D_Formulary.id],
  }),
  Ph_InEco: many(Ph_InEco),
}));

export const D_FormularyRelations = relations(D_Formulary, ({ many }) => ({
  D_BrandNames: many(D_BrandNames),
  D_formulary_roa_s: many(D_formulary_roa),
  D_Formulations: many(D_Formulations),
  MedPlans: many(MedPlan),
}));

export const D_formulary_roaRelations = relations(D_formulary_roa, ({ one }) => ({
  D_Formulary: one(D_Formulary, {
    fields: [D_formulary_roa.formulary_id],
    references: [D_Formulary.id],
  }),
  D_ROA: one(D_ROA, {
    fields: [D_formulary_roa.roa],
    references: [D_ROA.id],
  }),
}));

export const D_ROARelations = relations(D_ROA, ({ many }) => ({
  D_formulary_roa_s: many(D_formulary_roa),
}));

export const D_FormulationsRelations = relations(D_Formulations, ({ one, many }) => ({
  D_Formulation: one(D_Formulations, {
    fields: [D_Formulations.role_target],
    references: [D_Formulations.id],
    relationName: 'D_Formulations_role_target_D_Formulations_id',
  }),
  D_Formulations: many(D_Formulations, {
    relationName: 'D_Formulations_role_target_D_Formulations_id',
  }),
  D_AC: one(D_AC, {
    fields: [D_Formulations.ac_id],
    references: [D_AC.id],
  }),
  D_Formulary: one(D_Formulary, {
    fields: [D_Formulations.formulary_id],
    references: [D_Formulary.id],
  }),
}));

export const DiagnosesRelations = relations(Diagnoses, ({ one }) => ({
  People_Staff: one(People_Staff, {
    fields: [Diagnoses.diagnosing_phys],
    references: [People_Staff.id],
  }),
  Patient: one(Patients, {
    fields: [Diagnoses.patient_id],
    references: [Patients.id],
  }),
}));

export const People_StaffRelations = relations(People_Staff, ({ one, many }) => ({
  Diagnoses: many(Diagnoses),
  MedPlans: many(MedPlan),
  MedPlan_notes: many(MedPlan_notes),
  MedPlan_sign_nurses: many(MedPlan_sign_nurse),
  MedPlan_sign_pharm_s: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
  Patient_admissions_admitting_phys: many(Patient_admissions, {
    relationName: 'Patient_admissions_admitting_phys_People_Staff_id',
  }),
  Patient_admissions_registrar: many(Patient_admissions, {
    relationName: 'Patient_admissions_registrar_People_Staff_id',
  }),
  Patient_Exits: many(Patient_Exit),
  Patient_Exit_Orders: many(Patient_Exit_Orders),
  Patient_trans_orders: many(Patient_trans_orders),
  Person: one(People, {
    fields: [People_Staff.person_id],
    references: [People.id],
  }),
  People_Staff: one(People_Staff, {
    fields: [People_Staff.manager_id],
    references: [People_Staff.id],
    relationName: 'People_Staff_manager_id_People_Staff_id',
  }),
  People_Staffs: many(People_Staff, {
    relationName: 'People_Staff_manager_id_People_Staff_id',
  }),
  Ph_InEco_Transactions_dispensing_nurse_id: many(Ph_InEco_Transactions, {
    relationName: 'Ph_InEco_Transactions_dispensing_nurse_id_People_Staff_id',
  }),
  Ph_InEco_Transactions_pharm_id: many(Ph_InEco_Transactions, {
    relationName: 'Ph_InEco_Transactions_pharm_id_People_Staff_id',
  }),
  Sys_Users: many(Sys_Users),
}));

export const PatientsRelations = relations(Patients, ({ one, many }) => ({
  Diagnoses: many(Diagnoses),
  MedPlans: many(MedPlan),
  Patient_admissions: many(Patient_admissions),
  Patient_Exits: many(Patient_Exit),
  Patient_Exit_Orders: many(Patient_Exit_Orders),
  Patient_trans: many(Patient_trans),
  Patient_trans_orders: many(Patient_trans_orders),
  Person: one(People, {
    fields: [Patients.person_id],
    references: [People.id],
  }),
  Ward: one(Wards, {
    fields: [Patients.ward],
    references: [Wards.id],
  }),
}));

export const MedPlanRelations = relations(MedPlan, ({ one, many }) => ({
  People_Staff: one(People_Staff, {
    fields: [MedPlan.discontinue_phys_id],
    references: [People_Staff.id],
  }),
  S_pb_key: one(S_pb_keys, {
    fields: [MedPlan.discontinue_phys_sign_key_id],
    references: [S_pb_keys.id],
  }),
  D_Formulary: one(D_Formulary, {
    fields: [MedPlan.medication_id],
    references: [D_Formulary.id],
  }),
  Patient: one(Patients, {
    fields: [MedPlan.patient_id],
    references: [Patients.id],
  }),
  MedPlan: one(MedPlan, {
    fields: [MedPlan.mixed_with],
    references: [MedPlan.id],
    relationName: 'MedPlan_mixed_with_MedPlan_id',
  }),
  MedPlans: many(MedPlan, {
    relationName: 'MedPlan_mixed_with_MedPlan_id',
  }),
  MedPlan_notes: many(MedPlan_notes),
  MedPlan_sign_nurses: many(MedPlan_sign_nurse),
  MedPlan_sign_pharm_s: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
  Ph_InEco_Transactions: many(Ph_InEco_Transactions),
}));

export const S_pb_keysRelations = relations(S_pb_keys, ({ many }) => ({
  MedPlans: many(MedPlan),
  MedPlan_notes: many(MedPlan_notes),
  MedPlan_sign_nurses: many(MedPlan_sign_nurse),
  MedPlan_sign_pharm_s: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
  Patient_admissions: many(Patient_admissions),
  Patient_Exits: many(Patient_Exit),
  Patient_Exit_Orders: many(Patient_Exit_Orders),
  Patient_trans: many(Patient_trans),
  Patient_trans_orders: many(Patient_trans_orders),
  Ph_InEco_Transactions: many(Ph_InEco_Transactions),
  Sys_Users: many(Sys_Users),
}));

export const MedPlan_notesRelations = relations(MedPlan_notes, ({ one }) => ({
  People_Staff: one(People_Staff, {
    fields: [MedPlan_notes.author_id],
    references: [People_Staff.id],
  }),
  S_pb_key: one(S_pb_keys, {
    fields: [MedPlan_notes.author_sign_key_id],
    references: [S_pb_keys.id],
  }),
  MedPlan: one(MedPlan, {
    fields: [MedPlan_notes.med_plan_id],
    references: [MedPlan.id],
  }),
  MedPlan_NoteType: one(MedPlan_NoteTypes, {
    fields: [MedPlan_notes.note_type],
    references: [MedPlan_NoteTypes.id],
  }),
}));

export const MedPlan_NoteTypesRelations = relations(MedPlan_NoteTypes, ({ many }) => ({
  MedPlan_notes: many(MedPlan_notes),
}));

export const MedPlan_sign_nurseRelations = relations(MedPlan_sign_nurse, ({ one }) => ({
  MedPlan: one(MedPlan, {
    fields: [MedPlan_sign_nurse.med_plan_id],
    references: [MedPlan.id],
  }),
  People_Staff: one(People_Staff, {
    fields: [MedPlan_sign_nurse.nurse_id],
    references: [People_Staff.id],
  }),
  S_pb_key: one(S_pb_keys, {
    fields: [MedPlan_sign_nurse.nurse_sign_key_id],
    references: [S_pb_keys.id],
  }),
}));

export const MedPlan_sign_pharmRelations = relations(MedPlan_sign_pharm, ({ one }) => ({
  MedPlan: one(MedPlan, {
    fields: [MedPlan_sign_pharm.med_plan_id],
    references: [MedPlan.id],
  }),
  People_Staff: one(People_Staff, {
    fields: [MedPlan_sign_pharm.pharm_id],
    references: [People_Staff.id],
  }),
  S_pb_key: one(S_pb_keys, {
    fields: [MedPlan_sign_pharm.pharm_signature_key_id],
    references: [S_pb_keys.id],
  }),
}));

export const MedPlan_sign_physRelations = relations(MedPlan_sign_phys, ({ one }) => ({
  MedPlan: one(MedPlan, {
    fields: [MedPlan_sign_phys.med_plan_id],
    references: [MedPlan.id],
  }),
  People_Staff: one(People_Staff, {
    fields: [MedPlan_sign_phys.phys_id],
    references: [People_Staff.id],
  }),
  S_pb_key: one(S_pb_keys, {
    fields: [MedPlan_sign_phys.phys_signature_key_id],
    references: [S_pb_keys.id],
  }),
}));

export const Patient_admissionsRelations = relations(Patient_admissions, ({ one }) => ({
  People_Staff_admitting_phys: one(People_Staff, {
    fields: [Patient_admissions.admitting_phys],
    references: [People_Staff.id],
    relationName: 'Patient_admissions_admitting_phys_People_Staff_id',
  }),
  S_pb_key: one(S_pb_keys, {
    fields: [Patient_admissions.admitting_phys_sign_key_id],
    references: [S_pb_keys.id],
  }),
  Patient: one(Patients, {
    fields: [Patient_admissions.patient_id],
    references: [Patients.id],
  }),
  People_Staff_registrar: one(People_Staff, {
    fields: [Patient_admissions.registrar],
    references: [People_Staff.id],
    relationName: 'Patient_admissions_registrar_People_Staff_id',
  }),
}));

export const Patient_ExitRelations = relations(Patient_Exit, ({ one }) => ({
  Patient_Exit_Order: one(Patient_Exit_Orders, {
    fields: [Patient_Exit.exit_order_id],
    references: [Patient_Exit_Orders.id],
  }),
  Patient_exit_reason: one(Patient_exit_reasons, {
    fields: [Patient_Exit.exit_reason],
    references: [Patient_exit_reasons.id],
  }),
  Patient: one(Patients, {
    fields: [Patient_Exit.patient_id],
    references: [Patients.id],
  }),
  People_Staff: one(People_Staff, {
    fields: [Patient_Exit.registrar],
    references: [People_Staff.id],
  }),
  S_pb_key: one(S_pb_keys, {
    fields: [Patient_Exit.registrar_sign_key],
    references: [S_pb_keys.id],
  }),
}));

export const Patient_Exit_OrdersRelations = relations(
  Patient_Exit_Orders,
  ({ one, many }) => ({
    Patient_Exits: many(Patient_Exit),
    Patient: one(Patients, {
      fields: [Patient_Exit_Orders.patient_id],
      references: [Patients.id],
    }),
    People_Staff: one(People_Staff, {
      fields: [Patient_Exit_Orders.phys_id],
      references: [People_Staff.id],
    }),
    S_pb_key: one(S_pb_keys, {
      fields: [Patient_Exit_Orders.phys_sign_key],
      references: [S_pb_keys.id],
    }),
  })
);

export const Patient_exit_reasonsRelations = relations(
  Patient_exit_reasons,
  ({ many }) => ({
    Patient_Exits: many(Patient_Exit),
  })
);

export const Patient_transRelations = relations(Patient_trans, ({ one }) => ({
  Person: one(People, {
    fields: [Patient_trans.nurse_id],
    references: [People.id],
  }),
  S_pb_key: one(S_pb_keys, {
    fields: [Patient_trans.nurse_sign_key_id],
    references: [S_pb_keys.id],
  }),
  Patient: one(Patients, {
    fields: [Patient_trans.patient_id],
    references: [Patients.id],
  }),
}));

export const PeopleRelations = relations(People, ({ many }) => ({
  Patient_trans: many(Patient_trans),
  Patients: many(Patients),
  People_contact_information: many(People_contact_information),
  People_identifying_documents: many(People_identifying_documents),
  People_Insurances: many(People_Insurance),
  People_relationships_person_id: many(People_relationships, {
    relationName: 'People_relationships_person_id_People_id',
  }),
  People_relationships_related_to_id: many(People_relationships, {
    relationName: 'People_relationships_related_to_id_People_id',
  }),
  People_Staffs: many(People_Staff),
  Sys_Users: many(Sys_Users),
}));

export const Patient_trans_ordersRelations = relations(
  Patient_trans_orders,
  ({ one }) => ({
    Patient: one(Patients, {
      fields: [Patient_trans_orders.patient_id],
      references: [Patients.id],
    }),
    People_Staff: one(People_Staff, {
      fields: [Patient_trans_orders.phys_id],
      references: [People_Staff.id],
    }),
    S_pb_key: one(S_pb_keys, {
      fields: [Patient_trans_orders.phys_sign_key_id],
      references: [S_pb_keys.id],
    }),
    Ward: one(Wards, {
      fields: [Patient_trans_orders.ward],
      references: [Wards.id],
    }),
  })
);

export const WardsRelations = relations(Wards, ({ many }) => ({
  Patient_trans_orders: many(Patient_trans_orders),
  Patients: many(Patients),
}));

export const People_contact_informationRelations = relations(
  People_contact_information,
  ({ one }) => ({
    Person: one(People, {
      fields: [People_contact_information.person_id],
      references: [People.id],
    }),
  })
);

export const People_identifying_documentsRelations = relations(
  People_identifying_documents,
  ({ one }) => ({
    Person: one(People, {
      fields: [People_identifying_documents.person_id],
      references: [People.id],
    }),
  })
);

export const People_InsuranceRelations = relations(People_Insurance, ({ one }) => ({
  Person: one(People, {
    fields: [People_Insurance.person_id],
    references: [People.id],
  }),
}));

export const People_relationshipsRelations = relations(
  People_relationships,
  ({ one }) => ({
    Person_person_id: one(People, {
      fields: [People_relationships.person_id],
      references: [People.id],
      relationName: 'People_relationships_person_id_People_id',
    }),
    Person_related_to_id: one(People, {
      fields: [People_relationships.related_to_id],
      references: [People.id],
      relationName: 'People_relationships_related_to_id_People_id',
    }),
  })
);

export const Ph_InEcoRelations = relations(Ph_InEco, ({ one, many }) => ({
  D_BrandName: one(D_BrandNames, {
    fields: [Ph_InEco.brand_name_id],
    references: [D_BrandNames.id],
  }),
  Ph_InEco_Transactions: many(Ph_InEco_Transactions),
}));

export const Ph_InEco_TransactionsRelations = relations(
  Ph_InEco_Transactions,
  ({ one }) => ({
    People_Staff_dispensing_nurse_id: one(People_Staff, {
      fields: [Ph_InEco_Transactions.dispensing_nurse_id],
      references: [People_Staff.id],
      relationName: 'Ph_InEco_Transactions_dispensing_nurse_id_People_Staff_id',
    }),
    Ph_InEco: one(Ph_InEco, {
      fields: [Ph_InEco_Transactions.item_id],
      references: [Ph_InEco.id],
    }),
    MedPlan: one(MedPlan, {
      fields: [Ph_InEco_Transactions.med_plan_id],
      references: [MedPlan.id],
    }),
    People_Staff_pharm_id: one(People_Staff, {
      fields: [Ph_InEco_Transactions.pharm_id],
      references: [People_Staff.id],
      relationName: 'Ph_InEco_Transactions_pharm_id_People_Staff_id',
    }),
    S_pb_key: one(S_pb_keys, {
      fields: [Ph_InEco_Transactions.pharm_sign_key],
      references: [S_pb_keys.id],
    }),
  })
);

export const Sys_SessionsRelations = relations(Sys_Sessions, ({ one }) => ({
  Sys_User: one(Sys_Users, {
    fields: [Sys_Sessions.user_id],
    references: [Sys_Users.id],
  }),
}));

export const Sys_UsersRelations = relations(Sys_Users, ({ one, many }) => ({
  Sys_Sessions: many(Sys_Sessions),
  Person: one(People, {
    fields: [Sys_Users.person_id],
    references: [People.id],
  }),
  S_pv_key: one(S_pv_keys, {
    fields: [Sys_Users.private_key],
    references: [S_pv_keys.id],
  }),
  S_pb_key: one(S_pb_keys, {
    fields: [Sys_Users.public_key],
    references: [S_pb_keys.id],
  }),
  People_Staff: one(People_Staff, {
    fields: [Sys_Users.staff_id],
    references: [People_Staff.id],
  }),
}));

export const S_pv_keysRelations = relations(S_pv_keys, ({ many }) => ({
  Sys_Users: many(Sys_Users),
}));
