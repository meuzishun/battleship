import { createGameboard } from './gameboardFactory.js';

const createPlayer = function (data) {
  const name = data.name || data.type;

  const type = data.type;

  const board = createGameboard();

  const attack = function (opponent, position) {
    opponent.board.receiveAttack(position);
  };

  return {
    name,
    type,
    board,
    attack,
  };
};

export { createPlayer };
