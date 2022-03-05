import { gameLoop } from './gameLoop.js';

const UI = (function () {
  //* CREATING AND REFERENCING DOM
  const gameContainer = document.querySelector('.game-container');

  const createHeader = function () {
    const gameboardHeader = document.createElement('header');
    gameboardHeader.classList.add('gameboard-header');
    gameboardHeader.textContent = 'Battleship';
    gameContainer.appendChild(gameboardHeader);
  };

  let messageText;

  const createMessageWindow = function () {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    messageText = document.createElement('p');
    messageText.classList.add('message-text');
    messageContainer.appendChild(messageText);
    gameContainer.appendChild(messageContainer);
  };

  const gameboardSides = [];
  let activeBoardSide;
  let dormantBoardSide;

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

  const createBoardSide = function (side) {
    const boardSide = document.createElement('div');
    boardSide.classList.add('gameboard-container');
    boardSide.classList.add(`${side}-gameboard-container`);

    const shipList = createShipList();
    const gameboard = createBoard();
    boardSide.appendChild(shipList);
    //? We are going to query the DOM to get to the list and board but would it be better to add a property?  Probably not...
    boardSide.appendChild(gameboard);
    gameContainer.appendChild(boardSide);
    gameboardSides.push({ boardSide, gameboard, shipList });
  };

  //* CALLBACKS
  const switchActiveBoardSide = function () {
    [activeBoardSide, dormantBoardSide] = [dormantBoardSide, activeBoardSide];
    activeBoardSide.gameboard.addEventListener('click', handleBoardClick);
    dormantBoardSide.gameboard.removeEventListener('click', handleBoardClick);
  };

  const deactivateGameboards = function () {
    this.gameboardSides.forEach((side) =>
      side.gameboard.removeEventListener('click', handleBoardClick)
    );
  };

  const temporaryPlaceShipFunction = function (data) {
    gameLoop.players[data.playerIndex].board.placeShip(
      data.boardPosition,
      data.shipName,
      data.direction
    );
    addShipToList(data.shipName, gameboardSides[data.playerIndex].shipList);
  };

  const openAddPlayerModal = function () {};

  const clearMessage = function () {
    messageText.textContent = '';
  };

  const displayMessage = function (msg) {
    //TODO: figure way to not overlap timeouts
    clearMessage();
    messageText.textContent = msg;
    // const msgTimer = setTimeout(function () {
    //   clearMessage();
    //   clearTimeout(msgTimer);
    // }, 3000);
  };

  const addShipToList = function (name, list) {
    const shipName = document.createElement('p');
    shipName.classList.add('ship-name');
    shipName.dataset.name = name;
    shipName.textContent = name;
    list.appendChild(shipName);
  };

  const markShipNameInList = function (ship, board) {
    board.parentElement
      .querySelector('.ship-list')
      .querySelector(`[data-name='${ship.name}']`)
      .classList.add('crossout');
  };

  const markShipAsSunk = function (board, ship) {
    changeSunkShipCells(ship, board);
    markShipNameInList(ship, board);
  };

  const changeSunkShipCells = function (ship, board) {
    ship.positions.forEach((position) => {
      const cell = board.querySelector(`[data-position='${position}']`);
      cell.classList.remove('hit');
      cell.classList.add('sunk');
    });
  };

  const setFirstTurn = function () {
    [dormantBoardSide, activeBoardSide] = gameboardSides;
    activeBoardSide.gameboard.addEventListener('click', handleBoardClick);
    dormantBoardSide.gameboard.removeEventListener('click', handleBoardClick);
  };

  const init = function () {
    createHeader();
    createMessageWindow();
    createBoardSide('left-side');
    createBoardSide('right-side');
    setFirstTurn();
  };

  //* EVENT LISTENERS AND CALLBACKS
  const handleShipNameDrag = function () {};

  const handleBoardDrop = function () {};

  const handleBoardClick = function (e) {
    const cell = e.target;
    if (!cell.classList.contains('cell')) return;
    if (cell.classList.contains('hit')) return;
    if (cell.classList.contains('miss')) return;
    gameLoop.processTurn(cell);
  };

  return {
    //* CREATING AND REFERENCING DOM
    gameContainer,
    createHeader,
    messageText,
    createMessageWindow,
    gameboardSides,
    activeBoardSide,
    dormantBoardSide,
    createBoard,
    createShipList,
    createBoardSide,
    //* CALLBACKS
    switchActiveBoardSide,
    deactivateGameboards,
    temporaryPlaceShipFunction,
    openAddPlayerModal,
    clearMessage,
    displayMessage,
    addShipToList,
    markShipNameInList,
    markShipAsSunk,
    changeSunkShipCells,
    setFirstTurn,
    init,
    //* EVENT LISTENERS
    handleShipNameDrag,
    handleBoardDrop,
    handleBoardClick,
  };
})();

export { UI };
