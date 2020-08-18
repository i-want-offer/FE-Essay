Function.prototype.apply2 = function (that = window) {
  that.fn = this;
  const args = arguments[1];
  const result = args ? that.fn(...args) : that.fn();
  delete that.fn;
  return result;
};
