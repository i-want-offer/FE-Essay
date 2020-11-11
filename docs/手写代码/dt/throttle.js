function throttle(fn, delay) {
  let timeout, context, args, result;
  let previous = 0;

  const later = function () {
    previous = +new Date();
    timeout = null;
    fn.apply(context, args);
  };

  const throttled = function () {
    const now = +new Date();
    // 下次触发 fn 的剩余时间
    const remaining = delay - (now - previous);
    context = this;
    args = arguments;
    // 如果没有剩余时间了
    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = fn.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };
  return throttled;
}
