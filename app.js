import { gameLoop } from './js/gameLoop.js';
import { UI } from './js/UI.js';

gameLoop.addPlayerToGame('Player 1');
gameLoop.addPlayerToGame('Player 2');

UI.init();
gameLoop.init();
