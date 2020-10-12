# Async 和 Await

async 是 ES7 提出的新特性，是 Generator 的语法糖。既然是语法糖，那我们首先说一下它的改进之处。

## Async 对 Generator 的改进之处

### 写法改进

```js
// Generator
function* foo() {
  yield 'b'
}

// Async Await
async function foo() {
  await 'b'
}
```

对比发现，async 函数在写法上将 Generator 的星号替换成 async 关键字，yield 关键字替换为 await，更符合异步编程语义化。

### 内置执行器

Generator 函数必须依靠执行器，而 async 函数自带执行器。所以 async 函数不用像 Generator 函数一样要用 next 方法才会执行，完全可以和普通函数一样。

### 更好的实用性

co 模块约定，yield 命令后面只能是 Thunk 函数或者是 Promise 对象，而 async 函数的 await 后面可以是任意类型的值，并且会将后面的值转换成为一个立即执行 resolved 的 Promise 对象。

### 返回值为 Promise

async 函数的返回值是一个 Promise 对象，可以用 then 方法；Generator 函数返回的是一个 Iterator 对象。

## Async 基本用法

async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数。当函数执行的时候，一旦遇到 await 就会先返回，等到一步操作完成，再接着执行函数体内后面的语句，并且 await 必须在 async 函数内，不然会报错。

async 函数中的返回值会成为返回的 Promise 对象中 resolve 的值；当 async 函数中抛出一个错误的时候，会成为返回 Promise 对象中 reject 的值。

## Await 表达式

await 语句后面跟随的是一个 thenable 对象（即包含 then 的对象，类 Promise 对象），此时 await 会把他们当成是一个标准的 Promise 来处理，并且返回该 Promise resolved 的值。如果是基本数据类型的话，则会直接返回这个值。

当 await 后面的 Promise 抛出一个错误时，此时会直接跳出 async 函数并被 async 函数的 catch 捕获。如果想要不中断 async 函数继续执行的话，可以尝试在内部对 await 用 try catch 包裹起来。