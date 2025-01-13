const fs = require("fs");
const { resolve, sep } = require("path");
const pathAutoLoad = (url) =>
  `${process.cwd()}/src/${url}`.replaceAll("/", sep).replaceAll(sep + sep, sep);

const pathFilterLoad = (dirPath, filters) => {
  return fs.readdirSync(dirPath).filter((i) => {
    const filterUrl = `${dirPath}${sep}${i}`;
    return !filters.some((filterItem) => {
      const ruleUrl = filterItem.replaceAll("/", sep);
      return filterUrl.includes(ruleUrl);
    });
  });
};

const readDirSync = (dirPath, result = {}, filters = [], initPath = "") => {
  const files = pathFilterLoad(dirPath, filters);
  files.map((file) => {
    const stat = fs.statSync(resolve(dirPath, file));
    if (stat.isDirectory()) {
      readDirSync(`${dirPath}${sep}${file}`, result, filters, initPath);
    } else {
      const url = `${dirPath}${sep}${file}`;
      const urlStartIndex = url.indexOf(initPath) + initPath.length;
      const urlEndIndex = url.length;
      const apiUrl = url.substring(urlStartIndex, urlEndIndex);
      result[apiUrl.replaceAll(sep, "/")] = resolve(dirPath, file);
    }
  });
  return result;
};

const requireContext = (dirPath, filters = []) => {
  const allDirPath = pathAutoLoad(dirPath);
  const apis = readDirSync(
    allDirPath,
    {},
    filters,
    dirPath.replaceAll("/", sep),
  );
  for (const [key, val] of Object.entries(apis)) {
    apis[key] = require(val);
  }
  return apis;
};

const readDirSyncUtils = (dirPath, result = {}, filters = []) => {
  const files = pathFilterLoad(dirPath, filters);
  files.map((file) => {
    const stat = fs.statSync(resolve(dirPath, file));
    if (stat.isDirectory()) {
      result[file] = {};
      readDirSyncUtils(`${dirPath}${sep}${file}`, result[file], filters);
      if (!Object.keys(result[file]).length) {
        delete result[file];
      }
    } else {
      const url = `${dirPath}${sep}${file}`;
      const urlStartIndex = url.indexOf(file);
      const urlEndIndex = url.length;
      const apiUrl = url.substring(urlStartIndex, urlEndIndex);
      result[apiUrl] = resolve(dirPath, file);
    }
  });
  return result;
};

const requireContextUtils = (dirPath, filters = []) => {
  dirPath = resolve(process.cwd(), dirPath.replaceAll("/", sep));
  const apis = readDirSyncUtils(dirPath, {}, filters);
  return apis;
};

const getApi = (url, type = "url") => {
  const endIndex = url.indexOf(".");
  const jsIndex = url.indexOf(".js");
  const getApiMaps = {
    url() {
      const paramIdLeftIndex = url.indexOf("[");
      const paramIdRightIndex = url.indexOf("]");
      const rUrl = url.substring(0, endIndex);
      if (paramIdLeftIndex == -1) {
        return rUrl;
      } else {
        const paramKey = url.substring(paramIdLeftIndex + 1, paramIdRightIndex);
        return rUrl.replace(`[${paramKey}]`, `:${paramKey}`);
      }
    },
    method() {
      const unMethod = url.substring(endIndex, jsIndex);
      if (!!unMethod) {
        return unMethod.replace(".", "");
      } else {
        return "get";
      }
    },
  };
  try {
    return getApiMaps[type]();
  } catch (error) {
    throw Error("type not define:x-" + type);
  }
};
const expressWs = require("express-ws");
/**
 *
 * @param {*} apiObj - 需要挂载接口函数
 * @param {*} target - 挂载目标
 * @param {*} baseUrl - 接口请求前缀
 * @param {Boolean} isWs -是否是webSocket
 */
const autoImport = (apiObj, target, baseUrl = "", isWs = false) => {
  if (isWs) {
    expressWs(target);
  }

  for (const [key, val] of Object.entries(apiObj)) {
    const apiUrl = getApi(key, "url");
    const method = isWs ? "ws" : getApi(key, "method");

    target[method](
      baseUrl + (apiUrl == "/index" ? "/" : apiUrl),
      ...(Array.isArray(val) ? val : [val]),
    );
  }
};

module.exports = { requireContext, requireContextUtils, autoImport };
