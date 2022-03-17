import { createPlayer } from '../js/factories/playerFactory.js';
const data = { type: 'computer' };
// test construction
test('calling createPlayer returns an object', () => {
  const testPlayer = createPlayer(data);
  expect(typeof testPlayer).toBe('object');
});

// test properties
test('player to have name property', () => {
  const testPlayer = createPlayer(data);
  expect(testPlayer).toHaveProperty('name');
});

test.skip('player to have turn property', () => {
  const testPlayer = createPlayer();
  expect(testPlayer).toHaveProperty('turn');
});

test.skip('player to have startTurn property', () => {
  const testPlayer = createPlayer();
  expect(testPlayer).toHaveProperty('startTurn');
});

test.skip('player to have endTurn property', () => {
  const testPlayer = createPlayer();
  expect(testPlayer).toHaveProperty('endTurn');
});

test('player to have board property', () => {
  const testPlayer = createPlayer(data);
  expect(testPlayer).toHaveProperty('board');
});

test.skip('player to have resetGameboard property', () => {
  const testPlayer = createPlayer();
  expect(testPlayer).toHaveProperty('resetGameboard');
});

test('player has a property of attack', () => {
  const testPlayer = createPlayer(data);
  expect(testPlayer).toHaveProperty('attack');
});

// test attack
test('players can attack other player boards and register a miss', () => {
  const testPlayer1 = createPlayer(data);
  const testPlayer2 = createPlayer(data);

  // testPlayer1.startTurn();
  testPlayer1.attack(testPlayer2, 21);
  expect(testPlayer2.board.cells[21].status).toBe('miss');
});

test('players can attack other player boards and register a hit', () => {
  const testPlayer1 = createPlayer(data);
  const testPlayer2 = createPlayer(data);

  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');

  // testPlayer1.startTurn();
  testPlayer1.attack(testPlayer2, 21);
  expect(testPlayer2.board.cells[21].status).toBe('hit');
});

test("one hit doesn't sink a ship", () => {
  const testPlayer1 = createPlayer(data);
  const testPlayer2 = createPlayer(data);

  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');

  // testPlayer1.startTurn();
  testPlayer1.attack(testPlayer2, 21);
  expect(testPlayer2.board.cells[21].occupied.isSunk()).toBe(false);
});

test('all hits sinks ship', () => {
  const testPlayer1 = createPlayer(data);
  const testPlayer2 = createPlayer(data);

  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');

  // testPlayer1.startTurn();
  testPlayer1.attack(testPlayer2, 21);
  testPlayer2.autoAttack(testPlayer1);
  testPlayer1.attack(testPlayer2, 31);
  expect(testPlayer2.board.cells[31].occupied.isSunk()).toBe(true);
});

test('making sure a bunch of things are true', () => {
  const testPlayer1 = createPlayer({ type: 'person', name: 'Andrew' });
  expect(testPlayer1.name).toBe('Andrew');

  const testPlayer2 = createPlayer({ type: 'computer' });
  expect(testPlayer2.name).toBe('computer');

  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');
  expect(testPlayer2.board.cells[21].occupied).toBeTruthy();
  expect(testPlayer2.board.cells[31].occupied).toBeTruthy();

  // testPlayer1.startTurn();
  testPlayer1.attack(testPlayer2, 21);
  expect(testPlayer2.board.cells[21].status).toBe('hit');
  expect(testPlayer2.board.cells[31].occupied.isSunk()).toBe(false);

  testPlayer2.autoAttack(testPlayer1);

  testPlayer1.attack(testPlayer2, 31);
  expect(testPlayer2.board.cells[31].status).toBe('hit');
  expect(testPlayer2.board.cells[31].occupied.isSunk()).toBe(true);
});

test('successful player attacks return hit', () => {
  const testPlayer1 = createPlayer('Andrew');
  const testPlayer2 = createPlayer('Computer');
  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');
  // testPlayer1.startTurn();
  testPlayer1.attack(testPlayer2, 21);
  expect(testPlayer2.board.cells[21].status).toBe('hit');
});

test('ships sunk return sunk', () => {
  const testPlayer1 = createPlayer('Andrew');
  const testPlayer2 = createPlayer('Computer');
  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');
  // testPlayer1.startTurn();
  testPlayer1.attack(testPlayer2, 21);
  expect(testPlayer2.board.cells[21].status).toBe('hit');
  testPlayer2.autoAttack(testPlayer1);
  testPlayer1.attack(testPlayer2, 31);
  expect(testPlayer2.board.cells[31].occupied.isSunk()).toBe(true);
});

test.skip('gameboard can be reset', () => {
  const testPlayer1 = createPlayer('Andrew');
  const testPlayer2 = createPlayer('Computer');

  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');
  testPlayer1.attack(testPlayer2, 21);
  expect(testPlayer2.board.cells[21].status).toBe('hit');

  testPlayer2.autoAttack(testPlayer1);
  testPlayer1.attack(testPlayer2, 31);
  expect(testPlayer2.board.cells[31].occupied.isSunk()).toBe(true);

  console.log(testPlayer2.board);
  testPlayer2.resetGameboard();
  console.log(testPlayer2.board);
  expect(testPlayer2.board.cells[21].occupied).toBeNull();
  expect(testPlayer2.board.cells[21].status).toBeUndefined();
  expect(testPlayer2.board.cells[31].occupied).toBeNull();
  expect(testPlayer2.board.cells[31].status).toBeUndefined();
});

test.skip('attacks return expected values', () => {
  const testPlayer1 = createPlayer('Andrew');
  const testPlayer2 = createPlayer('Computer');
  testPlayer2.board.placeShip(21, 'Patrol Boat', 'vertical');
  // testPlayer1.startTurn();
  expect(testPlayer1.attack(testPlayer2, 11)).toBe('miss');
  testPlayer2.autoAttack(testPlayer1);
  expect(testPlayer1.attack(testPlayer2, 21)).toBe('hit');
  testPlayer2.autoAttack(testPlayer1);
  expect(testPlayer1.attack(testPlayer2, 31)).toBe('sunk');
});

test.skip('players have an autoAttack property', () => {
  const testPlayer1 = createPlayer('Andrew');
  expect(testPlayer1).toHaveProperty('autoAttack');
});

test.skip('autoAttack is forced to choose cell[99] because all other cells have a status', () => {
  const testPlayer1 = createPlayer('Andrew');
  const testPlayer2 = createPlayer('Computer');

  // testPlayer1.startTurn();
  for (let i = 0; i < 99; i++) {
    testPlayer1.autoAttack(testPlayer2);
    testPlayer2.attack(testPlayer1, i);
  }
  testPlayer1.autoAttack(testPlayer2);
  testPlayer2.autoAttack(testPlayer1);

  expect(testPlayer1.board.cells[99].status).toBe('miss');
});

test.skip('autoAttack is forced to choose remaining cells when all others have status', () => {
  const testPlayer1 = createPlayer('Andrew');
  const testPlayer2 = createPlayer('Computer');

  for (let i = 0; i < 100; i++) {
    // testPlayer2.startTurn();
    if (i === 34 || i === 44) {
      continue;
    }
    testPlayer2.attack(testPlayer1, i);
  }

  expect(testPlayer1.board.cells[34].status).toBeUndefined();
  expect(testPlayer1.board.cells[44].status).toBeUndefined();

  testPlayer1.autoAttack(testPlayer2);
  testPlayer2.autoAttack(testPlayer1);
  testPlayer1.autoAttack(testPlayer2);
  testPlayer2.autoAttack(testPlayer1);
  expect(testPlayer1.board.cells[34].status).toBe('miss');
  expect(testPlayer1.board.cells[44].status).toBe('miss');
});
