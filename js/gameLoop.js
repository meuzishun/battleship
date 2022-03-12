import { createPlayer } from './factories/playerFactory.js';
import { modal_UI } from './UI/modal-ui.js';
import { game_UI } from './UI/game-ui.js';

export const gameLoop = (function () {
  const players = [];
  let currentPlayer;
  let opponent;

  const startGame = function () {
    modal_UI.openAddPlayerModal();
  };

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
      game_UI.initializeGameboard();
    } else {
      modal_UI.openAddPlayerModal();
    }
  };

  const setFirstTurn = function () {
    [currentPlayer, opponent] = players;
  };

  const switchTurn = function () {
    [opponent, currentPlayer] = [currentPlayer, opponent];
    game_UI.switchActiveBoardSide();
  };

  const processTurn = function (cell) {
    const position = Number(cell.dataset.position);
    currentPlayer.attack(opponent, position);
    const { occupied, status } = opponent.board.cells[position];

    if (occupied && occupied.isSunk()) {
      game_UI.markShipAsSunk(cell.parentElement, occupied);
      game_UI.displayMessage(
        `${currentPlayer.name} has sunk ${opponent.name}'s ${occupied.name}!`
      );
    } else if (status === 'hit') {
      cell.classList.add('hit');
      game_UI.displayMessage('HIT!');
    } else if (status === 'miss') {
      cell.classList.add('miss');
      game_UI.displayMessage('miss...');
    }

    if (opponent.board.allShipsSunk()) {
      endGame();
    } else {
      switchTurn();
    }
  };

  const endGame = function () {
    game_UI.deactivateGameboards();
    game_UI.displayMessage(`GAME OVER ${currentPlayer.name} has won`);
  };

  return {
    startGame,
    getPlayers,
    registerNewPlayerSubmission,
    processTurn,
  };
})();
