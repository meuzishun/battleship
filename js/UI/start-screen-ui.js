import { modal_UI } from './modal-ui.js';

export const start_UI = (function () {
  const createContainer = function () {
    const container = document.createElement('div');
    container.classList.add('start-screen');
    return container;
  };

  const createHeading = function () {
    const heading = document.createElement('h1');
    heading.classList.add('start-heading');
    heading.textContent = 'battleship';
    return heading;
  };

  const createBtn = function () {
    const btn = document.createElement('button');
    btn.classList.add('start-game-btn');
    btn.textContent = 'start game';
    return btn;
  };

  const handleStartGameBtn = function () {
    document.body.querySelector('.wrapper').textContent = '';
    modal_UI.openAddPlayerModal();
  };

  const init = function () {
    const container = createContainer();
    container.appendChild(createHeading());
    const startBtn = createBtn();
    startBtn.addEventListener('click', handleStartGameBtn);
    container.appendChild(startBtn);
    document.body.querySelector('.wrapper').textContent = '';
    document.body.querySelector('.wrapper').appendChild(container);
  };

  return {
    init,
  };
})();
