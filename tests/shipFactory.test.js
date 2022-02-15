import { createShip } from '../factories/shipFactory.js';

// testing for type
test('createShip returns an object', () => {
  expect(typeof createShip('Destroyer')).toEqual('object');
});

test('createShip does NOT return a number', () => {
  expect(typeof createShip('Destroyer')).not.toEqual('number');
});

test('createShip does NOT return a string', () => {
  expect(typeof createShip('Destroyer')).not.toEqual('string');
});

test('createShip with invalid name arg throws an error', () => {
  expect(() => createShip('someDumbShipName')).toThrow();
});

test('createShip with invalid name arg throws error "That is not a valid ship name"', () => {
  expect(() => createShip('someDumbShipName')).toThrow(
    'That is not a valid ship name'
  );
});

// testing for properties
test('createShip "Carrier" returns an object with a name prop', () => {
  const testShip = createShip('Carrier');
  expect(testShip).toHaveProperty('name');
});

test('creating a ship "Destroyer" returns an object with a length property', () => {
  const testShip = createShip('Destroyer');
  expect(testShip).toHaveProperty('length');
});

test('creating a ship "Destroyer" returns an object with a positions property', () => {
  const testShip = createShip('Destroyer');
  expect(testShip).toHaveProperty('positions');
});

test('creating a ship "Destroyer" returns an object with a hit property', () => {
  const testShip = createShip('Destroyer');
  expect(testShip).toHaveProperty('hit');
});

test('creating a ship "Destroyer" returns an object with a isSunk property', () => {
  const testShip = createShip('Destroyer');
  expect(testShip).toHaveProperty('isSunk');
});

// testing prop values
test('createShip "Carrier" returns an object with a name prop of "Carrier"', () => {
  const testShip = createShip('Carrier');
  expect(testShip.name).toBe('Carrier');
});

test('createShip "Patrol Boat" returns an object with a name prop of "Patrol Boat"', () => {
  const testShip = createShip('Patrol Boat');
  expect(testShip.name).toBe('Patrol Boat');
});

test('creating a ship "Destroyer" has a length of 3', () => {
  const testShip = createShip('Destroyer');
  expect(testShip.length).toBe(3);
});

test('creating a ship "Carrier" has a length of 5', () => {
  const testShip = createShip('Carrier');
  expect(testShip.length).toBe(5);
});

test('adding positions to ship updates the positions property', () => {
  const testShip = createShip('Patrol Boat');
  testShip.positions.push(13);
  expect(testShip.positions).toContain(13);
});

// testing ship functions
test('ship with one hit is not sunk', () => {
  const testShip = createShip('Patrol Boat');
  testShip.positions.push(13);
  testShip.positions.push(14);
  testShip.hit(13);
  expect(testShip.isSunk()).toBe(false);
});

test('ship with all positions hit is sunk', () => {
  const testShip = createShip('Patrol Boat');
  testShip.positions.push(13);
  testShip.positions.push(14);
  testShip.hit(13);
  testShip.hit(14);
  expect(testShip.isSunk()).toBe(true);
});
