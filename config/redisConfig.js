module.exports = {
  redisBasePath: env.AUTO_REDIS_URL, // redis缓存前缀
  redisTime: 60 * 1 * 30, // redis缓存时间 1 = 1s
  host: env.AUTO_REDIS_HOST, //ip
  port: env.AUTO_REDIS_PORT, //端口
  disabled: true,
};
// node --env-file=config.env index.js。
