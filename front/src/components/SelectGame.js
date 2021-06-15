import React, { useEffect } from 'react';

import { useGameList } from '../use/gameList';

export function SelectGame({ setGameId }) {
  const { gameList, getGameList } = useGameList();

  useEffect(() => {
    getGameList();
  }, []);

  const handleClick = (e) => {
    setGameId(e.target.id);
  };

  return(
    <>
      <h2>Select game</h2>
      {gameList.length ?
        <ul>
          {gameList.map(({ gameName, gameId }) => {
            return(
              <li key={gameId}>
                <button id={gameId} onClick={handleClick}>
                  {gameName}
                </button>
              </li>
            );
          })}
        </ul> : null
      }
    </>
  );
}
