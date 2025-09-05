ALTER TABLE `Patient_Insurance` RENAME COLUMN `patient_id` TO `person_id`;--> statement-breakpoint
ALTER TABLE `Patient_Insurance` DROP FOREIGN KEY `Patient_Insurance_patient_id_Patients_id_fk`;
--> statement-breakpoint
DROP INDEX `patient_insurance_link_idx` ON `Patient_Insurance`;--> statement-breakpoint
ALTER TABLE `D_AC` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `D_BrandNames` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `D_Formulary` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `D_Formulations` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `D_ROA` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `D_Uses` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `Diagnoses` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `People_Staff` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `People_Users` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `People_contact_information` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `People_identifying_documents` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `Ph_InEco` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `S_pb_keys` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `S_pv_keys` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `S_pv_keys` MODIFY COLUMN `key` text NOT NULL;--> statement-breakpoint
ALTER TABLE `D_AC` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `D_BrandNames` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `D_Formulary` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `D_Formulations` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `D_ROA` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `D_Uses` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `Diagnoses` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `People_Staff` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `People_Users` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `People_contact_information` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `People_identifying_documents` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `Ph_InEco` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `S_pb_keys` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `S_pv_keys` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `People_Users` ADD `private_key` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `S_pv_keys` ADD `init_vector` text NOT NULL;--> statement-breakpoint
ALTER TABLE `S_pv_keys` ADD `auth_tag` text NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_Insurance` ADD CONSTRAINT `Patient_Insurance_person_id_People_id_fk` FOREIGN KEY (`person_id`) REFERENCES `People`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `People_Users` ADD CONSTRAINT `People_Users_private_key_S_pv_keys_id_fk` FOREIGN KEY (`private_key`) REFERENCES `S_pv_keys`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `person_insurance_link_idx` ON `Patient_Insurance` (`person_id`);