import {
  pgTable,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: text("id").primaryKey(),
  gameName: text("game_name").notNull(),
  hostName: text("host_name").notNull(),
  systemPrompt: text("system_prompt").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const players = pgTable("players", {
  id: text("id").primaryKey(),
  gameId: text("game_id")
    .notNull()
    .references(() => games.id),
  name: text("name").notNull(),
  score: integer("score").notNull().default(0),
});

export const gameRounds = pgTable("game_rounds", {
  id: text("id").primaryKey(),
  gameId: text("game_id")
    .notNull()
    .references(() => games.id),
  roundNumber: integer("round_number").notNull(),
  instruction: text("instruction").notNull(),
  question: text("question").notNull(),
  winnerPlayerId: text("winner_player_id").references(() => players.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});