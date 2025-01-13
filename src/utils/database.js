const mysql = require("mysql2");
const mysqlConfig = require("../../config/dataBaseConfig");
const {
  database,
  host,
  mysqlUser: user,
  mysqlPassword: password,
  disabled,
} = mysqlConfig;

if (disabled) {
  return console.log("已禁用数据库连接");
}

const con = mysql.createPool({
  waitForConnections: true, // 是否等待连接
  connectionLimit: 10, // 最大连接数
  queueLimit: 0,
  host,
  user,
  password,
  database, //开发数据库
});
//查询多条
const query = (sql, values, isRedis = false) => {
  const sqlParams = Array.isArray(values) ? values : [];

  return new Promise(async (resolve, reject) => {
    const { redis } = utils;
    if (isRedis) {
      const result = await redis.get(sql + "_" + JSON.stringify(sqlParams));
      if (result) {
        resolve(result);
        return;
      }
    }

    con.getConnection(function (err, conn) {
      if (err) reject(err);
      conn.execute(sql, sqlParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          if (isRedis) {
            redis.set(sql + "_" + JSON.stringify(sqlParams), data);
          }
          resolve(data);
        } // 查询完之后释放连接
        con.releaseConnection(conn); // 释放连接
      });
    });
  });
};
//查询单挑
const findOne = (sql, values, isRedis = false) => {
  const sqlParams = Array.isArray(values) ? values : [];
  return new Promise(async (resolve, reject) => {
    const { redis } = utils;
    if (isRedis) {
      const result = await redis.get(sql + "_" + JSON.stringify(sqlParams));
      if (result) {
        resolve(result);
        return;
      }
    }
    con.getConnection(function (err, conn) {
      if (err) reject(err);
      conn.execute(
        sql,
        Array.isArray(values) && values.length ? values : [],
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            const [result] = data;
            if (isRedis) {
              redis.set(sql + "_" + JSON.stringify(sqlParams), result);
            }
            resolve(result); // 查询完之后释放连接
          }
          con.releaseConnection(conn); // 释放连接
        },
      );
    });
  });
};

module.exports = { db: { query, findOne } };
