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

    const typeFieldSet = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = 'Type of Player';

    const personContainer = document.createElement('div');
    personContainer.classList.add('container');
    personContainer.classList.add('person-container');

    const personInput = document.createElement('input');
    personInput.setAttribute('type', 'radio');
    personInput.setAttribute('id', 'person-choice');
    personInput.setAttribute('name', 'player-type');
    personInput.checked = true;

    const personLabel = document.createElement('label');
    personLabel.setAttribute('for', 'person-choice');
    personLabel.textContent = 'Person';

    personContainer.appendChild(personInput);
    personContainer.appendChild(personLabel);

    const computerContainer = document.createElement('div');
    computerContainer.classList.add('container');
    computerContainer.classList.add('computer-container');

    const computerInput = document.createElement('input');
    computerInput.setAttribute('type', 'radio');
    computerInput.setAttribute('id', 'computer-choice');
    computerInput.setAttribute('name', 'player-type');

    const computerLabel = document.createElement('label');
    computerLabel.setAttribute('for', 'computer-choice');
    computerLabel.textContent = 'Computer';

    computerContainer.appendChild(computerInput);
    computerContainer.appendChild(computerLabel);

    typeFieldSet.appendChild(legend);
    typeFieldSet.appendChild(personContainer);
    typeFieldSet.appendChild(computerContainer);
    typeFieldSet.addEventListener('click', handleTypeOfPlayerClick);

    const nameContainer = document.createElement('div');
    nameContainer.classList.add('name-container');

    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'player-name');
    nameLabel.textContent = `Enter the name of Player ${playerNum}: `;

    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('name', 'player-name');
    nameInput.setAttribute('id', 'player-name');
    nameInput.required = true;

    nameContainer.appendChild(nameLabel);
    nameContainer.appendChild(nameInput);

    const submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.value = 'Add Player';

    form.appendChild(typeFieldSet);
    form.appendChild(nameContainer);
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

  const handleTypeOfPlayerClick = function (e) {
    const fieldset = e.currentTarget;
    const selectedRadio = fieldset.querySelector(
      'input[type=radio]:checked'
    ).id;
    if (selectedRadio === 'person-choice') {
      document.body
        .querySelector('.new-player-form > .name-container')
        .classList.remove('hidden');
      document.body.querySelector('#player-name').required = true;
    }
    if (selectedRadio === 'computer-choice') {
      document.body
        .querySelector('.new-player-form > .name-container')
        .classList.add('hidden');
      document.body.querySelector('#player-name').required = false;
    }
  };

  const handleAddPlayerSubmission = function (e) {
    e.preventDefault();
    const data = {
      type: e.target
        .querySelector('input[type=radio]:checked')
        .id.split('-')[0],
    };
    if (
      data.type === 'person' &&
      e.target.querySelector('#player-name').value
    ) {
      data.name = e.target.querySelector('#player-name').value;
    }
    console.log(data);

    const modal = e.srcElement.parentElement.parentElement;
    gameLoop.registerNewPlayerSubmission(data);
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
