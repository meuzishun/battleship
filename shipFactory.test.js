import { createShip } from './shipFactory.js';

test('createShip returns an object', () => {
  expect(typeof createShip('Destroyer')).toEqual('object');
});

test('createShip does NOT return a number', () => {
  expect(typeof createShip('Destroyer')).not.toEqual('number');
});

test('createShip does NOT return a string', () => {
  expect(typeof createShip('Destroyer')).not.toEqual('string');
});

test('createShip "Carrier" returns an object with a name prop', () => {
  const testShip = createShip('Carrier');
  expect(testShip).toHaveProperty('name');
});

test('createShip "Carrier" returns an object with a name prop of "Carrier"', () => {
  const testShip = createShip('Carrier');
  expect(testShip.name).toBe('Carrier');
});

test('createShip "Patrol Boat" returns an object with a name prop of "Patrol Boat"', () => {
  const testShip = createShip('Patrol Boat');
  expect(testShip.name).toBe('Patrol Boat');
});

test('creating a ship "Destroyer" returns an object with a length property', () => {
  const testShip = createShip('Destroyer');
  expect(testShip).toHaveProperty('length');
});

test('creating a ship "Destroyer" has a length of 3', () => {
  const testShip = createShip('Destroyer');
  expect(testShip.length).toBe(3);
});

test('creating a ship "Destroyer" returns an object with a hit property', () => {
  const testShip = createShip('Destroyer');
  expect(testShip).toHaveProperty('hit');
});

test('creating a ship "Destroyer" returns an object with a isSunk property', () => {
  const testShip = createShip('Destroyer');
  expect(testShip).toHaveProperty('isSunk');
});
