Function.prototype.Bind = function (context = window, ...args) {
  const that = this;

  function fn(): any {
    return that.apply(context, args.push(...arguments));
  }

  function Temp() {
  }

  Temp.prototype = this.prototype;

  // @ts-ignore
  fn.prototype = new Temp();

  return fn;
};
