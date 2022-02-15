import { createGameboard } from '../factories/gameboardFactory.js';

// it is an object
test('createGameboard returns an object', () => {
  expect(typeof createGameboard()).toBe('object');
});

// has correct props
test('gameboard has a "cells" property', () => {
  const gameboard = createGameboard();
  expect(gameboard).toHaveProperty('cells');
});

test('gameboard has a "placeShip" property', () => {
  const gameboard = createGameboard();
  expect(gameboard).toHaveProperty('placeShip');
});

test('gameboard has a "receiveAttack" property', () => {
  const gameboard = createGameboard();
  expect(gameboard).toHaveProperty('receiveAttack');
});

test('gameboard has a "allShipsSunk" property', () => {
  const gameboard = createGameboard();
  expect(gameboard).toHaveProperty('allShipsSunk');
});

// has correct number of cells
test('default gameboard has 100 cells', () => {
  const gameboard = createGameboard();
  const { cells } = gameboard;
  expect(Object.entries(cells).length).toBe(100);
});

test('creating a gameboard with a width of 5 and a height of 8 has 40 cells', () => {
  const gameboard = createGameboard(5, 8);
  const { cells } = gameboard;
  expect(Object.entries(cells).length).toBe(40);
});

// placing ships
test('placing a horizontal destroyer at 13 results with cells 13, 14, and 15 occupied', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(13, 'Destroyer', 'horizontal');
  expect(gameboard.cells[13].occupied).toBeTruthy();
  expect(gameboard.cells[14].occupied).toBeTruthy();
  expect(gameboard.cells[15].occupied).toBeTruthy();
});

test('placing a vertical carrier at 25 results with cells 25, 35, 45, 55 and 65 occupied', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(25, 'Carrier', 'vertical');
  expect(gameboard.cells[25].occupied).toBeTruthy();
  expect(gameboard.cells[35].occupied).toBeTruthy();
  expect(gameboard.cells[45].occupied).toBeTruthy();
  expect(gameboard.cells[55].occupied).toBeTruthy();
  expect(gameboard.cells[65].occupied).toBeTruthy();
});

test('placed ship takes a hit registers a hit at ships location', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(13, 'Destroyer', 'horizontal');
  gameboard.receiveAttack(14);
  expect(gameboard.cells[14].status).toBe('hit');
});
