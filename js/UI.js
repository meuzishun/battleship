import { gameLoop } from './gameLoop.js';

//TODO: IIFEs can prevent leaking methods...
const UI = {
  gameContainer: document.querySelector('.game-container'),
  gameboardSides: [],

  createHeader: function () {
    const gameboardHeader = document.createElement('header');
    gameboardHeader.classList.add('gameboard-header');
    gameboardHeader.textContent = 'Battleship';
    this.gameContainer.appendChild(gameboardHeader);
  },

  createMessageWindow: function () {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    const messageText = document.createElement('p');
    messageText.classList.add('message-text');
    messageContainer.appendChild(messageText);
    this.gameContainer.appendChild(messageContainer);
    this.messageText = messageText;
  },

  clearMessage: function () {
    this.messageText.textContent = '';
  },

  displayMessage: function (msg) {
    this.messageText.textContent = msg;
    const msgTimer = setTimeout(function () {
      UI.clearMessage();
      clearTimeout(msgTimer);
    }, 3000);
  },

  updateCellStatus: function (cell, status) {
    cell.classList.add(status);
  },

  createBoard: function () {
    const gameboard = document.createElement('div');
    gameboard.classList.add('gameboard');

    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.position = i;
      gameboard.appendChild(cell);
    }

    return gameboard;
  },

  handleBoardClick: function (e) {
    if (!e.target.classList.contains('cell')) {
      return;
    }

    const cell = e.target;

    if (cell.classList.contains('hit')) {
      return;
    }

    if (cell.classList.contains('miss')) {
      return;
    }

    gameLoop.processTurn(cell);
  },

  createShipList: function () {
    const listContainer = document.createElement('div');
    listContainer.classList.add('ship-list');
    return listContainer;
  },

  addShipToList: function (ship, list) {
    const shipName = document.createElement('p');
    shipName.classList.add('ship-name');
    shipName.dataset.name = ship.name;
    shipName.textContent = ship.name;
    list.appendChild(shipName);
  },

  markShipAsSunk: function (ship, list) {},

  createBoardSide: function (side) {
    const boardSide = document.createElement('div');
    boardSide.classList.add('gameboard-container');
    boardSide.classList.add(`${side}-gameboard-container`);

    const shipList = this.createShipList();
    const gameboard = this.createBoard();
    boardSide.appendChild(shipList);
    //? We are going to query the DOM to get to the list and board but would it be better to add a property?  Probably not...
    boardSide.appendChild(gameboard);
    this.gameContainer.appendChild(boardSide);
    this.gameboardSides.push({ boardSide, gameboard, shipList });
  },

  init: function () {
    this.createHeader();
    this.createMessageWindow();
    this.createBoardSide('left-side');
    this.createBoardSide('right-side');
  },
};

UI.init();

export { UI };
