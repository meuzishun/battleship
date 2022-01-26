const Ship = function (length) {
  if (length < 1) {
    throw new Error('Ship must have a length');
  }
  if (length < 2) {
    throw new Error('Ship must have a length of at least 2');
  }
  if (length > 5) {
    throw new Error('Ship must have a length no greater than 5');
  }
  return {
    length,
    damage: [],
    // damage: (() => {
    //   const arr = [];
    //   arr.length = length;
    // })(),
    hit: function (index) {
      if (this.damage[index] === 'hit') {
        //? This may be redundant if the board can send an error for choosing a spot already shot at
        throw new Error('the ship is already hit at that location');
      }
      this.damage[index] = 'hit';
      console.log(this.damage);
    },
    isSunk: function () {
      return (
        this.damage.filter((index) => index === 'hit').length === this.length
      );
    },
  };
};

module.exports = Ship;
