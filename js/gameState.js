import { createPlayer } from './factories/playerFactory.js';
import { gameboard_UI } from './UI/gameboard-ui.js';

export const gameState = (function () {
  const players = [];
  let currentPlayer;
  let opponent;

  const addPlayerToGame = function (data) {
    players.push(createPlayer(data));
  };

  const getPlayers = function () {
    return players;
  };

  const getCurrentPlayer = function () {
    return currentPlayer;
  };

  const getOpponent = function () {
    return opponent;
  };

  const clearPlayers = function () {
    players.length = 0;
  };

  const registerShipPlacementData = function (data) {
    getPlayers()[data.playerIndex].board.placeShip(
      data.boardPosition,
      data.shipName,
      data.direction
    );
    // gameboard_UI.addShipToList(data.shipName, data.playerIndex);
  };

  const setFirstTurn = function () {
    [currentPlayer, opponent] = players;
  };

  const switchTurn = function () {
    [opponent, currentPlayer] = [currentPlayer, opponent];
  };

  const resetBoards = function () {
    players.forEach((player) => player.board.resetBoard());
  };

  return {
    addPlayerToGame,
    getPlayers,
    getCurrentPlayer,
    getOpponent,
    clearPlayers,
    registerShipPlacementData,
    setFirstTurn,
    switchTurn,
    resetBoards,
  };
})();
