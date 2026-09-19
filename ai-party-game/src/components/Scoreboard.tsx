import type { Player } from "../types/game";

export function Scoreboard({ players, winnerId }: { players: Player[]; winnerId?: string }) {
  const rankedPlayers = [...players].sort((a, b) => b.score - a.score);
  return (
    <aside className="panel scoreboard">
      <div className="section-heading">
        <div><p className="eyebrow">LIVE SCORES</p><h2>Scoreboard</h2></div>
        <span className="player-count">{players.length} players</span>
      </div>
      <ol>
        {rankedPlayers.map((player, index) => (
          <li className={`${index === 0 && player.score > 0 ? "leader" : ""} ${winnerId === player.id ? "score-updated" : ""}`} key={player.id}>
            <span className="score-player"><span className="rank">{index + 1}</span><span className="avatar">{player.name.charAt(0).toUpperCase()}</span><span>{player.name}</span></span>
            <strong>{player.score}{winnerId === player.id && <small>+10</small>}</strong>
          </li>
        ))}
      </ol>
    </aside>
  );
}
