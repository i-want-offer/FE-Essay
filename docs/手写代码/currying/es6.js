const curry = (fn, arr = []) => (...args) =>
  ((arg) => (arg.length === fn.length ? fn(...arg) : curry(fn, arg)))([
    ...arr,
    ...args,
  ]);
