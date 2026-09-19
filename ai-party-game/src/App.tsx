import { useState } from "react";
import "./App.css";
import { GameScreen } from "./components/GameScreen";
import { HomeScreen } from "./components/HomeScreen";
import { SetupScreen } from "./components/SetupScreen";
import { createGame, generateQuestion, selectWinner } from "./services/api";
import type { Game, Player } from "./types/game";

const INSTRUCTIONS = [
  "Give us a funny question",
  "Give us a funny question about college",
  "Ask us a riddle",
  "Give us something challenging",
];

function App() {
  const [screen, setScreen] = useState<"home" | "setup" | "game">("home");
  const [gameName, setGameName] = useState("");
  const [hostName, setHostName] = useState("");
  const [players, setPlayers] = useState(["", ""]);
  const [game, setGame] = useState<Game | null>(null);
  const [round, setRound] = useState(1);
  const [question, setQuestion] = useState("");
  const [instruction, setInstruction] = useState(INSTRUCTIONS[0]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const runRequest = async (request: () => Promise<void>) => {
    setLoading(true);
    setError("");
    try {
      await request();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "";
      setError(message === "Failed to fetch" ? "Something went wrong. Please try again." : message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startGame = () => runRequest(async () => {
    const createdGame = await createGame({ gameName, hostName, players });
    setGame(createdGame);
    setGameEnded(false);
    setScreen("game");
  });

  const askAi = () => {
    if (!game) return;
    runRequest(async () => {
      const result = await generateQuestion(game.id, instruction);
      setRound(result.roundNumber);
      setQuestion(result.question);
      setWinner(null);
    });
  };

  const chooseWinner = (player: Player) => {
    if (!game) return;
    runRequest(async () => {
      const updatedPlayer = await selectWinner(game.id, player.id);
      setGame((currentGame) => currentGame
        ? { ...currentGame, players: currentGame.players.map((item) => item.id === player.id ? updatedPlayer : item) }
        : currentGame);
      setWinner(updatedPlayer);
    });
  };

  const nextRound = () => {
    setRound((currentRound) => currentRound + 1);
    setQuestion("");
    setWinner(null);
    setError("");
  };

  if (screen === "game" && game) {
    return <GameScreen game={game} round={round} question={question} instruction={instruction} instructions={INSTRUCTIONS} winner={winner} gameEnded={gameEnded} loading={loading} error={error} onInstructionChange={setInstruction} onAskAi={askAi} onSelectWinner={chooseWinner} onNextRound={nextRound} onEndGame={() => setGameEnded(true)} onReturnHome={() => { setGameEnded(false); setGame(null); setScreen("home"); }} />;
  }

  if (screen === "setup") {
    return <SetupScreen gameName={gameName} hostName={hostName} players={players} error={error} loading={loading} onGameNameChange={setGameName} onHostNameChange={setHostName} onPlayerChange={(index, value) => setPlayers((current) => current.map((player, playerIndex) => playerIndex === index ? value : player))} onAddPlayer={() => setPlayers((current) => [...current, ""])} onRemovePlayer={(index) => setPlayers((current) => current.filter((_player, playerIndex) => playerIndex !== index))} onStart={startGame} onBack={() => setScreen("home")} />;
  }

  return <HomeScreen onCreateGame={() => { setError(""); setScreen("setup"); }} />;
}

export default App;
