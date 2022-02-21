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

  const findStatuslessCells = function (cells) {
    return Object.entries(cells)
      .filter((cell) => !cell[1].status)
      .map((cell) => cell[0]);
  };

  const getRandomCell = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const autoAttack = function (opponent) {
    attack(opponent, getRandomCell(findStatuslessCells(opponent.board.cells)));
  };

  const board = createGameboard();

  return {
    name,
    board,
    attack,
    autoAttack,
  };
};

export { createPlayer };
