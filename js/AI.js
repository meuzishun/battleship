import { gameLoop } from './gameLoop.js';
import { gameState } from './gameState.js';

export class AI {
  constructor(player) {
    this.player = player;
    this.analysis = {
      lastHit: undefined,
      surroundingPositions: [],
      possibleTargets: [],
      surroundingHits: [],
      preferredTargets: [],
      recentHits: [],
    };
  }

  //* lastHit is the cell chosen
  setLastHit(position) {
    this.analysis.lastHit = position;
  }

  getLastHit() {
    return this.analysis.lastHit;
  }

  clearLastHit() {
    this.analysis.lastHit = undefined;
  }

  //* surroundingPositions are the NSEW cells that don't spill off the board
  calculateSurroundingPositions() {
    const moves = [-10, 10, 1, -1];
    const temp = moves.map((move) => {
      const newPos = move + this.analysis.lastHit;
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
    this.analysis.surroundingPositions = temp.filter(
      (position) => typeof position === 'number'
    );
  }

  getSurroundingPositions() {
    return this.analysis.surroundingPositions;
  }

  removeFromSurroundingPositions(position) {
    const index = this.analysis.surroundingPositions.indexOf(position);
    if (index > -1) {
      this.analysis.surroundingPositions.splice(index, 1);
    }
  }

  emptySurroundingPositions() {
    this.analysis.surroundingPositions.length = 0;
  }

  //* possiblePositions are the cells that don't have a status ('hit' or 'miss')
  calculatePossibleTargets() {
    //! sometimes getting an error here... check desktop for screenshot
    const newTargets = this.analysis.surroundingPositions.filter((position) => {
      return !gameState.getOpponent().board.cells[position].status;
    });
    //TODO: we need to make sure that we don't add a possible target that is already there
    newTargets.forEach((target) => {
      if (!this.analysis.possibleTargets.includes(target)) {
        this.analysis.possibleTargets.push(target);
      }
    });
  }

  getPossibleTargets() {
    return this.analysis.possibleTargets;
  }

  removeFromPossibleTargets(position) {
    const index = this.analysis.possibleTargets.indexOf(position);
    if (index > -1) {
      this.analysis.possibleTargets.splice(index, 1);
    }
  }

  emptyPossibleTargets() {
    this.analysis.possibleTargets.length = 0;
  }

  //* surroundingHits are surroundingPositions that have a 'hit' status
  calculateSurroundingHits() {
    this.analysis.surroundingHits = this.analysis.surroundingPositions.filter(
      (position) => {
        return (
          gameState.getOpponent().board.cells[position].status === 'hit' &&
          !gameState.getOpponent().board.cells[position].occupied.isSunk()
        );
      }
    );
  }

  getSurroundingHits() {
    return this.analysis.surroundingHits;
  }

  removeFromSurroundingHits(position) {
    const index = this.analysis.surroundingHits.indexOf(position);
    if (index > -1) {
      this.analysis.surroundingHits.splice(index, 1);
    }
  }

  emptySurroundingHits() {
    this.analysis.surroundingHits.length = 0;
  }

  //* preferredTargets are possiblePositions that have a 'hit' cell across from them
  calculatePreferredTargets() {
    const distances = this.analysis.surroundingHits.map((hit) =>
      Math.abs(hit - this.analysis.lastHit)
    );

    this.analysis.preferredTargets = this.analysis.possibleTargets.filter(
      (position) => {
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
      }
    );
  }

  getPreferredTargets() {
    return this.analysis.preferredTargets;
  }

  removeFromPreferredTargets(position) {
    const index = this.analysis.preferredTargets.indexOf(position);
    if (index > -1) {
      this.analysis.preferredTargets.splice(index, 1);
    }
  }

  emptyPreferredTargets() {
    this.analysis.preferredTargets.length = 0;
  }

  chooseNextPosition() {
    if (this.getPreferredTargets().length > 0) {
      console.log('We have preferred targets');
      const position = this.getRandomCell(this.getPreferredTargets());
      this.removeFromPreferredTargets(position);
      return position;
    }
    if (this.getPossibleTargets().length > 0) {
      console.log('We have possible targets');
      const position = this.getRandomCell(this.getPossibleTargets());
      this.removeFromPossibleTargets(position);
      return position;
    }
    return this.getRandomCell(
      this.findStatuslessCells(gameState.getOpponent().board.cells)
    );
  }

  //* recentHits are hits that have accured during an analysis period
  removeSunkFromRecentHits() {
    this.analysis.recentHits = this.analysis.recentHits.filter((hit) => {
      console.log(gameState.getOpponent().board.cells[hit].status);
      return !gameState.getOpponent().board.cells[hit].occupied.isSunk();
    });
  }

  addToRecentHits(position) {
    this.analysis.recentHits.push(position);
  }

  getRecentHits() {
    return this.analysis.recentHits;
  }

  removeFromRecentHits(position) {
    const index = this.analysis.recentHits.indexOf(position);
    if (index > -1) {
      this.analysis.recentHits.splice(index, 1);
    }
  }

  emptyRecentHits() {
    this.analysis.recentHits.length = 0;
  }

  logState() {
    console.group('Last hit:');
    console.log(this.getLastHit());
    console.groupEnd();

    console.group('Surrounding positions:');
    console.log(this.getSurroundingPositions());
    console.groupEnd();

    console.group('Possible targets:');
    console.log(this.getPossibleTargets());
    console.groupEnd();

    console.group('Surrounding hits:');
    console.log(this.getSurroundingHits());
    console.groupEnd();

    console.group('Preferred targets:');
    console.log(this.getPreferredTargets());
    console.groupEnd();

    console.group('Recent Hits:');
    console.log(this.getRecentHits());
    console.groupEnd();
  }

  findStatuslessCells(cells) {
    return Object.entries(cells)
      .filter((cell) => !cell[1].status)
      .map((cell) => cell[0]);
  }

  getRandomCell(cells) {
    return cells[Math.floor(Math.random() * cells.length)];
  }

  interpretResults(results) {
    console.log('========================================');
    if (results.status === 'miss') {
      this.removeFromPossibleTargets(results.position);
      this.removeFromPreferredTargets(results.position);
      this.logState();
      return;
    }
    if (results.status === 'hit' && !results.occupied.isSunk()) {
      this.setLastHit(results.position);
      this.addToRecentHits(results.position);
      this.removeFromPossibleTargets(results.position);
      this.calculateSurroundingPositions();
      this.calculatePossibleTargets();
      this.calculateSurroundingHits();
      this.calculatePreferredTargets();
      this.logState();
    }
    if (results.occupied.isSunk()) {
      this.removeSunkFromRecentHits();

      if (this.getRecentHits().length === 0) {
        this.reset();
        this.logState();
      } else {
        this.setLastHit(this.getRecentHits()[0]);
        this.removeFromRecentHits(this.getLastHit());
        this.calculateSurroundingPositions();
        this.emptyPossibleTargets();
        this.calculatePossibleTargets();
        this.calculateSurroundingHits();
        this.calculatePreferredTargets();
        this.logState();
      }
    }
  }

  play() {
    const playTimer = setTimeout(() => {
      gameLoop.processTurn(Number(this.chooseNextPosition()));
      clearTimeout(playTimer);
    }, 500);
  }

  reset() {
    this.clearLastHit();
    this.emptySurroundingPositions();
    this.emptyPossibleTargets();
    this.emptySurroundingHits();
    this.emptyPreferredTargets();
  }
}
