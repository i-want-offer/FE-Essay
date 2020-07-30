# call

>   call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。

```js
var foo = {
  value: 1,
}

function bar() {
  console.log(this.value)
}

bar.call(foo) // 1
```

注意两点：

1.  call 改变了 this 的指向，指向到 foo
2.  bar 函数执行了

## 模拟实现第一步

```js
var foo = {
  value: 1,
  bar() {
    console.log(this.value)
  }
}

foo.bar() // 1
```

实现非常简单，但是会给 foo 额外增加了一个属性来表示函数，所以我们在用过之后需要把该属性删除掉。

所以模拟实现的步骤：

1.  将函数设为对象的属性
2.  执行该函数
3.  删除该函数

等价于

```js
// 第一步
foo.fn = bar
// 第二步
foo.fn()
// 第三步
delete foo.fn
```

根据这个思路，可以实现第一版 call2 函数：

```js
// 第一版
Function.prototype.call2 = function(context) {
  // 首先要获取调用 call 的函数，用 this 可以获取
  context.fn = this
  context.fn()
  delete context.fn
}
```

## 模拟实现第二步

call 函数允许传入参数进去执行函数，由于参数个数并不确定，所以使用 arguments 对象，在排除第一个之后，从第二个开始一直到最后一个参数，然后放入一个数组。

```js
// 第二版
Function.prototype.call2 = function(context) {
  const args = [...arguments].slice(1)
  context.fn = this
  context.fn(...args)
  delete context.fn
}
```

## 模拟实现第三步

1.  this 参数可以传 null 或者 undefined，这时候应该是为 Window
2.  函数是可以有返回值的

```js
// 第三版
Function.prototype.call2 = function(context = window) {
  const args = [...arguments].slice(1)
  context.fn = this
  const result = context.fn(...args)
  delete context.fn
  return result
}
```



# apply

apply 的实现思路和 call 异曲同工，直接给出代码：

```js
Function.prototype.apply2 = function(context = window) {
  const args = arguments[1]
  context.fn = this
  const result = args? context.fn(...args) : context.fn() 
  delete context.fn
  return result
}
```



