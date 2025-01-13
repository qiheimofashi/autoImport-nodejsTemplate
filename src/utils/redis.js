const Ioredis = require("ioredis"); // 引入 redis
const {
  redisTime,
  host,
  port,
  redisBasePath,
  disabled,
} = require("../../config/redisConfig");
if (disabled) {
  return console.log("已禁用redis连接");
}
const ioredis = new Ioredis({
  host, //ip
  port, //端口
}); // 创建客户端
let isLoad = false;
ioredis.on("connect", () => {
  isLoad = true;
});
let errorCount = 0;
ioredis.on("error", (err) => {
  console.log("redis连接错误：", err);
  errorCount++;
  if (errorCount > 10) {
    ioredis.end();
    console.log("redis:重连次数已用完");
  }
});

module.exports = {
  redis: {
    getRedisSelf() {
      if (!isLoad) {
        throw new Error("redis未连接成功");
      }
      return ioredis;
    },
    async set(key, value, timeState = true) {
      if (!isLoad) {
        throw new Error("redis未连接成功");
      }
      if (["", null, undefined].includes(key)) {
        throw new Error("redis存储的key不能为空");
      }
      const JSONValue =
        typeof value == "object" ? JSON.stringify(value) : value;
      const redisPath = `${redisBasePath}_${key}`;
      let selfRedisTime = redisTime;
      let selfRedisState = true;
      if (typeof timeState == "number") {
        selfRedisTime = timeState;
      } else {
        selfRedisState = timeState;
      }
      try {
        if (selfRedisState) {
          const state = await ioredis.setex(
            redisPath,
            selfRedisTime,
            JSONValue,
          );
          if (state == "ok") {
            return true;
          }
        } else {
          const state = await ioredis.set(redisPath, JSONValue);
          if (state == "ok") {
            return true;
          }
        }
      } catch (error) {
        console.log("redis存储错误：", error);
      }
      return false;
    },
    async get(key) {
      if (!isLoad) {
        throw new Error("redis未连接成功");
      }
      if (["", null, undefined].includes(key)) {
        throw new Error("redis存储的key不能为空");
      }
      try {
        const redisPath = `${redisBasePath}_${key}`;
        const value = await ioredis.get(redisPath);
        return typeof value == "string" ? JSON.parse(value) : value;
      } catch (error) {
        console.log("redis获取错误：", error);
        throw new Error("redis获取错误");
      }
    },
    async del() {
      if (!isLoad) {
        throw new Error("redis未连接成功");
      }
      if (["", null, undefined].includes(key)) {
        throw new Error("redis存储的key不能为空");
      }
      try {
        const redisPath = `${redisBasePath}_${key}`;
        return !!(await ioredis.del(redisPath));
      } catch (error) {
        console.log("redis删除错误：", error);
        throw new Error("redis删除错误");
      }
    },
  },
};
