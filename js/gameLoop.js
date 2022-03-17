import { gameState } from './gameState.js';
import { modal_UI } from './UI/modal-ui.js';
import { game_UI } from './UI/gameboard-ui.js';

export const gameLoop = (function () {
  const startGame = function () {
    gameState.setFirstTurn();
    game_UI.initializeGameboard();
    if (gameState.getCurrentPlayer().type === 'computer') {
      autoPlay();
    }
  };

  const newGame = function () {
    gameState.clearPlayers();
    document.body.querySelector('.wrapper').textContent = '';
    modal_UI.openAddPlayerModal();
  };

  const rematch = function () {
    gameState.resetBoards();
    document.body.querySelector('.wrapper').textContent = '';
    startGame();
  };

  const registerNewPlayerSubmission = function (data) {
    gameState.addPlayerToGame(data);

    if (gameState.getPlayers().length === 2) {
      startGame();
    } else {
      modal_UI.openAddPlayerModal();
    }
  };

  const nextTurn = function () {
    //! not helpful here...
    // game_UI.deactivateGameboards();
    gameState.switchTurn();
    game_UI.switchActiveBoardSide();
    if (gameState.getCurrentPlayer().type === 'computer') {
      autoPlay();
    }
  };

  const autoPlay = function () {
    const playTimer = setTimeout(() => {
      const findStatuslessCells = function (cells) {
        return Object.entries(cells)
          .filter((cell) => !cell[1].status)
          .map((cell) => cell[0]);
      };

      const getRandomCell = function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      };

      const position = Number(
        getRandomCell(findStatuslessCells(gameState.getOpponent().board.cells))
      );

      processTurn(position);
      clearTimeout(playTimer);
    }, 500);
  };

  const processTurn = function (position) {
    gameState.getCurrentPlayer().attack(gameState.getOpponent(), position);
    const { occupied, status } = gameState.getOpponent().board.cells[position];

    if (occupied && occupied.isSunk()) {
      game_UI.markShipAsSunk(occupied);
      game_UI.displayMessage(
        `${gameState.getCurrentPlayer().name} has sunk ${
          gameState.getOpponent().name
        }'s ${occupied.name}!`
      );
    } else if (status === 'hit') {
      game_UI.markCell(position, 'hit');
      game_UI.displayMessage('HIT!');
    } else if (status === 'miss') {
      game_UI.markCell(position, 'miss');
      game_UI.displayMessage('miss...');
    }

    if (gameState.getOpponent().board.allShipsSunk()) {
      endGame();
    } else {
      //! not helpful here...
      game_UI.deactivateGameboards();
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
