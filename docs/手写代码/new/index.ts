function New(fn: Function, ...args: any) {
  const obj = Object.create(fn.prototype);
  const result = fn.apply(obj, args);

  return result && (typeof result === "function" || result instanceof Object)
    ? result
    : obj;
}
