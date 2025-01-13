const fs = require("fs");
const template = require("art-template");
// 运行时
const templateRuntime = require("art-template/lib/runtime");
//引入全局模板函数
const { join } = require("path");

global.template = template;

global.templateRuntime = templateRuntime;
global.templateRuntime.getSvg = (name) => {
  try {
    return fs.readFileSync(
      join(__dirname, `../../public/svg/${name}.svg`),
      "utf8",
    );
  } catch (error) {
    console.log(error);
    return "获取资源错误";
  }
};

const getBaseUrl = () => env.AUTO_BASEURL ?? "";

global.templateRuntime.getProjectUrl = (routerPath) => {
  return `${getBaseUrl()}${routerPath}`;
};
global.templateRuntime.getBaseUrl = getBaseUrl;

global.templateRuntime.env = env;
global.getPage = (pageName, params = {}) => {
  params.$baseUrl = params?.$baseUrl ?? env.AUTO_BASEURL ?? "/";
  const { ...templateParams } = params;
  const templateSelf = template(
    join(__dirname, "../../src/views", `${pageName}.art`),
    templateParams,
  );
  return templateSelf;
};
