import { createGameboard } from './gameboardFactory.js';

const createPlayer = function (name) {
  const attack = function (opponent, position) {
    opponent.board.receiveAttack(position);
    if (opponent.board.cells[position].status === 'miss') {
      return 'miss';
    }
    if (opponent.board.cells[position].occupied.isSunk()) {
      return 'sunk';
    }
    if (opponent.board.cells[position].status === 'hit') {
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
