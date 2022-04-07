import { gameState } from './gameState.js';

export const shipPlacement = (function () {
  const ships = [
    { name: 'Carrier', length: 5 },
    { name: 'Battleship', length: 4 },
    { name: 'Destroyer', length: 3 },
    { name: 'Submarine', length: 3 },
    { name: 'Patrol Boat', length: 2 },
  ];

  const directions = ['horizontal', 'vertical'];

  const between0And99 = function (num) {
    return num > -1 && num < 100;
  };

  const sameTensPlace = function (num, index, arr) {
    return Math.floor(num / 10) === Math.floor(arr[0] / 10);
  };

  const hasSameTensPlace = function (num1, num2) {
    return Math.floor(num1 / 10) === Math.floor(num2 / 10);
  };

  const randomlyPlaceShips = function (playerIndex) {
    const boardCellFree = function (position) {
      return !gameState.getPlayers()[playerIndex].board.cells[position]
        .occupied;
    };

    const findLocationForShip = function (ship) {
      const positions = [];
      const startingPosition = Math.floor(Math.random() * 100);
      const direction =
        directions[Math.floor(Math.random() * directions.length)];

      for (let j = 0; j < ship.length; j++) {
        if (direction === 'horizontal') {
          positions.push(startingPosition + j);
        }
        if (direction === 'vertical') {
          positions.push(startingPosition + j * 10);
        }
      }

      if (
        (direction === 'vertical' && !positions.every(between0And99)) ||
        (direction === 'horizontal' && !positions.every(sameTensPlace)) ||
        !positions.every(boardCellFree)
      ) {
        return findLocationForShip(ship);
      }

      return {
        shipName: ship.name,
        playerIndex,
        boardPosition: startingPosition,
        direction,
      };
    };

    ships.forEach((ship) => {
      const location = findLocationForShip(ship);
      gameState.registerShipPlacementData(location);

      if (gameState.getPlayers()[playerIndex].board.ships.length === 5) {
        gameState.getPlayers()[playerIndex].shipsPlaced = true;
      }
    });
  };

  return {
    randomlyPlaceShips,
  };
})();
