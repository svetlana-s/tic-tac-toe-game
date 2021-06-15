import { createServer } from 'http';
import sockjs from 'sockjs';

import { Board } from './lib/board.mjs';

const { createServer: createSocketServer } = sockjs;
const httpServer = createServer();
const socketServer = createSocketServer();

let poolOfClient = [];
let gameList = [];

socketServer.on('connection', connection => {
  poolOfClient = [...poolOfClient, connection];

  connection.on('close', () => {
    poolOfClient = poolOfClient.filter(c => c !== connection)
  });

  connection.on('data', msg => {
    try {
      const parsedData = JSON.parse(msg);
      switch (parsedData.type) {
        case 'startNewGame':
          startNewGame(connection, parsedData.payload);
          break;

        case 'firstStep':
          handleFirstStep(connection, parsedData.payload);
          break;

        case 'step':
          handleStep(connection, parsedData.payload);
          break;

        case 'clearBoard':
          handleClear(parsedData.payload);
          break;

        case 'getBoardState':
          handleGetBoardState(connection, parsedData.payload.gameId);
          break;

        case 'getGameList':
          handleGetGameList(connection);
          break;

        default:
          handleDefault(connection);
      }
    } catch (e) {
      console.log(e)
    }
  })
});

socketServer.installHandlers(httpServer);

httpServer.listen(5000);

function startNewGame(connection, payload) {
  const board = new Board(payload.gameName, payload.gameId);

  gameList.push({
    gameName: payload.gameName,
    gameId: payload.gameId,
    board,
  });

  handleGetBoardState(connection, payload.gameId);
}

function handleDefault(connection) {
  connection.write(JSON.stringify({ type: 'UNKNOWN' }))
}

function handleFirstStep(connection, payload) {
  const { board } = gameList.find(game => game.gameId == payload.gameId);
  const { result } = board?.firstStep(payload);
  const boardStatus = board?.getCurrentGameState();

  if(result) {
    const message = JSON.stringify({ type: 'firstStepIsHappen', payload: boardStatus });
    poolOfClient.forEach(conn => conn.write(message))
  } else {
    const message = JSON.stringify({ type: 'yourFirstStepIsFailed', payload: boardStatus });
    connection.write(message)
  }
}

function handleStep(connection, payload) {
  const { board } = gameList.find(game => game.gameId == payload.gameId);
  const { result } = board?.step(payload);
  const boardStatus = board?.getCurrentGameState();

  if(result) {
    const message = JSON.stringify({ type: 'stepIsHappen', payload: boardStatus });
    poolOfClient.forEach(conn => conn.write(message))
  } else {
    const message = JSON.stringify({ type: 'yourStepIsFailed', payload: boardStatus });
    connection.write(message)
  }
}

function handleClear(payload) {
  const { board } = gameList.find(game => game.gameId == payload.gameId) || {};

  board?.clear();

  const message = JSON.stringify({ type: 'mapIsCleared', payload: board?.getCurrentGameState() });
  poolOfClient.forEach(conn => conn.write(message));
}

function handleGetBoardState(connection, gameId) {
  const { board } = gameList.find(game => game.gameId == gameId) || {};

  connection.write(JSON.stringify({
    type: 'boardState',
    payload: board?.getCurrentGameState(),
  }));
}

function handleGetGameList(connection) {
  const mappedGameList = gameList.map((game) => {
    return { gameName: game.gameName, gameId: game.gameId };
  });

  connection.write(JSON.stringify({
    type: 'gameList',
    payload: { gameList: mappedGameList },
  }));
}
