import type { Game, Player } from "../types/game";
import { Scoreboard } from "./Scoreboard";

type GameScreenProps = {
  game: Game;
  round: number;
  question: string;
  instruction: string;
  instructions: string[];
  winner: Player | null;
  gameEnded: boolean;
  loading: boolean;
  error: string;
  onInstructionChange: (value: string) => void;
  onAskAi: () => void;
  onSelectWinner: (player: Player) => void;
  onNextRound: () => void;
  onEndGame: () => void;
  onReturnHome: () => void;
};

export function GameScreen(props: GameScreenProps) {
  const winningScore = Math.max(...props.game.players.map((player) => player.score));
  const gameWinners = props.game.players.filter((player) => player.score === winningScore);

  if (props.gameEnded) {
    return (
      <main className="app">
        <section className="game-shell end-game-shell">
          <p className="eyebrow">FINAL SCOREBOARD</p>
          <h1>{props.game.gameName}</h1>
          <div className="final-winner-card">
            <span className="trophy">🏆</span>
            <p className="eyebrow">GAME WINNER{gameWinners.length > 1 ? "S" : ""}</p>
            <h2>{gameWinners.map((player) => player.name).join(" & ")}</h2>
            <p>{winningScore} points{gameWinners.length > 1 ? " each · It's a tie!" : ""}</p>
          </div>
          <Scoreboard players={props.game.players} />
          <button className="primary-button return-home-button" onClick={props.onReturnHome}>Return to Home <span>→</span></button>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="game-shell">
        <header className="game-header">
          <div><p className="eyebrow">HOST: {props.game.hostName}</p><h1>{props.game.gameName}</h1></div>
          <div className="header-actions"><div className="round-badge">ROUND {props.round}</div><button className="end-game-button" onClick={props.onEndGame}>End Game</button></div>
        </header>
        <div className="game-grid">
          <section className="panel question-panel">
            <div className="round-label">ROUND {props.round}</div>
            <h2>Host controls this round</h2>
            <p className="helper-copy">Players answer out loud. Host picks the winner.</p>
            <label htmlFor="instruction">Choose a prompt</label>
            <select id="instruction" value={props.instruction} onChange={(event) => props.onInstructionChange(event.target.value)}>
              {props.instructions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <button className="primary-button" onClick={props.onAskAi} disabled={props.loading || Boolean(props.question)}>{props.loading ? <><span className="button-spinner" aria-hidden="true" />AI is thinking…</> : props.question ? "Question ready" : "Ask the AI"}</button>
            <div className={`question-card ${props.question ? "has-question" : ""}`} aria-live="polite">{props.question || "Your question will appear here..."}</div>
            {props.question && !props.winner && <div className="winner-area"><h3>Who won the round?</h3><p className="winner-hint">Host picks the funniest answer.</p><div className="winner-buttons">{props.game.players.map((player) => <button key={player.id} onClick={() => props.onSelectWinner(player)} disabled={props.loading}><span className="avatar">{player.name.charAt(0).toUpperCase()}</span><span>{player.name}</span><strong>+10</strong></button>)}</div></div>}
            {props.winner && <div className="winner-message"><strong>🏆 {props.winner.name} wins the round!</strong><span>+10 points</span><button className="next-round-inline" onClick={props.onNextRound}>Next Round →</button></div>}
          </section>
          <div className="scoreboard-column"><Scoreboard players={props.game.players} winnerId={props.winner?.id} />{props.winner && <button className="secondary-button" onClick={props.onNextRound}>Next Round <span>→</span></button>}</div>
        </div>
        {props.error && <p className="error">{props.error}</p>}
      </section>
    </main>
  );
}
