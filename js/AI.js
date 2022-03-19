import { gameLoop } from './gameLoop.js';
import { gameState } from './gameState.js';

export const AI = (function () {
  const nextChoices = [];

  const findStatuslessCells = function (cells) {
    return Object.entries(cells)
      .filter((cell) => !cell[1].status)
      .map((cell) => cell[0]);
  };

  const acceptResult = function (position, result) {
    if (result === 'hit') {
      nextChoices.push(...filterOutMisses(getBorderCells(position)));
    }
    if (result === 'sunk') {
      nextChoices.length = 0;
    }
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
      return !gameState.getOpponent().board.cells[cell].status;
    });
  };

  const removePositionFromNextChoices = function (position) {
    const index = nextChoices.indexOf(position);
    nextChoices.splice(index, 1);
  };

  const getRandomCell = function (cells) {
    return cells[Math.floor(Math.random() * cells.length)];
  };

  const play = function () {
    let position;

    if (nextChoices.length > 0) {
      position = getRandomCell(nextChoices);
      removePositionFromNextChoices(position);
    } else {
      position = getRandomCell(
        findStatuslessCells(gameState.getOpponent().board.cells)
      );
    }

    const playTimer = setTimeout(() => {
      gameLoop.processTurn(Number(position));
      clearTimeout(playTimer);
    }, 500);
  };

  return {
    play,
    acceptResult,
  };
})();
