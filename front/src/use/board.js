import { useState, useEffect, useCallback } from 'react';

import { useWS } from './ws';

export function useBoard(gameId) {
  const { ws, isWs } = useWS();

  const [map, setMap] = useState(null);
  const [steps, setSteps] = useState([]);
  const [gameStatus, setGameStatus] = useState('');
  const [gameName, setGameName] = useState('');

  useEffect(() => {
    let unsubscribe;

    function listenMessage(ev) {
      try {
        const parsedData = JSON.parse(ev.data);

        if (parsedData.payload?.map) {
          setMap(() => parsedData.payload.map);
        }

        if (parsedData.payload?.steps) {
          setSteps(() => parsedData.payload.steps);
        }

        if (parsedData.payload?.gameStatus) {
          setGameStatus(() => parsedData.payload.gameStatus);
        }

        if (parsedData.payload?.gameName) {
          setGameName(() => parsedData.payload.gameName);
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (ws && isWs) {
      unsubscribe = ws.subscribeMessage(listenMessage);
      ws.send(JSON.stringify({ type: 'getBoardState', payload: { gameId } }));
    }

    return unsubscribe;
  }, [ws, isWs, setSteps, setMap, setGameStatus, setGameName, gameId]);

  const handleClear = useCallback(() => {
    if (ws && isWs) {
      ws.send(JSON.stringify({ type: 'clearBoard', payload: { gameId } }));
      ws.send(JSON.stringify({ type: 'getBoardState', payload: { gameId } }));
    }
  }, [ws, isWs]);

  const getGameState = useCallback((gameId) => {
    if (ws && isWs) {
      ws.send(JSON.stringify({ type: 'getBoardState', payload: { gameId } }));
    }
  });

  const startNewGame = useCallback((gameName, gameId) => {
    if (ws && isWs) {
      ws.send(JSON.stringify({ type: 'startNewGame', payload: { gameName, gameId } }));
    }
  }, [ws, isWs]);

  const handleStep = useCallback((field) => {
    if (ws && isWs) {
      if(steps.length === 0) {
        ws.send(JSON.stringify({
          type: 'firstStep',
          payload: { field, gameId },
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'step',
          payload: { field, prevStepId: steps.slice(-1)[0]?.id, gameId },
        }));
      }
    }
  }, [ws, isWs, steps]);

  return {
    map, steps,
    startNewGame,
    getGameState,
    handleClear,
    handleStep,
    gameName,
    gameStatus,
  };
}
