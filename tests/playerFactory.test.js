import { playerFactory } from '../factories/playerFactory.js';

test('calling playerFactory returns an object', () => {
  const testPlayer = playerFactory();
  expect(typeof testPlayer).toBe('object');
});

test('player has a property of attack', () => {
  const testPlayer = playerFactory();
  expect(testPlayer).toHaveProperty('attack');
});

test('player to have name property', () => {
  const testPlayer = playerFactory();
  expect(testPlayer).toHaveProperty('name');
});
