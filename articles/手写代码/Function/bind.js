Function.prototype.bind2 = function (obj) {
  const context = obj || window;
  const that = this;
  const args = [...arguments].slice(1);

  const fn = function () {
    return that.apply(context, [...args, ...arguments]);
  };

  function Tmp() {}

  Tmp.prototype = this.prototype;
  fn.prototype = new Tmp();

  return fn;
};
