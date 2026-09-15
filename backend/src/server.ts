import express from "express";
import cors from "cors";

import { db } from "./db";
import { games, players as playersTable } from "./db/schema";

import { eq } from "drizzle-orm";

const app = express();
const PORT = 5000;



app.use(cors());
app.use(express.json());


app.post("/api/games", async (req, res) => {
  const { gameName, systemPrompt, players } = req.body;

  const game = {
    id: Date.now().toString(),
    gameName,
    systemPrompt,
    createdAt: new Date(),
  };

  await db.insert(games).values(game);

const playerRecords = players.map((name: string) => ({
id: crypto.randomUUID(),
gameId: game.id,
name,
score: 0,
}));

await db.insert(playersTable).values(playerRecords);

res.status(201).json({
...game,
players: playerRecords,
scores: playerRecords.map(() => 0),
});
});

app.patch("/api/players/:playerId/score", async (req, res) => {
  const { playerId } = req.params;
  const { score } = req.body;

  const result = await db
    .update(playersTable)
    .set({ score })
    .where(eq(playersTable.id, playerId))
    .returning();

  if (result.length === 0) {
    return res.status(404).json({ message: "Player not found" });
  }

  res.json(result[0]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});