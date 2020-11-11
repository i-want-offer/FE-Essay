Function.prototype.call2 = function (that = window) {
  that.fn = this;
  const args = [...arguments].slice(1);
  const result = that.fn(...args);
  delete that.fn;
  return result;
};
