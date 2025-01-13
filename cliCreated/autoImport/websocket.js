//websocket注册配置
const websocketConfig = require("../../config/filterAutoPath/websocket");
const { baseUrl, filterPaths, disabled = false } = websocketConfig;
const { requireContext, autoImport } = require("../utils/autoImports");

module.exports = function (app) {
  if (disabled) return;
  //webSocket模块注册
  const wss = requireContext("/server/ws");

  autoImport(wss, app, "/websocketApi", true);
};
