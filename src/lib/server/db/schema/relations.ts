import { relations } from 'drizzle-orm/relations';
import entities from './';

const {
  ActiveIngredient,
  ActiveIngredient_Use,
  Use,
  Admission_Order,
  Admission,
  InPatient,
  Staff,
  Sec_pb_key,
  Person,
  Formulary,
  BrandName,
  DosageForm_SizeUnit,
  Discharge_Order,
  Discharge,
  Discharge_Reason,
  DosageUnit_look_like,
  Formulary_ROA,
  RouteOfAdministration,
  Formulation,
  ActiveIngredient_Unit,
  Ward,
  Insurance_Doc,
  User,
  Invoice,
  MedPlan,
  MedPlan_note,
  MedPlan_note_type,
  MedPlan_sign_nurse,
  MedPlan_sign_pharm,
  MedPlan_sign_phys,
  Patient_diagnosis,
  Diagnosis,
  Contact_type,
  People_contact_information,
  IdDoc_type,
  Person_IdDoc,
  Person_relationship,
  RefreshToken,
  Transfer,
  Transfer_Order,
  Sec_pv_key,
} = entities;

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
  ActiveIngredient_Uses: many(ActiveIngredient_Use),
  Formulations: many(Formulation),
}));

export const UseRelations = relations(Use, ({ many }) => ({
  ActiveIngredient_Uses: many(ActiveIngredient_Use),
}));

export const AdmissionRelations = relations(Admission, ({ one }) => ({
  Admission_Order: one(Admission_Order, {
    fields: [Admission.admission_order_id],
    references: [Admission_Order.id],
  }),
  InPatient: one(InPatient, {
    fields: [Admission.patient_id],
    references: [InPatient.id],
  }),
  Staff: one(Staff, {
    fields: [Admission.registrar],
    references: [Staff.id],
  }),
}));

export const Admission_OrderRelations = relations(Admission_Order, ({ one, many }) => ({
  Admissions: many(Admission),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [Admission_Order.admitting_phys_sign_key_id],
    references: [Sec_pb_key.id],
  }),
  Staff: one(Staff, {
    fields: [Admission_Order.admitting_phys],
    references: [Staff.id],
  }),
  Person: one(Person, {
    fields: [Admission_Order.person_id],
    references: [Person.id],
  }),
}));

export const InPatientRelations = relations(InPatient, ({ one, many }) => ({
  Admissions: many(Admission),
  Discharges: many(Discharge),
  Discharge_Orders: many(Discharge_Order),
  Person: one(Person, {
    fields: [InPatient.person_id],
    references: [Person.id],
  }),
  Ward: one(Ward, {
    fields: [InPatient.recent_ward],
    references: [Ward.id],
  }),
  Insurance_Docs: many(Insurance_Doc),
  Invoices: many(Invoice),
  MedPlans: many(MedPlan),
  Patient_diagnoses: many(Patient_diagnosis),
  Transfers: many(Transfer),
  Transfer_Orders: many(Transfer_Order),
}));

export const StaffRelations = relations(Staff, ({ one, many }) => ({
  Admissions: many(Admission),
  Admission_Orders: many(Admission_Order),
  Discharges: many(Discharge),
  Discharge_Orders: many(Discharge_Order),
  MedPlans: many(MedPlan),
  MedPlan_notes: many(MedPlan_note),
  MedPlan_sign_nurses: many(MedPlan_sign_nurse),
  MedPlan_sign_pharms: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
  Patient_diagnoses: many(Patient_diagnosis),
  Staff_member_manager_id: one(Staff, {
    fields: [Staff.manager_id],
    references: [Staff.id],
    relationName: 'Staff_member_manager_id_Staff_id',
  }),
  Staff_manager_id: many(Staff, {
    relationName: 'Staff_manager_id_Staff_id',
  }),
  Person: one(Person, {
    fields: [Staff.person_id],
    references: [Person.id],
  }),
  Transfer_Orders: many(Transfer_Order),
  Users: many(User),
}));

export const Sec_pb_keyRelations = relations(Sec_pb_key, ({ many }) => ({
  Admission_Orders: many(Admission_Order),
  Discharges: many(Discharge),
  Discharge_Orders: many(Discharge_Order),
  Invoices: many(Invoice),
  MedPlans: many(MedPlan),
  MedPlan_notes: many(MedPlan_note),
  MedPlan_sign_nurses: many(MedPlan_sign_nurse),
  MedPlan_sign_pharms: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
  Patient_diagnoses: many(Patient_diagnosis),
  Transfer_Orders: many(Transfer_Order),
  Users: many(User),
}));

export const PersonRelations = relations(Person, ({ many }) => ({
  Admission_Orders: many(Admission_Order),
  InPatients: many(InPatient),
  People_contact_informations: many(People_contact_information),
  Person_IdDocs: many(Person_IdDoc),
  Person_relationships_person_id: many(Person_relationship, {
    relationName: 'Person_relationship_person_id_Person_id',
  }),
  Person_relationships_related_to_id: many(Person_relationship, {
    relationName: 'Person_relationship_related_to_id_Person_id',
  }),
  Staff: many(Staff),
  Users: many(User),
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
  DosageUnit_look_likes_brand_name_id: many(DosageUnit_look_like, {
    relationName: 'DosageUnit_look_like_brand_name_id_BrandName_id',
  }),
  DosageUnit_look_likes_look_like_id: many(DosageUnit_look_like, {
    relationName: 'DosageUnit_look_like_look_like_id_BrandName_id',
  }),
}));

export const FormularyRelations = relations(Formulary, ({ many }) => ({
  BrandNames: many(BrandName),
  Formulary_ROAS: many(Formulary_ROA),
  Formulations: many(Formulation),
  MedPlans: many(MedPlan),
}));

export const DosageForm_SizeUnitRelations = relations(
  DosageForm_SizeUnit,
  ({ many }) => ({
    BrandNames: many(BrandName),
  })
);

export const DischargeRelations = relations(Discharge, ({ one }) => ({
  Discharge_Order: one(Discharge_Order, {
    fields: [Discharge.discharge_order_id],
    references: [Discharge_Order.id],
  }),
  Discharge_Reason: one(Discharge_Reason, {
    fields: [Discharge.discharge_reason],
    references: [Discharge_Reason.id],
  }),
  InPatient: one(InPatient, {
    fields: [Discharge.patient_id],
    references: [InPatient.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [Discharge.registrar_sign_key],
    references: [Sec_pb_key.id],
  }),
  Staff: one(Staff, {
    fields: [Discharge.registrar],
    references: [Staff.id],
  }),
}));

export const Discharge_OrderRelations = relations(Discharge_Order, ({ one, many }) => ({
  Discharges: many(Discharge),
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
  Discharges: many(Discharge),
}));

export const DosageUnit_look_likeRelations = relations(
  DosageUnit_look_like,
  ({ one }) => ({
    BrandName_brand_name_id: one(BrandName, {
      fields: [DosageUnit_look_like.brand_name_id],
      references: [BrandName.id],
      relationName: 'DosageUnit_look_like_brand_name_id_BrandName_id',
    }),
    BrandName_look_like_id: one(BrandName, {
      fields: [DosageUnit_look_like.look_like_id],
      references: [BrandName.id],
      relationName: 'DosageUnit_look_like_look_like_id_BrandName_id',
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
    Formulary_ROAS: many(Formulary_ROA),
  })
);

export const FormulationRelations = relations(Formulation, ({ one, many }) => ({
  Formulation: one(Formulation, {
    fields: [Formulation.role_target],
    references: [Formulation.id],
    relationName: 'Formulation_role_target_Formulation_id',
  }),
  Formulations: many(Formulation, {
    relationName: 'Formulation_role_target_Formulation_id',
  }),
  ActiveIngredient: one(ActiveIngredient, {
    fields: [Formulation.ac_id],
    references: [ActiveIngredient.id],
  }),
  ActiveIngredient_Unit: one(ActiveIngredient_Unit, {
    fields: [Formulation.amount_unit],
    references: [ActiveIngredient_Unit.id],
  }),
  Formulary: one(Formulary, {
    fields: [Formulation.formulary_id],
    references: [Formulary.id],
  }),
}));

export const ActiveIngredient_UnitRelations = relations(
  ActiveIngredient_Unit,
  ({ many }) => ({
    Formulations: many(Formulation),
  })
);

export const WardRelations = relations(Ward, ({ many }) => ({
  InPatients: many(InPatient),
  Transfers_from_ward_id: many(Transfer, {
    relationName: 'Transfer_from_ward_id_Ward_id',
  }),
  Transfers_to_ward_id: many(Transfer, {
    relationName: 'Transfer_to_ward_id_Ward_id',
  }),
  Transfer_Orders: many(Transfer_Order),
}));

export const Insurance_DocRelations = relations(Insurance_Doc, ({ one }) => ({
  InPatient: one(InPatient, {
    fields: [Insurance_Doc.patient_id],
    references: [InPatient.id],
  }),
}));

export const InvoiceRelations = relations(Invoice, ({ one }) => ({
  User: one(User, {
    fields: [Invoice.created_by],
    references: [User.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [Invoice.creator_pb_key_id],
    references: [Sec_pb_key.id],
  }),
  InPatient: one(InPatient, {
    fields: [Invoice.patient_id],
    references: [InPatient.id],
  }),
}));

export const UserRelations = relations(User, ({ one, many }) => ({
  Invoices: many(Invoice),
  RefreshTokens: many(RefreshToken),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [User.pb_key_id],
    references: [Sec_pb_key.id],
  }),
  Person: one(Person, {
    fields: [User.person_id],
    references: [Person.id],
  }),
  Sec_pv_key: one(Sec_pv_key, {
    fields: [User.pv_key_id],
    references: [Sec_pv_key.id],
  }),
  Staff: one(Staff, {
    fields: [User.staff_id],
    references: [Staff.id],
  }),
}));

export const MedPlanRelations = relations(MedPlan, ({ one, many }) => ({
  Staff: one(Staff, {
    fields: [MedPlan.discontinue_phys_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [MedPlan.discontinue_phys_sign_key_id],
    references: [Sec_pb_key.id],
  }),
  Formulary: one(Formulary, {
    fields: [MedPlan.medication_id],
    references: [Formulary.id],
  }),
  InPatient: one(InPatient, {
    fields: [MedPlan.patient_id],
    references: [InPatient.id],
  }),
  MedPlan: one(MedPlan, {
    fields: [MedPlan.mixed_with],
    references: [MedPlan.id],
    relationName: 'MedPlan_mixed_with_MedPlan_id',
  }),
  MedPlans: many(MedPlan, {
    relationName: 'MedPlan_mixed_with_MedPlan_id',
  }),
  MedPlan_notes: many(MedPlan_note),
  MedPlan_sign_nurses: many(MedPlan_sign_nurse),
  MedPlan_sign_pharms: many(MedPlan_sign_pharm),
  MedPlan_sign_phys: many(MedPlan_sign_phys),
}));

export const MedPlan_noteRelations = relations(MedPlan_note, ({ one }) => ({
  Staff: one(Staff, {
    fields: [MedPlan_note.author_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [MedPlan_note.author_sign_key_id],
    references: [Sec_pb_key.id],
  }),
  MedPlan: one(MedPlan, {
    fields: [MedPlan_note.med_plan_id],
    references: [MedPlan.id],
  }),
  MedPlan_note_type: one(MedPlan_note_type, {
    fields: [MedPlan_note.note_type],
    references: [MedPlan_note_type.id],
  }),
}));

export const MedPlan_note_typeRelations = relations(MedPlan_note_type, ({ many }) => ({
  MedPlan_notes: many(MedPlan_note),
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

export const Patient_diagnosisRelations = relations(Patient_diagnosis, ({ one }) => ({
  Staff: one(Staff, {
    fields: [Patient_diagnosis.diagnosing_phys_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [Patient_diagnosis.diagnosing_phys_sign_key_id],
    references: [Sec_pb_key.id],
  }),
  Diagnosis: one(Diagnosis, {
    fields: [Patient_diagnosis.diagnosis_id],
    references: [Diagnosis.id],
  }),
  InPatient: one(InPatient, {
    fields: [Patient_diagnosis.patient_id],
    references: [InPatient.id],
  }),
}));

export const DiagnosisRelations = relations(Diagnosis, ({ many }) => ({
  Patient_diagnoses: many(Patient_diagnosis),
}));

export const People_contact_informationRelations = relations(
  People_contact_information,
  ({ one }) => ({
    Contact_type: one(Contact_type, {
      fields: [People_contact_information.contact_type],
      references: [Contact_type.id],
    }),
    Person: one(Person, {
      fields: [People_contact_information.person_id],
      references: [Person.id],
    }),
  })
);

export const Contact_typeRelations = relations(Contact_type, ({ many }) => ({
  People_contact_informations: many(People_contact_information),
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
  Person_IdDocs: many(Person_IdDoc),
}));

export const Person_relationshipRelations = relations(Person_relationship, ({ one }) => ({
  Person_person_id: one(Person, {
    fields: [Person_relationship.person_id],
    references: [Person.id],
    relationName: 'Person_relationship_person_id_Person_id',
  }),
  Person_related_to_id: one(Person, {
    fields: [Person_relationship.related_to_id],
    references: [Person.id],
    relationName: 'Person_relationship_related_to_id_Person_id',
  }),
}));

export const RefreshTokenRelations = relations(RefreshToken, ({ one }) => ({
  User: one(User, {
    fields: [RefreshToken.user_id],
    references: [User.id],
  }),
}));

export const TransferRelations = relations(Transfer, ({ one }) => ({
  Ward_from_ward_id: one(Ward, {
    fields: [Transfer.from_ward_id],
    references: [Ward.id],
    relationName: 'Transfer_from_ward_id_Ward_id',
  }),
  InPatient: one(InPatient, {
    fields: [Transfer.patient_id],
    references: [InPatient.id],
  }),
  Ward_to_ward_id: one(Ward, {
    fields: [Transfer.to_ward_id],
    references: [Ward.id],
    relationName: 'Transfer_to_ward_id_Ward_id',
  }),
  Transfer_Order: one(Transfer_Order, {
    fields: [Transfer.transfer_order_id],
    references: [Transfer_Order.id],
  }),
}));

export const Transfer_OrderRelations = relations(Transfer_Order, ({ one, many }) => ({
  Transfers: many(Transfer),
  InPatient: one(InPatient, {
    fields: [Transfer_Order.patient_id],
    references: [InPatient.id],
  }),
  Staff: one(Staff, {
    fields: [Transfer_Order.phys_id],
    references: [Staff.id],
  }),
  Sec_pb_key: one(Sec_pb_key, {
    fields: [Transfer_Order.phys_sign_key_id],
    references: [Sec_pb_key.id],
  }),
  Ward: one(Ward, {
    fields: [Transfer_Order.to_ward],
    references: [Ward.id],
  }),
}));

export const Sec_pv_keyRelations = relations(Sec_pv_key, ({ many }) => ({
  Users: many(User),
}));
