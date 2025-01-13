const jwt = require("jsonwebtoken");
const jwtKey = "ljp_token_key";

//token时间
const expiresIn = 60 * 60 * 24; //* 15;
const setToken = function (payload) {
  const { TOKEN_SUCCESS, redis } = utils;
  const token = jwt.sign(payload, jwtKey, { expiresIn: expiresIn });
  redis.hSet(token, { token, state: TOKEN_SUCCESS });
  redis.expire(token, expiresIn);
  return token;
};

const getToken = function (token) {
  const { redis } = utils;
  try {
    return redis.hGetAll(token);
  } catch (error) {
    return "error";
  }
};

module.exports = { setToken, getToken };
