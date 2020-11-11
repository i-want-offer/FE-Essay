# Function call, apply, bind 的实现

## call

### 核心

*   将函数设为对象的属性
*   执行&删除这个函数
*   指定 `this` 到函数并传入给定参数执行函数
*   如果不传入参数，默认指向 window

### 实现

>   因为真实面试中，面试官很喜欢让你逐步深入思考，所以这时候你可以来一波反套路，先实现一个乞丐版

#### 乞丐版

```javascript
var foo = {
  value: 1,
  bind: function() {
    console.log(this.value)
  }
}

foo.bind() // 1
```

#### 皇帝版

>   当面试官进一步询问时，你可以装作思考一波然后给出以下版本

```javascript
Function.prototype.call2 = function(that = window) {
  that.fn = this
  const args = [...arguments].slice(1)
  const result = that.fn(...args)
  delete that.fn
  return result
}

var foo = {
  value: 1
}

function bar(name, age) {
  console.log(name, age, this.value)
}

bar.call2(foo, 'Tom', 18) // 'Tom', 18, 1
```



## apply

`apply()`  实现思路和 `call()` 类似，只是参数形式不同。

```javascript
Function.prototype.apply2 = function(that = window) {
  that.fn = this
  const args = arguments[1]
  const result = args? that.fn(...args) : that.fn()
  delete that.fn
  return result
}
```



## bind

>   bind() 会创建一个新的函数。当这个新函数被调用时，bind() 的第一个参数作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

此外，`bind` 实现需要考虑实例化后对原型链的影响。

```javascript
Function.prototype.bind2 = function(obj) {
  if(typeof this !== 'function') throw Error('not a function')
  
  const context = obj ?? window
  const that = this
  const args = [...arguments].slice(1)
  
  const temp() {}
 
  const resFn = function() {
  	return that.apply(this instanceof resFn ? this : context, [...args, ...arguments])
  }
  
  temp.prototype = this.prototype
  resFn.prototype = new temp()
  return resFn
}
```

