import { createPlayer } from './factories/playerFactory.js';

export const gameState = (function () {
  const players = [];
  let currentPlayer;
  let opponent;

  const addPlayerToGame = function (playerName) {
    players.push(createPlayer(playerName));
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
    setFirstTurn,
    switchTurn,
    resetBoards,
  };
})();
