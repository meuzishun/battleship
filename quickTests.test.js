const Ship = require('./sandbox');

test('created ship has a length property', () => {
  const testShip = Ship(3);
  expect(testShip).toHaveProperty('length');
});

test('created ship has a length property greater than zero', () => {
  const testShip = Ship(3);
  expect(testShip.length).toBeGreaterThan(0);
});

test('created ship with a length of zero throws error', () => {
  expect(() => Ship(0)).toThrow('Ship must have a length');
});

test('created ship with a length less than 2 throws error', () => {
  expect(() => Ship(1)).toThrow('Ship must have a length of at least 2');
});

test('created ship with a length greater than 5 throws error', () => {
  expect(() => Ship(6)).toThrow('Ship must have a length no greater than 5');
});

test('created ship has the correct length', () => {
  const testShip = Ship(3);
  expect(testShip.length).toBe(3);
});

test('created ship has a method named "hit"', () => {
  const testShip = Ship(3);
  expect(testShip).toHaveProperty('hit');
});

test('same number of hits as length makes the ship sunk', () => {
  const testShip = Ship(4);
  expect(testShip.isSunk()).toBe(false);
  testShip.hit(1);
  expect(testShip.isSunk()).toBe(false);
  testShip.hit(3);
  expect(testShip.isSunk()).toBe(false);
  testShip.hit(2);
  expect(testShip.isSunk()).toBe(false);
  testShip.hit(0);
  expect(testShip.isSunk()).toBe(true);
});

test('taking a hit where a ship is already hit throws an error', () => {
  const testShip = Ship(4);
  testShip.hit(2);
  expect(testShip.isSunk()).toBe(false);
  expect(() => testShip.hit(2)).toThrow(
    'the ship is already hit at that location'
  );
});

// test('ship hit method returns expected value', () => {
//   const testShip = Ship(3);
//   const expectedValue = 'hit';
//   expect(testShip.hit()).toBe(expectedValue);
// });
