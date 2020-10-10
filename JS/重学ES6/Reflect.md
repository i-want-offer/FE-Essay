# 重学 Reflect

之前完全没有了解过 Reflect，实际开发中也几乎没有用过这个ES6的新内置对象，面试中也没有遇到过问这个的。但是了解更多总是没有错，这个内置对象在框架开发上还是挺常见的。

## 概念

Reflect 不是一个构造函数，所以使用时不需要用 `new` 来进行创建。

Reflect 字面意思是反射，比较晦涩难懂，ES6新增这个对象的主要目的是：

*   将 Object 对象的一些明显属于语言内部的方法（比如 `Object.defineProperty` ）放到 Reflect 对象上。现阶段，某些方法同时部署在两个对象上，未来新方法只会部署在 Reflect 对象上。也就是说，从 Reflect 对象上可以拿到语言内部的方法；
*   修改某些 Object 方法的返回结果，让其变得更合理。比如：`Object.defineProperty ` 在无法定义属性时会抛出一个错误，而 `Reflect.defineProperty` 则会返回 false；
*    让 Object 操作都变成函数行为。某些 Object 操作是命令行为，比如 `key in obj` 和 `delete obj[key]` ，而 `Reflect.has(obj, name)` 和 `Reflect.delete(obj, name)` 让它们变成函数行为；
*   Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为。

```js
const loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name)
    return Reflect.get(target, name)
  },
  deleteProperty(target, name) {
    console.log('delete' + name)
    return Reflect.deleteProperty(target, name)
  },
  has(target, name) {
    console.log('has' + name)
    return Reflect.has(target, name)
  }
})
```

上面代码中，每一个 Proxy 对象的拦截操作（get、delete、has）内部都调用对应的 Reflect 方法，保证原生行为能够正常执行。添加的工作，就是将每一个操作输出一行日志。

## 静态 API

Reflect 拥有 13 个静态 API，其大部分与 Object 对象的同名方法作用都是相同的，而且它与 Proxy 对象的方法是一一对应的。

### `Reflect.apply()`

通过制定的参数列表发起对目标函数的调用。该方法接受三个参数：

*   target：目标函数
*   thisArgument：target 函数调用时绑定的 this 对象
*   argumentsList：目标函数调用时传入的实参

该方法与 `Function.prototype.apply` 类似，但是更加通俗易懂。

### `Reflect.construct()`

该方法的行为有点和 new 操作符类似，相当于 `new Target(...args)` 。

该方法接受三个参数：

*   target：被运行的构造函数
*   argumentList：累数组，目标构造函数调用时的实参
*   newTarget（可选）：作为新创建对象的原型对象的 constructor 属性，默认为 target

### `Reflect.defineProperty()`

基本等价于 `Object.definePropery` ，唯一的区别在于当无法进行监听时，`Reflect.defineProperty` 会返回 false，而 `Object.defineProperty` 会报错。

### `Reflect.deleteProperty()`

该方法用于删除对象上的属性，作用等价于 `delete obj[name]` ，但是它是一个函数，接受两个参数：

*   target：删除属性的目标对象
*   propertyKey：需要删除的属性的名称

### `Reflect.get()`

该方法与直接从对象上读取属性类似，但是它是通过一个函数执行操作。该方法接受三个参数：

*   target：需要取值的目标对象
*   propertyKey：需要获取的值的键
*   receiver：如果 target 对象中指定了 getter，receiver 则为 getter 调用时的 this 值。

如果 target 不是一个对象则会报错。

### `Reflect.getOwnPropertyDescriptor()`

该方法与 `Object.getOwnPropertyDescriptor` 一致，用户返回对象中给定属性的属性描述符。

### `Reflect.getPrototypeOf()`

该方法与 `Object.getProrotypeOf` 一致，用户返回给定对象的原型。

### `Reflect.has()`

该方法作用于 `key in obj` 相类似，但它是一个函数，接受两个参数：

*   target：目标对象
*   propertyKey：属性名

如果 target 不是一个对象，会报错。

### `Reflect.isExtensible()`

判断一个对象是否可扩展，和 `Object.isExtensible` 相类似，区别在于 `Reflect.isExtensible` 如果第一个参数不是一个对象会报错，而 `Object.isExtensible` 则会强制将它转换成一个对象。

### `Reflect.ownKeys()`

返回一个由目标自身属性键组成的数组。

该方法等价于 `Object.getOwnPropertyName(target).concat(Object.getOwnPropertySymbols(target))` 。

### `Reflect.preventExtensions()`

该方法阻止新属性添加到对象。

### `Reflect.set()`

该方法作用和直接设置对象属性相同，接受四个参数：

*   target：设置属性的目标对象
*   propertyKey：设置的属性名称
*   value：设置的值
*   receiver：如果遇到 setter，receiver 则为 setter 调用时 this

### `Reflect.setProrotypeOf()`

该方法可以设置一个对象的原型对象，结果返回一个布尔值。

