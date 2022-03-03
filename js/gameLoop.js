import { createPlayer } from './factories/playerFactory.js';
import { UI } from './UI.js';

const gameLoop = (function () {
  const players = [];
  let currentPlayer;
  let opponent;

  const setFirstTurn = function () {
    [currentPlayer, opponent] = players;
  };

  const switchTurn = function () {
    [opponent, currentPlayer] = [currentPlayer, opponent];
    UI.switchActiveBoardSide();
  };

  const endGame = function () {
    UI.deactivateGameboard();
  };

  return {
    //*
    addPlayerToGame: function (playerName) {
      players.push(createPlayer(playerName));
    },

    handleAddPlayerSubmission: function (e) {
      e.preventDefault();
      // get player info
    },

    //*
    processTurn: function (cell) {
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
        UI.displayMessage('Hit!');
      } else if (status === 'miss') {
        cell.classList.add('miss');
        UI.displayMessage('Miss...');
      }

      //TODO: check to see if all ships are sunk...
      if (opponent.board.allShipsSunk()) {
        UI.displayMessage(`GAME OVER ${currentPlayer.name} has won`);
        endGame();
      } else {
        switchTurn();
      }
    },

    //*
    temporaryPlaceShipFunction: function (
      shipName,
      playerIndex,
      boardPosition,
      direction
    ) {
      players[playerIndex].board.placeShip(boardPosition, shipName, direction);
      UI.addShipToList(shipName, UI.gameboardSides[playerIndex].shipList);
    },

    //*
    init: function () {
      //TODO: We should use a modal here to setup the players...

      // this.temporaryPlaceShipsFunction();
      setFirstTurn();
    },
  };
})();

export { gameLoop };
