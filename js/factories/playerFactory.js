import { createGameboard } from './gameboardFactory.js';

const createPlayer = function (data) {
  const name = data.name || data.type;

  const type = data.type;

  const placeShips = data.placeShips;

  const shipsPlaced = false;

  const board = createGameboard();

  const attack = function (opponent, position) {
    opponent.board.receiveAttack(position);
  };

  return {
    name,
    type,
    placeShips,
    shipsPlaced,
    board,
    attack,
  };
};

export { createPlayer };
