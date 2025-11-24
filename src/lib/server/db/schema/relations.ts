import { relations } from 'drizzle-orm/relations';
import entities from './';

const {
  Person,
  Staff,
  InPatient,
  Ward,
  MedPlan,
  Formulary,
  Sec_pb_key,
  MedPlan_note,
  MedPlan_note_type,
  MedPlan_sign_nurse,
  MedPlan_sign_pharm,
  MedPlan_sign_phys,
  Admission,
  Admission_Order,
  Discharge,
  Discharge_Order,
  Discharge_Reason,
  Insurance_Doc,
  Patient_diagnosis,
  Diagnosis,
  Transfer,
  Transfer_Order,
  People_contact_information,
  Contact_type,
  IdDoc_type,
  Person_IdDoc,
  Person_relationship,
  ActiveIngredient,
  ActiveIngredient_Use,
  Use,
  BrandName,
  DosageForm_SizeUnit,
  DosageUnit_look_like,
  Formulary_ROA,
  RouteOfAdministration,
  Formulation,
  ActiveIngredient_Unit,
  Invoice,
  User,
  Sec_pv_key,
  RefreshToken,
} = entities;

export const StaffRelations = relations(Staff, ({ one, many }) => ({
  Person: one(Person, {
    fields: [Staff.person_id],
    references: [Person.id],
  }),
  Manager: one(Staff, {
    fields: [Staff.manager_id],
    references: [Staff.id],
    relationName: 'StaffInHospital_manager_id_Staff',
  }),
  Employee: many(Staff, {
    relationName: 'StaffInHospital_manager_id_Staff',
  }),
  MedPlan: many(MedPlan),
  MedPlan_note: many(MedPlan_note),
  MedPlan_sign_nurse: many(MedPlan_sign_nurse),
  MedPlan_sign_pharm: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
  Admission: many(Admission),
  Admission_Order: many(Admission_Order),
  Discharge: many(Discharge),
  Discharge_Order: many(Discharge_Order),
  Patient_diagnosis: many(Patient_diagnosis),
  Transfer_Order: many(Transfer_Order),
  User: many(User),
}));

export const PersonRelations = relations(Person, ({ many }) => ({
  Staff: many(Staff),
  InPatient: many(InPatient),
  Admission_Order: many(Admission_Order),
  People_contact_information: many(People_contact_information),
  Person_IdDoc: many(Person_IdDoc),
  relative: many(Person_relationship, {
    relationName: 'Person_relative_id_Person',
  }),

  User: many(User),
}));

export const InPatientRelations = relations(InPatient, ({ one, many }) => ({
  Person: one(Person, {
    fields: [InPatient.person_id],
    references: [Person.id],
  }),
  Ward: one(Ward, {
    fields: [InPatient.recent_ward],
    references: [Ward.id],
  }),
  MedPlan: many(MedPlan),
  Admission: many(Admission),
  Discharge: many(Discharge),
  Discharge_Order: many(Discharge_Order),
  Insurance_Doc: many(Insurance_Doc),
  Patient_diagnosis: many(Patient_diagnosis),
  Transfer: many(Transfer),
  Transfer_Order: many(Transfer_Order),
  Invoice: many(Invoice),
}));

export const WardRelations = relations(Ward, ({ many }) => ({
  InPatient: many(InPatient),
  Transfer: many(Transfer, {
    relationName: 'TransferInPatient_from_ward_id_Ward',
  }),
  Transfer_Order: many(Transfer_Order),
}));

export const MedPlanRelations = relations(MedPlan, ({ one, many }) => ({
  InPatient: one(InPatient, {
    fields: [MedPlan.patient_id],
    references: [InPatient.id],
  }),
  Formulary: one(Formulary, {
    fields: [MedPlan.medication_id],
    references: [Formulary.id],
  }),
  Staff: one(Staff, {
    fields: [MedPlan.discontinue_phys_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [MedPlan.discontinue_phys_sign_key_id],
    references: [Sec_pb_key.id],
  }),
  main_ingredient: one(MedPlan, {
    fields: [MedPlan.mixed_with],
    references: [MedPlan.id],
    relationName: 'MedPlanInMedicationPlan_mixed_with_MedPlan',
  }),
  other_ingredients: many(MedPlan, {
    relationName: 'MedPlanInMedicationPlan_mixed_with_MedPlan',
  }),
  MedPlan_note: many(MedPlan_note),
  MedPlan_sign_nurse: many(MedPlan_sign_nurse),
  MedPlan_sign_pharm: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
}));

export const FormularyRelations = relations(Formulary, ({ many }) => ({
  MedPlan: many(MedPlan),
  BrandName: many(BrandName),
  Formulary_ROA: many(Formulary_ROA),
  Formulation: many(Formulation),
}));

export const Sec_pb_keyRelations = relations(Sec_pb_key, ({ many }) => ({
  MedPlan: many(MedPlan),
  MedPlan_note: many(MedPlan_note),
  MedPlan_sign_nurse: many(MedPlan_sign_nurse),
  MedPlan_sign_pharm: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
  Admission_Order: many(Admission_Order),
  Discharge: many(Discharge),
  Discharge_Order: many(Discharge_Order),
  Patient_diagnosis: many(Patient_diagnosis),
  Transfer_Order: many(Transfer_Order),
  Invoice: many(Invoice),
  User: many(User),
}));

export const MedPlan_noteRelations = relations(MedPlan_note, ({ one }) => ({
  MedPlan: one(MedPlan, {
    fields: [MedPlan_note.med_plan_id],
    references: [MedPlan.id],
  }),
  MedPlan_note_type: one(MedPlan_note_type, {
    fields: [MedPlan_note.note_type],
    references: [MedPlan_note_type.id],
  }),
  Staff: one(Staff, {
    fields: [MedPlan_note.author_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [MedPlan_note.author_sign_key_id],
    references: [Sec_pb_key.id],
  }),
}));

export const MedPlan_note_typeRelations = relations(MedPlan_note_type, ({ many }) => ({
  MedPlan_note: many(MedPlan_note),
}));

export const MedPlan_sign_nurseRelations = relations(MedPlan_sign_nurse, ({ one }) => ({
  MedPlan: one(MedPlan, {
    fields: [MedPlan_sign_nurse.med_plan_id],
    references: [MedPlan.id],
  }),
  Staff: one(Staff, {
    fields: [MedPlan_sign_nurse.nurse_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [MedPlan_sign_nurse.nurse_sign_key_id],
    references: [Sec_pb_key.id],
  }),
}));

export const MedPlan_sign_pharmRelations = relations(MedPlan_sign_pharm, ({ one }) => ({
  MedPlan: one(MedPlan, {
    fields: [MedPlan_sign_pharm.med_plan_id],
    references: [MedPlan.id],
  }),
  Staff: one(Staff, {
    fields: [MedPlan_sign_pharm.pharm_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [MedPlan_sign_pharm.pharm_signature_key_id],
    references: [Sec_pb_key.id],
  }),
}));

export const MedPlan_sign_physRelations = relations(MedPlan_sign_phys, ({ one }) => ({
  MedPlan: one(MedPlan, {
    fields: [MedPlan_sign_phys.med_plan_id],
    references: [MedPlan.id],
  }),
  Staff: one(Staff, {
    fields: [MedPlan_sign_phys.phys_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [MedPlan_sign_phys.phys_signature_key_id],
    references: [Sec_pb_key.id],
  }),
}));

export const AdmissionRelations = relations(Admission, ({ one }) => ({
  InPatient: one(InPatient, {
    fields: [Admission.patient_id],
    references: [InPatient.id],
  }),
  Admission_Order: one(Admission_Order, {
    fields: [Admission.admission_order_id],
    references: [Admission_Order.id],
  }),
  Staff: one(Staff, {
    fields: [Admission.registrar],
    references: [Staff.id],
  }),
}));

export const Admission_OrderRelations = relations(Admission_Order, ({ one, many }) => ({
  Admission: many(Admission),
  Person: one(Person, {
    fields: [Admission_Order.person_id],
    references: [Person.id],
  }),
  Staff: one(Staff, {
    fields: [Admission_Order.admitting_phys],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [Admission_Order.admitting_phys_sign_key_id],
    references: [Sec_pb_key.id],
  }),
}));

export const DischargeRelations = relations(Discharge, ({ one }) => ({
  InPatient: one(InPatient, {
    fields: [Discharge.patient_id],
    references: [InPatient.id],
  }),
  Discharge_Order: one(Discharge_Order, {
    fields: [Discharge.discharge_order_id],
    references: [Discharge_Order.id],
  }),
  Discharge_Reason: one(Discharge_Reason, {
    fields: [Discharge.discharge_reason],
    references: [Discharge_Reason.id],
  }),
  Staff: one(Staff, {
    fields: [Discharge.registrar],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [Discharge.registrar_sign_key],
    references: [Sec_pb_key.id],
  }),
}));

export const Discharge_OrderRelations = relations(Discharge_Order, ({ one, many }) => ({
  Discharge: many(Discharge),
  InPatient: one(InPatient, {
    fields: [Discharge_Order.patient_id],
    references: [InPatient.id],
  }),
  Staff: one(Staff, {
    fields: [Discharge_Order.phys_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [Discharge_Order.phys_sign_key],
    references: [Sec_pb_key.id],
  }),
}));

export const Discharge_ReasonRelations = relations(Discharge_Reason, ({ many }) => ({
  Discharge: many(Discharge),
}));

export const Insurance_DocRelations = relations(Insurance_Doc, ({ one }) => ({
  InPatient: one(InPatient, {
    fields: [Insurance_Doc.patient_id],
    references: [InPatient.id],
  }),
}));

export const Patient_diagnosisRelations = relations(Patient_diagnosis, ({ one }) => ({
  InPatient: one(InPatient, {
    fields: [Patient_diagnosis.patient_id],
    references: [InPatient.id],
  }),
  Diagnosis: one(Diagnosis, {
    fields: [Patient_diagnosis.diagnosis_id],
    references: [Diagnosis.id],
  }),
  Staff: one(Staff, {
    fields: [Patient_diagnosis.diagnosing_phys_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [Patient_diagnosis.diagnosing_phys_sign_key_id],
    references: [Sec_pb_key.id],
  }),
}));

export const DiagnosisRelations = relations(Diagnosis, ({ many }) => ({
  Patient_diagnosis: many(Patient_diagnosis),
}));

export const TransferRelations = relations(Transfer, ({ one }) => ({
  InPatient: one(InPatient, {
    fields: [Transfer.patient_id],
    references: [InPatient.id],
  }),
  Origin_Ward: one(Ward, {
    fields: [Transfer.from_ward_id],
    references: [Ward.id],
    relationName: 'TransferInPatient_from_ward_id_Ward',
  }),
  Destination_Ward: one(Ward, {
    fields: [Transfer.to_ward_id],
    references: [Ward.id],
    relationName: 'TransferInPatient_to_ward_id_Ward',
  }),
  Transfer_Order: one(Transfer_Order, {
    fields: [Transfer.transfer_order_id],
    references: [Transfer_Order.id],
  }),
}));

export const Transfer_OrderRelations = relations(Transfer_Order, ({ one, many }) => ({
  Transfer: many(Transfer),
  InPatient: one(InPatient, {
    fields: [Transfer_Order.patient_id],
    references: [InPatient.id],
  }),
  Ward: one(Ward, {
    fields: [Transfer_Order.to_ward],
    references: [Ward.id],
  }),
  Staff: one(Staff, {
    fields: [Transfer_Order.phys_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [Transfer_Order.phys_sign_key_id],
    references: [Sec_pb_key.id],
  }),
}));

export const People_contact_informationRelations = relations(
  People_contact_information,
  ({ one }) => ({
    Person: one(Person, {
      fields: [People_contact_information.person_id],
      references: [Person.id],
    }),
    Contact_type: one(Contact_type, {
      fields: [People_contact_information.contact_type],
      references: [Contact_type.id],
    }),
  })
);

export const Contact_typeRelations = relations(Contact_type, ({ many }) => ({
  People_contact_information: many(People_contact_information),
}));

export const Person_IdDocRelations = relations(Person_IdDoc, ({ one }) => ({
  IdDoc_type: one(IdDoc_type, {
    fields: [Person_IdDoc.document_type],
    references: [IdDoc_type.id],
  }),
  Person: one(Person, {
    fields: [Person_IdDoc.person_id],
    references: [Person.id],
  }),
}));

export const IdDoc_typeRelations = relations(IdDoc_type, ({ many }) => ({
  Person_IdDoc: many(Person_IdDoc),
}));

export const Person_relationshipRelations = relations(Person_relationship, ({ one }) => ({
  relative: one(Person, {
    fields: [Person_relationship.related_to_id],
    references: [Person.id],
    relationName: 'Person_relationshipInPeople_related_to_id_Person',
  }),
}));

export const ActiveIngredient_UseRelations = relations(
  ActiveIngredient_Use,
  ({ one }) => ({
    ActiveIngredient: one(ActiveIngredient, {
      fields: [ActiveIngredient_Use.ac_id],
      references: [ActiveIngredient.id],
    }),
    Use: one(Use, {
      fields: [ActiveIngredient_Use.use_id],
      references: [Use.id],
    }),
  })
);

export const ActiveIngredientRelations = relations(ActiveIngredient, ({ many }) => ({
  ActiveIngredient_Use: many(ActiveIngredient_Use),
  Formulation: many(Formulation),
}));

export const UseRelations = relations(Use, ({ many }) => ({
  ActiveIngredient_Use: many(ActiveIngredient_Use),
}));

export const BrandNameRelations = relations(BrandName, ({ one, many }) => ({
  Formulary: one(Formulary, {
    fields: [BrandName.formulary_id],
    references: [Formulary.id],
  }),
  DosageForm_SizeUnit: one(DosageForm_SizeUnit, {
    fields: [BrandName.size_unit],
    references: [DosageForm_SizeUnit.id],
  }),
  DosageUnit_look_like: many(DosageUnit_look_like, {
    relationName: 'DosageUnit_look_likeInPharmacy_brand_name_id_BrandName',
  }),
}));

export const DosageForm_SizeUnitRelations = relations(
  DosageForm_SizeUnit,
  ({ many }) => ({
    BrandName: many(BrandName),
  })
);

export const DosageUnit_look_likeRelations = relations(
  DosageUnit_look_like,
  ({ one }) => ({
    look_alike: one(BrandName, {
      fields: [DosageUnit_look_like.look_like_id],
      references: [BrandName.id],
      relationName: 'DosageUnit_look_likeInPharmacy_look_like_id_BrandName',
    }),
  })
);

export const Formulary_ROARelations = relations(Formulary_ROA, ({ one }) => ({
  Formulary: one(Formulary, {
    fields: [Formulary_ROA.formulary_id],
    references: [Formulary.id],
  }),
  RouteOfAdministration: one(RouteOfAdministration, {
    fields: [Formulary_ROA.roa],
    references: [RouteOfAdministration.id],
  }),
}));

export const RouteOfAdministrationRelations = relations(
  RouteOfAdministration,
  ({ many }) => ({
    Formulary_ROA: many(Formulary_ROA),
  })
);

export const FormulationRelations = relations(Formulation, ({ one, many }) => ({
  Formulary: one(Formulary, {
    fields: [Formulation.formulary_id],
    references: [Formulary.id],
  }),
  ActiveIngredient: one(ActiveIngredient, {
    fields: [Formulation.ac_id],
    references: [ActiveIngredient.id],
  }),
  ActiveIngredient_Unit: one(ActiveIngredient_Unit, {
    fields: [Formulation.amount_unit],
    references: [ActiveIngredient_Unit.id],
  }),
  main_ingredient: one(Formulation, {
    fields: [Formulation.role_target],
    references: [Formulation.id],
    relationName: 'FormulationInPharmacy_role_target_Formulation',
  }),
  additive: many(Formulation, {
    relationName: 'FormulationInPharmacy_role_target_Formulation',
  }),
}));

export const ActiveIngredient_UnitRelations = relations(
  ActiveIngredient_Unit,
  ({ many }) => ({
    Formulation: many(Formulation),
  })
);

export const InvoiceRelations = relations(Invoice, ({ one }) => ({
  InPatient: one(InPatient, {
    fields: [Invoice.patient_id],
    references: [InPatient.id],
  }),
  User: one(User, {
    fields: [Invoice.created_by],
    references: [User.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [Invoice.creator_pb_key_id],
    references: [Sec_pb_key.id],
  }),
}));

export const UserRelations = relations(User, ({ one, many }) => ({
  Invoice: many(Invoice),
  Person: one(Person, {
    fields: [User.person_id],
    references: [Person.id],
  }),
  Staff: one(Staff, {
    fields: [User.staff_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [User.pb_key_id],
    references: [Sec_pb_key.id],
  }),
  Sec_pv_key: one(Sec_pv_key, {
    fields: [User.pv_key_id],
    references: [Sec_pv_key.id],
  }),
  RefreshToken: many(RefreshToken),
}));

export const Sec_pv_keyRelations = relations(Sec_pv_key, ({ many }) => ({
  User: many(User),
}));

export const RefreshTokenRelations = relations(RefreshToken, ({ one }) => ({
  User: one(User, {
    fields: [RefreshToken.user_id],
    references: [User.id],
  }),
}));
