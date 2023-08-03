onmessage = function (ev) {
  if (ev.data[0] === "start") {
    let data = calculate(ev.data.slice(1)); //开始计算
    postMessage(data);
  }
};
compare = function (date1 = new Date(), date2 = new Date("2023-05-20")) {
  if (date1 > date2) {
    return 1;
  } else if (date1 == date2) {
    return 0;
  } else {
    return -1;
  }
};
calculate = function (data) {
  let temp = [
    ...new Set([
      ...data[2].map((item) => item.date),
      ...data[1].map((item) => item.date),
      ...data[0].map((item) => item.date),
    ]),
  ];
  let arr = [];
  for (let i = 0; i < data[2].length; i++) {
    compare();
    arr.push(data[2][i].value);
  }
  return arr;
};
