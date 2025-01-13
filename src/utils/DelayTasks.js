class DelayTasks {
  #tasks = [];
  #proxyTasks = [];
  #tasksSum = 0;
  #tasksStatus = false;
  #duration = 1000;
  constructor(duration = 1000) {
    this.#tasks = [];
    this.#tasksStatus = false;
    this.#tasksSum = 0;
    this.#duration = duration;
    this.#proxyTasks = new Proxy(this.#tasks, {
      set: (target, key, value) => {
        target[key] = value;
        if (!!target?.length && !this.#tasksStatus) {
          this.#runTasks();
        }
        return true;
      },
      get: (target, key) => {
        return target[key];
      },
    });
  }
  addTask(task) {
    this.#proxyTasks.push(() => {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            typeof task === "function" && (await task(this.#tasksSum));
          } catch (e) {
            reject(e);
          }
          resolve(this.#tasksSum);
          console.log("任务:" + this.#tasksSum);
          this.#tasksSum++;
        }, this.#duration);
      });
    });
  }
  async #runTasks() {
    this.#tasksStatus = true;
    while (!!this.#proxyTasks.length) {
      const task = this.#proxyTasks.shift();
      try {
        task && (await task());
      } catch (error) {
        console.log("任务队列执行错误", error);
      }
    }
    this.#tasksStatus = false;
  }
}

module.exports = DelayTasks;
