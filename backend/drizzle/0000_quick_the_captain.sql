CREATE TABLE "games" (
	"id" text PRIMARY KEY NOT NULL,
	"game_name" text NOT NULL,
	"system_prompt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
