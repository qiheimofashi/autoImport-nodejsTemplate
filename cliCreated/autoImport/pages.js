//引入注册函数
const { requireContext, autoImport } = require("../utils/autoImports");

module.exports = function (router) {
  //pages模块注册
  const routers = requireContext("/pages", []);
  autoImport(routers, router);
};
