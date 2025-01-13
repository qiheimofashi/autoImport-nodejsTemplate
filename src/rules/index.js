//导入参数验证中间件
const { body, param, query, validationResult } = require("express-validator");

//将需要验证的参数保存为对象，以便重用
const ruleData = {
  name: body("name")
    .notEmpty()
    .withMessage("昵称不能为空！")
    .isLength({ max: 20 })
    .withMessage("昵称格式不正确或超出20个字符！"),
  mobile: body("mobile")
    .notEmpty()
    .withMessage("手机号不能为空！")
    .isLength({ max: 11 })
    .withMessage("请输入正确的11位手机号！"),
  password: body("password").notEmpty().withMessage("密码不能为空！"),
  newPassword: body("newPassword").notEmpty().withMessage("新密码不能为空！"),
  documentContent: body("documentContent")
    .notEmpty()
    .withMessage("文章内容不能为空！"),
  title: body("title").notEmpty().withMessage("文章标题不能为空！"),
  pageNo: query("pageNo").notEmpty().withMessage("页数不能为空！"),
  pageSize: query("pageSize").notEmpty().withMessage("条数不能为空！"),
  bid: param("bid").notEmpty().withMessage("文章id不能为空！"),
  translate: {
    toType: body("toType").notEmpty().withMessage("请选择翻译目标语言！"),
    text: body("text").notEmpty().withMessage("请输入需要翻译的内容！"),
    appid: body("appid").notEmpty().withMessage("请输入appid！"),
    secretKey: body("secretKey").notEmpty().withMessage("请输入秘钥！"),
    translateType: body("translateType")
      .notEmpty()
      .withMessage("请选择翻译api！"),
  },
  user: {
    userIdCard: body("userIdCard")
      .notEmpty()
      .withMessage("浏览器指纹不能为空！"),
    userName: body("userName").notEmpty().withMessage("用户名不能为空！"),
    userNickName: body("userNickName").notEmpty().withMessage("昵称不能为空！"),
    avatar: body("avatar").notEmpty().withMessage("头像不能为空！"),
  },
};
/**
 * validate 高阶函数：根据验证器生成中间件
 *
 * @param {array} validators 验证器数组
 * @returns function Express的中间件
 */
const rule = (validators) => {
  return async (req, res, next) => {
    await Promise.all(validators.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const errMessages = {
      errorsInfo: {},
      errorTexts: [],
    };
    for (let e of errors.array()) {
      errMessages.errorTexts.push(e.msg);
      errMessages.errorsInfo[e.path] = e.msg;
    }

    res.error(errMessages);
  };
};
module.exports = { rule, ruleData };
