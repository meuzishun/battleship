import { createGameboard } from './gameboardFactory.js';

const createPlayer = function (name) {
  const attack = function (board, position) {
    board.receiveAttack(position);
    if (board.cells[position].status === 'miss') {
      return 'miss';
    }
    if (board.cells[position].occupied.isSunk()) {
      return 'sunk';
    }
    if (board.cells[position].status === 'hit') {
      return 'hit';
    }
  };

  const board = createGameboard();

  return {
    name,
    board,
    attack,
  };
};

export { createPlayer };
