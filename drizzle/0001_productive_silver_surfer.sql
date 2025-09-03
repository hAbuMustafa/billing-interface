ALTER TABLE `People_Users` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `People_Users` ADD `active` tinyint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `People_Users` ADD `last_login` timestamp;