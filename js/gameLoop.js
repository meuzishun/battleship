import { createPlayer } from './factories/playerFactory.js';
import { UI } from './UI.js';

//TODO: IIFEs can prevent leaking methods...
const gameLoop = (function () {
  const players = [];
  let currentPlayer;
  let opponent;

  const setFirstTurn = function () {
    [currentPlayer, opponent] = players;
    opponent.UI_board_side.gameboard.addEventListener(
      'click',
      UI.handleBoardClick
    );
  };

  const switchTurn = function () {
    opponent.UI_board_side.gameboard.removeEventListener(
      'click',
      UI.handleBoardClick
    );

    [opponent, currentPlayer] = [currentPlayer, opponent];

    opponent.UI_board_side.gameboard.addEventListener(
      'click',
      UI.handleBoardClick
    );
  };

  return {
    //*
    addPlayerToGame: function (player, UI_board_side) {
      players.push({ player, UI_board_side });
    },

    handleAddPlayerSubmission: function (e) {
      e.preventDefault();
      // get player info
    },

    //TODO: this seems like a UI method...
    markShipSunk: function (board, ship) {
      ship.positions.forEach((position) => {
        const cell = board.querySelector(`[data-position='${position}']`);
        cell.classList.remove('hit');
        cell.classList.add('sunk');
      });
      board.parentElement
        .querySelector('.ship-list')
        .querySelector(`[data-name='${ship.name}']`)
        .classList.add('crossout');
    },

    //*
    processTurn: function (cell) {
      const position = Number(cell.dataset.position);
      currentPlayer.player.attack(opponent.player, position);
      const { occupied, status } = opponent.player.board.cells[position];

      if (occupied && occupied.isSunk()) {
        //TODO: this seems like a UI method...
        this.markShipSunk(cell.parentElement, occupied);
        UI.displayMessage(
          `${currentPlayer.player.name} has sunk ${opponent.player.name}'s ${occupied.name}!`
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
      players[0].player.board.placeShip(21, 'Carrier', 'vertical');
      players[1].player.board.placeShip(30, 'Carrier', 'vertical');
      players[0].player.board.placeShip(53, 'Battleship', 'horizontal');
      players[1].player.board.placeShip(23, 'Battleship', 'horizontal');
      players[0].player.board.placeShip(3, 'Destroyer', 'horizontal');
      players[1].player.board.placeShip(3, 'Destroyer', 'horizontal');
      players[0].player.board.placeShip(75, 'Submarine', 'horizontal');
      players[1].player.board.placeShip(84, 'Submarine', 'horizontal');
      players[0].player.board.placeShip(39, 'Patrol Boat', 'vertical');
      players[1].player.board.placeShip(78, 'Patrol Boat', 'vertical');

      players.forEach((player, index) => {
        player.player.board.ships.forEach((ship) => {
          UI.addShipToList(ship, UI.gameboardSides[index].shipList);
        });
      });
    },

    //*
    init: function () {
      //TODO: We should use a modal here to setup the players...
      this.addPlayerToGame(createPlayer('Player 1'), UI.gameboardSides[0]);
      this.addPlayerToGame(createPlayer('Player 2'), UI.gameboardSides[1]);
      this.temporaryPlaceShipsFunction();
      setFirstTurn();
    },
  };
})();

export { gameLoop };
