import { UI } from '../UI.js';
import { createPlayer } from './playerFactory.js';

const createGame = function () {
  const players = [];
  let currentPlayer = undefined;
  let opponent = undefined;

  const addPlayerToGame = function (player, UI_board) {
    players.push({ player, UI_board });
  };

  const setFirstTurn = function () {
    [currentPlayer, opponent] = players;
    opponent.UI_board.addEventListener('click', handleBoardClick);
  };

  const switchTurn = function () {
    opponent.UI_board.removeEventListener('click', handleBoardClick);
    [opponent, currentPlayer] = [currentPlayer, opponent];
    opponent.UI_board.addEventListener('click', handleBoardClick);
  };

  //* obtain info from an element
  const getClickInfo = function (elem) {
    return {
      board: elem.parentElement,
      cell: elem,
      position: Number(elem.dataset.position),
    };
  };

  //* callback for board clicks
  const handleBoardClick = function (e) {
    if (!e.target.classList.contains('cell')) {
      return;
    }

    const { cell, position } = getClickInfo(e.target);

    currentPlayer.player.attack(opponent.player, position);
    UI.updateCellStatus(cell, opponent.player.board.cells[position].status);

    if (
      opponent.player.board.cells[position].status === 'hit' &&
      opponent.player.board.cells[position].occupied.isSunk()
    ) {
      UI.displayMessage(
        `You sunk my ${opponent.player.board.cells[position].occupied.name}`
      );
    } else {
      UI.displayMessage(opponent.player.board.cells[position].status);
    }

    switchTurn();
  };

  UI.init();

  //TODO: We should use a modal here to setup the players...
  addPlayerToGame(createPlayer('Andrew'), UI.gameboards[0]);
  addPlayerToGame(createPlayer('Computer'), UI.gameboards[1]);

  const temporaryPlaceShipsFunction = function () {
    players[0].player.board.placeShip(21, 'Carrier', 'vertical');
    players[1].player.board.placeShip(30, 'Carrier', 'vertical');
  };

  temporaryPlaceShipsFunction();
  setFirstTurn();

  return {
    players,
    addPlayerToGame,
    currentPlayer,
    opponent,
    setFirstTurn,
    switchTurn,
  };
};

export { createGame };
