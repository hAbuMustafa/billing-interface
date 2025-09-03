import { relations } from 'drizzle-orm/relations';
import {
  People_Users,
  S_pb_key,
  S_pv_keys,
  D_AC,
  D_AC_use,
  D_Use,
  D_Formulary,
  D_BrandNames,
  D_formulary_roa,
  D_ROA,
  D_Formulations,
  People_Staff,
  Diagnoses,
  Patients,
  Patient_admissions,
  Patient_Exit_Orders,
  Patient_Exit,
  Patient_exit_reasons,
  Patient_Insurance,
  Patient_trans_orders,
  Patient_trans,
  People,
  Wards,
  People_contact_information,
  People_identifying_documents,
  People_relationships,
  Ph_InEco,
  Ph_InEco_Transactions,
  MedPlan_notes,
  MedPlan_NoteTypes,
  MedPlan_sign_nurse,
  MedPlan_sign_pharm,
  MedPlan_sign_phys,
  MedPlan,
} from '$lib/server/schema';

export const UsersToKeysRelations = relations(People_Users, ({ many }) => ({
  pb_keys: many(S_pb_key),
  pv_keys: many(S_pv_keys),
}));

export const ac_therapeutic_useRelations = relations(D_AC_use, ({ one }) => ({
  AC: one(D_AC, {
    fields: [D_AC_use.ac_id],
    references: [D_AC.id],
  }),
  TherapeuticUse: one(D_Use, {
    fields: [D_AC_use.use_id],
    references: [D_Use.id],
  }),
}));

export const ACsRelations = relations(D_AC, ({ many }) => ({
  ac_therapeutic_uses: many(D_AC_use),
  Formulations: many(D_Formulations),
}));

export const TherapeuticUseRelations = relations(D_Use, ({ many }) => ({
  ac_therapeutic_uses: many(D_AC_use),
}));

export const BrandNamesToFormularyRelations = relations(D_BrandNames, ({ one }) => ({
  Formulary: one(D_Formulary, {
    fields: [D_BrandNames.formulary_id],
    references: [D_Formulary.id],
  }),
}));

export const FormularyToBrandNamesRelations = relations(D_Formulary, ({ many }) => ({
  BrandNames: many(D_BrandNames),
  formulary_routes_of_administrations: many(D_formulary_roa),
  Formulations: many(D_Formulations),
}));

export const formulary_routes_of_administrationRelations = relations(
  D_formulary_roa,
  ({ one }) => ({
    Formulary: one(D_Formulary, {
      fields: [D_formulary_roa.formulary_id],
      references: [D_Formulary.id],
    }),
    RoutesOfAdministration: one(D_ROA, {
      fields: [D_formulary_roa.roa],
      references: [D_ROA.id],
    }),
  })
);

export const RoutesOfAdministrationRelations = relations(D_ROA, ({ many }) => ({
  formulary_routes_of_administrations: many(D_formulary_roa),
}));

export const FormulationsRelations = relations(D_Formulations, ({ one, many }) => ({
  AC: one(D_AC, {
    fields: [D_Formulations.ac_id],
    references: [D_AC.id],
  }),
  Formulation: one(D_Formulations, {
    fields: [D_Formulations.role_target],
    references: [D_Formulations.id],
    relationName: 'Formulations_role_target_Formulations_id',
  }),
  Formulations: many(D_Formulations, {
    relationName: 'Formulations_role_target_Formulations_id',
  }),
  Formulary: one(D_Formulary, {
    fields: [D_Formulations.formulary_id],
    references: [D_Formulary.id],
  }),
}));

export const diagnosesRelations = relations(Diagnoses, ({ one }) => ({
  Staff: one(People_Staff, {
    fields: [Diagnoses.diagnosing_phys],
    references: [People_Staff.id],
  }),
  Patient: one(Patients, {
    fields: [Diagnoses.patient_id],
    references: [Patients.id],
  }),
}));

export const StaffRelations = relations(People_Staff, ({ many }) => ({
  diagnoses: many(Diagnoses),
  Patient_admissions_admitting_phys: many(Patient_admissions, {
    relationName: 'Patient_admissions_admitting_phys_Staff_id',
  }),
  Patient_admissions_registrar: many(Patient_admissions, {
    relationName: 'Patient_admissions_registrar_Staff_id',
  }),
}));

export const PatientsRelations = relations(Patients, ({ one, many }) => ({
  diagnoses: many(Diagnoses),
  Patient_admissions: many(Patient_admissions),
  Patient_Exit_Orders: many(Patient_Exit_Orders),
  Patient_Exits: many(Patient_Exit),
  Patient_Insurances: many(Patient_Insurance),
  Patient_trans_orders: many(Patient_trans_orders),
  Patient_trans: many(Patient_trans),
  person: one(People, {
    fields: [Patients.person_id],
    references: [People.id],
  }),
  ward: one(Wards, {
    fields: [Patients.ward],
    references: [Wards.id],
  }),
}));

export const Patient_admissionsRelations = relations(Patient_admissions, ({ one }) => ({
  Patient: one(Patients, {
    fields: [Patient_admissions.patient_id],
    references: [Patients.id],
  }),
  Staff_admitting_phys: one(People_Staff, {
    fields: [Patient_admissions.admitting_phys],
    references: [People_Staff.id],
    relationName: 'Patient_admissions_admitting_phys_Staff_id',
  }),
  pb_key: one(S_pb_key, {
    fields: [Patient_admissions.admitting_phys_sign_key_id],
    references: [S_pb_key.id],
  }),
  Staff_registrar: one(People_Staff, {
    fields: [Patient_admissions.registrar],
    references: [People_Staff.id],
    relationName: 'Patient_admissions_registrar_Staff_id',
  }),
}));

export const pb_keyToPatientActionsRelations = relations(S_pb_key, ({ many }) => ({
  Patient_admissions: many(Patient_admissions),
  Patient_Exit_Orders: many(Patient_Exit_Orders),
  Patient_Exits: many(Patient_Exit),
  Patient_trans_orders: many(Patient_trans_orders),
  Patient_trans: many(Patient_trans),
}));

export const Patient_Exit_OrdersRelations = relations(
  Patient_Exit_Orders,
  ({ one, many }) => ({
    Patient: one(Patients, {
      fields: [Patient_Exit_Orders.patient_id],
      references: [Patients.id],
    }),
    pb_key: one(S_pb_key, {
      fields: [Patient_Exit_Orders.phys_sign_key],
      references: [S_pb_key.id],
    }),
    staff: one(People_Staff, {
      fields: [Patient_Exit_Orders.phys_id],
      references: [People_Staff.id],
    }),
    Patient_Exits: many(Patient_Exit),
  })
);

export const staffRelations = relations(People_Staff, ({ many }) => ({
  Patient_Exit_Orders: many(Patient_Exit_Orders),
  Patient_Exits: many(Patient_Exit),
  Patient_trans_orders: many(Patient_trans_orders),
}));

export const Patient_ExitsRelations = relations(Patient_Exit, ({ one }) => ({
  Patient_Exit_Order: one(Patient_Exit_Orders, {
    fields: [Patient_Exit.exit_order_id],
    references: [Patient_Exit_Orders.id],
  }),
  Patient: one(Patients, {
    fields: [Patient_Exit.patient_id],
    references: [Patients.id],
  }),
  Patient_exit_reason: one(Patient_exit_reasons, {
    fields: [Patient_Exit.exit_reason],
    references: [Patient_exit_reasons.id],
  }),
  staff: one(People_Staff, {
    fields: [Patient_Exit.registrar],
    references: [People_Staff.id],
  }),
  pb_key: one(S_pb_key, {
    fields: [Patient_Exit.registrar_sign_key],
    references: [S_pb_key.id],
  }),
}));

export const Patient_exit_reasonsRelations = relations(
  Patient_exit_reasons,
  ({ many }) => ({
    Patient_Exits: many(Patient_Exit),
  })
);

export const Patient_InsuranceRelations = relations(Patient_Insurance, ({ one }) => ({
  Patient: one(Patients, {
    fields: [Patient_Insurance.patient_id],
    references: [Patients.id],
  }),
}));

export const Patient_trans_ordersRelations = relations(
  Patient_trans_orders,
  ({ one }) => ({
    Patient: one(Patients, {
      fields: [Patient_trans_orders.patient_id],
      references: [Patients.id],
    }),
    staff: one(People_Staff, {
      fields: [Patient_trans_orders.phys_id],
      references: [People_Staff.id],
    }),
    pb_key: one(S_pb_key, {
      fields: [Patient_trans_orders.phys_sign_key_id],
      references: [S_pb_key.id],
    }),
    ward: one(Wards, {
      fields: [Patient_trans_orders.ward],
      references: [Wards.id],
    }),
  })
);

export const wardsRelations = relations(Wards, ({ many }) => ({
  Patient_trans_orders: many(Patient_trans_orders),
  Patients: many(Patients),
}));

export const Patient_transRelations = relations(Patient_trans, ({ one }) => ({
  person: one(People, {
    fields: [Patient_trans.nurse_id],
    references: [People.id],
  }),
  pb_key: one(S_pb_key, {
    fields: [Patient_trans.nurse_sign_key_id],
    references: [S_pb_key.id],
  }),
  Patient: one(Patients, {
    fields: [Patient_trans.patient_id],
    references: [Patients.id],
  }),
}));

export const peopleRelations = relations(People, ({ many }) => ({
  Patient_trans: many(Patient_trans),
  Patients: many(Patients),
}));

export const contact_informationRelations = relations(
  People_contact_information,
  ({ one }) => ({
    Person: one(People, {
      fields: [People_contact_information.person_id],
      references: [People.id],
    }),
  })
);

export const PeopleDataRelations = relations(People, ({ many }) => ({
  contact_information: many(People_contact_information),
  identifying_documents: many(People_identifying_documents),
  people_relationships_person_id: many(People_relationships, {
    relationName: 'people_relationships_person_id_People_id',
  }),
  people_relationships_related_to_id: many(People_relationships, {
    relationName: 'people_relationships_related_to_id_People_id',
  }),
  Staff: many(People_Staff),
}));

export const identifying_documentsRelations = relations(
  People_identifying_documents,
  ({ one }) => ({
    Person: one(People, {
      fields: [People_identifying_documents.person_id],
      references: [People.id],
    }),
  })
);

export const people_relationshipsRelations = relations(
  People_relationships,
  ({ one }) => ({
    Person_person_id: one(People, {
      fields: [People_relationships.person_id],
      references: [People.id],
      relationName: 'people_relationships_person_id_People_id',
    }),
    Person_related_to_id: one(People, {
      fields: [People_relationships.related_to_id],
      references: [People.id],
      relationName: 'people_relationships_related_to_id_People_id',
    }),
  })
);

export const StaffSelfRelations = relations(People_Staff, ({ one, many }) => ({
  Staff_manager_id: one(People_Staff, {
    fields: [People_Staff.manager_id],
    references: [People_Staff.id],
    relationName: 'Staff_manager_id',
  }),
  Staff_manager_for_id: many(People_Staff, {
    relationName: 'Staff_manager_for_id',
  }),
  Person: one(People, {
    fields: [People_Staff.person_id],
    references: [People.id],
  }),
}));

export const PhInEcoRelations = relations(Ph_InEco, ({ one, many }) => ({
  BrandName: one(D_BrandNames, {
    fields: [Ph_InEco.brand_name_id],
    references: [D_BrandNames.id],
  }),
  PhInEco_Transactions: many(Ph_InEco_Transactions),
}));

export const BrandNamesRelations = relations(D_BrandNames, ({ many }) => ({
  EconomyMedicationInpatientPharmacies: many(Ph_InEco),
}));

export const PhInEco_TransactionsRelations = relations(
  Ph_InEco_Transactions,
  ({ one }) => ({
    Staff_pharm_id: one(People_Staff, {
      fields: [Ph_InEco_Transactions.pharm_id],
      references: [People_Staff.id],
      relationName: 'PhInEco_Transactions_pharm_id_Staff_id',
    }),
    PhInEco: one(Ph_InEco, {
      fields: [Ph_InEco_Transactions.item_id],
      references: [Ph_InEco.id],
    }),
    MedPlan: one(MedPlan, {
      fields: [Ph_InEco_Transactions.med_plan_id],
      references: [MedPlan.id],
    }),
    Staff_dispensing_nurse_id: one(People_Staff, {
      fields: [Ph_InEco_Transactions.dispensing_nurse_id],
      references: [People_Staff.id],
      relationName: 'PhInEco_Transactions_dispensing_nurse_id_Staff_id',
    }),
    pb_key: one(S_pb_key, {
      fields: [Ph_InEco_Transactions.pharm_sign_key],
      references: [S_pb_key.id],
    }),
  })
);

export const StaffDispensingRelations = relations(People_Staff, ({ many }) => ({
  PhInEco_Transactions_pharm_id: many(Ph_InEco_Transactions, {
    relationName: 'PhInEco_Transactions_pharm_id_Staff_id',
  }),
  PhInEco_Transactions_dispensing_nurse_id: many(Ph_InEco_Transactions, {
    relationName: 'PhInEco_Transactions_dispensing_nurse_id_Staff_id',
  }),
}));

export const MedPlanToHistoryRelations = relations(MedPlan, ({ many }) => ({
  PhInEco_Transactions: many(Ph_InEco_Transactions),
}));

export const pb_keyRelations = relations(S_pb_key, ({ many }) => ({
  PhInEco_Transactions: many(Ph_InEco_Transactions),
}));

export const MedPlanRelations = relations(MedPlan, ({ one, many }) => ({
  pb_key: one(S_pb_key, {
    fields: [MedPlan.discontinue_phys_sign_key_id],
    references: [S_pb_key.id],
  }),
  Staff: one(People_Staff, {
    fields: [MedPlan.discontinue_phys_id],
    references: [People_Staff.id],
  }),
  Formulary: one(D_Formulary, {
    fields: [MedPlan.medication_id],
    references: [D_Formulary.id],
  }),
  patient: one(Patients, {
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
  MedPlan_sign_pharm: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
}));

export const pb_keySignRelations = relations(S_pb_key, ({ many }) => ({
  MedPlans: many(MedPlan),
  MedPlan_notes: many(MedPlan_notes),
  MedPlan_sign_nurses: many(MedPlan_sign_nurse),
  MedPlan_sign_pharm: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
}));

export const StaffToMedPlansRelations = relations(People_Staff, ({ many }) => ({
  MedPlans: many(MedPlan),
  MedPlan_notes: many(MedPlan_notes),
  MedPlan_sign_nurses: many(MedPlan_sign_nurse),
  MedPlan_sign_pharm: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
}));

export const FormularyRelations = relations(D_Formulary, ({ many }) => ({
  MedPlans: many(MedPlan),
}));

export const patientsRelations = relations(Patients, ({ many }) => ({
  MedPlans: many(MedPlan),
}));

export const MedPlan_notesRelations = relations(MedPlan_notes, ({ one }) => ({
  Staff: one(People_Staff, {
    fields: [MedPlan_notes.author_id],
    references: [People_Staff.id],
  }),
  pb_key: one(S_pb_key, {
    fields: [MedPlan_notes.author_sign_key_id],
    references: [S_pb_key.id],
  }),
  MedPlan_NoteType: one(MedPlan_NoteTypes, {
    fields: [MedPlan_notes.note_type],
    references: [MedPlan_NoteTypes.id],
  }),
  MedPlan: one(MedPlan, {
    fields: [MedPlan_notes.med_plan_id],
    references: [MedPlan.id],
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
  Staff: one(People_Staff, {
    fields: [MedPlan_sign_nurse.nurse_id],
    references: [People_Staff.id],
  }),
  pb_key: one(S_pb_key, {
    fields: [MedPlan_sign_nurse.nurse_sign_key_id],
    references: [S_pb_key.id],
  }),
}));

export const MedPlan_sign_pharmRelations = relations(MedPlan_sign_pharm, ({ one }) => ({
  MedPlan: one(MedPlan, {
    fields: [MedPlan_sign_pharm.med_plan_id],
    references: [MedPlan.id],
  }),
  Staff: one(People_Staff, {
    fields: [MedPlan_sign_pharm.pharm_id],
    references: [People_Staff.id],
  }),
  pb_key: one(S_pb_key, {
    fields: [MedPlan_sign_pharm.pharm_signature_key_id],
    references: [S_pb_key.id],
  }),
}));

export const MedPlan_sign_physRelations = relations(MedPlan_sign_phys, ({ one }) => ({
  MedPlan: one(MedPlan, {
    fields: [MedPlan_sign_phys.med_plan_id],
    references: [MedPlan.id],
  }),
  Staff: one(People_Staff, {
    fields: [MedPlan_sign_phys.phys_id],
    references: [People_Staff.id],
  }),
  pb_key: one(S_pb_key, {
    fields: [MedPlan_sign_phys.phys_signature_key_id],
    references: [S_pb_key.id],
  }),
}));

export const UsersRelations = relations(People_Users, ({ one }) => ({
  pb_key: one(S_pb_key, {
    fields: [People_Users.public_key],
    references: [S_pb_key.id],
  }),
  Person: one(People, {
    fields: [People_Users.person_id],
    references: [People.id],
  }),
  Staff: one(People_Staff, {
    fields: [People_Users.staff_id],
    references: [People_Staff.id],
  }),
}));

export const pb_keyToUsersRelations = relations(S_pb_key, ({ many }) => ({
  Users: many(People_Users),
}));

export const PeopleRelations = relations(People, ({ many }) => ({
  Users: many(People_Users),
}));

export const StaffToUsersRelations = relations(People_Staff, ({ many }) => ({
  Users: many(People_Users),
}));
