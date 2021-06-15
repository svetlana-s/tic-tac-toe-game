import { useState, useEffect, useCallback } from 'react';

import { useWS } from './ws';

export function useGameList() {
  const { ws, isWs } = useWS();

  const [gameList, setGameList] = useState([]);

  useEffect(() => {
    let unsubscribe;

    function listenMessage(ev) {
      try {
        const parsedData = JSON.parse(ev.data);

        if (parsedData.payload?.gameList) {
          setGameList(() => parsedData.payload.gameList);
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (ws && isWs) {
      unsubscribe = ws.subscribeMessage(listenMessage);
      ws.send(JSON.stringify({ type: 'getGameList' }));
      // ws.send(JSON.stringify({ type: 'getGameList', payload: {} }));
    }

    return unsubscribe;
  }, [ws, isWs, setGameList]);

  // const startNewGame = useCallback((gameName, gameId) => {
  //   if (ws && isWs) {
  //     ws.send(JSON.stringify({ type: 'startNewGame', payload: { gameName, gameId } }));
  //   }
  // }, [ws, isWs]);

  const getGameList = useCallback(() => {
    if (ws && isWs) {
      ws.send(JSON.stringify({ type: 'getGameList' }));
    }
  }, [ws, isWs]);

  return { gameList, getGameList };
}
