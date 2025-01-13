module.exports = {
  prot: global?.env?.AUTO_PROT ?? process.env.AUTO_PROT, // 端口号
  appName: "AUTO_nodejs",
  main: "./src/main.js",
};
