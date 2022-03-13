import { gameLoop } from '../gameLoop.js';
import { gameState } from '../gameState.js';

export const modal_UI = (function () {
  const createModal = function (content) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const popup = document.createElement('div');
    popup.appendChild(content);
    popup.classList.add('pop-up');

    modal.appendChild(popup);
    return modal;
  };

  const createAddPlayerForm = function (playerNum) {
    const form = document.createElement('form');
    form.classList.add('new-player-form');

    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'player-name');
    nameLabel.textContent = `Enter the name of Player ${playerNum}: `;

    const nameInput = document.createElement('input');
    nameInput.setAttribute('name', 'player-name');
    nameInput.setAttribute('id', 'player-name');

    const submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.value = 'Add Player';

    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(submitBtn);
    form.addEventListener('submit', handleAddPlayerSubmission);
    return form;
  };

  const createGameOverForm = function (player) {
    const container = document.createElement('div');
    container.classList.add('game-over-container');

    const msg = document.createElement('p');
    msg.classList.add('game-over-msg');
    msg.textContent = `GAME OVER ${player.name} has won.
    Would you like a rematch or to start a new game?`;

    const rematchBtn = document.createElement('button');
    rematchBtn.classList.add('rematch-btn');
    rematchBtn.textContent = 'rematch';

    const newGameBtn = document.createElement('button');
    newGameBtn.classList.add('new-game-btn');
    newGameBtn.textContent = 'new game';

    container.appendChild(msg);
    container.appendChild(rematchBtn);
    container.appendChild(newGameBtn);

    return container;
  };

  const handleAddPlayerSubmission = function (e) {
    e.preventDefault();
    const name = e.srcElement.children[1].value;
    const modal = e.srcElement.parentElement.parentElement;
    gameLoop.registerNewPlayerSubmission(name);
    document.body.querySelector('.wrapper').removeChild(modal);
  };

  const handleGameOverOptions = function (e) {
    if (e.target.classList.contains('rematch-btn')) {
      gameLoop.rematch();
    }
    if (e.target.classList.contains('new-game-btn')) {
      gameLoop.newGame();
    }
  };

  const openAddPlayerModal = function () {
    const addPlayerForm = createAddPlayerForm(
      gameState.getPlayers().length + 1
    );
    const modal = createModal(addPlayerForm);
    document.querySelector('.wrapper').appendChild(modal);
    modal.querySelector('#player-name').focus();
  };

  const openGameOverModal = function (player) {
    const gameOverPopup = createGameOverForm(player);
    gameOverPopup.addEventListener('click', handleGameOverOptions);
    const modal = createModal(gameOverPopup);
    document.querySelector('.wrapper').appendChild(modal);
  };

  return {
    openAddPlayerModal,
    openGameOverModal,
  };
})();
