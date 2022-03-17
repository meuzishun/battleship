import { gameLoop } from './gameLoop.js';
import { gameState } from './gameState.js';

export const AI = (function () {
  const findStatuslessCells = function (cells) {
    return Object.entries(cells)
      .filter((cell) => !cell[1].status)
      .map((cell) => cell[0]);
  };

  const getBorderCells = function (position) {
    const borderCells = [];
    const cellNum = Number(position);
    const north = cellNum - 10;
    if (north > -1) {
      borderCells.push(cellNum - 10);
    }
    const south = cellNum + 10;
    if (south < 100) {
      borderCells.push(cellNum + 10);
    }
    const east = cellNum + 1;
    if (east % 10 > 0) {
      borderCells.push(east);
    }
    const west = cellNum - 1;
    if (cellNum % 10 > 0) {
      borderCells.push(west);
    }
    return borderCells;
  };

  const filterOutMisses = function (cells) {
    return cells.filter((cell) => {
      return gameState.getOpponent().board.cells[cell].status === 'undefined';
    });
  };

  const getRandomCell = function (cells) {
    return cells[Math.floor(Math.random() * cells.length)];
  };

  const play = function () {
    const position = getRandomCell(
      findStatuslessCells(gameState.getOpponent().board.cells)
    );
    console.log(filterOutMisses(getBorderCells(position)));
    const playTimer = setTimeout(() => {
      gameLoop.processTurn(position);
      clearTimeout(playTimer);
    }, 500);
  };

  return {
    play,
  };
})();
