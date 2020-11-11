class Promise {
  static resolve(value) {
    if (value instanceof Promise) return value;
    return new Promise(function (resolve, reject) {
      if (value && value.then && typeof value.then === "function") {
        setTimeout(function () {
          value.then(resolve, reject);
        });
      } else {
        resolve(value);
      }
    });
  }

  static reject(reason) {
    return new Promise(function (resolve, reject) {
      if (reason && reason.then && typeof reason.then === "function") {
        setTimeout(function () {
          reason.then(resolve, reject);
        });
      } else {
        reject(reason);
      }
    });
  }

  static all(promises) {
    if (!promises || typeof promises[Symbol.iterator] !== "function")
      throw TypeError(
        `${typeof promises} is not iterable (cannot read property Symbol(Symbol.iterator))`
      );
    let index = 0;
    const result = [];
    return new Promise(function (resolve, reject) {
      if (!promises.length) resolve(promises);
      else {
        function processValue(value, i) {
          result[i] = value;
          if (++index === promises.length) {
            resolve(result);
          }
        }
        for (let i = 0; i < promises.length; i++) {
          Promise.resolve(promises[i]).then(
            function (value) {
              processValue(value, i);
            },
            function (reason) {
              reject(reason);
            }
          );
        }
      }
    });
  }

  static race(promises) {
    if (!promises || typeof promises[Symbol.iterator] !== "function")
      throw TypeError(
        `${typeof promises} is not iterable (cannot read property Symbol(Symbol.iterator))`
      );
    return new Promise(function (resolve, reject) {
      if (!promises.length) {
        resolve();
        return;
      }
      for (const promise of promises) {
        Promise.resolve(promise).then(
          function (value) {
            resolve(value);
          },
          function (reason) {
            reject(reason);
          }
        );
      }
    });
  }

  /**
   * 终值
   * @type {*}
   */
  value = null;

  /**
   * 据因
   * @type {string}
   */
  reason;

  /**
   * 状态
   * @type {"pending"|"fulfilled"|"rejected"}
   */
  state = "pending";

  /**
   * 异步成功回调
   * @type {Function[]}
   */
  onFulfilledCallback = [];

  /**
   * 异步失败回调
   * @type {Function[]}
   */
  onRejectedCallback = [];

  constructor(executor) {
    this.init();
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  init() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  /**
   * 成功函数
   * @param value {*}
   */
  resolve(value) {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.value = value;

      this.onFulfilledCallback.forEach((fn) => {
        fn(this.value);
      });
    }
  }

  /**
   * 失败函数
   * @param reason {string}
   */
  reject(reason) {
    if (this.state === "pending") {
      this.state = "rejected";
      this.reason = reason;

      this.onRejectedCallback.forEach((fn) => {
        fn(this.reason);
      });
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function"
        ? onFulfilled
        : function (value) {
            return value;
          };
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : function (reason) {
            throw reason;
          };

    return new Promise((resolve, reject) => {
      if (this.state === "fulfilled") {
        try {
          const result = onFulfilled(this.value);
          resolvePromise(result, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }

      if (this.state === "rejected") {
        try {
          const result = onRejected(this.reason);
          resolvePromise(result, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }

      if (this.state === "pending") {
        this.onFulfilledCallback.push((value) => {
          try {
            const result = onFulfilled(value);
            resolvePromise(result, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });

        this.onRejectedCallback.push((reason) => {
          try {
            const result = onRejected(reason);
            resolvePromise(result, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
  }

  finally(callback) {
    return this.then(
      () => Promise.resolve(callback()),
      () => Promise.reject(callback())
    );
  }
}

function resolvePromise(promise, resolve, reject) {
  if (promise instanceof Promise) {
    promise.then(resolve, reject);
  } else {
    resolve(promise);
  }
}
