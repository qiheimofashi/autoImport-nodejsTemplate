//导入express包
const express = require("express");
const autoApi = require("./autoImport/api");
const autoPages = require("./autoImport/pages");
const autoWebsocket = require("./autoImport/websocket");

const createdAutoApp = () => {
  //注册工具函数
  require("./autoImport/utils");
  //注册字段校验
  require("./autoImport/rules");
  //注册模板
  require("./autoImport/template");
};
const globalMiddleware = require("@/middleware/globalMiddleware.js");

const createdApp = () => {
  //生成 express 服务实例
  const app = express();
  // 创建路由对象，使得用户登录状态检查的中间件只作用于部分路由。
  const router = express.Router();
  globalMiddleware(app, router);
  global.app = app;
  global.router = router;
  autoApi(app);
  autoPages(router);
  autoWebsocket(app);

  return {
    app,
    router,
  };
};

module.exports = {
  createdAutoApp,
  createdApp,
};
