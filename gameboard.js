const Gameboard = function (size) {
  const board = [];

  const Cell = function (id) {
    return {
      id,
      occupied: null,
    };
  };

  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const cell = Cell(`${String.fromCharCode(65 + j)}${i}`);
      row.push(cell);
    }
    board.push(row);
  }

  const placeShip = function (ship, location, direction) {
    // TODO: make sure ship's length will fit at location
  };

  return {
    board,
    placeShip,
  };
};

module.exports = Gameboard;
