const createShip = function (name) {
  const shipNameLookup = {
    Carrier: 5,
    Battleship: 4,
    Destroyer: 3,
    Submarine: 3,
    'Patrol Boat': 2,
  };

  if (!shipNameLookup[name]) {
    throw new Error('That is not a valid ship name');
  }

  const length = shipNameLookup[name];

  const positions = [];

  const hits = [];

  const hit = function (position) {
    if (positions.includes(position) && !hits.includes(position)) {
      hits.push(position);
    }
    //? Should we check for isSunk with each hit?  If so, maybe emit and event?
  };

  const isSunk = function () {
    return hits.length === positions.length;
  };

  return {
    name,
    length,
    positions,
    hits,
    hit,
    isSunk,
  };
};

export { createShip };
