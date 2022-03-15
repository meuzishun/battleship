import { createGameboard } from './gameboardFactory.js';

const createPlayer = function (data) {
  const name = data.name || data.type;

  const type = data.type;

  const attack = function (opponent, position) {
    opponent.board.receiveAttack(position);
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
    // attack(opponent, getRandomCell(findStatuslessCells(opponent.board.cells)));
    return Number(getRandomCell(findStatuslessCells(opponent.board.cells)));
  };

  const board = createGameboard();

  return {
    name,
    type,
    board,
    attack,
    autoAttack,
  };
};

export { createPlayer };
