import { GAME_STATUS } from './constants.js';
import { getRandomColorPairs } from './utils.js';
import {
  getUlColorElementList,
  getColorElementList,
  getTimerElement,
  getPlayAgainButton,
  getColorBackground,
} from './selectors.js';

// Global variables
let selections = [];
let gameState = GAME_STATUS.PLAYING;

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

(() => {
  // init
  initColorElementList();
})();

function initColorElementList() {
  // add each class index
  const colorElementList = getColorElementList();
  if (colorElementList) {
    colorElementList.forEach((liElement, index) => {
      liElement.dataset.idx = index;
    });
  }

  // attach each target
  const ulElement = getUlColorElementList();
  if (ulElement) {
    ulElement.addEventListener('click', (e) => {
      const liElement = e.target;
      if (liElement.tagName !== 'LI') return;

      const index = Number.parseInt(liElement.dataset.idx);
      handleColorElementList(liElement, index);
    });
  }
}

function handleColorElementList(liElement, index) {
  liElement.classList.add('active');

  console.log('click', liElement, index);
}

console.log(getRandomColorPairs(8));
