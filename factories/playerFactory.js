import { createGameboard } from './gameboardFactory.js';

const createPlayer = function (name) {
  const attack = function (opponent, position) {
    opponent.board.receiveAttack(position);
  };

  const board = createGameboard();

  return {
    name,
    board,
    attack,
  };
};

export { createPlayer };
