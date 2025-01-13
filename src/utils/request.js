/**
 * js将post请求的参数对象转换成get的形式拼接在url上
 * @param param
 * @returns {string}
 */
function changeParam(param) {
  return JSON.stringify(param)
    .replace(/:/g, "=")
    .replace(/,/g, "&")
    .replace(/{/g, "?")
    .replace(/}/g, "")
    .replace(/"/g, "");
}

const request = (url, { method, params, data, headers }) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: method ?? "get",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
    if (params && Object.values(params).length > 0) {
      //处理请求行数据
      url += changeParam(params);
    }
    if (data) {
      options.body = JSON.stringify(data);
    }

    fetch(url, options)
      .then(async (res) => {
        resolve({
          success: false,
          data: await res.json(),
        });
      })
      .catch((error) => {
        resolve({
          success: false,
          data: error,
        });
      });
  });
};

module.exports = request;
