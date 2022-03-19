import { gameState } from './gameState.js';
import { modal_UI } from './UI/modal-ui.js';
import { game_UI } from './UI/gameboard-ui.js';
import { AI } from './AI.js';

export const gameLoop = (function () {
  const startGame = function () {
    gameState.setFirstTurn();
    game_UI.initializeGameboard();
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
      game_UI.addClickListenerToActiveBoardSide();
    }
  };

  const nextTurn = function () {
    gameState.switchTurn();
    game_UI.switchBoardSideRoles();
    setupPlayerTurn();
  };

  const handleSunk = function (occupied) {
    game_UI.markShipAsSunk(occupied);
    game_UI.displayMessage(
      `${gameState.getCurrentPlayer().name} has sunk ${
        gameState.getOpponent().name
      }'s ${occupied.name}!`
    );
  };

  const handleHit = function (position, occupied) {
    if (occupied.isSunk()) {
      handleSunk(occupied);
      if (gameState.getCurrentPlayer().type === 'computer') {
        AI.acceptResult(position, 'sunk');
      }
    }
    if (!occupied.isSunk()) {
      game_UI.markCell(position, 'hit');
      game_UI.displayMessage('HIT!');
      if (gameState.getCurrentPlayer().type === 'computer') {
        AI.acceptResult(position, 'hit');
      }
    }
  };

  const handleMiss = function (position) {
    game_UI.markCell(position, 'miss');
    game_UI.displayMessage('miss...');
    if (gameState.getCurrentPlayer().type === 'computer') {
      AI.acceptResult(position, 'miss');
    }
  };

  const processResults = function (results) {
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

    console.group('The results:');
    console.log(results);
    console.groupEnd();

    processResults(results);
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
