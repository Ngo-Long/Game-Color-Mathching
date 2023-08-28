export function getRandomColorPairs(count) {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = [];
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

  for (let i = 0; i < count; i++) {
    // randomColor function is provided by https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      format: hueList[i % hueList.length],
    });

    colorList.push(color);
  }

  // double current color list
  const fullColorList = [...colorList, ...colorList];

  // shuffle it
  colorPositionShuffle(fullColorList);

  return fullColorList;
}

function colorPositionShuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return arr;

  for (let i = arr.length - 1; i > 1; i--) {
    let j = Math.floor(Math.random() * i);

    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
}

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null;

  // start
  function start() {
    clear();

    let currentSecond = seconds;
    intervalId = setInterval(() => {
      onChange?.(currentSecond);

      currentSecond--;

      if (currentSecond < 0) {
        clear();
        onFinish?.();
      }
    }, 1000);
  }

  // clear
  function clear() {
    clearInterval(intervalId);
  }

  return {
    start,
    clear,
  };
}
