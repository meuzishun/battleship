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

      switchTurn();
    },

    //*
    temporaryPlaceShipsFunction: function () {
      players[0].board.placeShip(21, 'Carrier', 'vertical');
      players[1].board.placeShip(30, 'Carrier', 'vertical');
      players[0].board.placeShip(53, 'Battleship', 'horizontal');
      players[1].board.placeShip(23, 'Battleship', 'horizontal');
      players[0].board.placeShip(3, 'Destroyer', 'horizontal');
      players[1].board.placeShip(3, 'Destroyer', 'horizontal');
      players[0].board.placeShip(75, 'Submarine', 'horizontal');
      players[1].board.placeShip(84, 'Submarine', 'horizontal');
      players[0].board.placeShip(39, 'Patrol Boat', 'vertical');
      players[1].board.placeShip(78, 'Patrol Boat', 'vertical');

      players.forEach((player, index) => {
        player.board.ships.forEach((ship) => {
          UI.addShipToList(ship, UI.gameboardSides[index].shipList);
        });
      });
    },

    //*
    init: function () {
      //TODO: We should use a modal here to setup the players...

      this.temporaryPlaceShipsFunction();
      setFirstTurn();
    },
  };
})();

export { gameLoop };
