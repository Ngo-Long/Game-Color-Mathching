import { GAME_STATUS, PAIRS_COUNT } from './constants.js';
import { getRandomColorPairs } from './utils.js';
import {
  getTimerElement,
  getPlayAgainButton,
  getColorBackground,
  getColorElementList,
  getInActiveColorList,
  getUlColorElementList,
} from './selectors.js';

// Global variables
let selections = [];
let gameStatus = GAME_STATUS.PLAYING;

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

(() => {
  // init
  initColorList();

  attachEventForColorList();

  // event play agin
  attachEventForPlayAgainButton();
})();

// init
function initColorList() {
  const colorList = getRandomColorPairs(PAIRS_COUNT);

  // add each class index
  const colorElementItem = getColorElementList();
  if (!colorElementItem) return;

  colorElementItem.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index];

    const overlayElement = liElement.querySelector('.overlay');
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
  });
}

function attachEventForColorList() {
  const ulElement = getUlColorElementList();
  if (!ulElement) return;

  ulElement.addEventListener('click', (e) => {
    const liElement = e.target;
    if (liElement.tagName !== 'LI') return;

    handleColorElementList(liElement);
  });
}

function handleColorElementList(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);
  const isClicked = liElement.classList.contains('active');
  if (!liElement || isClicked || shouldBlockClick) return;

  // show color for clicked cell
  liElement.classList.add('active');

  // save clicked cell to selections
  selections.push(liElement);
  if (selections.length < 2) return;

  // check selections
  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;
  const isMach = firstColor === secondColor;

  console.log(liElement, selections);
  checkIsMach(isMach);
}

function checkIsMach(isMach) {
  // if mach true
  if (isMach) {
    // check win game
    const isWin = getInActiveColorList().length === 0;
    if (isWin) {
      setTimeoutText('You Win');
      displayPlayAgainButton();

      gameStatus = GAME_STATUS.FINISHED;
    }

    // reset selections for the next turn
    selections = [];
    return;
  }

  // if mach false
  gameStatus = GAME_STATUS.BLOCKING;
  setTimeout(() => {
    // remove class 'active' for 2 li element
    selections[0].classList.remove('active');
    selections[1].classList.remove('active');

    // reset selections for the next turn
    selections = [];

    gameStatus = GAME_STATUS.PLAYING;
  }, 500);
}

function displayPlayAgainButton() {
  const playGameButton = getPlayAgainButton();
  if (playGameButton) playGameButton.style.display = 'block';
}

function setTimeoutText(text) {
  const timerElement = getTimerElement();
  if (timerElement) timerElement.textContent = text;
}

// event play agin
function attachEventForPlayAgainButton() {
  // display play again button
  const playAgainButton = getPlayAgainButton();
  if (playAgainButton) playAgainButton.addEventListener('click', resetGame());
}

function resetGame() {
  // Global variables
  let selections = [];
  let gameStatus = GAME_STATUS.PLAYING;

  // reset DOM elements
}
