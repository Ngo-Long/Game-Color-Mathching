import { getRandomColorPairs, createTimer } from './utils.js';
import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js';
import {
  getTimerElement,
  getPlayAgainButton,
  getColorBackground,
  getColorElementList,
  getInActiveColorList,
  getUlColorElementList,
} from './selectors.js';

// valid common
let selections = [];
let gameStatus = GAME_STATUS.PLAYING;
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChane,
  onFinish: handleTimerFinish,
});

function handleTimerChane(second) {
  let currentSecond = `0${second}`.slice(-2);
  textTimerElement(currentSecond);
}

function handleTimerFinish() {
  showPlayAgainButton();

  textTimerElement('GAME OVER!!!');

  gameStatus = GAME_STATUS.FINISHED;
}

// main
(() => {
  startTimer();

  // change color list
  initColorList();

  initColorListElement();

  attachEventPlayAgainButton();
})();

function startTimer() {
  timer.start();
}

function initColorList() {
  const colorPairs = getRandomColorPairs(PAIRS_COUNT);
  if (!colorPairs) return;

  const colorList = getColorElementList();
  if (!colorList) return;

  colorList.forEach((colorItem, index) => {
    // attach data-color
    colorItem.dataset.color = colorPairs[index];

    // attach background color
    const overlayElement = colorItem.querySelector('.overlay');
    if (overlayElement) overlayElement.style.backgroundColor = colorPairs[index];
  });
}

function initColorListElement() {
  const colorElementList = getUlColorElementList();
  if (!colorElementList) return;

  colorElementList.addEventListener('click', (e) => {
    let colorElementItem = e.target;
    if (colorElementItem.tagName !== 'LI') return;

    handleEventColorList(colorElementItem);
  });
}

function handleEventColorList(colorElementItem) {
  const isClicked = colorElementItem.classList.contains('active');
  const isCheckStatus = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);
  if (isClicked || isCheckStatus) return;

  // show color
  colorElementItem.classList.add('active');

  // check pairs color in selections
  selections.push(colorElementItem);

  if (selections.length < 2) return;
  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;

  const isGameColor = firstColor === secondColor;
  checkColorPairs(isGameColor, firstColor);
}

function checkColorPairs(isSameColor, color) {
  // if true
  if (isSameColor) {
    // change background color if same color
    const colorBackgroundElement = getColorBackground();
    if (colorBackgroundElement) colorBackgroundElement.style.backgroundColor = color;

    // reset selection for next time
    selections = [];

    checkWinGame();
    return;
  }

  // if false
  else {
    // prevent event
    gameStatus = GAME_STATUS.BLOCKING;

    setTimeout(() => {
      // hidden color
      selections[0].classList.remove('active');
      selections[1].classList.remove('active');

      // reset selection for next time
      selections = [];

      // race-condition if win game
      if (gameStatus !== GAME_STATUS.FINISHED) {
        gameStatus = GAME_STATUS.PLAYING;
      }
    }, 500);
  }
}

function checkWinGame() {
  const activeColorList = getInActiveColorList();
  if (!activeColorList) return;

  if (activeColorList.length === 0) {
    textTimerElement('WIN GAME <3');
    showPlayAgainButton();
    gameStatus = GAME_STATUS.FINISHED;

    timer.clear();
  }
}

function textTimerElement(text) {
  const textElement = getTimerElement();
  if (textElement) textElement.textContent = text;
}

function showPlayAgainButton() {
  const playAgainElementButton = getPlayAgainButton();
  if (playAgainElementButton) {
    playAgainElementButton.classList.add('show');
  }
}

function hiddenPlayAgainButton() {
  const playAgainElementButton = getPlayAgainButton();
  if (playAgainElementButton) {
    playAgainElementButton.classList.remove('show');
  }
}

function attachEventPlayAgainButton() {
  const playAgainElementButton = getPlayAgainButton();
  if (playAgainElementButton) {
    playAgainElementButton.addEventListener('click', resetGame);
  }
}

function resetGame() {
  // valid common
  selections = [];
  gameStatus = GAME_STATUS.PLAYING;

  startTimer();

  // change color list
  initColorList();
  textTimerElement('');
  hiddenPlayAgainButton();

  clearClassActiveElementList();
}

function clearClassActiveElementList() {
  const colorList = getColorElementList();
  if (!colorList) return;

  colorList.forEach((colorItem) => {
    colorItem.classList.remove('active');
  });
}
