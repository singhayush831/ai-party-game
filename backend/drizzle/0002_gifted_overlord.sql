CREATE TABLE "game_rounds" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"round_number" integer NOT NULL,
	"instruction" text NOT NULL,
	"question" text NOT NULL,
	"winner_player_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "host_name" text DEFAULT 'Host';--> statement-breakpoint
UPDATE "games" SET "host_name" = 'Host' WHERE "host_name" IS NULL;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "host_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "host_name" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "game_rounds" ADD CONSTRAINT "game_rounds_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_rounds" ADD CONSTRAINT "game_rounds_winner_player_id_players_id_fk" FOREIGN KEY ("winner_player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;