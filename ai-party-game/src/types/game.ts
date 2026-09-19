export type Player = {
  id: string;
  name: string;
  score: number;
};

export type Game = {
  id: string;
  gameName: string;
  hostName: string;
  players: Player[];
};
