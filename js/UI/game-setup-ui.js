export const gameSetup_UI = (function () {
  // let currentPlayer = undefined;
  let messageText = undefined;
  let msgTimer;

  const eventListenerCallbacks = {};

  const createSetupContainer = function () {
    const setupContainer = document.createElement('div');
    setupContainer.classList.add('setup-container');
    return setupContainer;
  };

  const createMessageWindow = function () {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    messageText = document.createElement('p');
    messageText.classList.add('message-text');
    messageContainer.appendChild(messageText);
    return messageContainer;
  };

  const clearMessage = function () {
    messageText.textContent = '';
  };

  const startMsgTimer = function (time) {
    msgTimer = setTimeout(clearMessage, time);
  };

  const cancelMsgTimer = function () {
    clearTimeout(msgTimer);
  };

  const displayMessage = function (msg, delay) {
    cancelMsgTimer();
    clearMessage();
    messageText.textContent = msg;
    if (delay) {
      startMsgTimer(delay);
    }
  };

  const createShipPlacementList = function () {
    const ships = [
      { name: 'Carrier', length: 5 },
      { name: 'Battleship', length: 4 },
      { name: 'Destroyer', length: 3 },
      { name: 'Submarine', length: 3 },
      { name: 'Patrol Boat', length: 2 },
    ];

    const listContainer = document.createElement('div');
    listContainer.classList.add('ship-placement-list');
    ships.forEach((ship) => {
      const shipText = document.createElement('p');
      shipText.classList.add('ship-name');
      shipText.dataset.name = ship.name;
      shipText.dataset.length = ship.length;
      shipText.textContent = `${ship.name} (${ship.length})`;
      shipText.draggable = true;
      shipText.addEventListener('dragstart', handleShipNameDrag);
      // shipText.addEventListener('dragend', handleShipDrop);
      listContainer.appendChild(shipText);
    });

    return listContainer;
  };

  const createBoard = function () {
    const gameboard = document.createElement('div');
    gameboard.classList.add('gameboard');

    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.position = i;
      cell.textContent = i; //? remove after testing?
      gameboard.appendChild(cell);
    }

    return gameboard;
  };

  const initializeBoardForShipDrop = function (player) {
    document.querySelector('.wrapper').textContent = '';
    // currentPlayer = player;
    // console.log(currentPlayer);
    const setupContainer = createSetupContainer();
    setupContainer.appendChild(createMessageWindow());
    displayMessage(`Place the ships on the board for ${player.name}`);

    const setupBoard = createBoard();
    setupBoard.addEventListener(
      'dragenter',
      (eventListenerCallbacks.setupBoardDrag = handleDragOver.bind(
        this,
        player
      ))
    );

    const shipList = createShipPlacementList();
    setupContainer.appendChild(shipList);
    setupContainer.appendChild(setupBoard);
    document.querySelector('.wrapper').appendChild(setupContainer);
  };

  const clearDragClasses = function (cell) {
    if (cell.classList.contains('dragged-over-cell')) {
      cell.classList.remove('dragged-over-cell');
    }
    if (cell.classList.contains('available')) {
      cell.classList.remove('available');
    }
    if (cell.classList.contains('unavailable')) {
      cell.classList.remove('unavailable');
    }
  };

  //* EVENT LISTENERS
  const handleShipNameDrag = function (e) {
    // console.log(e);
    e.target.classList.add('dragging');
  };

  // const handleShipDrop = function (e) {
  //   console.log(e);
  //   e.target.classList.remove('dragging');
  // };

  const handleDragOver = function (player, e) {
    if (e.target.classList.contains('cell')) {
      // console.log(player);
      // console.log(e);
      // console.log(this);
      const allCells = document.querySelectorAll('.cell');
      allCells.forEach((cell) => {
        clearDragClasses(cell);
      });
      const startingCell = e.target;
      const startingPosition = Number(startingCell.dataset.position);
      const draggingShip = document.querySelector('.dragging');
      const draggingShipLength = Number(draggingShip.dataset.length);

      const cells = (() => {
        const arr = [];
        for (let i = 0, l = draggingShipLength; i < l; i++) {
          // console.log(i);
          const cell = document.querySelector(
            `[data-position='${i + startingPosition}']`
          );
          // cell.classList.add('dragged-over-cell');
          console.log(player.board.cells[i + startingPosition]);
          if (player.board.cells[i + startingPosition].occupied) {
            cell.classList.add('unavailable');
          } else {
            cell.classList.add('available');
          }
          // console.log(cell);
          arr.push(
            document.querySelector(
              `.cell[data-position='${i + startingPosition}']`
            )
          );
        }
        return arr;
      })();
      // console.log(draggingShip);
      draggingShip.addEventListener('dragend', () => {
        console.log(cells);
        if (cells.every((cell) => cell.classList.contains('available'))) {
          console.log('all cells good');
          console.log(startingCell.dataset.position);
          player.board.placeShip(
            Number(startingCell.dataset.position),
            draggingShip.dataset.name,
            'horizonal'
          );
          console.log(player.board.cells);
          cells.forEach((cell) => cell.classList.add('occupied'));
        }
      });
      // over.classList.add('dragged-over-cell');
      // over.addEventListener('dragleave', handleDragLeaveCell);
    }
  };

  const handleDragLeaveCell = function (e) {
    e.target.classList.remove('dragged-over-cell');
  };

  return {
    initializeBoardForShipDrop,
  };
})();
