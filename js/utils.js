export function getRandomColorPairs(count) {
  let colorList = [];
  const hueList = ['red', 'blue', 'green', 'pink', 'orange', 'yellow', 'gray', 'purple'];

  for (let i = 0; i < count; i++) {
    let color = randomColor({
      luminosity: 'dark',
      format: hueList[i % hueList.length],
    });

    colorList.push(color);
  }

  const fullColorList = [...colorList, ...colorList];
  colorPositionShuffle(fullColorList);

  return fullColorList;
}

function colorPositionShuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return arr;

  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);

    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
}

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null;

  const start = () => {
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
  };

  const clear = () => clearInterval(intervalId);

  return {
    start,
    clear,
  };
}
