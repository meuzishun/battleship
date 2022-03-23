import { gameLoop } from './gameLoop.js';
import { gameState } from './gameState.js';

export const AI = (function () {
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

    chooseNextPosition: function () {
      if (this.getPreferredTargets().length > 0) {
        console.log('We have preferred targets');
        const position = getRandomCell(this.getPreferredTargets());
        this.removeFromPreferredTargets(position);
        return position;
      }
      if (this.getPossibleTargets().length > 0) {
        console.log('We have possible targets');
        const position = getRandomCell(this.getPossibleTargets());
        this.removeFromPossibleTargets(position);
        return position;
      }
      return getRandomCell(
        findStatuslessCells(gameState.getOpponent().board.cells)
      );
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

  const getRandomCell = function (cells) {
    return cells[Math.floor(Math.random() * cells.length)];
  };

  const interpretResults = function (results) {
    console.log('========================================');
    if (results.status === 'miss') {
      analysis.logState();
      return;
    }
    if (results.status === 'hit' && !results.occupied.isSunk()) {
      analysis.setLastHit(results.position);
      analysis.removeFromPossibleTargets(results.position);
      analysis.calculateSurroundingPositions();
      analysis.calculatePossibleTargets();
      analysis.calculateSurroundingHits();
      analysis.calculatePreferredTargets();
      analysis.logState();
    }
    if (results.occupied.isSunk()) {
      analysis.reset();
      analysis.logState();
    }
  };

  const play = function () {
    const playTimer = setTimeout(() => {
      gameLoop.processTurn(Number(analysis.chooseNextPosition()));
      clearTimeout(playTimer);
    }, 500);
  };

  return {
    interpretResults,
    play,
  };
})();
