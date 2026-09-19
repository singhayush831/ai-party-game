type SetupScreenProps = {
  gameName: string;
  hostName: string;
  players: string[];
  error: string;
  loading: boolean;
  onGameNameChange: (value: string) => void;
  onHostNameChange: (value: string) => void;
  onPlayerChange: (index: number, value: string) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (index: number) => void;
  onStart: () => void;
  onBack: () => void;
};

export function SetupScreen(props: SetupScreenProps) {
  return (
    <main className="app">
      <section className="setup-shell">
        <button className="back-button" onClick={props.onBack}>← Back</button>
        <p className="eyebrow">CREATE A GAME</p>
        <h1>Set Up Your<br /><em>Game</em></h1>
        <p className="intro">Add a host and at least two players to get started.</p>
        <div className="form">
          <div className="form-section-label">GAME DETAILS</div>
          <label htmlFor="game-name">Game Name</label>
          <input id="game-name" maxLength={80} value={props.gameName} onChange={(event) => props.onGameNameChange(event.target.value)} placeholder="Friday Night Game" />
          <label htmlFor="host-name">Host</label>
          <input id="host-name" maxLength={30} value={props.hostName} onChange={(event) => props.onHostNameChange(event.target.value)} placeholder="Alex (host)" />
          <p className="host-hint">The host controls the AI and chooses the winner each round.</p>
          <div className="players-label"><label>Players <span>({props.players.length})</span></label><span>2–20 players</span></div>
          {props.players.map((player, index) => (
            <div className="player-input" key={index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <input maxLength={30} value={player} onChange={(event) => props.onPlayerChange(index, event.target.value)} placeholder={`Player ${index + 1}`} />
              <button className="remove-player" onClick={() => props.onRemovePlayer(index)} disabled={props.players.length <= 2} aria-label={`Remove player ${index + 1}`}>×</button>
            </div>
          ))}
          <button className="add-player" onClick={props.onAddPlayer} disabled={props.players.length >= 20}>+ Add player{props.players.length >= 20 ? " (maximum reached)" : ""}</button>
          {props.error && <p className="error">{props.error}</p>}
          <button className="primary-button" onClick={props.onStart} disabled={props.loading}>{props.loading ? <><span className="button-spinner" aria-hidden="true" />Creating...</> : <>Start Game <span>→</span></>}</button>
        </div>
      </section>
    </main>
  );
}
