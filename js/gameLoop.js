import { gameState } from './gameState.js';
import { modal_UI } from './UI/modal-ui.js';
import { gameboard_UI } from './UI/gameboard-ui.js';
import { AI } from './AI.js';
import { shipPlacement } from './shipPlacement.js';

export const gameLoop = (function () {
  const startGame = function () {
    gameState.setFirstTurn();
    gameboard_UI.initializeGameboard();
    gameState.getPlayers().forEach((player, index) => {
      shipPlacement.randomlyPlaceShips(index);
    });
    setupPlayerTurn();
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

  const setupPlayerTurn = function () {
    if (gameState.getCurrentPlayer().type === 'computer') {
      AI.play();
    }

    if (gameState.getCurrentPlayer().type === 'person') {
      gameboard_UI.addClickListenerToActiveBoardSide();
    }
  };

  const nextTurn = function () {
    gameState.switchTurn();
    gameboard_UI.switchBoardSideRoles();
    setupPlayerTurn();
  };

  const handleSunk = function (occupied) {
    gameboard_UI.markShipAsSunk(occupied);
    gameboard_UI.displayMessage(
      `${gameState.getCurrentPlayer().name} has sunk ${
        gameState.getOpponent().name
      }'s ${occupied.name}!`
    );
  };

  const handleHit = function (position, occupied) {
    if (occupied.isSunk()) {
      handleSunk(occupied);
    }
    if (!occupied.isSunk()) {
      gameboard_UI.markCell(position, 'hit');
      gameboard_UI.displayMessage('HIT!');
    }
  };

  const handleMiss = function (position) {
    gameboard_UI.markCell(position, 'miss');
    gameboard_UI.displayMessage('miss...');
  };

  const processResults = function (results) {
    if (gameState.getCurrentPlayer().type === 'computer') {
      AI.interpretResults(results);
    }

    if (results.status === 'miss') {
      handleMiss(results.position);
    }

    if (results.status === 'hit') {
      handleHit(results.position, results.occupied);
    }

    if (gameState.getOpponent().board.allShipsSunk()) {
      endGame();
    } else {
      nextTurn();
    }
  };

  const processTurn = function (position) {
    if (typeof position !== 'number') {
      throw new Error('processTurn needs a number for an argument');
    }

    gameState.getCurrentPlayer().attack(gameState.getOpponent(), position);

    const results = Object.assign(
      {},
      gameState.getOpponent().board.cells[position],
      { position }
    );

    processResults(results);
  };

  const endGame = function () {
    gameboard_UI.deactivateGameboards();
    gameboard_UI.displayMessage(
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
