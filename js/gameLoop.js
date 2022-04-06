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
      console.log(player);
      if (
        player.type === 'computer' ||
        (player.type === 'person' && player.placeShips === 'auto')
      ) {
        shipPlacement.randomlyPlaceShips(index);
      } else {
        console.log('We have to place the ships ourselves?!  But how?!');
        console.log(index);
      }
    });
    startPlayerTurn();
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

  const startPlayerTurn = function () {
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
    startPlayerTurn();
  };

  const handleSunk = function (occupied) {
    gameboard_UI.markShipAsSunk(occupied);
    gameboard_UI.displayMessage(
      `${gameState.getCurrentPlayer().name} has sunk ${
        gameState.getOpponent().name
      }'s ${occupied.name}!`,
      1500
    );
  };

  const handleHit = function (position, occupied) {
    if (occupied.isSunk()) {
      handleSunk(occupied);
    }
    if (!occupied.isSunk()) {
      gameboard_UI.markCell(position, 'hit');
      gameboard_UI.displayMessage('HIT!', 1500);
    }
  };

  const handleMiss = function (position) {
    gameboard_UI.markCell(position, 'miss');
    gameboard_UI.displayMessage('miss...', 1500);
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
      `GAME OVER ${gameState.getCurrentPlayer().name} has won`,
      1500
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
