ALTER TABLE `D_AC` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `D_AC_use` MODIFY COLUMN `ac_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `D_AC_use` MODIFY COLUMN `use_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `D_BrandNames` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `D_BrandNames` MODIFY COLUMN `formulary_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `D_Formulary` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `D_Formulations` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `D_Formulations` MODIFY COLUMN `formulary_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `D_Formulations` MODIFY COLUMN `ac_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `D_Formulations` MODIFY COLUMN `role_target` bigint unsigned;--> statement-breakpoint
ALTER TABLE `D_Uses` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `D_formulary_roa` MODIFY COLUMN `formulary_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `Diagnoses` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Diagnoses` MODIFY COLUMN `patient_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `Diagnoses` MODIFY COLUMN `diagnosing_phys` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan` MODIFY COLUMN `patient_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan` MODIFY COLUMN `medication_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan` MODIFY COLUMN `mixed_with` bigint unsigned;--> statement-breakpoint
ALTER TABLE `MedPlan` MODIFY COLUMN `discontinue_phys_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `MedPlan` MODIFY COLUMN `discontinue_phys_sign_key_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `MedPlan_notes` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_notes` MODIFY COLUMN `med_plan_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_notes` MODIFY COLUMN `author_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_notes` MODIFY COLUMN `author_sign_key_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_nurse` MODIFY COLUMN `med_plan_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_nurse` MODIFY COLUMN `nurse_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_nurse` MODIFY COLUMN `nurse_sign_key_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_pharm` MODIFY COLUMN `med_plan_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_pharm` MODIFY COLUMN `pharm_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_pharm` MODIFY COLUMN `pharm_signature_key_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_phys` MODIFY COLUMN `med_plan_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_phys` MODIFY COLUMN `phys_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_phys` MODIFY COLUMN `phys_signature_key_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_Exit` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_Exit` MODIFY COLUMN `patient_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_Exit` MODIFY COLUMN `exit_order_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `Patient_Exit` MODIFY COLUMN `registrar` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_Exit` MODIFY COLUMN `registrar_sign_key` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_Exit_Orders` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_Exit_Orders` MODIFY COLUMN `patient_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `Patient_Exit_Orders` MODIFY COLUMN `phys_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `Patient_Exit_Orders` MODIFY COLUMN `phys_sign_key` bigint unsigned;--> statement-breakpoint
ALTER TABLE `Patient_Insurance` MODIFY COLUMN `patient_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_admissions` MODIFY COLUMN `patient_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `Patient_admissions` MODIFY COLUMN `admitting_phys` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_admissions` MODIFY COLUMN `admitting_phys_sign_key_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `Patient_admissions` MODIFY COLUMN `registrar` bigint unsigned;--> statement-breakpoint
ALTER TABLE `Patient_trans` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_trans` MODIFY COLUMN `patient_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_trans` MODIFY COLUMN `nurse_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_trans` MODIFY COLUMN `nurse_sign_key_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_trans_orders` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_trans_orders` MODIFY COLUMN `patient_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_trans_orders` MODIFY COLUMN `phys_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_trans_orders` MODIFY COLUMN `phys_sign_key_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Patients` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Patients` MODIFY COLUMN `person_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `People` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `People_Staff` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `People_Staff` MODIFY COLUMN `manager_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `People_Staff` MODIFY COLUMN `person_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `People_Users` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `People_Users` MODIFY COLUMN `person_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `People_Users` MODIFY COLUMN `staff_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `People_Users` MODIFY COLUMN `public_key` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `People_contact_information` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `People_contact_information` MODIFY COLUMN `person_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `People_identifying_documents` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `People_identifying_documents` MODIFY COLUMN `person_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `People_relationships` MODIFY COLUMN `person_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `People_relationships` MODIFY COLUMN `related_to_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Ph_InEco` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Ph_InEco` MODIFY COLUMN `brand_name_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` MODIFY COLUMN `item_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` MODIFY COLUMN `pharm_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` MODIFY COLUMN `pharm_sign_key` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` MODIFY COLUMN `med_plan_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` MODIFY COLUMN `dispensing_nurse_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `S_pb_keys` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `S_pv_keys` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Sys_Sessions` MODIFY COLUMN `user_id` bigint unsigned NOT NULL;