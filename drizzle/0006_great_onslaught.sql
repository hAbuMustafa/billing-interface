RENAME TABLE `People_Users` TO `Sys_Users`;--> statement-breakpoint
ALTER TABLE `Sys_Users` DROP FOREIGN KEY `People_Users_person_id_People_id_fk`;
--> statement-breakpoint
ALTER TABLE `Sys_Users` DROP FOREIGN KEY `People_Users_staff_id_People_Staff_id_fk`;
--> statement-breakpoint
ALTER TABLE `Sys_Users` DROP FOREIGN KEY `People_Users_public_key_S_pb_keys_id_fk`;
--> statement-breakpoint
ALTER TABLE `Sys_Users` DROP FOREIGN KEY `People_Users_private_key_S_pv_keys_id_fk`;
--> statement-breakpoint
ALTER TABLE `Sys_Sessions` DROP FOREIGN KEY `Sys_Sessions_user_id_People_Users_id_fk`;
--> statement-breakpoint
ALTER TABLE `Sys_Users` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `D_AC_use` MODIFY COLUMN `use_id` int;--> statement-breakpoint
ALTER TABLE `D_Uses` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Diagnoses` MODIFY COLUMN `diagnosing_phys` int NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan` MODIFY COLUMN `discontinue_phys_id` int;--> statement-breakpoint
ALTER TABLE `MedPlan_notes` MODIFY COLUMN `author_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_nurse` MODIFY COLUMN `nurse_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_pharm` MODIFY COLUMN `pharm_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `MedPlan_sign_phys` MODIFY COLUMN `phys_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_Exit` MODIFY COLUMN `registrar` int NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_Exit_Orders` MODIFY COLUMN `phys_id` int;--> statement-breakpoint
ALTER TABLE `Patient_admissions` MODIFY COLUMN `admitting_phys` int NOT NULL;--> statement-breakpoint
ALTER TABLE `Patient_admissions` MODIFY COLUMN `registrar` int;--> statement-breakpoint
ALTER TABLE `Patient_trans_orders` MODIFY COLUMN `phys_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `People_Staff` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `People_Staff` MODIFY COLUMN `manager_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `Sys_Users` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Sys_Users` MODIFY COLUMN `staff_id` int;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` MODIFY COLUMN `pharm_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `Ph_InEco_Transactions` MODIFY COLUMN `dispensing_nurse_id` int;--> statement-breakpoint
ALTER TABLE `Sys_Sessions` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `Sys_Users` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `Sys_Users` ADD CONSTRAINT `Sys_Users_person_id_People_id_fk` FOREIGN KEY (`person_id`) REFERENCES `People`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Sys_Users` ADD CONSTRAINT `Sys_Users_staff_id_People_Staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `People_Staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Sys_Users` ADD CONSTRAINT `Sys_Users_public_key_S_pb_keys_id_fk` FOREIGN KEY (`public_key`) REFERENCES `S_pb_keys`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Sys_Users` ADD CONSTRAINT `Sys_Users_private_key_S_pv_keys_id_fk` FOREIGN KEY (`private_key`) REFERENCES `S_pv_keys`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Sys_Sessions` ADD CONSTRAINT `Sys_Sessions_user_id_Sys_Users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `Sys_Users`(`id`) ON DELETE no action ON UPDATE no action;