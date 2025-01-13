/**
 * utils
 * 就是一个模块，模块就是可以重复使用的代码块。
 */
const fs = require("fs");
const crypto = require("crypto");

const UNUSABLE_PASSWORD = "!";
/**
 * getHexDigest 加密字符串
 * @param {string} algorithm 加密算法
 * @param {string} salt 随机字符串
 * @param {string} raw 明文
 * @returns 密文
 */
function getHexDigest(algorithm, salt, raw) {
  let hash = crypto.createHash(algorithm);
  hash.update(salt + raw);
  return hash.digest("hex");
}

/**
 * makePassword 密码加密函数
 * @param {string} rawPassword 明文密码
 * @returns 加密后的密文
 */
function makePassword(rawPassword) {
  if (rawPassword == undefined) return UNUSABLE_PASSWORD;
  let algo = "sha1",
    rand = () => Math.random().toString(16).slice(-8),
    salt = getHexDigest(algo, rand(), rand()).slice(-8),
    hsh = getHexDigest(algo, salt, rawPassword);
  return `${algo}$${salt}$${hsh}`;
}

/**
 * checkPassword 验证密码
 * @param {string} rawPassword 明文密码
 * @param {string} encPassword 密文
 * @returns {boolean}
 */
function checkPassword(rawPassword, encPassword) {
  if (encPassword == UNUSABLE_PASSWORD) return false;
  let [algo, salt, hsh] = encPassword.split("$");
  if (!algo || !salt || !hsh) return false;
  return hsh == getHexDigest(algo, salt, rawPassword);
}

/**
 * 自动删除桑一份数据文件
 * @param {string || array} parUrls 需要删除的文件或者数组
 * @param {string} baseUrl 文件所在目录 注意：默认是冲public下寻找
 */
function deleteFileAi(parUrls = [], baseUrl = "imgList/") {
  const url = "public/";
  if (fs.existsSync(url + baseUrl + parUrls)) {
    !!parUrls && fs.unlinkSync(url + baseUrl + parUrls);
  }
  if (Array.isArray(parUrls)) {
    parUrls.map((i) => {
      fs.existsSync(url + baseUrl + i) &&
        !!i &&
        fs.unlinkSync(url + baseUrl + i);
    });
  }
}

const CryptoJS = require("crypto-js");
const aseKey = "blog_123";
// crypto-js解密
function cryptoDecrypt(message) {
  var decrypt = CryptoJS.AES.decrypt(message, CryptoJS.enc.Utf8.parse(aseKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
  return decrypt;
}

// 安照CommonJS规范进行导出
module.exports = {
  getHexDigest,
  makePassword,
  checkPassword,
  deleteFileAi,
  cryptoDecrypt,
};
