import { createPlayer } from '../factories/playerFactory.js';

// test construction
test('calling createPlayer returns an object', () => {
  const testPlayer = createPlayer();
  expect(typeof testPlayer).toBe('object');
});

// test properties
test('player to have name property', () => {
  const testPlayer = createPlayer();
  expect(testPlayer).toHaveProperty('name');
});

test('player to have board property', () => {
  const testPlayer = createPlayer();
  expect(testPlayer).toHaveProperty('board');
});

test('player has a property of attack', () => {
  const testPlayer = createPlayer();
  expect(testPlayer).toHaveProperty('attack');
});

// test attack
test('players can attack other player boards and register a miss', () => {
  const testPlayer1 = createPlayer();
  const testPlayer2 = createPlayer();

  testPlayer1.attack(testPlayer2, 21);
  expect(testPlayer2.board.cells[21].status).toBe('miss');
});

test('players can attack other player boards and register a hit', () => {
  const testPlayer1 = createPlayer();
  const testPlayer2 = createPlayer();

  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');

  testPlayer1.attack(testPlayer2, 21);
  expect(testPlayer2.board.cells[21].status).toBe('hit');
});

test("one hit doesn't sink a ship", () => {
  const testPlayer1 = createPlayer();
  const testPlayer2 = createPlayer();

  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');

  testPlayer1.attack(testPlayer2, 21);
  expect(testPlayer2.board.cells[21].occupied.isSunk()).toBe(false);
});

test('all hits sinks ship', () => {
  const testPlayer1 = createPlayer();
  const testPlayer2 = createPlayer();

  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');

  testPlayer1.attack(testPlayer2, 21);
  testPlayer1.attack(testPlayer2, 31);
  expect(testPlayer2.board.cells[31].occupied.isSunk()).toBe(true);
});

test('making sure a bunch of things are true', () => {
  const testPlayer1 = createPlayer('Andrew');
  expect(testPlayer1.name).toBe('Andrew');

  const testPlayer2 = createPlayer('Computer');
  expect(testPlayer2.name).toBe('Computer');

  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');
  expect(testPlayer2.board.cells[21].occupied).toBeTruthy();
  expect(testPlayer2.board.cells[31].occupied).toBeTruthy();

  testPlayer1.attack(testPlayer2, 21);
  expect(testPlayer2.board.cells[21].status).toBe('hit');
  expect(testPlayer2.board.cells[31].occupied.isSunk()).toBe(false);

  testPlayer1.attack(testPlayer2, 31);
  expect(testPlayer2.board.cells[31].status).toBe('hit');
  expect(testPlayer2.board.cells[31].occupied.isSunk()).toBe(true);
});

test('successful player attacks return hit', () => {
  const testPlayer1 = createPlayer('Andrew');
  const testPlayer2 = createPlayer('Computer');
  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');
  expect(testPlayer1.attack(testPlayer2, 21)).toBe('hit');
});

test('ships sunk return sunk', () => {
  const testPlayer1 = createPlayer('Andrew');
  const testPlayer2 = createPlayer('Computer');
  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');
  expect(testPlayer1.attack(testPlayer2, 21)).toBe('hit');
  expect(testPlayer1.attack(testPlayer2, 31)).toBe('sunk');
});

test('attacks return expected values', () => {
  const testPlayer1 = createPlayer('Andrew');
  const testPlayer2 = createPlayer('Computer');
  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');
  expect(testPlayer1.attack(testPlayer2, 11)).toBe('miss');
  expect(testPlayer1.attack(testPlayer2, 21)).toBe('hit');
  expect(testPlayer1.attack(testPlayer2, 31)).toBe('sunk');
});
