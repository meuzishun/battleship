import { gameLoop } from '../gameLoop.js';
import { gameState } from '../gameState.js';

export const game_UI = (function () {
  const gameboardSides = [];
  let activeBoardSide;
  let dormantBoardSide;
  let messageText;
  let msgTimer;

  //* CREATING GAMEBOARD COMPONENTS
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
      gameboard.appendChild(cell);
    }

    return gameboard;
  };

  const createShipList = function () {
    const listContainer = document.createElement('div');
    listContainer.classList.add('ship-list');
    return listContainer;
  };

  const createBoardSide = function (name) {
    const boardSide = document.createElement('div');
    boardSide.classList.add('gameboard-container');

    const playerTitle = createPlayerTitle(name);
    const shipList = createShipList();
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

  const createRandomShipData = function (playerIndex) {
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

    const sameTensSpot = function (num, index, arr) {
      return Math.floor(num / 10) === Math.floor(arr[0] / 10);
    };

    const boardCellFree = function (position) {
      return !gameState.getPlayers()[playerIndex].board.cells[position]
        .occupied;
    };

    const findPlaceForShip = function (ship) {
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

      if (direction === 'vertical' && !positions.every(between0And99)) {
        findPlaceForShip(ship);
        return;
      }
      if (direction === 'horizontal' && !positions.every(sameTensSpot)) {
        findPlaceForShip(ship);
        return;
      }
      if (!positions.every(boardCellFree)) {
        findPlaceForShip(ship);
        return;
      }
      gameState.registerShipPlacementData({
        shipName: ship.name,
        playerIndex,
        boardPosition: startingPosition,
        direction,
      });
    };

    ships.forEach((ship) => {
      findPlaceForShip(ship);
    });
  };

  // const handleDroppedShipData = function (data) {
  //   gameState
  //     .getPlayers()
  //     [data.playerIndex].board.placeShip(
  //       data.boardPosition,
  //       data.shipName,
  //       data.direction
  //     );
  //   addShipToList(data.shipName, gameboardSides[data.playerIndex].shipList);
  // };

  const clearMessage = function () {
    messageText.textContent = '';
  };

  const startMsgTimer = function (time) {
    msgTimer = setTimeout(clearMessage, time);
  };

  const cancelMsgTimer = function () {
    clearTimeout(msgTimer);
  };

  const displayMessage = function (msg) {
    cancelMsgTimer();
    clearMessage();
    messageText.textContent = msg;
    startMsgTimer(1500);
  };

  const addShipToList = function (name, boardIndex) {
    const shipName = document.createElement('p');
    shipName.classList.add('ship-name');
    shipName.dataset.name = name;
    shipName.textContent = name;
    gameboardSides[boardIndex].shipList.appendChild(shipName);
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

  const initializeGameboard = function () {
    gameboardSides.length = 0;
    const gameContainer = createGameContainer();
    gameContainer.appendChild(createHeader());
    gameContainer.appendChild(createMessageWindow());
    gameState
      .getPlayers()
      .forEach((player) =>
        gameContainer.appendChild(createBoardSide(player.name))
      );
    document.querySelector('.wrapper').appendChild(gameContainer);

    // tempPlaceShips();
    createRandomShipData(0);
    createRandomShipData(1);
    setRightBoardSideAsActive();
  };

  //* EVENT LISTENERS
  const handleShipNameDrag = function () {};

  const handleBoardDrop = function () {};

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
    createRandomShipData(1);
  };

  return {
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
