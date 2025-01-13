const getEnv = require("../config/getEnv.js");
global.env = getEnv();
//引入路径别名
require("module-alias/register");
//异步错误获取补丁
require("express-async-errors");
const { createdAutoApp, createdApp } = require("../cliCreated/createdAuto.js");
createdAutoApp();

//读取环境变量
const { prot = 5351 } = require("../config/appConfig.js");
// 日志生成
const { write_log, write_stream } = require("./journal.js");

const { router, app } = createdApp();

//将路由作为中间件挂接在 / 根路由上面
app.use("/", router);
router.get("*", async (req, res) => {
  res.send("404");
});
//全局错误处理
app.use((err, req, res, next) => {
  const log = `
    |
    |
    ---start---
    请求类型：${req.method};
    请求地址：${req.url};
    请求参数：${JSON.stringify(req.body)};
    请求头：${JSON.stringify(req.headers)};
    请求时间：${new Date().toLocaleString()};
    错误信息：${err.message};
    请求来源：${req.headers["user-agent"]};
    ---end---
  `;

  write_log(log, "err.log"); //添加错误日志
  console.error([err.message]);
  res.status(500).send("服务器内部错误");
});
// 捕捉异步错误 防止服务崩溃
process.on("uncaughtException", function (e) {
  write_log(e, "uncaughtException.log"); //添加错误日志
});

//启动服务监听
app.listen(prot, () => {
  console.log(`服务器已经启动：http://localhost:${prot}`);
});
