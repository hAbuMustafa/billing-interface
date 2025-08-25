import { relations } from 'drizzle-orm/relations';
import {
  Users,
  pb_key,
  pv_keys,
  ActiveIngredients,
  active_ingredient_therapeutic_use,
  TherapeuticUse,
  Formulary,
  BrandNames,
  formulary_routes_of_administration,
  RoutesOfAdministration,
  Formulations,
  Staff,
  diagnoses,
  Patients,
  Patient_admissions,
  Patient_Discharge_Orders,
  Patient_Discharges,
  Patient_discharge_reasons,
  Patient_Insurance,
  Patient_ward_assignment_orders,
  Patient_ward_assignments,
  People,
  Wards,
  contact_information,
  identifying_documents,
  people_relationships,
  EconomyMedicationInpatientPharmacy,
  EconomyMedicationInpatientPharmacy_Transactions,
  MedicationPlan_notes,
  MedicationPlan_NoteTypes,
  MedicationPlan_sign_nurse,
  MedicationPlan_sign_pharmacist,
  MedicationPlan_sign_physician,
  MedicationPlan,
} from '$lib/server/schema';

export const pb_keyToUserRelations = relations(pb_key, ({ one }) => ({
  User: one(Users, {
    fields: [pb_key.user_id],
    references: [Users.id],
  }),
}));

export const UsersToKeysRelations = relations(Users, ({ many }) => ({
  pb_keys: many(pb_key),
  pv_keys: many(pv_keys),
}));

export const pv_keysRelations = relations(pv_keys, ({ one }) => ({
  User: one(Users, {
    fields: [pv_keys.user_id],
    references: [Users.id],
  }),
}));

export const active_ingredient_therapeutic_useRelations = relations(
  active_ingredient_therapeutic_use,
  ({ one }) => ({
    ActiveIngredient: one(ActiveIngredients, {
      fields: [active_ingredient_therapeutic_use.active_ingredient_id],
      references: [ActiveIngredients.id],
    }),
    TherapeuticUse: one(TherapeuticUse, {
      fields: [active_ingredient_therapeutic_use.therapeutic_use_id],
      references: [TherapeuticUse.id],
    }),
  })
);

export const ActiveIngredientsRelations = relations(ActiveIngredients, ({ many }) => ({
  active_ingredient_therapeutic_uses: many(active_ingredient_therapeutic_use),
  Formulations: many(Formulations),
}));

export const TherapeuticUseRelations = relations(TherapeuticUse, ({ many }) => ({
  active_ingredient_therapeutic_uses: many(active_ingredient_therapeutic_use),
}));

export const BrandNamesToFormularyRelations = relations(BrandNames, ({ one }) => ({
  Formulary: one(Formulary, {
    fields: [BrandNames.formulary_id],
    references: [Formulary.id],
  }),
}));

export const FormularyToBrandNamesRelations = relations(Formulary, ({ many }) => ({
  BrandNames: many(BrandNames),
  formulary_routes_of_administrations: many(formulary_routes_of_administration),
  Formulations: many(Formulations),
}));

export const formulary_routes_of_administrationRelations = relations(
  formulary_routes_of_administration,
  ({ one }) => ({
    Formulary: one(Formulary, {
      fields: [formulary_routes_of_administration.formulary_id],
      references: [Formulary.id],
    }),
    RoutesOfAdministration: one(RoutesOfAdministration, {
      fields: [formulary_routes_of_administration.route_of_administration],
      references: [RoutesOfAdministration.id],
    }),
  })
);

export const RoutesOfAdministrationRelations = relations(
  RoutesOfAdministration,
  ({ many }) => ({
    formulary_routes_of_administrations: many(formulary_routes_of_administration),
  })
);

export const FormulationsRelations = relations(Formulations, ({ one, many }) => ({
  ActiveIngredient: one(ActiveIngredients, {
    fields: [Formulations.active_ingredient_id],
    references: [ActiveIngredients.id],
  }),
  Formulation: one(Formulations, {
    fields: [Formulations.role_target],
    references: [Formulations.id],
    relationName: 'Formulations_role_target_Formulations_id',
  }),
  Formulations: many(Formulations, {
    relationName: 'Formulations_role_target_Formulations_id',
  }),
  Formulary: one(Formulary, {
    fields: [Formulations.formulary_id],
    references: [Formulary.id],
  }),
}));

export const diagnosesRelations = relations(diagnoses, ({ one }) => ({
  Staff: one(Staff, {
    fields: [diagnoses.diagnosing_physician],
    references: [Staff.id],
  }),
  Patient: one(Patients, {
    fields: [diagnoses.patient_id],
    references: [Patients.id],
  }),
}));

export const StaffRelations = relations(Staff, ({ many }) => ({
  diagnoses: many(diagnoses),
  Patient_admissions_admitting_physician: many(Patient_admissions, {
    relationName: 'Patient_admissions_admitting_physician_Staff_id',
  }),
  Patient_admissions_registrar: many(Patient_admissions, {
    relationName: 'Patient_admissions_registrar_Staff_id',
  }),
}));

export const PatientsRelations = relations(Patients, ({ one, many }) => ({
  diagnoses: many(diagnoses),
  Patient_admissions: many(Patient_admissions),
  Patient_Discharge_Orders: many(Patient_Discharge_Orders),
  Patient_Discharges: many(Patient_Discharges),
  Patient_Insurances: many(Patient_Insurance),
  Patient_ward_assignment_orders: many(Patient_ward_assignment_orders),
  Patient_ward_assignments: many(Patient_ward_assignments),
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
  Staff_admitting_physician: one(Staff, {
    fields: [Patient_admissions.admitting_physician],
    references: [Staff.id],
    relationName: 'Patient_admissions_admitting_physician_Staff_id',
  }),
  pb_key: one(pb_key, {
    fields: [Patient_admissions.admitting_physician_sign_key_id],
    references: [pb_key.id],
  }),
  Staff_registrar: one(Staff, {
    fields: [Patient_admissions.registrar],
    references: [Staff.id],
    relationName: 'Patient_admissions_registrar_Staff_id',
  }),
}));

export const pb_keyToPatientActionsRelations = relations(pb_key, ({ many }) => ({
  Patient_admissions: many(Patient_admissions),
  Patient_Discharge_Orders: many(Patient_Discharge_Orders),
  Patient_Discharges: many(Patient_Discharges),
  Patient_ward_assignment_orders: many(Patient_ward_assignment_orders),
  Patient_ward_assignments: many(Patient_ward_assignments),
}));

export const Patient_Discharge_OrdersRelations = relations(
  Patient_Discharge_Orders,
  ({ one, many }) => ({
    Patient: one(Patients, {
      fields: [Patient_Discharge_Orders.patient_id],
      references: [Patients.id],
    }),
    pb_key: one(pb_key, {
      fields: [Patient_Discharge_Orders.physician_sign_key],
      references: [pb_key.id],
    }),
    staff: one(Staff, {
      fields: [Patient_Discharge_Orders.physician_id],
      references: [Staff.id],
    }),
    Patient_Discharges: many(Patient_Discharges),
  })
);

export const staffRelations = relations(Staff, ({ many }) => ({
  Patient_Discharge_Orders: many(Patient_Discharge_Orders),
  Patient_Discharges: many(Patient_Discharges),
  Patient_ward_assignment_orders: many(Patient_ward_assignment_orders),
}));

export const Patient_DischargesRelations = relations(Patient_Discharges, ({ one }) => ({
  Patient_Discharge_Order: one(Patient_Discharge_Orders, {
    fields: [Patient_Discharges.discharge_order_id],
    references: [Patient_Discharge_Orders.id],
  }),
  Patient: one(Patients, {
    fields: [Patient_Discharges.patient_id],
    references: [Patients.id],
  }),
  Patient_discharge_reason: one(Patient_discharge_reasons, {
    fields: [Patient_Discharges.discharge_reason],
    references: [Patient_discharge_reasons.id],
  }),
  staff: one(Staff, {
    fields: [Patient_Discharges.registrar],
    references: [Staff.id],
  }),
  pb_key: one(pb_key, {
    fields: [Patient_Discharges.registrar_sign_key],
    references: [pb_key.id],
  }),
}));

export const Patient_discharge_reasonsRelations = relations(
  Patient_discharge_reasons,
  ({ many }) => ({
    Patient_Discharges: many(Patient_Discharges),
  })
);

export const Patient_InsuranceRelations = relations(Patient_Insurance, ({ one }) => ({
  Patient: one(Patients, {
    fields: [Patient_Insurance.patient_id],
    references: [Patients.id],
  }),
}));

export const Patient_ward_assignment_ordersRelations = relations(
  Patient_ward_assignment_orders,
  ({ one }) => ({
    Patient: one(Patients, {
      fields: [Patient_ward_assignment_orders.patient_id],
      references: [Patients.id],
    }),
    staff: one(Staff, {
      fields: [Patient_ward_assignment_orders.physician_id],
      references: [Staff.id],
    }),
    pb_key: one(pb_key, {
      fields: [Patient_ward_assignment_orders.physician_sign_key_id],
      references: [pb_key.id],
    }),
    ward: one(Wards, {
      fields: [Patient_ward_assignment_orders.ward],
      references: [Wards.id],
    }),
  })
);

export const wardsRelations = relations(Wards, ({ many }) => ({
  Patient_ward_assignment_orders: many(Patient_ward_assignment_orders),
  Patients: many(Patients),
}));

export const Patient_ward_assignmentsRelations = relations(
  Patient_ward_assignments,
  ({ one }) => ({
    person: one(People, {
      fields: [Patient_ward_assignments.executing_nurse_id],
      references: [People.id],
    }),
    pb_key: one(pb_key, {
      fields: [Patient_ward_assignments.executing_nurse_sign_key_id],
      references: [pb_key.id],
    }),
    Patient: one(Patients, {
      fields: [Patient_ward_assignments.patient_id],
      references: [Patients.id],
    }),
  })
);

export const peopleRelations = relations(People, ({ many }) => ({
  Patient_ward_assignments: many(Patient_ward_assignments),
  Patients: many(Patients),
}));

export const contact_informationRelations = relations(contact_information, ({ one }) => ({
  Person: one(People, {
    fields: [contact_information.person_id],
    references: [People.id],
  }),
}));

export const PeopleDataRelations = relations(People, ({ many }) => ({
  contact_information: many(contact_information),
  identifying_documents: many(identifying_documents),
  people_relationships_person_id: many(people_relationships, {
    relationName: 'people_relationships_person_id_People_id',
  }),
  people_relationships_related_to_id: many(people_relationships, {
    relationName: 'people_relationships_related_to_id_People_id',
  }),
  Staff: many(Staff),
}));

export const identifying_documentsRelations = relations(
  identifying_documents,
  ({ one }) => ({
    Person: one(People, {
      fields: [identifying_documents.person_id],
      references: [People.id],
    }),
  })
);

export const people_relationshipsRelations = relations(
  people_relationships,
  ({ one }) => ({
    Person_person_id: one(People, {
      fields: [people_relationships.person_id],
      references: [People.id],
      relationName: 'people_relationships_person_id_People_id',
    }),
    Person_related_to_id: one(People, {
      fields: [people_relationships.related_to_id],
      references: [People.id],
      relationName: 'people_relationships_related_to_id_People_id',
    }),
  })
);

export const StaffSelfRelations = relations(Staff, ({ one, many }) => ({
  Staff_manager_id: one(Staff, {
    fields: [Staff.manager_id],
    references: [Staff.id],
    relationName: 'Staff_manager_id_Staff_id',
  }),
  // Staff_manager_id: many(Staff, {
  //   relationName: 'Staff_manager_id_Staff_id',
  // }),
  Person: one(People, {
    fields: [Staff.person_id],
    references: [People.id],
  }),
}));

export const EconomyMedicationInpatientPharmacyRelations = relations(
  EconomyMedicationInpatientPharmacy,
  ({ one, many }) => ({
    BrandName: one(BrandNames, {
      fields: [EconomyMedicationInpatientPharmacy.brand_name_id],
      references: [BrandNames.id],
    }),
    EconomyMedicationInpatientPharmacy_Transactions: many(
      EconomyMedicationInpatientPharmacy_Transactions
    ),
  })
);

export const BrandNamesRelations = relations(BrandNames, ({ many }) => ({
  EconomyMedicationInpatientPharmacies: many(EconomyMedicationInpatientPharmacy),
}));

export const EconomyMedicationInpatientPharmacy_TransactionsRelations = relations(
  EconomyMedicationInpatientPharmacy_Transactions,
  ({ one }) => ({
    Staff_pharmacist_id: one(Staff, {
      fields: [EconomyMedicationInpatientPharmacy_Transactions.pharmacist_id],
      references: [Staff.id],
      relationName:
        'EconomyMedicationInpatientPharmacy_Transactions_pharmacist_id_Staff_id',
    }),
    EconomyMedicationInpatientPharmacy: one(EconomyMedicationInpatientPharmacy, {
      fields: [EconomyMedicationInpatientPharmacy_Transactions.item_id],
      references: [EconomyMedicationInpatientPharmacy.id],
    }),
    MedicationPlan: one(MedicationPlan, {
      fields: [EconomyMedicationInpatientPharmacy_Transactions.medication_plan_id],
      references: [MedicationPlan.id],
    }),
    Staff_dispensing_nurse_id: one(Staff, {
      fields: [EconomyMedicationInpatientPharmacy_Transactions.dispensing_nurse_id],
      references: [Staff.id],
      relationName:
        'EconomyMedicationInpatientPharmacy_Transactions_dispensing_nurse_id_Staff_id',
    }),
    pb_key: one(pb_key, {
      fields: [EconomyMedicationInpatientPharmacy_Transactions.pharmacist_sign_key],
      references: [pb_key.id],
    }),
  })
);

export const StaffDispensingRelations = relations(Staff, ({ many }) => ({
  EconomyMedicationInpatientPharmacy_Transactions_pharmacist_id: many(
    EconomyMedicationInpatientPharmacy_Transactions,
    {
      relationName:
        'EconomyMedicationInpatientPharmacy_Transactions_pharmacist_id_Staff_id',
    }
  ),
  EconomyMedicationInpatientPharmacy_Transactions_dispensing_nurse_id: many(
    EconomyMedicationInpatientPharmacy_Transactions,
    {
      relationName:
        'EconomyMedicationInpatientPharmacy_Transactions_dispensing_nurse_id_Staff_id',
    }
  ),
}));

export const MedicationPlanToHistoryRelations = relations(MedicationPlan, ({ many }) => ({
  EconomyMedicationInpatientPharmacy_Transactions: many(
    EconomyMedicationInpatientPharmacy_Transactions
  ),
}));

export const pb_keyRelations = relations(pb_key, ({ many }) => ({
  EconomyMedicationInpatientPharmacy_Transactions: many(
    EconomyMedicationInpatientPharmacy_Transactions
  ),
}));

export const MedicationPlanRelations = relations(MedicationPlan, ({ one, many }) => ({
  pb_key: one(pb_key, {
    fields: [MedicationPlan.discontinue_physician_sign_key_id],
    references: [pb_key.id],
  }),
  Staff: one(Staff, {
    fields: [MedicationPlan.discontinue_physician_id],
    references: [Staff.id],
  }),
  Formulary: one(Formulary, {
    fields: [MedicationPlan.medication_id],
    references: [Formulary.id],
  }),
  patient: one(Patients, {
    fields: [MedicationPlan.patient_id],
    references: [Patients.id],
  }),
  MedicationPlan: one(MedicationPlan, {
    fields: [MedicationPlan.mixed_with],
    references: [MedicationPlan.id],
    relationName: 'MedicationPlan_mixed_with_MedicationPlan_id',
  }),
  MedicationPlans: many(MedicationPlan, {
    relationName: 'MedicationPlan_mixed_with_MedicationPlan_id',
  }),
  MedicationPlan_notes: many(MedicationPlan_notes),
  MedicationPlan_sign_nurses: many(MedicationPlan_sign_nurse),
  MedicationPlan_sign_pharmacists: many(MedicationPlan_sign_pharmacist),
  MedicationPlan_sign_physicians: many(MedicationPlan_sign_physician),
}));

export const pb_keySignRelations = relations(pb_key, ({ many }) => ({
  MedicationPlans: many(MedicationPlan),
  MedicationPlan_notes: many(MedicationPlan_notes),
  MedicationPlan_sign_nurses: many(MedicationPlan_sign_nurse),
  MedicationPlan_sign_pharmacists: many(MedicationPlan_sign_pharmacist),
  MedicationPlan_sign_physicians: many(MedicationPlan_sign_physician),
}));

export const StaffToMedicationPlansRelations = relations(Staff, ({ many }) => ({
  MedicationPlans: many(MedicationPlan),
  MedicationPlan_notes: many(MedicationPlan_notes),
  MedicationPlan_sign_nurses: many(MedicationPlan_sign_nurse),
  MedicationPlan_sign_pharmacists: many(MedicationPlan_sign_pharmacist),
  MedicationPlan_sign_physicians: many(MedicationPlan_sign_physician),
}));

export const FormularyRelations = relations(Formulary, ({ many }) => ({
  MedicationPlans: many(MedicationPlan),
}));

export const patientsRelations = relations(Patients, ({ many }) => ({
  MedicationPlans: many(MedicationPlan),
}));

export const MedicationPlan_notesRelations = relations(
  MedicationPlan_notes,
  ({ one }) => ({
    Staff: one(Staff, {
      fields: [MedicationPlan_notes.author_id],
      references: [Staff.id],
    }),
    pb_key: one(pb_key, {
      fields: [MedicationPlan_notes.author_sign_key_id],
      references: [pb_key.id],
    }),
    MedicationPlan_NoteType: one(MedicationPlan_NoteTypes, {
      fields: [MedicationPlan_notes.note_type],
      references: [MedicationPlan_NoteTypes.id],
    }),
    MedicationPlan: one(MedicationPlan, {
      fields: [MedicationPlan_notes.medication_plan_id],
      references: [MedicationPlan.id],
    }),
  })
);

export const MedicationPlan_NoteTypesRelations = relations(
  MedicationPlan_NoteTypes,
  ({ many }) => ({
    MedicationPlan_notes: many(MedicationPlan_notes),
  })
);

export const MedicationPlan_sign_nurseRelations = relations(
  MedicationPlan_sign_nurse,
  ({ one }) => ({
    MedicationPlan: one(MedicationPlan, {
      fields: [MedicationPlan_sign_nurse.medication_plan_id],
      references: [MedicationPlan.id],
    }),
    Staff: one(Staff, {
      fields: [MedicationPlan_sign_nurse.nurse_id],
      references: [Staff.id],
    }),
    pb_key: one(pb_key, {
      fields: [MedicationPlan_sign_nurse.nurse_sign_key_id],
      references: [pb_key.id],
    }),
  })
);

export const MedicationPlan_sign_pharmacistRelations = relations(
  MedicationPlan_sign_pharmacist,
  ({ one }) => ({
    MedicationPlan: one(MedicationPlan, {
      fields: [MedicationPlan_sign_pharmacist.medication_plan_id],
      references: [MedicationPlan.id],
    }),
    Staff: one(Staff, {
      fields: [MedicationPlan_sign_pharmacist.pharmacist_id],
      references: [Staff.id],
    }),
    pb_key: one(pb_key, {
      fields: [MedicationPlan_sign_pharmacist.pharmacist_signature_key_id],
      references: [pb_key.id],
    }),
  })
);

export const MedicationPlan_sign_physicianRelations = relations(
  MedicationPlan_sign_physician,
  ({ one }) => ({
    MedicationPlan: one(MedicationPlan, {
      fields: [MedicationPlan_sign_physician.medication_plan_id],
      references: [MedicationPlan.id],
    }),
    Staff: one(Staff, {
      fields: [MedicationPlan_sign_physician.physician_id],
      references: [Staff.id],
    }),
    pb_key: one(pb_key, {
      fields: [MedicationPlan_sign_physician.physician_signature_key_id],
      references: [pb_key.id],
    }),
  })
);

export const UsersRelations = relations(Users, ({ one }) => ({
  pb_key: one(pb_key, {
    fields: [Users.public_key],
    references: [pb_key.id],
  }),
  Person: one(People, {
    fields: [Users.person_id],
    references: [People.id],
  }),
  Staff: one(Staff, {
    fields: [Users.staff_id],
    references: [Staff.id],
  }),
}));

export const pb_keyToUsersRelations = relations(pb_key, ({ many }) => ({
  Users: many(Users),
}));

export const PeopleRelations = relations(People, ({ many }) => ({
  Users: many(Users),
}));

export const StaffToUsersRelations = relations(Staff, ({ many }) => ({
  Users: many(Users),
}));
