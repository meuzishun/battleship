import { boundEventListeners } from '../bound-event-listeners.js';
import { gameLoop } from '../gameLoop.js';

export const gameSetup_UI = (function () {
  const createSetupContainer = function () {
    const setupContainer = document.createElement('div');
    setupContainer.classList.add('setup-container');
    return setupContainer;
  };

  const createMessageWindow = function () {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    const messageText = document.createElement('p');
    messageText.classList.add('message-text');
    messageContainer.appendChild(messageText);

    let msgTimer;

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
        cancelMsgTimer();
      }
    };

    return {
      elem: messageContainer,
      displayMessage,
    };
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
      shipText.textContent = `${ship.name}`;
      shipText.draggable = true;
      shipText.addEventListener(
        'dragstart',
        (boundEventListeners[`${ship.name} Drag Event`] =
          handleShipNameDrag.bind(this))
      );
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

  const buildSetupUI = function () {
    document.querySelector('.wrapper').textContent = '';

    const container = createSetupContainer();
    const messageWindow = createMessageWindow();
    const board = createBoard();
    const shipList = createShipPlacementList();

    container.appendChild(messageWindow.elem);
    container.appendChild(shipList);
    container.appendChild(board);

    document.querySelector('.wrapper').appendChild(container);

    return {
      container,
      messageWindow,
      board,
      shipList,
    };
  };

  const initializeBoardForShipDrop = function (player) {
    const setupUI = buildSetupUI();

    setupUI.messageWindow.displayMessage(
      `Drag ${player.name}'s ships on the board... hold Shift before dragging for a vertical ship...`
    );

    setupUI.board.addEventListener(
      'dragenter',
      (boundEventListeners.setupBoardDragOver = handleDragOver.bind(
        this,
        player
      ))
    );

    document.addEventListener(
      'keydown',
      (boundEventListeners.shiftPressListener = setDirection.bind(this))
    );

    document.addEventListener(
      'keyup',
      (boundEventListeners.shiftLiftListener = setDirection.bind(this))
    );
  };

  const sameTensPlace = function (num, index, arr) {
    return Math.floor(num / 10) === Math.floor(arr[0] / 10);
  };

  const between0And99 = function (num) {
    return num > -1 && num < 100;
  };

  const clearAvailableUnavailableClasses = function (cell) {
    if (cell.classList.contains('available')) {
      cell.classList.remove('available');
    }
    if (cell.classList.contains('unavailable')) {
      cell.classList.remove('unavailable');
    }
  };

  const removeFeedbackClassesOnAllCells = function () {
    document
      .querySelectorAll('.cell')
      .forEach(clearAvailableUnavailableClasses);
  };

  const gatherCells = function (startingPosition, draggingShipLength) {
    const arr = [];
    for (let i = 0, l = draggingShipLength; i < l; i++) {
      if (direction === 'horizontal') {
        arr.push(
          document.querySelector(`[data-position='${i + startingPosition}']`)
        );
      }
      if (direction === 'vertical') {
        arr.push(
          document.querySelector(
            `[data-position='${i * 10 + startingPosition}']`
          )
        );
      }
    }
    return arr;
  };

  const colorAvailable = function (cell) {
    if (!cell.classList.contains('available')) {
      cell.classList.add('available');
    }
  };

  const colorUnavailable = function (cell) {
    if (!cell.classList.contains('unavailable')) {
      cell.classList.add('unavailable');
    }
  };

  const colorOccupied = function (cell) {
    if (!cell.classList.contains('occupied')) {
      cell.classList.add('occupied');
    }
  };

  const colorCells = function (cells, player) {
    const positions = cells.map((cell) => cell.dataset.position);
    if (
      (direction === 'horizontal' && !positions.every(sameTensPlace)) ||
      (direction === 'vertical' && !positions.every(between0And99))
    ) {
      cells.forEach(clearAvailableUnavailableClasses);
      return;
    }

    if (
      cells.some((cell) => player.board.cells[cell.dataset.position].occupied)
    ) {
      cells.forEach(colorUnavailable);
      return;
    }

    if (
      cells.every((cell) => !player.board.cells[cell.dataset.position].occupied)
    ) {
      cells.forEach(colorAvailable);
      return;
    }
  };

  let direction = 'horizontal';

  const setDirection = function (e) {
    if (e.shiftKey) {
      direction = 'vertical';
    } else {
      direction = 'horizontal';
    }
  };

  //* EVENT LISTENERS

  const handleShipNameDrag = function (e) {
    e.target.classList.add('dragging');
  };

  const handleDragOver = function (player, e) {
    removeFeedbackClassesOnAllCells();
    if (e.target.classList.contains('cell')) {
      const startingCell = e.target;
      const startingPosition = Number(startingCell.dataset.position);
      const draggingShip = document.querySelector('.dragging');
      const draggingShipLength = Number(draggingShip.dataset.length);

      const cells = gatherCells(startingPosition, draggingShipLength);
      colorCells(cells, player);

      draggingShip.addEventListener('dragend', () => {
        if (cells.every((cell) => cell.classList.contains('available'))) {
          player.board.placeShip(
            startingPosition,
            draggingShip.dataset.name,
            direction
          );
          removeFeedbackClassesOnAllCells();
          cells.forEach(colorOccupied);
          draggingShip.remove();
        }
        if (player.board.ships.length === 5) {
          gameLoop.startGame();
        }
      });
    }
  };

  return {
    initializeBoardForShipDrop,
  };
})();
