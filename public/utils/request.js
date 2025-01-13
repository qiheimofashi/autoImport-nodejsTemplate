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
    url = (window.$baseUrl + url).replaceAll("//", "/");
    if (params && Object.values(params).length > 0) {
      //处理请求行数据
      url += changeParam(params);
    }
    if (data) {
      options.body = JSON.stringify(data);
    }

    fetch(url, options)
      .then(async (res) => {
        const data = await res.json();
        resolve(data);
      })
      .catch((error) => {
        console.error("request error", error);

        reject({
          success: false,
          data: error,
        });
      });
  });
};
class CreateWebSocket {
  #socket;
  #tasks = [];
  #intervalId;
  constructor(url, query) {
    if (!url) {
      throw Error("url is required");
    }
    const jsonQuery = JSON.stringify(query ?? "");
    this.#init(url, jsonQuery);
    this.#intervalId = setInterval(() => {
      if (this.#socket.readyState == 3) {
        this.#init(url, jsonQuery);
      }
    }, 500);
  }
  send(data) {
    this.#socket.send(data);
  }
  addTask(task) {
    this.#tasks.push(task);
  }
  removeTask(task) {
    this.#tasks = this.#tasks.filter((item) => item !== task);
  }
  close() {
    this.#socket.close();
    this.#tasks = [];
    clearInterval(this.#intervalId);
    this.#intervalId = null;
  }
  get readyState() {
    return this.#socket.readyState;
  }
  #init(url, query) {
    this.#socket = new WebSocket(url);

    this.#socket.addEventListener("open", () => {
      this.#socket.send(query);
    });
    this.#initTasks();
  }
  #initTasks() {
    this.#socket.addEventListener("message", (event) => {
      this.#tasks.forEach((task) => {
        task(event.data);
      });
    });
  }
}
export { request, CreateWebSocket };
export default request;
