CREATE TABLE `D_AC` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`name_ar` varchar(100) NOT NULL,
	`alias` varchar(45),
	CONSTRAINT `AC_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `D_AC_use` (
	`ac_id` int NOT NULL,
	`use_id` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `D_BrandNames` (
	`id` int AUTO_INCREMENT NOT NULL,
	`formulary_id` int NOT NULL,
	`name` varchar(45) NOT NULL,
	`name_ar` varchar(45),
	`size` decimal NOT NULL,
	`size_unit` varchar(15) NOT NULL,
	`producer` varchar(45),
	CONSTRAINT `BrandNames_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `D_Formulary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`volume_in_ml` decimal(5,2),
	CONSTRAINT `Formulary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `D_Formulations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`formulary_id` int NOT NULL,
	`ac_id` int NOT NULL,
	`amount` decimal(10,5) NOT NULL,
	`amount_unit` varchar(5) NOT NULL,
	`role` varchar(45) NOT NULL,
	`role_target` int,
	CONSTRAINT `Formulations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `D_ROA` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(15) NOT NULL,
	CONSTRAINT `ROA_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `D_Use` (
	`id` int NOT NULL,
	`use` varchar(45) NOT NULL,
	CONSTRAINT `Use_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `D_formulary_roa` (
	`formulary_id` int NOT NULL,
	`roa` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Diagnoses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patient_id` int NOT NULL,
	`diagnosis_time` datetime NOT NULL,
	`diagnosis` varchar(45) NOT NULL,
	`diagnosis_icd11` varchar(45),
	`diagnosing_phys` int NOT NULL,
	`type` varchar(45),
	CONSTRAINT `diagnoses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `MedPlan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`timestamp` datetime NOT NULL,
	`patient_id` int NOT NULL,
	`medication_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`amount_unit` varchar(15) NOT NULL,
	`frequency` decimal(10,2) NOT NULL,
	`duration_days` decimal(10,2) NOT NULL,
	`mixed_with` int,
	`discontinued_at` datetime,
	`discontinue_phys_id` int,
	`discontinue_phys_signature` varchar(256),
	`discontinue_phys_sign_key_id` int,
	CONSTRAINT `MedPlan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `MedPlan_NoteTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` text NOT NULL,
	CONSTRAINT `MedPlan_NoteTypes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `MedPlan_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`timestamp` datetime NOT NULL,
	`med_plan_id` int NOT NULL,
	`note` longtext NOT NULL,
	`note_type` int NOT NULL,
	`author_id` int NOT NULL,
	`author_signature` varchar(256) NOT NULL,
	`author_sign_key_id` int NOT NULL,
	CONSTRAINT `MedPlan_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `MedPlan_sign_nurse` (
	`med_plan_id` int NOT NULL,
	`nurse_id` int NOT NULL,
	`nurse_signature` varchar(256) NOT NULL,
	`nurse_sign_key_id` int NOT NULL,
	`signature_time` datetime NOT NULL
);
--> statement-breakpoint
CREATE TABLE `MedPlan_sign_pharm` (
	`med_plan_id` int NOT NULL,
	`pharm_id` int NOT NULL,
	`pharm_signature` varchar(256) NOT NULL,
	`pharm_signature_key_id` int NOT NULL,
	`signature_time` datetime NOT NULL
);
--> statement-breakpoint
CREATE TABLE `MedPlan_sign_phys` (
	`med_plan_id` int NOT NULL,
	`phys_id` int NOT NULL,
	`phys_signature` varchar(256) NOT NULL,
	`phys_signature_key_id` int NOT NULL,
	`signature_time` datetime NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Patient_Exit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patient_id` int NOT NULL,
	`exit_order_id` int,
	`timestamp` datetime NOT NULL,
	`exit_reason` int NOT NULL,
	`notes` longtext,
	`registrar` int NOT NULL,
	`registrar_signature` varchar(256) NOT NULL,
	`registrar_sign_key` int NOT NULL,
	CONSTRAINT `Patient_Exit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Patient_Exit_Orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patient_id` int NOT NULL,
	`notes` longtext,
	`phys_id` int NOT NULL,
	`phys_signature` varchar(256) NOT NULL,
	`phys_sign_key` int NOT NULL,
	`timestamp` datetime NOT NULL,
	CONSTRAINT `Patient_Exit_Orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Patient_Insurance` (
	`patient_id` int NOT NULL,
	`insurance_number` varchar(45) NOT NULL,
	`insurance_entity` varchar(45) NOT NULL,
	`type` varchar(45) NOT NULL,
	`valid_from_date` date NOT NULL,
	`expiration_date` date NOT NULL,
	`stay` varchar(45),
	`medication_deductible_percent` decimal NOT NULL DEFAULT '1',
	`lab_deductible_percent` decimal NOT NULL DEFAULT '1',
	`radiology_deductible_percent` decimal NOT NULL DEFAULT '1',
	`dental_deductible_percent` decimal NOT NULL DEFAULT '1',
	`maternal_deductible_percent` decimal NOT NULL DEFAULT '1'
);
--> statement-breakpoint
CREATE TABLE `Patient_admissions` (
	`timestamp` datetime NOT NULL,
	`patient_id` int NOT NULL,
	`admission_notes` longtext,
	`admitted_from` varchar(45) NOT NULL,
	`admitting_phys` int NOT NULL,
	`admitting_phys_signature` varchar(256) NOT NULL,
	`admitting_phys_sign_key_id` int NOT NULL,
	`registrar` int
);
--> statement-breakpoint
CREATE TABLE `Patient_exit_reasons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reason` varchar(15) NOT NULL,
	CONSTRAINT `Patient_exit_reasons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Patient_trans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patient_id` int NOT NULL,
	`notes` longtext,
	`nurse_id` int NOT NULL,
	`nurse_signature` varchar(256) NOT NULL,
	`nurse_sign_key_id` int NOT NULL,
	`timestamp` datetime NOT NULL,
	CONSTRAINT `Patient_trans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Patient_trans_orders` (
	`id` int NOT NULL,
	`patient_id` int NOT NULL,
	`ward` int NOT NULL,
	`notes` longtext,
	`phys_id` int NOT NULL,
	`phys_signature` varchar(256) NOT NULL,
	`phys_sign_key_id` int NOT NULL,
	`timestamp` datetime NOT NULL,
	CONSTRAINT `Patient_trans_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Patients` (
	`id` int NOT NULL,
	`person_id` int NOT NULL,
	`meal_type` varchar(45) NOT NULL,
	`ward` int NOT NULL,
	CONSTRAINT `Patients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `People` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(45) NOT NULL,
	`father_name` varchar(45) NOT NULL,
	`grandfather_name` varchar(45) NOT NULL,
	`family_name` varchar(45),
	`birthdate` date,
	`race` varchar(16),
	`marital_status` tinyint,
	`gender` tinyint,
	`religion` varchar(15),
	`occupation` varchar(45),
	CONSTRAINT `People_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `People_Staff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job` varchar(45) NOT NULL,
	`qualification` varchar(45) NOT NULL,
	`major` varchar(45) NOT NULL,
	`department` varchar(45) NOT NULL,
	`employment_date` date NOT NULL,
	`manager_id` int NOT NULL,
	`person_id` int NOT NULL,
	CONSTRAINT `Staff_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `People_Users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(45) NOT NULL,
	`hashed_pw` longtext NOT NULL,
	`role` int NOT NULL,
	`person_id` int NOT NULL,
	`staff_id` int,
	`public_key` int NOT NULL,
	CONSTRAINT `Users_id` PRIMARY KEY(`id`),
	CONSTRAINT `username_UNIQUE` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `People_contact_information` (
	`id` int NOT NULL,
	`contact_string` varchar(100) NOT NULL,
	`contact_type` varchar(45) NOT NULL,
	`person_id` int NOT NULL,
	`is_verified` tinyint NOT NULL,
	CONSTRAINT `contact_information_id` PRIMARY KEY(`id`),
	CONSTRAINT `contact_string_UNIQUE` UNIQUE(`contact_string`),
	CONSTRAINT `id_contact_information_UNIQUE` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `People_identifying_documents` (
	`id` int NOT NULL,
	`document_number` varchar(45) NOT NULL,
	`document_type` varchar(20) NOT NULL,
	`person_id` int NOT NULL,
	CONSTRAINT `identifying_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `People_relationships` (
	`person_id` int NOT NULL,
	`related_to_id` int NOT NULL,
	`relationship` varchar(45) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Ph_InEco` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand_name_id` int NOT NULL,
	`amount` int NOT NULL,
	`unit_price` decimal(10,5) NOT NULL,
	`expiry_date` date,
	`batch_number` varchar(32),
	CONSTRAINT `PhInEco_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Ph_InEco_Transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`timestamp` datetime NOT NULL,
	`item_id` int NOT NULL,
	`amount` int NOT NULL,
	`pharm_id` int NOT NULL,
	`pharm_signature` varchar(256) NOT NULL,
	`pharm_sign_key` int NOT NULL,
	`med_plan_id` int,
	`dispensing_nurse_id` int,
	CONSTRAINT `PhInEco_Transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `S_pb_key` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`key` varchar(256) NOT NULL,
	`since` datetime NOT NULL,
	CONSTRAINT `pb_key_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `S_pv_keys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`key` varchar(256) NOT NULL,
	`since` datetime NOT NULL,
	CONSTRAINT `pv_keys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Wards` (
	`id` int NOT NULL,
	`name` varchar(10) NOT NULL,
	`floor` int NOT NULL,
	CONSTRAINT `Wards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `D_AC_use` ADD CONSTRAINT `D_AC_use_ac_id_D_AC_id_fk` FOREIGN KEY (`ac_id`) REFERENCES `D_AC`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `D_AC_use` ADD CONSTRAINT `D_AC_use_use_id_D_Use_id_fk` FOREIGN KEY (`use_id`) REFERENCES `D_Use`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `D_BrandNames` ADD CONSTRAINT `D_BrandNames_formulary_id_D_Formulary_id_fk` FOREIGN KEY (`formulary_id`) REFERENCES `D_Formulary`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `D_Formulations` ADD CONSTRAINT `D_Formulations_formulary_id_D_Formulary_id_fk` FOREIGN KEY (`formulary_id`) REFERENCES `D_Formulary`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `D_Formulations` ADD CONSTRAINT `D_Formulations_ac_id_D_AC_id_fk` FOREIGN KEY (`ac_id`) REFERENCES `D_AC`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `D_Formulations` ADD CONSTRAINT `ac_role_target_link` FOREIGN KEY (`role_target`) REFERENCES `D_Formulations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `D_formulary_roa` ADD CONSTRAINT `D_formulary_roa_formulary_id_D_Formulary_id_fk` FOREIGN KEY (`formulary_id`) REFERENCES `D_Formulary`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `D_formulary_roa` ADD CONSTRAINT `D_formulary_roa_roa_D_ROA_id_fk` FOREIGN KEY (`roa`) REFERENCES `D_ROA`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Diagnoses` ADD CONSTRAINT `Diagnoses_patient_id_Patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `Patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Diagnoses` ADD CONSTRAINT `Diagnoses_diagnosing_phys_People_Staff_id_fk` FOREIGN KEY (`diagnosing_phys`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan` ADD CONSTRAINT `MedPlan_patient_id_Patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `Patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan` ADD CONSTRAINT `MedPlan_medication_id_D_Formulary_id_fk` FOREIGN KEY (`medication_id`) REFERENCES `D_Formulary`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan` ADD CONSTRAINT `MedPlan_discontinue_phys_id_People_Staff_id_fk` FOREIGN KEY (`discontinue_phys_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan` ADD CONSTRAINT `MedPlan_discontinue_phys_sign_key_id_S_pb_key_id_fk` FOREIGN KEY (`discontinue_phys_sign_key_id`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan` ADD CONSTRAINT `mixture_link` FOREIGN KEY (`mixed_with`) REFERENCES `MedPlan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_notes` ADD CONSTRAINT `MedPlan_notes_med_plan_id_MedPlan_id_fk` FOREIGN KEY (`med_plan_id`) REFERENCES `MedPlan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_notes` ADD CONSTRAINT `MedPlan_notes_note_type_MedPlan_NoteTypes_id_fk` FOREIGN KEY (`note_type`) REFERENCES `MedPlan_NoteTypes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_notes` ADD CONSTRAINT `MedPlan_notes_author_id_People_Staff_id_fk` FOREIGN KEY (`author_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_notes` ADD CONSTRAINT `MedPlan_notes_author_sign_key_id_S_pb_key_id_fk` FOREIGN KEY (`author_sign_key_id`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_nurse` ADD CONSTRAINT `MedPlan_sign_nurse_med_plan_id_MedPlan_id_fk` FOREIGN KEY (`med_plan_id`) REFERENCES `MedPlan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_nurse` ADD CONSTRAINT `MedPlan_sign_nurse_nurse_id_People_Staff_id_fk` FOREIGN KEY (`nurse_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_nurse` ADD CONSTRAINT `MedPlan_sign_nurse_nurse_sign_key_id_S_pb_key_id_fk` FOREIGN KEY (`nurse_sign_key_id`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_pharm` ADD CONSTRAINT `MedPlan_sign_pharm_med_plan_id_MedPlan_id_fk` FOREIGN KEY (`med_plan_id`) REFERENCES `MedPlan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_pharm` ADD CONSTRAINT `MedPlan_sign_pharm_pharm_id_People_Staff_id_fk` FOREIGN KEY (`pharm_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_pharm` ADD CONSTRAINT `MedPlan_sign_pharm_pharm_signature_key_id_S_pb_key_id_fk` FOREIGN KEY (`pharm_signature_key_id`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_phys` ADD CONSTRAINT `MedPlan_sign_phys_med_plan_id_MedPlan_id_fk` FOREIGN KEY (`med_plan_id`) REFERENCES `MedPlan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_phys` ADD CONSTRAINT `MedPlan_sign_phys_phys_id_People_Staff_id_fk` FOREIGN KEY (`phys_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_phys` ADD CONSTRAINT `MedPlan_sign_phys_phys_signature_key_id_S_pb_key_id_fk` FOREIGN KEY (`phys_signature_key_id`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_Exit` ADD CONSTRAINT `Patient_Exit_patient_id_Patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `Patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_Exit` ADD CONSTRAINT `Patient_Exit_exit_order_id_Patient_Exit_Orders_id_fk` FOREIGN KEY (`exit_order_id`) REFERENCES `Patient_Exit_Orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_Exit` ADD CONSTRAINT `Patient_Exit_exit_reason_Patient_exit_reasons_id_fk` FOREIGN KEY (`exit_reason`) REFERENCES `Patient_exit_reasons`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_Exit` ADD CONSTRAINT `Patient_Exit_registrar_People_Staff_id_fk` FOREIGN KEY (`registrar`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_Exit` ADD CONSTRAINT `Patient_Exit_registrar_sign_key_S_pb_key_id_fk` FOREIGN KEY (`registrar_sign_key`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_Exit_Orders` ADD CONSTRAINT `Patient_Exit_Orders_patient_id_Patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `Patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_Exit_Orders` ADD CONSTRAINT `Patient_Exit_Orders_phys_id_People_Staff_id_fk` FOREIGN KEY (`phys_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_Exit_Orders` ADD CONSTRAINT `Patient_Exit_Orders_phys_sign_key_S_pb_key_id_fk` FOREIGN KEY (`phys_sign_key`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_Insurance` ADD CONSTRAINT `Patient_Insurance_patient_id_Patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `Patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_admissions` ADD CONSTRAINT `Patient_admissions_patient_id_Patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `Patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_admissions` ADD CONSTRAINT `Patient_admissions_admitting_phys_People_Staff_id_fk` FOREIGN KEY (`admitting_phys`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_admissions` ADD CONSTRAINT `Patient_admissions_admitting_phys_sign_key_id_S_pb_key_id_fk` FOREIGN KEY (`admitting_phys_sign_key_id`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_admissions` ADD CONSTRAINT `Patient_admissions_registrar_People_Staff_id_fk` FOREIGN KEY (`registrar`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_trans` ADD CONSTRAINT `Patient_trans_patient_id_Patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `Patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_trans` ADD CONSTRAINT `Patient_trans_nurse_id_People_id_fk` FOREIGN KEY (`nurse_id`) REFERENCES `People`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_trans` ADD CONSTRAINT `Patient_trans_nurse_sign_key_id_S_pb_key_id_fk` FOREIGN KEY (`nurse_sign_key_id`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_trans_orders` ADD CONSTRAINT `Patient_trans_orders_patient_id_Patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `Patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_trans_orders` ADD CONSTRAINT `Patient_trans_orders_ward_Wards_id_fk` FOREIGN KEY (`ward`) REFERENCES `Wards`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_trans_orders` ADD CONSTRAINT `Patient_trans_orders_phys_id_People_Staff_id_fk` FOREIGN KEY (`phys_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patient_trans_orders` ADD CONSTRAINT `Patient_trans_orders_phys_sign_key_id_S_pb_key_id_fk` FOREIGN KEY (`phys_sign_key_id`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patients` ADD CONSTRAINT `Patients_person_id_People_id_fk` FOREIGN KEY (`person_id`) REFERENCES `People`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Patients` ADD CONSTRAINT `Patients_ward_Wards_id_fk` FOREIGN KEY (`ward`) REFERENCES `Wards`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `People_Staff` ADD CONSTRAINT `People_Staff_person_id_People_id_fk` FOREIGN KEY (`person_id`) REFERENCES `People`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `People_Staff` ADD CONSTRAINT `staff_manager_link` FOREIGN KEY (`manager_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `People_Users` ADD CONSTRAINT `People_Users_person_id_People_id_fk` FOREIGN KEY (`person_id`) REFERENCES `People`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `People_Users` ADD CONSTRAINT `People_Users_staff_id_People_Staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `People_Users` ADD CONSTRAINT `People_Users_public_key_S_pb_key_id_fk` FOREIGN KEY (`public_key`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `People_contact_information` ADD CONSTRAINT `People_contact_information_person_id_People_id_fk` FOREIGN KEY (`person_id`) REFERENCES `People`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `People_identifying_documents` ADD CONSTRAINT `People_identifying_documents_person_id_People_id_fk` FOREIGN KEY (`person_id`) REFERENCES `People`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `People_relationships` ADD CONSTRAINT `People_relationships_person_id_People_id_fk` FOREIGN KEY (`person_id`) REFERENCES `People`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `People_relationships` ADD CONSTRAINT `People_relationships_related_to_id_People_id_fk` FOREIGN KEY (`related_to_id`) REFERENCES `People`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Ph_InEco` ADD CONSTRAINT `Ph_InEco_brand_name_id_D_BrandNames_id_fk` FOREIGN KEY (`brand_name_id`) REFERENCES `D_BrandNames`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` ADD CONSTRAINT `Ph_InEco_Transactions_item_id_Ph_InEco_id_fk` FOREIGN KEY (`item_id`) REFERENCES `Ph_InEco`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` ADD CONSTRAINT `Ph_InEco_Transactions_pharm_id_People_Staff_id_fk` FOREIGN KEY (`pharm_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` ADD CONSTRAINT `Ph_InEco_Transactions_pharm_sign_key_S_pb_key_id_fk` FOREIGN KEY (`pharm_sign_key`) REFERENCES `S_pb_key`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` ADD CONSTRAINT `Ph_InEco_Transactions_med_plan_id_MedPlan_id_fk` FOREIGN KEY (`med_plan_id`) REFERENCES `MedPlan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` ADD CONSTRAINT `Ph_InEco_Transactions_dispensing_nurse_id_People_Staff_id_fk` FOREIGN KEY (`dispensing_nurse_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `S_pb_key` ADD CONSTRAINT `S_pb_key_user_id_People_Users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `People_Users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `S_pv_keys` ADD CONSTRAINT `S_pv_keys_user_id_People_Users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `People_Users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `ingredient_link_idx` ON `D_AC_use` (`ac_id`);--> statement-breakpoint
CREATE INDEX `use_link_idx` ON `D_AC_use` (`use_id`);--> statement-breakpoint
CREATE INDEX `brand_name_formulary_link_idx` ON `D_BrandNames` (`formulary_id`);--> statement-breakpoint
CREATE INDEX `ac_link_idx` ON `D_Formulations` (`ac_id`);--> statement-breakpoint
CREATE INDEX `ac_role_target_link_idx` ON `D_Formulations` (`role_target`);--> statement-breakpoint
CREATE INDEX `formulary_link_idx` ON `D_Formulations` (`formulary_id`);--> statement-breakpoint
CREATE INDEX `formulary_name_link_idx` ON `D_formulary_roa` (`formulary_id`);--> statement-breakpoint
CREATE INDEX `formulary_routes_link_idx` ON `D_formulary_roa` (`roa`);--> statement-breakpoint
CREATE INDEX `diagnosing_phys_link_idx` ON `Diagnoses` (`diagnosing_phys`);--> statement-breakpoint
CREATE INDEX `patient_diagnosis_link_idx` ON `Diagnoses` (`patient_id`);--> statement-breakpoint
CREATE INDEX `dc_phy_sign_key_id_link_idx` ON `MedPlan` (`discontinue_phys_sign_key_id`);--> statement-breakpoint
CREATE INDEX `hold_phys_id_link_idx` ON `MedPlan` (`discontinue_phys_id`);--> statement-breakpoint
CREATE INDEX `medication_id_link_idx` ON `MedPlan` (`medication_id`);--> statement-breakpoint
CREATE INDEX `med_plan_patient_id_idx` ON `MedPlan` (`patient_id`);--> statement-breakpoint
CREATE INDEX `mixture_link_idx` ON `MedPlan` (`mixed_with`);--> statement-breakpoint
CREATE INDEX `author_link_idx` ON `MedPlan_notes` (`author_id`);--> statement-breakpoint
CREATE INDEX `author_sign_key_id_link_idx` ON `MedPlan_notes` (`author_sign_key_id`);--> statement-breakpoint
CREATE INDEX `note_type_link_idx` ON `MedPlan_notes` (`note_type`);--> statement-breakpoint
CREATE INDEX `treatment_plan_link_idx` ON `MedPlan_notes` (`med_plan_id`);--> statement-breakpoint
CREATE INDEX `med_plan_id_nurse_sign_link_idx` ON `MedPlan_sign_nurse` (`med_plan_id`);--> statement-breakpoint
CREATE INDEX `nurse_id_mp_link_idx` ON `MedPlan_sign_nurse` (`nurse_id`);--> statement-breakpoint
CREATE INDEX `pharm_sign_key_id_mp_link_idx` ON `MedPlan_sign_nurse` (`nurse_sign_key_id`);--> statement-breakpoint
CREATE INDEX `med_plan_id_pharm_sign_link_idx` ON `MedPlan_sign_pharm` (`med_plan_id`);--> statement-breakpoint
CREATE INDEX `pharm_sign_key_id_mp_link_idx` ON `MedPlan_sign_pharm` (`pharm_signature_key_id`);--> statement-breakpoint
CREATE INDEX `phys_id_mp_link_idx` ON `MedPlan_sign_pharm` (`pharm_id`);--> statement-breakpoint
CREATE INDEX `med_plan_id_link_idx` ON `MedPlan_sign_phys` (`med_plan_id`);--> statement-breakpoint
CREATE INDEX `phys_id_mp_link_idx` ON `MedPlan_sign_phys` (`phys_id`);--> statement-breakpoint
CREATE INDEX `phys_sign_key_id_mp_link_idx` ON `MedPlan_sign_phys` (`phys_signature_key_id`);--> statement-breakpoint
CREATE INDEX `patient_exit_exit_order_id_link_idx` ON `Patient_Exit` (`exit_order_id`);--> statement-breakpoint
CREATE INDEX `patient_exit_patient_id_link_idx` ON `Patient_Exit` (`patient_id`);--> statement-breakpoint
CREATE INDEX `patient_exit_reason_id_link_idx` ON `Patient_Exit` (`exit_reason`);--> statement-breakpoint
CREATE INDEX `patient_exit_registrar_id_link_idx` ON `Patient_Exit` (`registrar`);--> statement-breakpoint
CREATE INDEX `patient_exit_registrar_sign_key_id_link_idx` ON `Patient_Exit` (`registrar_sign_key`);--> statement-breakpoint
CREATE INDEX `patient_exit_orders_patient_id_link_idx` ON `Patient_Exit_Orders` (`patient_id`);--> statement-breakpoint
CREATE INDEX `patient_exit_orders_phys_sign_key_id_link_idx` ON `Patient_Exit_Orders` (`phys_sign_key`);--> statement-breakpoint
CREATE INDEX `patient_exit_orders_phys_id_link_idx` ON `Patient_Exit_Orders` (`phys_id`);--> statement-breakpoint
CREATE INDEX `patient_insurance_link_idx` ON `Patient_Insurance` (`patient_id`);--> statement-breakpoint
CREATE INDEX `admission_patient_id_link_idx` ON `Patient_admissions` (`patient_id`);--> statement-breakpoint
CREATE INDEX `admission_phys_id_link_idx` ON `Patient_admissions` (`admitting_phys`);--> statement-breakpoint
CREATE INDEX `admitting_phys_sign_key_id_link_idx` ON `Patient_admissions` (`admitting_phys_sign_key_id`);--> statement-breakpoint
CREATE INDEX `admitting_registrar_id_link_idx` ON `Patient_admissions` (`registrar`);--> statement-breakpoint
CREATE INDEX `trans_order_nurse_id_link_idx` ON `Patient_trans` (`nurse_id`);--> statement-breakpoint
CREATE INDEX `trans_order_nurse_sign_key_id_link_idx` ON `Patient_trans` (`nurse_sign_key_id`);--> statement-breakpoint
CREATE INDEX `trans_patient_id_link_idx` ON `Patient_trans` (`patient_id`);--> statement-breakpoint
CREATE INDEX `trans_order_patient_id_link_idx` ON `Patient_trans_orders` (`patient_id`);--> statement-breakpoint
CREATE INDEX `trans_order_phys_id_link_idx` ON `Patient_trans_orders` (`phys_id`);--> statement-breakpoint
CREATE INDEX `trans_order_phys_sign_id_link_idx` ON `Patient_trans_orders` (`phys_sign_key_id`);--> statement-breakpoint
CREATE INDEX `trans_order_ward_id_link_idx` ON `Patient_trans_orders` (`ward`);--> statement-breakpoint
CREATE INDEX `patients_person_id_link_idx` ON `Patients` (`person_id`);--> statement-breakpoint
CREATE INDEX `patients_ward_link_idx` ON `Patients` (`ward`);--> statement-breakpoint
CREATE INDEX `staff_manager_link_idx` ON `People_Staff` (`manager_id`);--> statement-breakpoint
CREATE INDEX `staff_person_link_idx` ON `People_Staff` (`person_id`);--> statement-breakpoint
CREATE INDEX `person_link_idx` ON `People_Users` (`person_id`);--> statement-breakpoint
CREATE INDEX `public_key_link_idx` ON `People_Users` (`public_key`);--> statement-breakpoint
CREATE INDEX `user_staff_id_link_idx` ON `People_Users` (`staff_id`);--> statement-breakpoint
CREATE INDEX `contact_person_link_idx` ON `People_contact_information` (`person_id`);--> statement-breakpoint
CREATE INDEX `document_person_link_idx` ON `People_identifying_documents` (`person_id`);--> statement-breakpoint
CREATE INDEX `people_relations_link_idx` ON `People_relationships` (`person_id`,`related_to_id`);--> statement-breakpoint
CREATE INDEX `person_relations_reference_idx` ON `People_relationships` (`person_id`);--> statement-breakpoint
CREATE INDEX `person_relative_reference_idx` ON `People_relationships` (`related_to_id`);--> statement-breakpoint
CREATE INDEX `drug_id_link_idx` ON `Ph_InEco` (`brand_name_id`);--> statement-breakpoint
CREATE INDEX `dispensing_pharm_id_link_idx` ON `Ph_InEco_Transactions` (`pharm_id`);--> statement-breakpoint
CREATE INDEX `item_id_link_idx` ON `Ph_InEco_Transactions` (`item_id`);--> statement-breakpoint
CREATE INDEX `med_plan_link_idx` ON `Ph_InEco_Transactions` (`med_plan_id`);--> statement-breakpoint
CREATE INDEX `nurse_id_link_idx` ON `Ph_InEco_Transactions` (`dispensing_nurse_id`);--> statement-breakpoint
CREATE INDEX `sign_key_link_idx` ON `Ph_InEco_Transactions` (`pharm_sign_key`);--> statement-breakpoint
CREATE INDEX `user_id_pb_key_link_idx` ON `S_pb_key` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_id_link_idx` ON `S_pv_keys` (`user_id`);