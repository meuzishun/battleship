import { gameLoop } from './js/gameLoop.js';
import { UI } from './js/UI.js';

gameLoop.addPlayerToGame('Player 1');
gameLoop.addPlayerToGame('Player 2');

UI.init();
gameLoop.init();

gameLoop.temporaryPlaceShipFunction('Carrier', 0, 21, 'vertical');
gameLoop.temporaryPlaceShipFunction('Carrier', 1, 30, 'vertical');
// gameLoop.temporaryPlaceShipFunction('Battleship', 0, 53, 'horizontal');
// gameLoop.temporaryPlaceShipFunction('Battleship', 1, 23, 'horizontal');
// gameLoop.temporaryPlaceShipFunction('Destroyer', 0, 3, 'horizontal');
// gameLoop.temporaryPlaceShipFunction('Destroyer', 1, 3, 'horizontal');
// gameLoop.temporaryPlaceShipFunction('Submarine', 0, 75, 'horizontal');
// gameLoop.temporaryPlaceShipFunction('Submarine', 1, 84, 'horizontal');
// gameLoop.temporaryPlaceShipFunction('Patrol Boat', 0, 39, 'vertical');
// gameLoop.temporaryPlaceShipFunction('Patrol Boat', 1, 78, 'vertical');
