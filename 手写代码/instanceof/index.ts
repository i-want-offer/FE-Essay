function Instanceof(left: Object, right: Function): boolean {
  let proto = left.__proto__;
  const prototype = right.prototype;

  while (true) {
    if (proto === null) return false;
    if (prototype === proto) return true;
    proto = proto.__proto__;
  }
}
