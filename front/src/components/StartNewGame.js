import React, { useState } from 'react';

import { useBoard } from '../use/board';
import { useGameList } from '../use/gameList';

export function StartNewGame({ setGameId }) {
  const [gameName, setGameName] = useState('');
  const[isGameVisible, setIsGameVisible] = useState(false);
  const { startNewGame } = useBoard();
  const { getGameList } = useGameList();

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = Date.now();
    setGameId(id);

    startNewGame(gameName, id);
    getGameList();
    setIsGameVisible(true);
  };

  if (isGameVisible) return null;
  return(
    <>
      <h2>New Game</h2>
      <p>Set game name for starting</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={!gameName.length}
        >Save</button>
      </form>
    </>
  );
}
