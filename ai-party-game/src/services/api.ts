import type { Game, Player } from "../types/game";

const API_URL = import.meta.env.VITE_API_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const data = await response.json() as T & { message?: string };
  if (!response.ok) throw new Error(data.message || "The request could not be completed.");
  return data;
}

export const createGame = (payload: { gameName: string; hostName: string; players: string[] }) =>
  request<Game>("/games", { method: "POST", body: JSON.stringify(payload) });

export const generateQuestion = (gameId: string, instruction: string) =>
  request<{ roundNumber: number; question: string }>(`/games/${gameId}/question`, {
    method: "POST",
    body: JSON.stringify({ instruction }),
  });

export const selectWinner = (gameId: string, playerId: string) =>
  request<Player>(`/games/${gameId}/winner`, {
    method: "PATCH",
    body: JSON.stringify({ playerId }),
  });
