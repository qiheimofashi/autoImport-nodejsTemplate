const appConfig = require("./config/appConfig");
const appStateTemplate = `
module.exports = {
  apps: [
    {
      name: "${appConfig.appName}",
      script: "${appConfig.main}",
      env: "{$env}",
    },
  ],
};
`;
const fs = require("fs");
const ENV_UTILS = Object.keys(process.env).filter((i) => i.includes("AUTO_"));
const env = ENV_UTILS.reduce((pre, cur) => {
  pre[cur] = process.env[cur];
  return pre;
}, {});
const JSON_ENV = JSON.stringify(env);
const startContext = appStateTemplate.replace('"{$env}"', JSON_ENV);
fs.writeFileSync("ecosystem.config.js", startContext);
