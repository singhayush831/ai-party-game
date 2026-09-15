import { useState } from "react";

function App() {
  const [screen, setScreen] = useState("home");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const [gameName, setGameName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [players, setPlayers] = useState<string[]>([""]);
  const [scores, setScores] = useState<number[]>([]);


  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const [score, setScore] = useState(5);

  const addPlayer = () => {
    setPlayers([...players, ""]);
  };

  const updatePlayer = (index: number, value: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = value;
    setPlayers(updatedPlayers);
  };

  if (screen === "game") {
  return (
    <div className="app">
      <h1>🎮 {gameName}</h1>

      <h2>
        {players[currentPlayerIndex]}'s Turn
      </h2>

    <div>
      <h3>🏆 Scores</h3>

      {players.map((player, index) => (
        <p key={index}>
          {player}: {scores[index] || 0}
        </p>
      ))}
    </div>

      <p>Ask the AI something funny!</p>

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask the AI something..."
      />
      <button
        onClick={() => {
          setAiResponse(
            `Interesting question, ${players[currentPlayerIndex]}! I have absolutely no idea, but I'll pretend I do.`
          );
        }}
      >
        ASK AI
      </button>

      {aiResponse && (
        <div>
          <h3>🤖 AI</h3>
          <p>{aiResponse}</p>
      </div>
      )}

      {aiResponse && (
        <div>
          <h3>👨‍⚖️ Funniness Score</h3>

          <input
            type="range"
            min="1"
            max="10"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
          />

          <p>{score} / 10</p>

          <button
            onClick={() => {
              const updatedScores = [...scores];
              updatedScores[currentPlayerIndex] += score;

              setScores(updatedScores);
              setAiResponse("");
              setQuestion("");
              setScore(5);

              if (currentPlayerIndex === players.length - 1) {
                setCurrentPlayerIndex(0);
              } else {
                setCurrentPlayerIndex(currentPlayerIndex + 1);
              }
            }}
           >
            SUBMIT SCORE
          </button>
        </div>
      )}

      <button onClick={() => setScreen("home")}>
        End Game
      </button>
    </div>
  );
}

  if (screen === "setup") {
    return (
      <div className="app">
        <h1>⚙️ Game Setup</h1>

        <div className="form">
          <label>Game Name</label>

          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Roast the Room"
          />

          <label>AI Personality</label>

          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="You are a sarcastic robot..."
          />

          <label>Players</label>

          {players.map((player, index) => (
            <input
              key={index}
              type="text"
              value={player}
              onChange={(e) => updatePlayer(index, e.target.value)}
              placeholder={`Player ${index + 1}`}
            />
          ))}

          <button onClick={addPlayer}>
            + Add Player
          </button>

          <button
            onClick={() => {
              setScores(players.map(() => 0));
              setCurrentPlayerIndex(0);
              setScreen("game");
            }}
          >
            START GAME
          </button>

          <button onClick={() => setScreen("home")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>🤖 AI Party Game</h1>

      <p>The AI is ready to play.</p>

      <button onClick={() => setScreen("setup")}>
        Create New Game
      </button>
    </div>
  );
}

export default App;
