# bind

一句话解释 bind：

>   bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

由此我们可以得出两个特点：

1.  返回一个函数
2.  可以传入参数



# 返回函数模拟实现

```js
// 第一版
Function.prototype.bind2 = function(context) {
  var self = this
  return function() {
    return self.apply(context)
  }
}
```



# 传参模拟实现

由于函数可以在 bind 的时候传一部分参数，调用的时候再传剩下的参数，所以实现如下：

```js
// 第二版
Function.prototype.bind2 = function(context) {
  var self = this
  var args = [...arguments].slice(1)
  return function() {
    return self.apply(context, [...args, ...arguments])
  }
}
```



# 构造函数效果的模拟实现

除了以上两点，bind 还有最难实现的第三点：

>   一个绑定函数也能使用 new 操作符创建对象：这种行为就想把原函数当成构造器。提供的 this 值会被忽略，同时调用时的参数也会被提供给模拟函数。

```js
// 第三版
Function.prototype.bind2 = function(context) {
  var self = this
  var args = [...arguments].slice(1)
  
  var resFn = function() {
    // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实力获得来自绑定函数的值
    return self.apply(this instanceof resFn? this : context ,[...args, ...arguments])
  }
  // 修改返回函数的原型为绑定函数的原型，实例就可以继承绑定函数原型中的值
  resFn.prototype = this.prototype
  return resFn
}
```



# 构造函数效果的优化实现

上面这个写法中，我们直接使用了 `resFn.prototype = this.prototype`，我们修改 `resFn.prototype` 的时候，也会修改绑定函数的原型，所以我们需要一个空函数来进行中转。

```js
// 第四版
Function.prototype.bind2 = function(context) {
  var self = this
  var args = [...arguments].slice(1)
  
  var tmp = function() {}
  var resFn = function() {
    return self.apply(this instanceof resFn ? this : context, [...args, ...arguments])
  }
  tmp.prototype = this.prototype
  resFn.prototype = new tmp()
  return resFn
}
```

