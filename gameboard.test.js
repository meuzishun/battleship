// TODO: should be able to place ships at specific coordinates by calling the ship factory
// TODO: should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot
// TODO: should keep track of missed attacks so they can display them properly
// TODO: should be able to report whether or not all of their ships have been sunk

const Gameboard = require('./gameboard');

test('Gameboard creates a gameboard with the correct size input', () => {
  const size = 6;
  const testGameboard = Gameboard(size);
  expect(testGameboard.board.length).toBe(size);
});

test('Gameboard creates a gameboard with the same number of rows as columns', () => {
  const size = 6;
  const testGameboard = Gameboard(size);
  expect(testGameboard.board.length).toBe(size);
  for (let i = 0; i < testGameboard.board.length; i++) {
    expect(testGameboard.board[i].length).toBe(size);
  }
});

test('Gameboard creates a gameboard with each cell being an object', () => {
  const testGameboard = Gameboard(6);
  for (let i = 0; i < testGameboard.board.length; i++) {
    for (let j = 0; j < testGameboard.board[i].length; j++) {
      expect(typeof testGameboard.board[i][j]).toBe('object');
    }
  }
});

test('Gameboard has a function called "placeShip"', () => {
  const testGameboard = Gameboard(6);
  expect(testGameboard).toHaveProperty('placeShip');
});
