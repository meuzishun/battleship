import { gameState } from './gameState.js';
import { modal_UI } from './UI/modal-ui.js';
import { game_UI } from './UI/gameboard-ui.js';

export const gameLoop = (function () {
  const startGame = function () {
    gameState.setFirstTurn();
    game_UI.initializeGameboard();
  };

  const newGame = function () {
    gameState.clearPlayers();
    document.body.querySelector('.wrapper').textContent = '';
    modal_UI.openAddPlayerModal();
  };

  const rematch = function () {
    const playerOneName = gameState.getPlayers()[0].name;
    const playerTwoName = gameState.getPlayers()[1].name;
    gameState.clearPlayers();
    gameState.addPlayerToGame(playerOneName);
    gameState.addPlayerToGame(playerTwoName);
    document.body.querySelector('.wrapper').textContent = '';
    startGame();
  };

  const registerNewPlayerSubmission = function (name) {
    gameState.addPlayerToGame(name);

    if (gameState.getPlayers().length === 2) {
      startGame();
    } else {
      modal_UI.openAddPlayerModal();
    }
  };

  const nextTurn = function () {
    gameState.switchTurn();
    game_UI.switchActiveBoardSide();
  };

  const processTurn = function (cell) {
    const position = Number(cell.dataset.position);
    gameState.getCurrentPlayer().attack(gameState.getOpponent(), position);
    const { occupied, status } = gameState.getOpponent().board.cells[position];

    if (occupied && occupied.isSunk()) {
      game_UI.markShipAsSunk(cell.parentElement, occupied);
      game_UI.displayMessage(
        `${gameState.getCurrentPlayer().name} has sunk ${
          gameState.getOpponent().name
        }'s ${occupied.name}!`
      );
    } else if (status === 'hit') {
      cell.classList.add('hit');
      game_UI.displayMessage('HIT!');
    } else if (status === 'miss') {
      cell.classList.add('miss');
      game_UI.displayMessage('miss...');
    }

    if (gameState.getOpponent().board.allShipsSunk()) {
      endGame();
    } else {
      nextTurn();
    }
  };

  const endGame = function () {
    game_UI.deactivateGameboards();
    game_UI.displayMessage(
      `GAME OVER ${gameState.getCurrentPlayer().name} has won`
    );
    modal_UI.openGameOverModal(gameState.getCurrentPlayer());
  };

  return {
    newGame,
    rematch,
    registerNewPlayerSubmission,
    processTurn,
  };
})();
