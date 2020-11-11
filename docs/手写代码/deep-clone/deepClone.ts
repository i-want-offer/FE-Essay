// @ts-ignore
function deepClone<T>(params: T): T {
  const getType = (v: any) => Object.prototype.toString.call(v).slice(8, -1);

  const isObj = (v: any) => getType(v) === "Object";
  const isDate = (v: any) => getType(v) === "Date";
  const isRegExp = (v: any) => getType(v) === "RegExp";

  function _deepClone(val: any) {
    if (Array.isArray(val)) {
      const source = val as any[];
      return source.reduce((res, item) => {
        res.push(_deepClone(item));
        return res;
      }, []);
    }

    if (isObj(val)) {
      const source = val as object;
      return Object.keys(source).reduce((res, key) => {
        // @ts-ignore
        res[key] = _deepClone(source[key]);
        return res;
      }, {});
    } else if (isDate(val)) {
      return new Date((val as Date).valueOf());
    } else if (isRegExp(val)) {
      const source = val as RegExp;
      const result = new RegExp(source.source, source.flags);
      result.lastIndex = source.lastIndex;
      return result;
    }

    return val;
  }

  return _deepClone(params) as T;
}
