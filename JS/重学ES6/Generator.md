# Generator

Generator 是 ES6 提出的一种新的异步编程的解决方案，与传统的函数完全不同。

## 概念

Generator 字面意思是「生成器」，可以理解为这个特殊的函数会生成多种状态，并返回给调用方。

因此 Generator 是一个状态机。

执行 Generator 函数会返回一个迭代器对象，也就是说 Generator 函数除了状态机，还是一个迭代器对象生成函数。返回的迭代器对象可以依次遍历函数内部的每一个状态。

Generator 有两个特点：

*   定义时需要在 function 关键字和函数名之间加一个 *
*   函数体中使用关键字 yeild 来表示不同的状态

```js
function* foo() {
  yield "a"
  yield "b"
}

const f = foo()
console.log(f)
```

和普通函数不同的是，当运行这个函数时，返回的不是这个函数的结果，而是一个迭代器对象，如果想要输出对应状态的值，则需要调用 `next()` 方法进行输出。`next()` 方法就是向下移动指针，即每次调用 `next()` ，就是从函数头部或者从上一个 yield 表达式移动到下一个 yield 表达式（或者 return 为止）。

```js
function* foo() {
  yield "a"
  yield "b"
}

const f = foo()
f.next() // {value: "a", done: false}
f.next() // {value: "b", done: false}
f.next() // {value: undefined, done: true}
```

可以看出，调用 `next()` 之后返回的是一个对象，其中对象中的 value 表示 field 后面表达式的结果，done 代表遍历是否结束。

## yield 表达式

yield 有个懒惰的特性，即 yield 后面的表达式如果不调用 `next()` 是不会执行的。

只有当 next 指针移动到该 yield 的时候，才会执行后面的表达式。

yield 和 return 是有不同之处的，在 Generator 中，可以定义多个 yield 表达式，但是 return 只能定义一个。并且，只要 Generator 遇到 return 就会终止遍历。

```js
function* foo() {
  yield "a"
  return "b"
  yield "c"
}

const f = foo()
f.next() // {value: 'a', done: false}
f.next() // {value: 'b', done: true}
f.next() // {value: undefined, done: true}
```

如果一个函数内部没有 yield 表达式，仍然需要调用 `next()` 之后函数才会执行。

yield 允许行内使用，但是注意要添加括号。

## next 方法

yield 是没有返回值的，它的返回值是 undefined，我们可以通过对 `next()` 传参，这个实参将作为 yield 的返回值。

```js
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i
    if(reset) i = -1
  }
}

var g = f()
g.next() // {value: 0, done: false}
g.next() // {value: 1, done: false}
g.next(true) // {value: 0, done: false}
```

上面例子中，我们使用了 next 来进行控制，那能否不使用 next 呢？

可以，我们使用 `for of` 来进行遍历。

```js
function* foo() {
  yield 1
  yield 2
  yield 3
  return 4
}

for (var v of foo()) {
  console.log(v)
}
```

值得注意的是，`for of` 会在状态为 done 的时候终止遍历，因此最后的 4 并没有输出。

## `yield*` 表达式

`yield*` 是为了解决在一个 Generator 中调用另一个 Generator 函数所提供的方法。

```js
function* foo() {
  yield 1
  yield 2
  yield* foo1()
}

// 等价于
function* foo() {
  yield 1
  yield 2
  for(let v of foo1()) {
    yield v
  }
}
```

当 `yield*` 后面的 Generator 函数中没有 return 时，作用就是 `for of` 遍历 Generator 函数，否则获取 return 的值。

```js
function* foo() {
  yield 1
  yield 2
  var value = yield* foo1()
  console.log(value)
}

function* foo1() {
  yield 4
  return 5
}

let f = foo()
f.next() // {value: 1, done: false}
f.next() // {value: 2, done: false}
f.next() // 5 {value: undefined, done: true}
```

其实 `yield*` 后面只要是可迭代元素都可以被遍历。

