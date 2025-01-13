module.exports = () => {
  const ENV_UTILS = Object.keys(process.env).filter((i) => i.includes("AUTO_"));
  const env = ENV_UTILS.reduce((pre, cur) => {
    pre[cur] = process.env[cur];
    return pre;
  }, {});
  return env;
};
