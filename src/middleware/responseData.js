/**
 *
 * @param  {...any} resize -错误文本数组
 */
const responseError = function (obj) {
  this.status(500);
  this.send({
    data: obj,
    success: false,
  });
};
/**
 *
 * @param {*} data -返回数据 为字符串时是文本提示
 * @param {*} msg -文本提示
 * @returns
 */
const responseSuccess = function (data, msg = "成功") {
  const obj = { success: true, msg };
  if (typeof data == "string") {
    obj.msg = data;
  } else {
    obj.data = data;
  }
  this.send(obj);

  return obj;
};
/**
 *
 * @param {Object} param0
 * @param {number} param0.code -状态码
 * @param {any} param0.data -返回数据
 * @param {String} param0.msg -文本提示
 * @param {Boolean} param0.success -状态
 */
const autoSend = function ({ code = 200, msg, data, success = true }) {
  this.status(code);
  this.send({ msg, data, success });
};

module.exports = function expressSend(target) {
  if (!("success" in target)) {
    target.success = responseSuccess;
  }
  if (!("error" in target)) {
    target.error = responseError;
  }
  if (!("autoSend" in target)) {
    target.autoSend = autoSend;
  }
};
