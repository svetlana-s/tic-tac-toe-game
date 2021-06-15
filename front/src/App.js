import React, { useState } from 'react';

import { StartNewGame } from './components/StartNewGame';
import { SelectGame } from './components/SelectGame';
import { Board } from './components/Board';

function App() {
  const [gameId, setGameId] = useState(null);

  return(
    <>
      <StartNewGame setGameId={setGameId} />
      <SelectGame setGameId={setGameId} />
      {gameId && <Board gameId={gameId} />}
    </>
  );
}

export default App;
