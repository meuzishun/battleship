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

  const createBoardSide = function (side, name) {
    const boardSide = document.createElement('div');
    boardSide.classList.add('gameboard-container');
    boardSide.classList.add(`${side}-gameboard-container`);

    const playerTitle = createPlayerTitle(name);
    const shipList = createShipList();
    const gameboard = createBoard();
    boardSide.appendChild(playerTitle);
    boardSide.appendChild(shipList);
    boardSide.appendChild(gameboard);
    gameContainer.appendChild(boardSide);
    gameboardSides.push({ boardSide, gameboard, shipList });
  };

  const createModal = function (content) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const popup = document.createElement('div');
    popup.appendChild(content);
    popup.classList.add('pop-up');
    modal.appendChild(popup);
    return modal;
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

  const handleDroppedShipData = function (data) {
    gameLoop.players[data.playerIndex].board.placeShip(
      data.boardPosition,
      data.shipName,
      data.direction
    );
    addShipToList(data.shipName, gameboardSides[data.playerIndex].shipList);
  };

  const createAddPlayerForm = function () {
    const form = document.createElement('form');
    form.classList.add('new-player-form');

    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'player-name');
    nameLabel.textContent = 'Enter the name of Player 1: ';

    const nameInput = document.createElement('input');
    nameInput.setAttribute('name', 'player-name');
    nameInput.setAttribute('id', 'player-name');

    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.addEventListener('submit', handleAddPlayerSubmission);
    return form;
  };

  const openAddPlayerModal = function () {
    const addPlayerForm = createAddPlayerForm();
    const modal = createModal(addPlayerForm);
    gameContainer.appendChild(modal);
  };

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

  const displayMessage = function (msg) {
    //TODO: figure way to not overlap timeouts
    cancelMsgTimer();
    clearMessage();
    messageText.textContent = msg;
    startMsgTimer(1500);
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
    setFirstTurn();
  };

  //* EVENT LISTENERS
  const handleAddPlayerSubmission = function (e) {
    e.preventDefault();
    const name = e.srcElement.children[1].value;
    console.log(name);
    const modal = e.srcElement.parentElement.parentElement;
    gameContainer.removeChild(modal);
  };

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
    createModal,
    //* CALLBACKS
    switchActiveBoardSide,
    deactivateGameboards,
    handleDroppedShipData,
    openAddPlayerModal,
    msgTimer,
    clearMessage,
    startMsgTimer,
    cancelMsgTimer,
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
