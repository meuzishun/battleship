import { gameLoop } from '../gameLoop.js';

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

  const handleAddPlayerSubmission = function (e) {
    e.preventDefault();
    const name = e.srcElement.children[1].value;
    const modal = e.srcElement.parentElement.parentElement;
    gameLoop.registerNewPlayerSubmission(name);
    document.querySelector('.wrapper').removeChild(modal);
  };

  const openAddPlayerModal = function () {
    const addPlayerForm = createAddPlayerForm(gameLoop.getPlayers().length + 1);
    const modal = createModal(addPlayerForm);
    document.querySelector('.wrapper').appendChild(modal);
    modal.querySelector('#player-name').focus();
  };

  return {
    openAddPlayerModal,
  };
})();
