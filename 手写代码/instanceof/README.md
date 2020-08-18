# 实现一个 instanceof

> 用来测试一个对象是否在其原型链中存在某个构造函数

```javascript
function _instanceof(left, right) {
  var prototype = right.prototype;
  var proto = left.__proto__;
  while (true) {
    if (proto === null) return false;
    if (proto === prototype) return true;
    proto = proto.__proto__;
  }
}
```
