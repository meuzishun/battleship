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

test('placing a horizontal destroyer at 13 results with cells 13, 14, and 15 occupied with the name "Destroyer"', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(13, 'Destroyer', 'horizontal');
  expect(gameboard.cells[13].occupied.name).toBe('Destroyer');
  expect(gameboard.cells[14].occupied.name).toBe('Destroyer');
  expect(gameboard.cells[15].occupied.name).toBe('Destroyer');
});

test('placing a vertical carrier at 25 results with cells 25, 35, 45, 55 and 65 occupied with the name "Carrier"', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(25, 'Carrier', 'vertical');
  expect(gameboard.cells[25].occupied.name).toBe('Carrier');
  expect(gameboard.cells[35].occupied.name).toBe('Carrier');
  expect(gameboard.cells[45].occupied.name).toBe('Carrier');
  expect(gameboard.cells[55].occupied.name).toBe('Carrier');
  expect(gameboard.cells[65].occupied.name).toBe('Carrier');
});

// testing attacks
test('placed ship takes a hit registers a hit at ships location', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(13, 'Destroyer', 'horizontal');
  gameboard.receiveAttack(14);
  expect(gameboard.cells[14].status).toBe('hit');
});

test('ship can take a single hit and verify it is not sunk via board', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(13, 'Destroyer', 'horizontal');
  gameboard.receiveAttack(14);
  expect(gameboard.cells[14].status).toBe('hit');
  expect(gameboard.cells[14].occupied.isSunk()).toBe(false);
});

test('when ship takes all hits isSunk is verified from the board', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(13, 'Destroyer', 'horizontal');
  gameboard.receiveAttack(13);
  expect(gameboard.cells[13].status).toBe('hit');
  expect(gameboard.cells[13].occupied.isSunk()).toBe(false);
  gameboard.receiveAttack(14);
  expect(gameboard.cells[14].status).toBe('hit');
  expect(gameboard.cells[14].occupied.isSunk()).toBe(false);
  gameboard.receiveAttack(15);
  expect(gameboard.cells[15].status).toBe('hit');
  expect(gameboard.cells[15].occupied.isSunk()).toBe(true);
});

test('when all ships are sunk, allShipsSunk returns true', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(13, 'Destroyer', 'horizontal');
  gameboard.placeShip(45, 'Patrol Boat', 'vertical');

  gameboard.receiveAttack(13);
  expect(gameboard.cells[13].status).toBe('hit');
  expect(gameboard.cells[13].occupied.isSunk()).toBe(false);
  expect(gameboard.allShipsSunk()).toBe(false);

  gameboard.receiveAttack(14);
  expect(gameboard.cells[14].status).toBe('hit');
  expect(gameboard.cells[14].occupied.isSunk()).toBe(false);
  expect(gameboard.allShipsSunk()).toBe(false);

  gameboard.receiveAttack(15);
  expect(gameboard.cells[15].status).toBe('hit');
  expect(gameboard.cells[15].occupied.isSunk()).toBe(true);
  expect(gameboard.allShipsSunk()).toBe(false);

  gameboard.receiveAttack(45);
  expect(gameboard.cells[45].status).toBe('hit');
  expect(gameboard.cells[45].occupied.isSunk()).toBe(false);
  expect(gameboard.allShipsSunk()).toBe(false);

  gameboard.receiveAttack(55);
  expect(gameboard.cells[55].status).toBe('hit');
  expect(gameboard.cells[55].occupied.isSunk()).toBe(true);
  expect(gameboard.allShipsSunk()).toBe(true);
});
