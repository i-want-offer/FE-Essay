# Event Loop

## 为什么会有 Event Loop

简单来说 Event Loop 通过将请求分发到别的地方，使得 Node.js 能够实现非阻塞（non-blocking）I/O 操作。



## Event Loop 工作原理

流程是这样的，你执行 `node index.js` 或者 `npm start` 之类的操作启动服务，所有的同步代码都会被执行，然后判断是否有 Active handle，如果没有就会停止。

```javascript
// index.js  执行完成之后立马停止
console.log('Hello world')

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello world'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// 这里运行的 app.listen 就是一个 active handle，有这个存在就相当于 Node.js 有理由继续运行下去，这样我们就进入了 Event Loop
```

Event Loop 包含了一系列阶段（phase），每个阶段都是只执行属于自己的任务（task）和微任务（micro task），这些阶段依次为：

1.  **timer（定时器）**
2.  pending callbacks（待定回调）
3.  idle，prepare
4.  **poll（轮询）**
5.  **check（检测）**
6.  close callbacks（关闭回调）

执行顺序是：

1.  输入数据阶段（incoming data）
2.  轮询阶段（poll）
3.  检查阶段（check）
4.  关闭事件回调阶段（close callbacks）
5.  定时器检测阶段（timer）
6.  I / O 事件回调阶段（I / O callbacks）
7.  闲置阶段（idle，prepare）
8.  轮询阶段



### timer

当你使用 `setTimeout` 和 `setInterval` 的时候，传入的回调函数就是在这个阶段执行。

```js
setTimeout(function () {
  console.log('Hello world') // 这一行在 timer 阶段执行
}, 1000)
```

### check

和 timer 阶段类似，当你使用 `setImmediate ` 函数的时候，传入的函数回调就是在 check 阶段执行。

```js
setImmediate(function () {
  console.log('Hello world') // 这一行在 check 阶段执行
})
```

### poll

poll 阶段基本涵盖了其余所有情况，你写的大部分回调，如果不是上面两种（排除 micro task），那基本上就是在 poll 阶段执行了。

```js
// io 回调
fs.readFile('index.html', 'utf8', function(err, data) {
  console.log('Hello world') // 在 poll 阶段执行
})

// http 回调
http.request('http://example.com', function(res) {
  res.on('data', function() {})
  res.on('end', function() {
    console.log('Hello world') // 在 poll 阶段执行
  })
}).end()
```

![Node.js 事件循环](https://user-gold-cdn.xitu.io/2019/8/23/16cbe07b01fc55da?imageslim)

### Microtask

我们可以想象每个阶段都有三个队列：

1.  这个阶段同步任务队列
2.  这个阶段 `process.nextTick` 队列
3.  这个阶段 Promise 队列

Node.js 会采用先进先出的方式处理该阶段的任务，当所有同步任务都处理完毕后，会先清空 `process.nextTick` 队列，然后是 Promise 队列。如果在某一阶段一直递归调用 `process.nextTick`，会导致主线程一直停留在该阶段，表现类似于`while(true)`

![微任务](https://user-gold-cdn.xitu.io/2019/8/23/16cbe07b037f976e?imageslim)



## libuv 线程池和内核

总结以上得出，其实 Event Loop 就是我们认为的 Node.js 的单线程，也就是 main thread，负责分发任务和执行 js 代码。那当我们发起 I/O 请求的时候，那是由谁来负责执行呢？

所有调用操作系统的接口，都是由 Node.js 调用 libuv 的 API 实现的，其中我们可以将这些异步的 Node.js API 分为两类：

1.  直接用内核（Kernel）的异步方法；
2.  使用线程池（Thread pool）来模拟异步。

![异步任务分类](https://user-gold-cdn.xitu.io/2019/8/23/16cbe07b038d14b4?imageslim)

举例来说，我们使用的 http 模块就是使用 kernel async 的方式，这种异步方式由内核直接实现，多个请求之间不会有明显的时间间隔。

加密算法是一个很好费计算的操作，由 libuv 线程池来模拟异步，线程池默认只有 4 个线程，所以当我们同事调用 6 个加密操作，后面 2 个就会被前面 4 个 block。

有些特殊情况，比如 `fs.readFile`，尽管官方文档说了也是使用 libuv 线程池，但是实际情况似乎并非如此，似乎 Node.js 在此做了 partition。