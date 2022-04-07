import { gameState } from './gameState.js';
import { modal_UI } from './UI/modal-ui.js';
import { gameboard_UI } from './UI/gameboard-ui.js';
import { AI } from './AI.js';
import { shipPlacement } from './shipPlacement.js';

export const gameLoop = (function () {
  const setupGame = function () {
    gameState.getPlayers().forEach((player, index) => {
      if (
        player.type === 'computer' ||
        (player.type === 'person' && player.placeShips === 'auto')
      ) {
        shipPlacement.randomlyPlaceShips(player);
      } else {
        console.log(player);
        console.log('We have to place the ships ourselves?!  But how?!');
        //? Is here where we insert a call to open a UI to place ships on the board?  What would that look like?

        //? Random question: do we need to pass the index of the player to randomlyPlaceShips? Can we just pass the player?
        //* It looks like we can... run through the code all the way to registerShipPlacementData and it appears that we are repeatedly looking up the player based on the index number.  Test to find out if it will work...

        //TODO: have the UI create a gameboard with a header explaining what to do (including a message to hold shift to change the ship to a vertical orientation)

        //TODO: there should be a list of ships that need placing which you can drag onto the board

        //TODO: once they are dragged onto the board, cells to the right or below (depending on orientation) are highlighted with color1 (green means good?) or color2 (red means bad?)

        //TODO: once the mouse is let go, and the ship is in a valid location, the ship name will disappear from the list and the cells will become be color3 (solid gray?).  They will also be placed in that location on the players gameboard data.

        //* Thoughts
        //* 1) We need to have access to the player in question so we can actually place the ships on the actual gameboard (not just the UI) AND check to make sure we are not running into ships that are already placed.

        //* 2) It would be nice to use code we already have in gameboard-ui to create some of these things but let's not force it if they can't be reused... DRY?
      }
      if (gameState.getPlayers().every((player) => player.shipsPlaced)) {
        startGame();
      }
    });
  };

  const startGame = function () {
    gameboard_UI.initializeGameboard();
    gameState.setFirstTurn();
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
    setupGame();
  };

  const registerNewPlayerSubmission = function (data) {
    gameState.addPlayerToGame(data);

    if (gameState.getPlayers().length === 2) {
      setupGame();
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
