import React from 'react';

import styles from './Board.module.css'
import { useBoard } from '../use/board';

export function Board({ gameId }) {
  const { map, gameName, gameStatus, handleClear, handleStep, getGameState } = useBoard(gameId);

  if (!map) {
    getGameState(gameId);
  }

  return (
    <div className={styles.box}>
      <h2>Current game: {gameName}</h2>
      <div className={styles.board}>
        <ul className={styles.map}>
          {map && map.map((field, idx) => (
            <li key={idx} className={styles.cell}>
              {field === ''
                ? <button onClick={() => handleStep(idx)}>{field}</button>
                : <>{field}</>
              }
            </li>
          ))}
        </ul>
      </div>
      {gameStatus === 'Finished' &&
        <div className={styles.control}>
          <h3>Game Over!</h3>
          <button className={styles.clear} onClick={handleClear}>Clear</button>
        </div>
        }
      </div>
  )
}
