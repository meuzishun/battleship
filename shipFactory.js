const createShip = function (name) {
  const shipNameLookup = {
    Carrier: 5,
    Battleship: 4,
    Destroyer: 3,
    Submarine: 3,
    'Patrol Boat': 2,
  };

  const hits = [];

  return {
    name,
    length: shipNameLookup[name],
    positions: [],
    hit: function (position) {
      if (!hits.includes(position)) {
        hits.push(position);
      }
    },
    isSunk: function () {
      return hits.length === positions.length;
    },
  };
};

export { createShip };
