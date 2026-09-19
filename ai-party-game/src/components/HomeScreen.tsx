type HomeScreenProps = { onCreateGame: () => void };

export function HomeScreen({ onCreateGame }: HomeScreenProps) {
  return (
    <main className="app home">
      <div className="hero-mark" aria-hidden="true">✦</div>
      <p className="eyebrow">AI PARTY GAME</p>
      <h1>Ask. Laugh.<br /><em>Pick a winner.</em></h1>
      <p className="intro">Let the AI bring the questions.<br />You bring the chaos.</p>
      <button className="primary-button hero-cta" onClick={onCreateGame}>Create a Game <span>→</span></button>
      <p className="home-note">One host. Your friends. Endless rounds.</p>
    </main>
  );
}
