import { gameLoop } from './js/gameLoop.js';
import { UI } from './js/UI.js';

gameLoop.addPlayerToGame('Player 1');
gameLoop.addPlayerToGame('Player 2');

UI.init();
gameLoop.setFirstTurn();

UI.temporaryPlaceShipFunction({
  shipName: 'Carrier',
  playerIndex: 0,
  boardPosition: 21,
  direction: 'vertical',
});
UI.temporaryPlaceShipFunction({
  shipName: 'Carrier',
  playerIndex: 1,
  boardPosition: 30,
  direction: 'vertical',
});
UI.temporaryPlaceShipFunction({
  shipName: 'Battleship',
  playerIndex: 0,
  boardPosition: 53,
  direction: 'horizontal',
});
UI.temporaryPlaceShipFunction({
  shipName: 'Battleship',
  playerIndex: 1,
  boardPosition: 23,
  direction: 'horizontal',
});
UI.temporaryPlaceShipFunction({
  shipName: 'Destroyer',
  playerIndex: 0,
  boardPosition: 3,
  direction: 'horizontal',
});
UI.temporaryPlaceShipFunction({
  shipName: 'Destroyer',
  playerIndex: 1,
  boardPosition: 3,
  direction: 'horizontal',
});
UI.temporaryPlaceShipFunction({
  shipName: 'Submarine',
  playerIndex: 0,
  boardPosition: 75,
  direction: 'horizontal',
});
UI.temporaryPlaceShipFunction({
  shipName: 'Submarine',
  playerIndex: 1,
  boardPosition: 84,
  direction: 'horizontal',
});
UI.temporaryPlaceShipFunction({
  shipName: 'Patrol Boat',
  playerIndex: 0,
  boardPosition: 39,
  direction: 'vertical',
});
UI.temporaryPlaceShipFunction({
  shipName: 'Patrol Boat',
  playerIndex: 1,
  boardPosition: 78,
  direction: 'vertical',
});
