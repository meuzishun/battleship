import { gameLoop } from './js/gameLoop.js';
import { UI } from './js/UI.js';

UI.init();
gameLoop.addPlayerToGame('Player 1');
gameLoop.addPlayerToGame('Player 2');

gameLoop.init();
