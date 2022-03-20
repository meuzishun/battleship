import { gameLoop } from './gameLoop.js';
import { gameState } from './gameState.js';

export const AI = (function () {
  const nextChoices = [];
  let preferredChoices = [];

  const analysis = {
    lastHit: undefined,
    surroundingPositions: [],
    possibleTargets: [],
    surroundingHits: [],
    preferredTargets: [],

    reset: function () {
      this.clearLastHit();
      this.emptySurroundingPositions();
      this.emptyPossibleTargets();
      this.emptySurroundingHits();
      this.emptyPreferredTargets();
    },

    //* lastHit is the cell chosen
    setLastHit: function (position) {
      this.lastHit = position;
    },

    getLastHit: function () {
      return this.lastHit;
    },

    clearLastHit: function () {
      this.lastHit = undefined;
    },

    //* surroundingPositions are the NSEW cells that don't spill off the board
    calculateSurroundingPositions: function () {
      const moves = [-10, 10, 1, -1];
      const temp = moves.map((move) => {
        const newPos = move + this.lastHit;
        if (Math.abs(move) === 10) {
          if (newPos < 0 || newPos > 99) {
            return null;
          }
          return newPos;
        }
        if (move === 1) {
          if (newPos % 10 <= 0) {
            return null;
          }
          return newPos;
        }
        if (move === -1) {
          if (newPos % 10 === 9) {
            return null;
          }
          return newPos;
        }
      });
      this.surroundingPositions = temp.filter(
        (position) => typeof position === 'number'
      );
    },

    getSurroundingPositions: function () {
      return this.surroundingPositions;
    },

    removeFromSurroundingPositions: function (position) {
      const index = this.surroundingPositions.indexOf(position);
      if (index > -1) {
        this.surroundingPositions.splice(index, 1);
      }
    },

    emptySurroundingPositions: function () {
      this.surroundingPositions.length = 0;
    },

    //* possiblePositions are the cells that don't have a status ('hit' or 'miss')
    calculatePossibleTargets: function () {
      //TODO: we should be pushing here.
      const newTargets = this.surroundingPositions.filter((position) => {
        return !gameState.getOpponent().board.cells[position].status;
      });
      newTargets.forEach((target) => this.possibleTargets.push(target));
    },

    getPossibleTargets: function () {
      return this.possibleTargets;
    },

    removeFromPossibleTargets: function (position) {
      const index = this.possibleTargets.indexOf(position);
      if (index > -1) {
        this.possibleTargets.splice(index, 1);
      }
    },

    emptyPossibleTargets: function () {
      this.possibleTargets.length = 0;
    },

    //* surroundingHits are surroundingPositions that have a 'hit' status
    calculateSurroundingHits: function () {
      this.surroundingHits = this.surroundingPositions.filter((position) => {
        return gameState.getOpponent().board.cells[position].status === 'hit';
      });
    },

    getSurroundingHits: function () {
      return this.surroundingHits;
    },

    removeFromSurroundingHits: function (position) {
      const index = this.surroundingHits.indexOf(position);
      if (index > -1) {
        this.surroundingHits.splice(index, 1);
      }
    },

    emptySurroundingHits: function () {
      this.surroundingHits.length = 0;
    },

    //* preferredTargets are possiblePositions that have a 'hit' cell across from them
    calculatePreferredTargets: function () {
      const distances = this.surroundingHits.map((hit) =>
        Math.abs(hit - this.lastHit)
      );

      this.preferredTargets = this.possibleTargets.filter((position) => {
        //! not getting multiples here... look over 235-242 from old code
        for (let i = 0; i < distances.length; i++) {
          if (distances[i] === 10) {
            return position % 10 === this.getLastHit() % 10;
          }
          if (distances[i] === 1) {
            return (
              Math.floor(position / 10) === Math.floor(this.getLastHit() / 10)
            );
          }
        }
      });
    },

    getPreferredTargets: function () {
      return this.preferredTargets;
    },

    removeFromPreferredTargets: function (position) {
      const index = this.preferredTargets.indexOf(position);
      if (index > -1) {
        this.preferredTargets.splice(index, 1);
      }
    },

    emptyPreferredTargets: function () {
      this.preferredTargets.length = 0;
    },

    logState: function () {
      console.group('Last hit:');
      console.log(analysis.getLastHit());
      console.groupEnd();

      console.group('Surrounding positions:');
      console.log(analysis.getSurroundingPositions());
      console.groupEnd();

      console.group('Possible targets:');
      console.log(analysis.getPossibleTargets());
      console.groupEnd();

      console.group('Surrounding hits:');
      console.log(analysis.getSurroundingHits());
      console.groupEnd();

      // console.group('Distances:');
      // console.log(distances);
      // console.groupEnd();

      console.group('Preferred targets:');
      console.log(analysis.getPreferredTargets());
      console.groupEnd();
    },
  };

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
      borderCells.push(north);
    }
    const south = cellNum + 10;
    if (south < 100) {
      borderCells.push(south);
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
      return gameState.getOpponent().board.cells[cell].status !== 'miss';
    });
  };

  const getStatusLessCells = function (cells) {
    return cells.filter((cell) => {
      return !gameState.getOpponent().board.cells[cell].status;
    });
  };

  const getHits = function (cells) {
    return cells.filter((cell) => {
      return gameState.getOpponent().board.cells[cell].status === 'hit';
    });
  };

  const removePositionFromNextChoices = function (position) {
    const index = nextChoices.indexOf(position);
    nextChoices.splice(index, 1);
  };

  const removePositionFromPreferredChoices = function (position) {
    const index = preferredChoices.indexOf(position);
    preferredChoices.splice(index, 1);
  };

  const getRandomCell = function (cells) {
    return cells[Math.floor(Math.random() * cells.length)];
  };

  const interpretResults = function (results) {
    //TODO: try commenting out old code and use new analysis object here instead
    console.log('========================================');
    // console.group('Results:');
    // console.log(results.position);
    // console.log(results.status);
    // console.groupEnd();
    if (results.status === 'miss') {
      analysis.logState();
      return;
    }
    if (results.status === 'hit' && !results.occupied.isSunk()) {
      // getStatusLessCells(getBorderCells(results.position)).forEach((cell) =>
      //   nextChoices.push(cell)
      // );
      // console.group('Next choices:');
      // console.table(nextChoices);
      // console.groupEnd();

      // const nearByHits = getHits(getBorderCells(results.position));
      // console.group('Nearby hits:');
      // console.table(nearByHits);
      // console.groupEnd();

      // const analysis = nearByHits.map((hit) =>
      //   Math.abs(hit - results.position)
      // );
      // console.group('Anaylysis:');
      // console.table(analysis);
      // console.groupEnd();

      // preferredChoices = nextChoices.filter((choice) => {
      //   if (analysis[0] === 10) {
      //     console.log('same column');
      //     return choice % 10 === results.position % 10;
      //   }
      //   if (analysis[0] === 1) {
      //     console.log('same row');
      //     return Math.floor(choice / 10) === Math.floor(results.position / 10);
      //   }
      // });
      // console.group('Preferred choices:');
      // console.table(preferredChoices);
      // console.groupEnd();

      analysis.setLastHit(results.position);
      analysis.removeFromPossibleTargets(results.position);
      // console.group('Current position:');
      // console.log(analysis.getlastHit());
      // console.groupEnd();

      analysis.calculateSurroundingPositions();
      // console.group('Surrounding positions:');
      // console.log(analysis.getSurroundingPositions());
      // console.groupEnd();

      analysis.calculatePossibleTargets();
      // console.group('Possible targets:');
      // console.log(analysis.getPossibleTargets());
      // console.groupEnd();

      analysis.calculateSurroundingHits();
      // console.group('Surrounding hits:');
      // console.log(analysis.getSurroundingHits());
      // console.groupEnd();

      analysis.calculatePreferredTargets();
      // console.group('Preferred targets:');
      // console.log(analysis.getPreferredTargets());
      // console.groupEnd();
      analysis.logState();
    }
    if (results.occupied.isSunk()) {
      // nextChoices.length = 0;
      // preferredChoices.length = 0;
      analysis.reset();
      analysis.logState();
    }
  };

  const chooseNextPosition = function () {
    if (analysis.getPreferredTargets().length > 0) {
      console.log('We have preferred targets');
      const position = getRandomCell(analysis.getPreferredTargets());
      analysis.removeFromPreferredTargets(position);
      return position;
    }
    if (analysis.getPossibleTargets().length > 0) {
      console.log('We have possible targets');
      const position = getRandomCell(analysis.getPossibleTargets());
      analysis.removeFromPossibleTargets(position);
      return position;
    }
    return getRandomCell(
      findStatuslessCells(gameState.getOpponent().board.cells)
    );
  };

  const play = function () {
    //TODO: log the position here, no matter what the result
    let position;

    // if (preferredChoices.length > 0) {
    //   position = getRandomCell(preferredChoices);
    //   removePositionFromNextChoices(position);
    //   removePositionFromPreferredChoices(position);
    // } else if (nextChoices.length > 0) {
    //   position = getRandomCell(nextChoices);
    //   removePositionFromNextChoices(position);
    // } else {
    //   position = getRandomCell(
    //     findStatuslessCells(gameState.getOpponent().board.cells)
    //   );
    // }

    const playTimer = setTimeout(() => {
      // gameLoop.processTurn(Number(position));
      const position = Number(chooseNextPosition());
      gameLoop.processTurn(position);
      clearTimeout(playTimer);
    }, 500);
  };

  return {
    play,
    interpretResults,
  };
})();
