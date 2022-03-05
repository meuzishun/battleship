import { gameLoop } from './js/gameLoop.js';
import { UI } from './js/UI.js';

gameLoop.addPlayerToGame('Player 1');
gameLoop.addPlayerToGame('Player 2');

UI.init();
gameLoop.init();

UI.temporaryPlaceShipFunction('Carrier', 0, 21, 'vertical');
UI.temporaryPlaceShipFunction('Carrier', 1, 30, 'vertical');
UI.temporaryPlaceShipFunction('Battleship', 0, 53, 'horizontal');
UI.temporaryPlaceShipFunction('Battleship', 1, 23, 'horizontal');
UI.temporaryPlaceShipFunction('Destroyer', 0, 3, 'horizontal');
UI.temporaryPlaceShipFunction('Destroyer', 1, 3, 'horizontal');
UI.temporaryPlaceShipFunction('Submarine', 0, 75, 'horizontal');
UI.temporaryPlaceShipFunction('Submarine', 1, 84, 'horizontal');
UI.temporaryPlaceShipFunction('Patrol Boat', 0, 39, 'vertical');
UI.temporaryPlaceShipFunction('Patrol Boat', 1, 78, 'vertical');
