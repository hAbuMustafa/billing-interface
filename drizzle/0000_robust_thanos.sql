CREATE TABLE `Drugs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name_ar` text NOT NULL,
	`name_en` text NOT NULL,
	`trade_name_ar` text,
	`trade_name_en` text,
	`unit` integer NOT NULL,
	`category` integer NOT NULL,
	`smc_code` integer,
	`cat_strategy` integer,
	`cat_high_concentration_electrolyte` integer,
	`cat_dangerous` integer,
	`cat_upa_quota` integer,
	FOREIGN KEY (`unit`) REFERENCES `Drugs_unit`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category`) REFERENCES `Drugs_category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Drugs_amb_look` (
	`drug_id` integer NOT NULL,
	`look_like_id` integer NOT NULL,
	FOREIGN KEY (`drug_id`) REFERENCES `Drugs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`look_like_id`) REFERENCES `Drugs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Drugs_amb_name` (
	`drug_id` integer NOT NULL,
	`sound_like_id` integer NOT NULL,
	FOREIGN KEY (`drug_id`) REFERENCES `Drugs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sound_like_id`) REFERENCES `Drugs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Drugs_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Drugs_page_number` (
	`drug_id` integer NOT NULL,
	`record_id` integer NOT NULL,
	`record_page_number` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Drugs_unit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Patient_dismissal_reasons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Patient_id_doc_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Patient_wards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`ward` integer NOT NULL,
	`notes` text,
	`timestamp` integer DEFAULT '"2025-09-16T13:48:24.266Z"' NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `Patients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ward`) REFERENCES `Wards`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `trans_patient_id_link_idx` ON `Patient_wards` (`patient_id`);--> statement-breakpoint
CREATE TABLE `Patients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`id_doc_type` integer,
	`id_doc_num` text,
	`diagnosis` text NOT NULL,
	`admission_date` integer DEFAULT '"2025-09-16T13:48:24.266Z"' NOT NULL,
	`admission_notes` text,
	`dismissal_date` integer,
	`dismissal_reason` integer,
	`dismissal_notes` text,
	`gender` integer,
	`birthdate` integer,
	`health_insurance` integer,
	FOREIGN KEY (`id_doc_type`) REFERENCES `Patient_id_doc_type`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`dismissal_reason`) REFERENCES `Patient_dismissal_reasons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Ph_InEco_Stock` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`drug_id` integer NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`price_purchase` real NOT NULL,
	`expiry_date` integer,
	`batch_number` text,
	FOREIGN KEY (`drug_id`) REFERENCES `Drugs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `drug_id_stock_link` ON `Ph_InEco_Stock` (`drug_id`);--> statement-breakpoint
CREATE TABLE `Ph_InEco_Transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` integer DEFAULT '"2025-09-16T13:48:24.267Z"' NOT NULL,
	`item_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`patient_id` text NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `Ph_InEco_Stock`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`patient_id`) REFERENCES `Patients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `Sys_Users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `item_id_tx_link_idx` ON `Ph_InEco_Transactions` (`item_id`);--> statement-breakpoint
CREATE INDEX `patient_id_tx_link` ON `Ph_InEco_Transactions` (`patient_id`);--> statement-breakpoint
CREATE INDEX `user_id_tx_link` ON `Ph_InEco_Transactions` (`user_id`);--> statement-breakpoint
CREATE TABLE `Sys_Sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer DEFAULT (DATETIME('now', '+2 hours')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `Sys_Users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sessions_user_link` ON `Sys_Sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `Sys_Users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`hashed_pw` text NOT NULL,
	`name` text NOT NULL,
	`phone_number` text NOT NULL,
	`email` text,
	`national_id` text,
	`role` integer NOT NULL,
	`created_at` integer DEFAULT '"2025-09-16T13:48:24.267Z"' NOT NULL,
	`active` integer DEFAULT false NOT NULL,
	`last_login` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `username_UNIQUE` ON `Sys_Users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_mobile_UNIQUE` ON `Sys_Users` (`phone_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_UNIQUE` ON `Sys_Users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_national_id_UNIQUE` ON `Sys_Users` (`national_id`);--> statement-breakpoint
CREATE TABLE `Wards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`floor` integer NOT NULL
);
