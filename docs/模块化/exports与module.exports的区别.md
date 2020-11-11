# Commonjs 中 exports 与 module.exports 的区别

`exports` 是 `modules.exports` 的引用，等价于

```js
const exports = module.exports
```

那如下结果会导出什么？

```js
module.exports = 100
exports = 3
```

很显然会导出 100，毕竟 exports 进行了重定向

node 的源码：

![](https://user-gold-cdn.xitu.io/2020/7/22/17373f0feaea5891?imageslim)

源码地址：https://github.com/nodejs/node/blob/master/lib/internal/modules/cjs/loader.js#L1252

众所周知，node 中所有的模块都被包裹在这个函数内

```js
(function(exports, require, module, __filename, __dirname) {
	exports.a = 3
})()
```

而以下的源码指出，exports 是如何得来的

```js
const dirname = path.dirname(filename);
const require = makeRequireFunction(this, redirects);
let result;
// 从这里可以看出来 exports 的实质
const exports = this.exports;
const thisValue = exports;
const module = this;
if (requireDepth === 0) statCache = new Map();
if (inspectorWrapper) {
  result = inspectorWrapper(compiledWrapper, thisValue, exports,
                            require, module, filename, dirname);
} else {

  // 这里是模块包装函数
  result = compiledWrapper.call(thisValue, exports, require, module,
                                filename, dirname);
}
```

