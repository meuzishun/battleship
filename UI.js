const UI = {
  gameContainer: document.querySelector('.game-container'),
  gameboards: [],

  createHeader: function () {
    const gameboardHeader = document.createElement('header');
    gameboardHeader.classList.add('gameboard-header');
    gameboardHeader.textContent = 'Battleship';
    this.gameContainer.appendChild(gameboardHeader);
  },

  createBoardContainer: function () {
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('gameboard-container');
    this.gameContainer.appendChild(boardContainer);
    this.boardContainer = boardContainer;
  },

  createBoard: function (className) {
    const gameboard = document.createElement('div');
    gameboard.classList.add('gameboard');
    gameboard.classList.add(className);

    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.position = i;
      gameboard.appendChild(cell);
    }

    this.boardContainer.appendChild(gameboard);
    this.gameboards.push(gameboard);
  },

  createMessageWindow: function () {
    const messageWindow = document.createElement('div');
    messageWindow.classList.add('message-window');
    this.gameContainer.appendChild(messageWindow);
    this.messageWindow = messageWindow;
  },

  updateCellStatus: function (cell, status) {
    cell.classList.add(status);
  },

  displayMessage: function (msg) {
    this.messageWindow.textContent = msg;
  },

  init: function () {
    this.createHeader();
    this.createBoardContainer();
    this.createBoard('left-board');
    this.createBoard('right-board');
    this.createMessageWindow();
  },
};

export { UI };
