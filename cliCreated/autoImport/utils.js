//util注册配置
const utilsConfig = require("../../config/filterAutoPath/utils");
const { filterPaths, disabled = false } = utilsConfig;
if (!disabled) {
  //引入自动注册函数
  const utilsAutoImport = require("../utils/utilsAutoImport");
  //注册utils工具函数
  utilsAutoImport("utils", filterPaths);
}
