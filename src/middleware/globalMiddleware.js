const expressSend = require("./responseData");
const express = require("express");
//session  中间件
const session = require("express-session");
const useragent = require("express-useragent");
module.exports = function (app, router) {
  //全局中间键挂载
  app.use((req, res, next) => {
    //同意返回格式
    expressSend(res);
    next();
  });

  //路由中间件挂载
  router.use((req, res, next) => {
    // 挂载art渲染函数
    if ("render" in res) {
      res.render = (...reset) => {
        res.setHeader("Content-Type", "text/html");
        res.send(getPage(...reset));
      };
    }
    next();
  });

  // 使用中间键 解析body
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(useragent.express());
  app.use(
    session({
      secret: "switch a good secret key",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false, httpOnly: false, maxAge: 30 * 60 * 1000 },
    }),
  );

  //使用静态文件服务
  app.use(express.static("public"));
};
