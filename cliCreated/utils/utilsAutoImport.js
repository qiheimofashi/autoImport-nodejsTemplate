const { requireContextUtils } = require("./autoImports");
const { join } = require("path");
// 递归深度导入
const deepRequire = (obj, _this, parentKey) => {
  // 将当前父级设置为对象
  _this[parentKey] = {};
  // 遍历对象中的每一个属性
  for (const [key, val] of Object.entries(obj)) {
    // 如果属性值是字符串
    if (typeof val == "string") {
      // 尝试加载模块
      const module = require(val);
      // 如果模块是函数
      if (typeof module == "function") {
        // 如果模块有名称
        if (!!module.name) {
          // 将模块设置为当前父级对象
          _this[parentKey][module.name] = module;
        } else {
          // 否则抛出错误
          throw Error("auto import is not anonymous function");
        }
      } else {
        // 遍历模块中的每一个属性
        for (const [moduleKey, moduleVal] of Object.entries(module)) {
          // 将模块属性设置为当前父级对象
          _this[parentKey][moduleKey] = moduleVal;
        }
      }
    } else {
      // 递归调用
      deepRequire(obj[key], _this[parentKey], key);
    }
  }
};

// 导出函数
module.exports = function (key, filters = []) {
  // 如果key未定义
  if (!key) {
    // 抛出错误
    throw Error("key is not undefined");
  }

  // 尝试加载utils
  const utils = requireContextUtils(
    join(__dirname, "../../src/" + key),
    filters,
  );

  // 递归深度导入
  deepRequire(utils, global, key);
};
