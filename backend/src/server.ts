import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

type Game = {
  id: string;
  gameName: string;
  systemPrompt: string;
  players: string[];
  scores: number[];
};

const games: Game[] = [];

app.use(cors());
app.use(express.json());


app.post("/api/games", (req, res) => {
  const { gameName, systemPrompt, players } = req.body;

  const game = {
    id: Date.now().toString(),
    gameName,
    systemPrompt,
    players,
    scores: players.map(() => 0),
  };

  games.push(game);

  res.status(201).json(game);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});