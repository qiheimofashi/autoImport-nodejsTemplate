//api注册配置
const apiConfig = require("../../config/filterAutoPath/server");
const { baseUrl, filterPaths, disabled = false } = apiConfig;
//引入注册函数
const { requireContext, autoImport } = require("../utils/autoImports");

module.exports = function (app) {
  if (disabled) return;
  //app模块注册
  const appApi = requireContext("/server/api", filterPaths);
  autoImport(appApi, app, baseUrl);
};
