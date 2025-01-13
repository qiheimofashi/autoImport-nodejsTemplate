module.exports = async (res, req) => {
  res.send("你连接成功了");
  res.on("message", (msg) => {
    console.log(msg);
    res.send(msg + "webSocket");
  });
};
