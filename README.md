# 一、项目描述（nodejs-auto-import-template）

这是一个通用性 nodejs 服务脚手架，利用 fs 系统模块实现工具函数，接口文件自动注册引入。

- 项目环境：node-20。

# 二、目录结构

```
Project
├── cliCreated 初始化项目配置
│    ├── autoImport 自动引入配置
│    ├── utils 自动引入配置工具
│    └── createdAuto.js 创建服务函数
├── config 配置文件
│    ├── dataBaseConfig.js 数据库配置
│    ├── getEnv.js 环境变量配置
│    ├── appConfig.js 服务配置
│    ├── filterAutoPath 自动引入配置
│    └── radisConfig websocket配置
├── public 公共资源
│    ├── assets js资源
│    ├── img 图片资源
│    ├── styles css资源
│    ├── svg svg资源
│    ├── utils 页面业务逻辑工具函数
│    ├── serverStatic 服务器生成资源
├── src
│    ├── middleware 中间件模块
│    ├── pages 页面路由定义模块
│    ├── rules 请求校验模块
│    ├── server 业务组件
│    │     ├── api 对应app实例接口
│    │     └── ws 对应webWebsocket实例接口
│    ├── utils 工具函数（自动引入此文件下的函数。暴漏给全局变量utils使用）
│    └── views art模板模块
│          ├── common 子模块
│          └── layout 布局模块
├── .env 开发环境变量配置
├── .env.prod 生产环境变量配置
└── main.js 程序入口文件
```

# 三、使用介绍

> 如何书写接口？
>
> > server 文件下 api 与 ws 的 js 文件会自动映射成接口。
> >
> > > 比如 server>api>user>login.js api 文件下的 user 文件里的 login.js 文件 => /user/login 此文件诶需 module.export = function(req,res){} 函数里书写业务逻辑代码
>
> 如何区分接口类型？
>
> > 文件名.类型 => getInfo.post.js(默认 get 请求)
>
> 如何使用 res.params 参数？
>
> > [参数 key].js [id].get.js => req.params.id
>
> 如何使用单路由中间件？
>
> > module.export = [...中间件,逻辑代码函数] =>module.export = [中间 1,中间 2,function(){}]
>
> 此模版以统一封装返回格式
>
> > res.success
> >
> > > res.success(返回的参数,提示文本) 状态码默认返回 200
>
> > res.error
> >
> > > res.error([...错误提示]) 状态码默认返回 500
>
> > res.autoSend
> >
> > > res.error({code:number,data:返回参数,msg:'提示文本'})
>
> > res.render (渲染模块特有方法)
> >
> > > res.render(模板名,模板参数) -> res.render('layout/index',{title:'页面标题',content:'页面内容'})

部署

> pnpm prod

停止运行 注意项目名需手动配置

> pnpm stop
