const playerFactory = function (name) {
  const attack = function (board, position) {};
  return {
    name,
    attack,
  };
};

export { playerFactory };
