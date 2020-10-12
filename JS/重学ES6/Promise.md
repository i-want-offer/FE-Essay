# Promise

Promise 是现代 Web 异步开发的重要组成部分，基本上目前所有的 Web 应用的异步开发手段都是通过 Promise 来实现的。

## 概念

所谓 Promise，就是一个容器对象，里面保存着某个未来才会结束的事件（异步事件）的结果。Promise 是一个构造函数，它有三个特点：

1.  Promise 有三个状态：pending（进行中）、fulfilled（成功）和 reject（失败），并且状态不受外部影响。
2.  状态一旦改变就无法修改，并且状态只能从 pending 到 fulfilled 或者是 pending 到 reject。
3.  Promise 一旦创建就会立即执行，不能中途取消。

## 用法

在 Promise 诞生之前，Web 应用中的异步开发主要采用的是回调函数的模式（详情可以参考 node.js 各个 API），回调函数的一大缺点就是，当我们的一个异步结果需要使用另外一个异步结果时，就会产生回调嵌套，一旦这样的嵌套多了，就会变成回调地狱，十分影响代码观感。

而 Promise 的诞生一定程度上解决了这个问题，因为 Promise 是采用链式调用的方式，并且在 Promise 返回的 Promise 对象中的 then、catch 等一系列方法都会返回一个新的 Promise 对象。

### then 方法

当 Promise 实例创建成功后，可以执行其原型上的 then 方法。then 方法接受两个参数，分别是当前 Promise 的成功回调和失败回调，并且这两个函数会自动返回一个新的 Promise 对象。

then 方法的成功回调如果返回的是一个 Promise 对象，那么只有当这个 Promise 对象状态发生改变之后，才会执行下一个 then。

### catch 方法

Promise 原型上还有一个 catch 方法，它会捕获在它链式之前的所有未被捕获的错误（一旦前面的错误被捕获，就不会执行）。

catch 只是捕获异常，catch 并不能终止当前 Promise 的链式调用。

同样的，catch 方法也会自动返回一个新的 Promise 对象，一旦显示返回一个 Promise，那么只有当这个 Promise 对象状态发生改变时，链式调用才会继续往下走。

### finally 方法

在 ES8 中新加入的方法，此方法和 then、catch 不同，它不会跟踪 Promise 的状态，即不管 Promise 最终变成了什么状态，都会执行这个方法，同时 finally 不接收任何参数。

同样的，finally 并不是链式调用的终点，它也会自动返回一个新的 Promise 对象。

## 其他 API

上述三个 API 是组成 Promise 的最基本的 API，除了这三个 API 以外，还有很多其他 API。

### all 方法

这个方法同字面意思一样，参数接收一个 Promise 数组，返回一个新的 Promise。只有当数组中的每一个元素都成功之后，Promise 的状态才会变更为 fulfilled，否则只要有一个失败，状态都会变更为 rejected。

成功之后的结果同样是返回一个数组，里面的每个元素按顺序对应着传入的 Promise 数组。

### race 方法

字面意思是竞速，参数同样是接收一个 Promise 数组，返回一个新的 Promise。数组中无论哪个元素先发生状态改变，结果就返回先完成的那个 Promise 的值。

### allSettled 方法

该方法是 ES2020 新加入的方法，参数和返回值同 `Promise.all` 一样，区别在于该方法返回值不论元素是否成功，只要执行结束，则返回最终执行的结果。