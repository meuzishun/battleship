import { createGameboard } from './gameboardFactory.js';

const createPlayer = function (name) {
  // let turn = false;

  //! it looks like the game module will take care of turns.  These functions may not be needed
  // const startTurn = function () {
  //   if (turn === false) {
  //     turn = true;
  //   }
  // };

  // const endTurn = function () {
  //   if (turn === true) {
  //     turn = false;
  //   }
  // };

  const attack = function (opponent, position) {
    opponent.board.receiveAttack(position);
    // if (turn) {
    // opponent.board.receiveAttack(position);
    // endTurn();
    // opponent.startTurn();
    // }
    //! we may not need to return any value here
    // if (opponent.board.cells[position].status === 'miss') {
    //   return 'miss';
    // }
    // if (opponent.board.cells[position].occupied.isSunk()) {
    //   return 'sunk';
    // }
    // if (opponent.board.cells[position].status === 'hit') {
    //   return 'hit';
    // }
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
    // turn,
    // startTurn,
    // endTurn,
    board,
    attack,
    autoAttack,
  };
};

export { createPlayer };
