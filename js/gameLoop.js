import { createPlayer } from './factories/playerFactory.js';
import { UI } from './UI.js';

export const gameLoop = (function () {
  const players = [];
  let currentPlayer;
  let opponent;

  const addPlayerToGame = function (playerName) {
    players.push(createPlayer(playerName));
  };

  const getPlayers = function () {
    return players;
  };

  const registerNewPlayerSubmission = function (name) {
    addPlayerToGame(name);

    if (players.length === 2) {
      setFirstTurn();
      UI.initializeGameboard();
    } else {
      UI.openAddPlayerModal();
    }
  };

  const setFirstTurn = function () {
    [currentPlayer, opponent] = players;
  };

  const switchTurn = function () {
    [opponent, currentPlayer] = [currentPlayer, opponent];
    UI.switchActiveBoardSide();
  };

  const processTurn = function (cell) {
    const position = Number(cell.dataset.position);
    currentPlayer.attack(opponent, position);
    const { occupied, status } = opponent.board.cells[position];

    if (occupied && occupied.isSunk()) {
      UI.markShipAsSunk(cell.parentElement, occupied);
      UI.displayMessage(
        `${currentPlayer.name} has sunk ${opponent.name}'s ${occupied.name}!`
      );
    } else if (status === 'hit') {
      cell.classList.add('hit');
      UI.displayMessage('HIT!');
    } else if (status === 'miss') {
      cell.classList.add('miss');
      UI.displayMessage('miss...');
    }

    if (opponent.board.allShipsSunk()) {
      endGame();
    } else {
      switchTurn();
    }
  };

  const endGame = function () {
    UI.deactivateGameboards();
    UI.displayMessage(`GAME OVER ${currentPlayer.name} has won`);
  };

  return {
    getPlayers,
    registerNewPlayerSubmission,
    processTurn,
  };
})();
