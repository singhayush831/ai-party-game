import "dotenv/config";
import cors from "cors";
import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import { and, asc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { db } from "./db";
import { gameRounds, games, players as playersTable } from "./db/schema";
import { aiQuestionService } from "./services/aiService";

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const MAX_GAME_NAME_LENGTH = 80;
const MAX_PERSON_NAME_LENGTH = 30;
const MAX_PLAYERS = 20;
const MAX_INSTRUCTION_LENGTH = 200;
const POINTS_PER_WIN = 10;

class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

const asyncRoute = (handler: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const requireString = (value: unknown, field: string, maxLength: number) => {
  if (typeof value !== "string") throw new ApiError(400, `${field} is required.`);
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    throw new ApiError(400, `${field} must be between 1 and ${maxLength} characters.`);
  }
  return trimmed;
};

const getGame = async (gameId: string) => {
  const [game] = await db.select().from(games).where(eq(games.id, gameId)).limit(1);
  if (!game) throw new ApiError(404, "Game not found.");
  return game;
};

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.post("/api/games", asyncRoute(async (req, res) => {
  const body = req.body as { gameName?: unknown; hostName?: unknown; systemPrompt?: unknown; players?: unknown };
  const gameName = requireString(body.gameName, "Game name", MAX_GAME_NAME_LENGTH);
  const hostName = requireString(body.hostName, "Host name", MAX_PERSON_NAME_LENGTH);

  if (!Array.isArray(body.players) || body.players.length < 2 || body.players.length > MAX_PLAYERS) {
    throw new ApiError(400, `Add between 2 and ${MAX_PLAYERS} players.`);
  }

  const playerNames = body.players.map((name) => requireString(name, "Player name", MAX_PERSON_NAME_LENGTH));
  const uniqueNames = new Set(playerNames.map((name) => name.toLowerCase()));
  if (uniqueNames.size !== playerNames.length) throw new ApiError(400, "Player names must be unique.");
  if (uniqueNames.has(hostName.toLowerCase())) throw new ApiError(400, "The host must not also be a player.");

  const systemPrompt = body.systemPrompt === undefined
    ? ""
    : requireString(body.systemPrompt, "System prompt", MAX_INSTRUCTION_LENGTH);
  const game = {
    id: randomUUID(),
    gameName,
    hostName,
    systemPrompt,
    createdAt: new Date(),
  };
  const playerRecords = playerNames.map((name) => ({
    id: randomUUID(),
    gameId: game.id,
    name,
    score: 0,
  }));

  await db.transaction(async (tx) => {
    await tx.insert(games).values(game);
    await tx.insert(playersTable).values(playerRecords);
  });

  res.status(201).json({ ...game, players: playerRecords });
}));

app.post("/api/games/:gameId/question", asyncRoute(async (req, res) => {
  const gameId = requireString(req.params.gameId, "Game ID", 100);
  const game = await getGame(gameId);
  const body = req.body as { instruction?: unknown };
  const instruction = body.instruction === undefined
    ? "Give us a funny question"
    : requireString(body.instruction, "Instruction", MAX_INSTRUCTION_LENGTH);
  const previousRounds = await db
    .select({
      id: gameRounds.id,
      instruction: gameRounds.instruction,
      question: gameRounds.question,
      winnerPlayerId: gameRounds.winnerPlayerId,
    })
    .from(gameRounds)
    .where(eq(gameRounds.gameId, game.id))
    .orderBy(asc(gameRounds.roundNumber));
  const currentRound = previousRounds[previousRounds.length - 1];
  if (currentRound && !currentRound.winnerPlayerId) {
    res.json({ roundNumber: previousRounds.length, instruction: currentRound.instruction, question: currentRound.question });
    return;
  }
  const question = aiQuestionService.generateQuestion(
    instruction,
    previousRounds.map((round) => round.question),
  );
  const roundNumber = previousRounds.length + 1;
  const round = {
    id: randomUUID(),
    gameId: game.id,
    roundNumber,
    instruction,
    question,
    createdAt: new Date(),
  };

  await db.insert(gameRounds).values(round);
  res.json({ roundNumber, instruction, question });
}));

app.patch("/api/games/:gameId/winner", asyncRoute(async (req, res) => {
  const gameId = requireString(req.params.gameId, "Game ID", 100);
  const game = await getGame(gameId);
  const body = req.body as { playerId?: unknown };
  const playerId = requireString(body.playerId, "Player ID", 100);

  const [updatedPlayer] = await db.transaction(async (tx) => {
    const [player] = await tx
      .update(playersTable)
      .set({ score: sql`${playersTable.score} + ${POINTS_PER_WIN}` })
      .where(and(eq(playersTable.id, playerId), eq(playersTable.gameId, game.id)))
      .returning();
    if (!player) throw new ApiError(404, "Player does not belong to this game.");

    const [latestRound] = await tx
      .select()
      .from(gameRounds)
      .where(eq(gameRounds.gameId, game.id))
      .orderBy(sql`${gameRounds.roundNumber} desc`)
      .limit(1);
    if (!latestRound) throw new ApiError(409, "Generate a question before selecting a winner.");
    if (latestRound.winnerPlayerId) throw new ApiError(409, "This round already has a winner.");
    await tx
      .update(gameRounds)
      .set({ winnerPlayerId: player.id })
      .where(eq(gameRounds.id, latestRound.id));
    return [player];
  });

  res.json(updatedPlayer);
}));

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({ message: "Request body must be valid JSON." });
    return;
  }
  if (error instanceof ApiError) {
    res.status(error.status).json({ message: error.message });
    return;
  }
  console.error(error);
  res.status(500).json({ message: "Something went wrong. Please try again." });
};

app.use(errorHandler);

app.listen(Number(PORT), HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
