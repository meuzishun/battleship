import { createShip } from '/shipFactory.js';

const createGameboard = function (width = 10, height = 10) {
  const cells = {};

  for (let i = 0; i < width * height; i++) {
    cells[i] = { occupied: null, status: undefined };
  }

  const ships = [];

  const findPositions = function (startingCell, ship, direction) {
    const positions = [];
    const n = direction === 'vertical' ? width : 1;
    for (let i = 0; i < ship.length; i++) {
      positions.push(startingCell + i * n);
    }
    return positions;
  };

  const isOnBoard = function (positions, direction) {
    const withinRange = positions.every(
      (position) => position >= 0 && position <= width * height
    );
    if (!withinRange) {
      // TODO: do something when ship doesn't fit on board
      console.log('Ship will not fit on board');
      return false;
    }
    return positions
      .map((position) => {
        if (direction === 'horizontal') {
          return Math.floor(position / width);
        }
        if (direction === 'vertical') {
          return position % width;
        }
      })
      .every((val, i, arr) => val === arr[0]);
  };

  const placeShip = function (startingCell, shipName, direction) {
    const ship = createShip(shipName);
    const positions = findPositions(startingCell, ship, direction);

    if (!isOnBoard(positions, direction)) {
      return;
    }

    positions.forEach((position) => {
      ship.positions.push(position);
      cells[position].occupied = ship;
    });

    ships.push(ship);
  };

  const allShipsSunk = function () {
    return ships.every((ship) => ship.isSunk());
  };

  const registerHit = function (position) {
    cells[position].status = 'hit';
    cells[position].occupied.hit(position);
    if (cells[position].occupied.isSunk()) {
      // TODO: do something about sunk ship
      console.log(`You sunk my ${cells[position].occupied.name}`);
    }
    if (allShipsSunk()) {
      // TODO: do something when all ships are sunk
      console.log('You sunk all my ships');
    }
  };

  const receiveAttack = function (position) {
    // do nothing if cell has already been shot at
    if (cells[position].status) {
      return;
    }

    if (!cells[position].occupied) {
      cells[position].status = 'miss';
    }

    if (cells[position].occupied) {
      registerHit(position);
    }
  };

  return {
    cells,
    placeShip,
    receiveAttack,
    allShipsSunk,
  };
};

export { createGameboard };
