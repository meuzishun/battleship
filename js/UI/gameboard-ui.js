import { gameLoop } from '../gameLoop.js';
import { gameState } from '../gameState.js';

export const gameboard_UI = (function () {
  const gameboardSides = [];
  let activeBoardSide;
  let dormantBoardSide;
  let messageText;
  let msgTimer;

  //* CREATING GAMEBOARD COMPONENTS
  // const createSetupContainer = function () {
  //   const setupContainer = document.createElement('div');
  //   setupContainer.classList.add('setup-container');
  //   return setupContainer;
  // };

  const createGameContainer = function () {
    const gameContainer = document.createElement('div');
    gameContainer.classList.add('game-container');
    return gameContainer;
  };

  const createHeader = function () {
    const gameboardHeader = document.createElement('header');
    gameboardHeader.classList.add('gameboard-header');
    gameboardHeader.textContent = 'Battleship';
    return gameboardHeader;
  };

  const createMessageWindow = function () {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    messageText = document.createElement('p');
    messageText.classList.add('message-text');
    messageContainer.appendChild(messageText);
    return messageContainer;
  };

  const createPlayerTitle = function (name) {
    const playerTitle = document.createElement('h2');
    playerTitle.classList.add('player-title');
    playerTitle.textContent = name;
    return playerTitle;
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

  const createShipList = function (player) {
    const listContainer = document.createElement('div');
    listContainer.classList.add('ship-list');
    player.board.ships.forEach((ship) => {
      addShipToList(ship.name, listContainer);
    });
    return listContainer;
  };

  // const createShipPlacementList = function () {
  //   const ships = [
  //     { name: 'Carrier', length: 5 },
  //     { name: 'Battleship', length: 4 },
  //     { name: 'Destroyer', length: 3 },
  //     { name: 'Submarine', length: 3 },
  //     { name: 'Patrol Boat', length: 2 },
  //   ];

  //   const listContainer = document.createElement('div');
  //   listContainer.classList.add('ship-placement-list');
  //   ships.forEach((ship) => {
  //     const shipText = document.createElement('p');
  //     shipText.classList.add('ship-name');
  //     shipText.dataset.name = ship.name;
  //     shipText.dataset.length = ship.length;
  //     shipText.textContent = `${ship.name} (${ship.length})`;
  //     shipText.draggable = true;
  //     shipText.addEventListener('dragstart', handleShipNameDrag);
  //     shipText.addEventListener('dragend', handleShipDrop);
  //     listContainer.appendChild(shipText);
  //   });

  //   return listContainer;
  // };

  const createBoardSide = function (player) {
    const boardSide = document.createElement('div');
    boardSide.classList.add('gameboard-container');

    const playerTitle = createPlayerTitle(player.name);
    const shipList = createShipList(player);
    const gameboard = createBoard();
    boardSide.appendChild(playerTitle);
    boardSide.appendChild(shipList);
    boardSide.appendChild(gameboard);
    gameboardSides.push({ boardSide, gameboard, shipList });
    return boardSide;
  };

  //* CALLBACKS
  const setRightBoardSideAsActive = function () {
    [dormantBoardSide, activeBoardSide] = gameboardSides;
  };

  const switchBoardSideRoles = function () {
    [activeBoardSide, dormantBoardSide] = [dormantBoardSide, activeBoardSide];
  };

  const addClickListenerToActiveBoardSide = function () {
    activeBoardSide.gameboard.addEventListener('click', handleBoardClick);
  };

  const deactivateGameboards = function () {
    gameboardSides.forEach((side) =>
      side.gameboard.removeEventListener('click', handleBoardClick)
    );
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

  const addShipToList = function (name, container) {
    const shipName = document.createElement('p');
    shipName.classList.add('ship-name');
    shipName.dataset.name = name;
    shipName.textContent = name;
    // gameboardSides[boardIndex].shipList.appendChild(shipName);
    container.appendChild(shipName);
  };

  const markCell = function (position, mark) {
    const cell = activeBoardSide.gameboard.querySelector(
      `[data-position="${position}"]`
    );
    cell.classList.add(mark);
  };

  const markShipNameInList = function (ship, board) {
    board.parentElement
      .querySelector('.ship-list')
      .querySelector(`[data-name='${ship.name}']`)
      .classList.add('crossout');
  };

  const markShipAsSunk = function (ship) {
    changeSunkShipCells(ship, activeBoardSide.gameboard);
    markShipNameInList(ship, activeBoardSide.gameboard);
  };

  const changeSunkShipCells = function (ship, board) {
    ship.positions.forEach((position) => {
      const cell = board.querySelector(`[data-position='${position}']`);
      cell.classList.remove('hit');
      cell.classList.add('sunk');
    });
  };

  // const initializeBoardForShipDrop = function (player) {
  //   document.querySelector('.wrapper').textContent = '';
  //   const setupContainer = createSetupContainer();
  //   setupContainer.appendChild(createMessageWindow());
  //   displayMessage(`Place the ships on the board for ${player.name}`);

  //   const setupBoard = createBoard();
  //   setupBoard.addEventListener('dragenter', handleDragOver);

  //   const shipList = createShipPlacementList();
  //   setupContainer.appendChild(shipList);
  //   setupContainer.appendChild(setupBoard);
  //   document.querySelector('.wrapper').appendChild(setupContainer);
  // };

  const initializeGameboard = function () {
    gameboardSides.length = 0;
    document.querySelector('.wrapper').textContent = '';
    const gameContainer = createGameContainer();
    gameContainer.appendChild(createHeader());
    gameContainer.appendChild(createMessageWindow());

    gameState.getPlayers().forEach((player) => {
      gameContainer.appendChild(createBoardSide(player));
    });

    document.querySelector('.wrapper').appendChild(gameContainer);

    // tempPlaceShips();
    setRightBoardSideAsActive();
  };

  //* EVENT LISTENERS
  // const handleShipNameDrag = function (e) {
  //   // console.log(e);
  //   e.target.classList.add('dragging');
  // };

  // const handleShipDrop = function (e) {
  //   console.log(e);
  //   e.target.classList.remove('dragging');
  // };

  // const handleDragOver = function (e) {
  //   if (e.target.classList.contains('cell')) {
  //     const allCells = document.querySelectorAll('.cell');
  //     allCells.forEach((cell) => {
  //       if (cell.classList.contains('dragged-over-cell')) {
  //         cell.classList.remove('dragged-over-cell');
  //       }
  //     });
  //     const startingCell = e.target;
  //     const startingPosition = Number(startingCell.dataset.position);
  //     const draggingShip = document.querySelector('.dragging');
  //     const draggingShipLength = Number(draggingShip.dataset.length);

  //     const cells = (() => {
  //       const arr = [];
  //       for (let i = 0, l = draggingShipLength; i < l; i++) {
  //         // console.log(i);
  //         const cell = document.querySelector(
  //           `[data-position='${i + startingPosition}']`
  //         );
  //         cell.classList.add('dragged-over-cell');
  //         console.log(cell);
  //         arr.push(
  //           document.querySelector(
  //             `.cell[data-position='${i + startingPosition}']`
  //           )
  //         );
  //       }
  //       return arr;
  //     })();
  //     console.log(cells);
  //   }
  // };

  // const handleDragLeaveCell = function (e) {
  //   e.target.classList.remove('dragged-over-cell');
  // };

  const handleBoardClick = function (e) {
    const cell = e.target;
    if (!cell.classList.contains('cell')) return;
    if (cell.classList.contains('hit')) return;
    if (cell.classList.contains('miss')) return;
    gameLoop.processTurn(Number(cell.dataset.position));
    deactivateGameboards();
  };

  const tempPlaceShips = function () {
    handleDroppedShipData({
      shipName: 'Carrier',
      playerIndex: 0,
      boardPosition: 21,
      direction: 'vertical',
    });
    handleDroppedShipData({
      shipName: 'Carrier',
      playerIndex: 1,
      boardPosition: 30,
      direction: 'vertical',
    });
    handleDroppedShipData({
      shipName: 'Battleship',
      playerIndex: 0,
      boardPosition: 53,
      direction: 'horizontal',
    });
    handleDroppedShipData({
      shipName: 'Battleship',
      playerIndex: 1,
      boardPosition: 23,
      direction: 'horizontal',
    });
    handleDroppedShipData({
      shipName: 'Destroyer',
      playerIndex: 0,
      boardPosition: 3,
      direction: 'horizontal',
    });
    handleDroppedShipData({
      shipName: 'Destroyer',
      playerIndex: 1,
      boardPosition: 3,
      direction: 'horizontal',
    });
    handleDroppedShipData({
      shipName: 'Submarine',
      playerIndex: 0,
      boardPosition: 75,
      direction: 'horizontal',
    });
    handleDroppedShipData({
      shipName: 'Submarine',
      playerIndex: 1,
      boardPosition: 84,
      direction: 'horizontal',
    });
    handleDroppedShipData({
      shipName: 'Patrol Boat',
      playerIndex: 0,
      boardPosition: 39,
      direction: 'vertical',
    });
    handleDroppedShipData({
      shipName: 'Patrol Boat',
      playerIndex: 1,
      boardPosition: 78,
      direction: 'vertical',
    });
  };

  return {
    // initializeBoardForShipDrop,
    initializeGameboard,
    displayMessage,
    switchBoardSideRoles,
    addShipToList,
    addClickListenerToActiveBoardSide,
    markCell,
    markShipAsSunk,
    deactivateGameboards,
  };
})();
