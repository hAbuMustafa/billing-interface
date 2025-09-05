RENAME TABLE `Patient_Insurance` TO `People_Insurance`;--> statement-breakpoint
ALTER TABLE `People_Insurance` DROP FOREIGN KEY `Patient_Insurance_person_id_People_id_fk`;
--> statement-breakpoint
ALTER TABLE `People_Insurance` ADD CONSTRAINT `People_Insurance_person_id_People_id_fk` FOREIGN KEY (`person_id`) REFERENCES `People`(`id`) ON DELETE no action ON UPDATE no action;