const arr1 = [1, 2, 3],
  arr2 = [{ value: 1 }, { value: 2 }, { value: 3 }],
  arr3 = [4, 5, 6];
const worker = new Worker("./worker.js");
worker.postMessage(["start", arr1, arr2, arr3]);
worker.onmessage = (ev) => {
  // to paint the echart
  console.log(ev);
};
