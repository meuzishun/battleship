import { createPlayer } from './factories/playerFactory.js';
import { UI } from './UI.js';

//TODO: IIFEs can prevent leaking methods...
const gamestate = {
  players: [],
  currentPlayer: undefined,
  opponent: undefined,

  addPlayerToGame: function (player, UI_board_side) {
    this.players.push({ player, UI_board_side });
  },

  setFirstTurn: function () {
    [this.currentPlayer, this.opponent] = this.players;
    this.opponent.UI_board_side.gameboard.addEventListener(
      'click',
      UI.handleBoardClick
    );
  },

  handleAddPlayerSubmission: function (e) {
    e.preventDefault();
    // get player info
  },

  switchTurn: function () {
    this.opponent.UI_board_side.gameboard.removeEventListener(
      'click',
      UI.handleBoardClick
    );

    [this.opponent, this.currentPlayer] = [this.currentPlayer, this.opponent];

    this.opponent.UI_board_side.gameboard.addEventListener(
      'click',
      UI.handleBoardClick
    );
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

  processTurn: function (cell) {
    const position = Number(cell.dataset.position);
    this.currentPlayer.player.attack(this.opponent.player, position);
    const { occupied, status } = this.opponent.player.board.cells[position];

    if (occupied && occupied.isSunk()) {
      this.markShipSunk(cell.parentElement, occupied);
      UI.displayMessage(
        `${this.currentPlayer.player.name} has sunk ${this.opponent.player.name}'s ${occupied.name}!`
      );
    } else if (status === 'hit') {
      cell.classList.add('hit');
      UI.displayMessage('Hit!');
    } else if (status === 'miss') {
      cell.classList.add('miss');
      UI.displayMessage('Miss...');
    }

    //TODO: check to see if all ships are sunk...

    this.switchTurn();
  },

  temporaryPlaceShipsFunction: function () {
    this.players[0].player.board.placeShip(21, 'Carrier', 'vertical');
    this.players[1].player.board.placeShip(30, 'Carrier', 'vertical');
    this.players[0].player.board.placeShip(53, 'Battleship', 'horizontal');
    this.players[1].player.board.placeShip(23, 'Battleship', 'horizontal');
    this.players[0].player.board.placeShip(3, 'Destroyer', 'horizontal');
    this.players[1].player.board.placeShip(3, 'Destroyer', 'horizontal');
    this.players[0].player.board.placeShip(75, 'Submarine', 'horizontal');
    this.players[1].player.board.placeShip(84, 'Submarine', 'horizontal');
    this.players[0].player.board.placeShip(39, 'Patrol Boat', 'vertical');
    this.players[1].player.board.placeShip(78, 'Patrol Boat', 'vertical');

    this.players.forEach((player, index) => {
      player.player.board.ships.forEach((ship) => {
        UI.addShipToList(ship, UI.gameboardSides[index].shipList);
      });
    });
  },

  init: function () {
    //TODO: We should use a modal here to setup the players...
    this.addPlayerToGame(createPlayer('Player 1'), UI.gameboardSides[0]);
    this.addPlayerToGame(createPlayer('Player 2'), UI.gameboardSides[1]);
    this.temporaryPlaceShipsFunction();
    this.setFirstTurn();
  },
};

export { gamestate };
