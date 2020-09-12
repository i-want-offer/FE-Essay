Function.prototype.apply2 = function (that = window) {
  that.fn = this;
  const args = arguments[1] ?? [];
  const result = that.fn(...args);
  delete that.fn;
  return result;
};
