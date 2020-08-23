# Proxy 相比较于 defineProperty 的优势

`Object.defineProperty` 是监听对象的字段而非对象本身，因此对于动态插入对象的字段，它无能为了，只能手动为其设置设置监听属性。

同时，`Object.defineProperty` 无法监听对象中数组的变化，因此其他基于 `Object.defineProperty` 都对数组做了一定的 Hack 处理。

`Proxy` 叫做代理器，它可以为一个对象设置代理，即监听对象本身，任何访问当前被监听的对象的操作，无论是对象本身亦或是对象的字段，都会被 Proxy 拦截，因此可以使用它来做一些双向绑定的操作。

鉴于兼容性的问题，目前仍然主要是使用 `Object.defineProperty` 更多，但是随着 Vue/3 的发布，Proxy 应该会逐渐淘汰 `Object.defineProperty`。



