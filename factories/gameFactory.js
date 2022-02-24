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

  const handleAddPlayerSubmission = function (e) {
    e.preventDefault();
    // get player info
  };

  const switchTurn = function () {
    opponent.UI_board.removeEventListener('click', handleBoardClick);
    [opponent, currentPlayer] = [currentPlayer, opponent];
    opponent.UI_board.addEventListener('click', handleBoardClick);
  };

  //* obtain info from an element
  const getClickInfo = function (elem) {
    return {
      UI_board: elem.parentElement,
      UI_cell: elem,
      position: Number(elem.dataset.position),
    };
  };

  //* callback for board clicks
  const handleBoardClick = function (e) {
    if (!e.target.classList.contains('cell')) {
      return;
    }

    const { UI_board, UI_cell, position } = getClickInfo(e.target);

    if (opponent.player.board.cells[position].status) {
      return;
    }

    currentPlayer.player.attack(opponent.player, position);
    const { occupied, status } = opponent.player.board.cells[position];
    UI.updateCellStatus(UI_cell, status);

    if (status === 'hit' && occupied.isSunk()) {
      occupied.positions.forEach((position) => {
        const cell = UI_board.querySelector(`[data-position='${position}']`);
        cell.classList.remove('hit');
        cell.classList.add('sunk');
      });

      if (opponent.player.board.allShipsSunk()) {
        UI.displayMessage(
          `All ${opponent.player.name}'s ships are sunk.  ${currentPlayer.player.name} has won the game.`
        );

        UI.gameboards.forEach((board) => {
          board.removeEventListener('click', handleBoardClick);
        });

        return;
      }

      UI.displayMessage(
        `${currentPlayer.player.name} sunk ${opponent.player.name}'s ${occupied.name}`
      );
    } else {
      UI.displayMessage(status);
      switchTurn();
    }
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
};

export { createGame };
