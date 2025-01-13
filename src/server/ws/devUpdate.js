const fs = require("fs");
const devTime = new Date().getTime();
const wsRes = [];
// 防抖
function debounce(fn, delay = 100) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

const fileChange = debounce((fileName) => {
  for (const res of wsRes) {
    res.send(
      JSON.stringify({
        fileName,
      }),
    );
  }
}, 1000);
fs.watch("src/views", { recursive: true }, (eventType, filename) => {
  fileChange(filename);
});
fs.watch("public", { recursive: true }, (eventType, filename) => {
  fileChange(filename);
});

module.exports = async (res, req) => {
  wsRes.push(res); // 存储ws连接
  // console.log("热跟新已连接");

  res.send(JSON.stringify({ msg: "热跟新已初始化", devTime }));

  res.on("close", () => {
    wsRes.splice(wsRes.indexOf(res), 1);
  });
};
