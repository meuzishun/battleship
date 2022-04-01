import { gameLoop } from './gameLoop.js';
import { gameState } from './gameState.js';

export const AI = (function () {
  // const randomlyPlaceShips = function (playerIndex) {
  //   const ships = [
  //     { name: 'Carrier', length: 5 },
  //     { name: 'Battleship', length: 4 },
  //     { name: 'Destroyer', length: 3 },
  //     { name: 'Submarine', length: 3 },
  //     { name: 'Patrol Boat', length: 2 },
  //   ];

  //   const directions = ['horizontal', 'vertical'];

  //   const between0And99 = function (num) {
  //     return num > -1 && num < 100;
  //   };

  //   const sameTensPlace = function (num, index, arr) {
  //     return Math.floor(num / 10) === Math.floor(arr[0] / 10);
  //   };

  //   const hasSameTensPlace = function (num1, num2) {
  //     return Math.floor(num1 / 10) === Math.floor(num2 / 10);
  //   };

  //   const boardCellFree = function (position) {
  //     return !gameState.getPlayers()[playerIndex].board.cells[position]
  //       .occupied;
  //   };

  //   const findLocationForShip = function (ship) {
  //     const positions = [];
  //     const startingPosition = Math.floor(Math.random() * 100);
  //     const direction =
  //       directions[Math.floor(Math.random() * directions.length)];

  //     for (let j = 0; j < ship.length; j++) {
  //       if (direction === 'horizontal') {
  //         positions.push(startingPosition + j);
  //       }
  //       if (direction === 'vertical') {
  //         positions.push(startingPosition + j * 10);
  //       }
  //     }

  //     if (direction === 'vertical' && !positions.every(between0And99)) {
  //       return findLocationForShip(ship);
  //     }
  //     if (direction === 'horizontal' && !positions.every(sameTensPlace)) {
  //       return findLocationForShip(ship);
  //     }
  //     if (!positions.every(boardCellFree)) {
  //       return findLocationForShip(ship);
  //     }
  //     return {
  //       shipName: ship.name,
  //       playerIndex,
  //       boardPosition: startingPosition,
  //       direction,
  //     };
  //   };

  //   ships.forEach((ship) => {
  //     const location = findLocationForShip(ship);
  //     gameState.registerShipPlacementData(location);
  //   });
  // };

  const analysis = {
    lastHit: undefined,
    surroundingPositions: [],
    possibleTargets: [],
    surroundingHits: [],
    preferredTargets: [],
    recentHits: [],

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
      const newTargets = this.surroundingPositions.filter((position) => {
        return !gameState.getOpponent().board.cells[position].status;
      });
      //TODO: we need to make sure that we don't add a possible target that is already there
      newTargets.forEach((target) => {
        if (!this.possibleTargets.includes(target)) {
          this.possibleTargets.push(target);
        }
      });
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
        return (
          gameState.getOpponent().board.cells[position].status === 'hit' &&
          !gameState.getOpponent().board.cells[position].occupied.isSunk()
        );
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

    //* recentHits are hits that have accured during an analysis period
    removeSunkFromRecentHits: function () {
      this.recentHits = this.recentHits.filter((hit) => {
        console.log(gameState.getOpponent().board.cells[hit].status);
        return !gameState.getOpponent().board.cells[hit].occupied.isSunk();
      });
    },

    addToRecentHits: function (position) {
      this.recentHits.push(position);
    },

    getRecentHits: function () {
      return this.recentHits;
    },

    removeFromRecentHits: function (position) {
      const index = this.recentHits.indexOf(position);
      if (index > -1) {
        this.recentHits.splice(index, 1);
      }
    },

    emptyRecentHits: function () {
      this.recentHits.length = 0;
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

      console.group('Recent Hits:');
      console.log(analysis.getRecentHits());
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
      analysis.removeFromPossibleTargets(results.position);
      analysis.removeFromPreferredTargets(results.position);
      analysis.logState();
      return;
    }
    if (results.status === 'hit' && !results.occupied.isSunk()) {
      analysis.setLastHit(results.position);
      analysis.addToRecentHits(results.position);
      analysis.removeFromPossibleTargets(results.position);
      analysis.calculateSurroundingPositions();
      analysis.calculatePossibleTargets();
      analysis.calculateSurroundingHits();
      analysis.calculatePreferredTargets();
      analysis.logState();
    }
    if (results.occupied.isSunk()) {
      analysis.removeSunkFromRecentHits();

      if (analysis.getRecentHits().length === 0) {
        analysis.reset();
        analysis.logState();
      } else {
        analysis.setLastHit(analysis.getRecentHits()[0]);
        analysis.removeFromRecentHits(analysis.getLastHit());
        analysis.calculateSurroundingPositions();
        analysis.emptyPossibleTargets();
        analysis.calculatePossibleTargets();
        analysis.calculateSurroundingHits();
        analysis.calculatePreferredTargets();
        analysis.logState();
      }
    }
  };

  const play = function () {
    const playTimer = setTimeout(() => {
      gameLoop.processTurn(Number(analysis.chooseNextPosition()));
      clearTimeout(playTimer);
    }, 500);
  };

  return {
    // randomlyPlaceShips,
    interpretResults,
    play,
  };
})();
