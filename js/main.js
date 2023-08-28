import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js';
import { getRandomColorPairs, createTimer } from './utils.js';
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
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
});

function handleTimerChange(second) {
  const fullSecond = `0${second}`.slice(-2);
  setTimeoutText(fullSecond);
}

function handleTimerFinish() {
  gameStatus = GAME_STATUS.FINISHED;

  setTimeoutText('GAME OVER!!!');

  showPlayAgainButton();
}

// count time down
// function countTimeDown() {
//   let second = 30;

//   let checkSecond = setInterval(() => {
//     if (second === 0) {
//       clearInterval(checkSecond);

//       setTimeoutText('GAME OVER!!!');

//       showPlayAgainButton();

//       // prevent click when end game
//       gameStatus = GAME_STATUS.FINISHED;
//     } else {
//       setTimeoutText(second);
//       second--;
//     }

//     checkWinGame();

//     if (isEndGame) clearInterval(checkSecond);
//   }, 100);
// }

// function handleTimerChange()
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

(() => {
  startTimer();
  initColorList();
  attachEventForColorList();
  attachEventForPlayAgainButton();
})();

function startTimer() {
  timer.start();
}

function initColorList() {
  const colorList = getRandomColorPairs(PAIRS_COUNT);

  // add each class color
  const colorElementItem = getColorElementList();
  if (!colorElementItem) return;

  colorElementItem.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index];

    const overlayElement = liElement.querySelector('.overlay');
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
  });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
  checkIsMach(isMach, firstColor);
}

function checkIsMach(isMach, firstColor) {
  // if mach true
  if (isMach) {
    checkWinGame();

    // change the background color by 2 pairs of the same color
    const colorBackground = getColorBackground();
    if (colorBackground) colorBackground.style.backgroundColor = firstColor;

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

    // race-condition check with handleTimerFinish()
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING;
    }
  }, 500);
}

function checkWinGame() {
  const isWin = getInActiveColorList().length === 0;
  if (isWin) {
    setTimeoutText('YOU WIN 💪👏');
    showPlayAgainButton();

    gameStatus = GAME_STATUS.FINISHED;

    timer.clear();
  }
}

function showPlayAgainButton() {
  const playGameButton = getPlayAgainButton();
  if (playGameButton) playGameButton.classList.add('show');
}

function hiddenPlayAgainButton() {
  const playGameButton = getPlayAgainButton();
  if (playGameButton) playGameButton.classList.remove('show');
}

function setTimeoutText(text) {
  const timerElement = getTimerElement();
  if (timerElement) timerElement.textContent = text;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  if (playAgainButton) playAgainButton.addEventListener('click', resetGame);
}

function resetGame() {
  // Global variables
  selections = [];
  gameStatus = GAME_STATUS.PLAYING;

  hiddenPlayAgainButton(); // reset DOM elements
  setTimeoutText('');
  clearClassActiveColorList();
  initColorList(); // color change
  startTimer();
}

function clearClassActiveColorList() {
  const colorElementItem = getColorElementList();
  if (!colorElementItem) return;

  colorElementItem.forEach((liElement) => {
    liElement.classList.remove('active');
  });
}
