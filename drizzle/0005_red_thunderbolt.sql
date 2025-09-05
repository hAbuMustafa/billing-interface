ALTER TABLE `S_pb_keys` MODIFY COLUMN `key` text NOT NULL;--> statement-breakpoint
ALTER TABLE `S_pb_keys` MODIFY COLUMN `since` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `S_pv_keys` MODIFY COLUMN `since` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `S_pv_keys` DROP COLUMN `init_vector`;--> statement-breakpoint
ALTER TABLE `S_pv_keys` DROP COLUMN `auth_tag`;