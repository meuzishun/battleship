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

  const clearPlayers = function () {
    players.length = 0;
  };

  const setFirstTurn = function () {
    [currentPlayer, opponent] = players;
  };

  const switchTurn = function () {
    [opponent, currentPlayer] = [currentPlayer, opponent];
  };

  return {
    addPlayerToGame,
    getPlayers,
    clearPlayers,
    setFirstTurn,
    switchTurn,
  };
})();
