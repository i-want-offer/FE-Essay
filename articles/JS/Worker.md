# Web Worker

>   Web Worker 作为浏览器多线程技术，在页面内容不断丰富，功能日趋复杂的当下，成为缓解页面卡顿，提升应用性能的可选方案。![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f6f18e8c4ba9?w=1798&h=970&f=jpeg&s=137913)
>
>   

## 发展历史

### 简介

曾经的浏览器对于 JS 的处理模式是单线程模式，页面更新要先 **串行** 做 2 件事情。

随着 Web Worker 的发布，2 件事情可以 **并行** 完成。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f70801e59c9b?imageslim)

可以直观地联想：并行可能会 **提升执行效率**；运行任务拆分能 **减少页面卡顿**。

### 技术规范

Web Worker 属于 HTML 规范，规范文档见  [Web Workers Working Draft](https://www.w3.org/TR/workers/) ，2009 年就提出了草案。

目前，除了 ie10 以下，主流浏览器都已经得到了兼容。

### DediactedWorker 和 SharedWorker

Web Worker 规范中包括：[DedicatedWorker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) 和 [SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) 。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f7108907aefd?w=572&h=270&f=png&s=32097)

如上图所示，DedicatedWorker 简称 Worker，其线程只能与一个页面渲染进程（Render Process）进行绑定和通信，不能多 Tab 共享。DedicatedWorker 是 **最早实现并广泛支持的** Web Worker 能力。

而 SharedWorker 可以多个浏览器 Tab 中访问到同一个 Worker 实例，实现多 Tab 共享数据，共享 websocket 等，但是 [safari 放弃了 SharedWorker 支持](https://news.ycombinator.com/item?id=20190869)，因为 [webkit 引擎的技术原因](https://bugs.webkit.org/show_bug.cgi?id=116359)。如下图所示，只在 safari 5~6 中短暂支持过。

因此，社区中主要针对兼容性更好的 DedicatedWorker 进行拓展，文章后续也主要以 DedicatedWorker 进行讲解。

## 主线程和多线程

用户使用浏览器一般会打开多个页面（Tab），现代浏览器使用单独的进程渲染每个页面，以提升页面性能和稳定性，并进行操作系统级别的内存隔离。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f6f1c7fa7dc1?w=865&h=494&f=png&s=72278)

### 主线程（Main Thread）

页面中，内容渲染和用户交互主要由 Render Process 中的主线程进行管理，主线程渲染页面每一帧（Frame）。

如下图所示，会包含 5 个步骤：`JavaScript -> Style -> Layout -> Paint -> Composite`，如果 JS 的执行修改了 DOM，还会暂停 JS，插入并执行 Style 和 Layout。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f6f1ced38d08?w=1093&h=167&f=jpeg&s=12548)

我们熟知的 JS 单线程和 Event Loop，是主线程的一部分。JS 单线程的机制避免了多线程开发中的复杂场景（如竞态和死锁），但单线程的主要困扰是：主线程同步 JS 执行耗时过久时（浏览器理想帧间隔约 16ms），**会阻塞用户交互和页面渲染**。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f6f2346dece1?w=1000&h=231&f=png&s=28617)

如上图所示中，长耗时任务执行时，页面无法更新，业务发响应用户的交互事件，如果卡死太久，浏览器会抛出卡顿提示。

### 多线程

Web Worker 会创建 **操作系统级别的线程**。

>   The Worker interface spawns **real OS-level threads**. -- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

JS 多线程，是有独立于主线程的 JS 运行环境，如下图所示： Worker 线程有独立的内存空间，Message Queue，Event Loop，Call Stack 等，线程间通过 postMessage 通信。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f70826dd260b?w=2240&h=878&f=jpeg&s=178893)

多个线程可以 **并行** 运行 JS。

这里的 **并行** 区别于单线程中的 **并发**，单线程中的 **并发** 准确的说叫 **Concurrent**，如下图所示，运行时 **只有一个函数调用栈**，通过 Event Loop 实现不同 Task 的上下文切换（Context Switch），这些 Task 通过 BOM API 调起其他线程为主线程工作，但回调函数代码逻辑 **仍然由 JS 串行运行**。

Web Worker 是 JS 多线程运行技术，准确来说是 **Parallel**，其与 **Concurrent**，如下图所示，运行时 **有多个函数调用栈**，每个调用栈可以独立运行 Task，互不干扰。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f6f24b024dc2?w=1232&h=1024&f=jpeg&s=103742)

## 应用场景

讨论完主线程和多线程，我们能更好地理解 Worker 多线程的应用场景：

*   可以减少主线程卡顿
*   可能会带来性能提升

### 减少卡顿

>   目前主流显示器的刷新率为 60Hz，即一帧为 16ms，因此播放动画时建议小于 16ms，用户操作响应建议小于 100ms，页面打开到开始呈现内容建议小于 1000ms。-- 根据 Chrome 团队提出的用户感知性能模型 [RAIL](https://web.dev/rail/)。

#### 逻辑异步化

减少主线程卡顿的主要方法是逻辑异步化，比如播放动画，将同步任务拆分为多个小于 16ms 的子任务，然后在页面的每一帧前通过 `requestAnimationFrame` 按计划执行一个子任务，直到全部子任务执行完毕。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f7108b671ff6?w=1000&h=231&f=png&s=32639)

拆分同步逻辑的异步方案对大部分场景有效果，但并非一劳永逸，有以下几个问题：

*   **并非所有 JS 逻辑都可拆分**：比如数组排序，树的递归查找，图像处理算法，执行中需要维护当前状态，且调用上非线性，无法轻易拆分成子任务；

*   **可以拆分的逻辑难以把控颗粒度**：如下图所示，拆分的子任务在高性能机器上可以控制在 16ms 以内，但在性能落后的机器上就超过了 deadline。16ms 的用户感知时间并不会因为用户手上机器的差别而变化，Google 的建议是再拆小到 3～4ms；

    ![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f6f278c2fe20?w=3180&h=1486&f=jpeg&s=206393)

*   **拆分的子任务并不稳定**：对同步 JS 逻辑的拆分，需要根据业务场景寻找原子逻辑，而原子逻辑会随着业务发生变化，每次改动业务都需要去 review 原子逻辑。

#### Worker 一步到位

Worker 的多线程能力，使得同步 JS 任务拆分一步到位：**从宏观上将整个同步 JS 任务异步化**。不需要再去苦苦寻找原子逻辑，逻辑异步化的设计上也更加简单和可维护。

这给我们带来更多的想象空间，如下图所示，在浏览器主线程渲染周期内，将可能阻塞页面渲染的 JS 任务迁移到 Worker 线程中，进而减少主线程的负担，缩短渲染间隔，减少页面卡顿。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f70834155450?w=2078&h=776&f=jpeg&s=140676)

### 性能提升

Worker 多线程并不会直接带来计算性能的提升，能否提升与设备 CPU 核数和线程策略有关。

#### 多线程和 CPU 核数

CPU 的单核和多核离前端似乎有点遥远，但在页面运用多线程技术时，核数会影响线程创建策略。

进程是操作系统 **资源分配** 的基本单位，线程是操作系统 **调度 CPU** 的基本单位，操作系统对线程能占用的 CPU 计算资源有复杂的分配策略，如下图所示：

*   单核多线程通过时间切片交替执行；
*   多核多线程可在不同核中真正并行。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f7108d5e0ebc?w=3116&h=1426&f=jpeg&s=236530)

#### Worker 线程策略

一台设备上相同任务在个线程中运行的时间是一样的，如下图所示：我们将主线程 JS 任务交给新建的 Worker 线程，任务在 Worker 线程上运行并不会比原本主线程更快，而线程新建消耗和通信开销使得渲染间隔可能变得更久。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f7108d520832?w=599&h=170&f=gif&s=1739574)

在单核机器上，**计算资源是内卷的**，新建的 Worker 线程并不能为页面争取到更多的计算资源。在多核机器上，新建的 Worker 线程和主线程都能做运算，**页面总计算资源增多**，但对单词任务来说，在哪个线程上运行耗时是一样的。

真正带来性能提升的是 **多核多线程并行**。

如多个没有依赖关系的同步任务，在单线程上只能串行执行，在多核多线程中可以并行执行。

值得注意的是，目前移动设备的核心数有限，受限于功耗，移动设备 CPU 中的多核通常是大小核，所以在创建多条 Worker 线程时建议区分场景和设备。

### 把主线程还给 UI

Worker 的应用场景，本质上是把主线程的逻辑剥离，让主线程专注于 UI 渲染，这种架构设计并非 Web 独创。

安卓和 IOS 原生开发中，主线程负责 UI 工作；前端领域热门的小程序，实现原理上就是渲染和逻辑完全分离。

本该如此。

## Worker API

### 通信 API

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f6f2ac6e4917?w=1776&h=846&f=jpeg&s=138160)

如上图所示，Worker 的通信十分简单，具体可以参考 [Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)。

双向通信代码十分简单，只需要 7 行：

```js
// main.js
const worker = new Worker('./worker.js')
worker.postMessage('hello')
worker.onmessage = event => {
  console.log(event.data) // 'world'
}

// worker.js
self.onmessage = event => {
  console.log(event.data) // 'hello'
  postMessage('world')
}
```

postMessage 会在接收线程创建一个 MessageEvent，传递的数据添加到 `event.data`，再触发该事件；MessageEvent 的回调函数进入 Message Queue，成为 **待执行的宏任务**。因此 postMessage **顺序发送** 的消息，在接收线程中会 **顺序执行回调函数**。而且我们无需担心实例化 Worker 过程中 postMessage 的信息丢失问题，对此 Worker 内部机制已经处理。

Worker 事件驱动的通信 API 虽然简洁，但大多数场景下通信需要等待响应，并且多次同类型通信要匹配到各自的响应，所以业务使用一般会封装成 Promise。

### 运行环境

在 Worker 线程中运行 JS，会创建 **独立于主线程的 JS 运行环境**，称之为 **DedicatedWorkerGlobalScope**，开发者需要关注 Worker 环境和主线程环境的异同，以及 Worker 在不同浏览器中的差异。

#### Worker 环境和主线程环境的异同

Worker 是无 UI 线程，无法调用 UI 相关的 DOM/BOM API，具体可参考 MDN 的 [functions and classes available to workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers)。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f70900983673?w=582&h=380&f=png&s=76363)

上图展示了 Worker 线程和主线程的异同，它们的共同点包括：

*   包含完整的 JS 运行时，支持 ES 规范定义的语言语法和内置对象；
*   支持 XMLHTTPRequest，能独立发送网络请求和后端进行交互；
*   包含只读的 Location，指向 Worker 线程执行的 script url，可通过 url 传递参数给 Worker 环境；
*   包含只读的 Navigator，用于获取浏览器信息；
*   支持 setTimeout / setInterval 计时器，可用于实现异步逻辑；
*   支持 WebSocket 进行网络 I / O，支持 IndexDB 进行文件 I / O。

从共同点上说，Worker 线程非常强大，除了利用线程独立执行重度逻辑以外，其网络 I / O 和文件 I / O 能力给业务和技术方案带来很大的想象空间。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f6f18e8c4ba9?w=1798&h=970&f=jpeg&s=137913)

另一方面，Worker 线程运行环境和主线程的差异点有：

*   Worker 线程没有 DOM API，无法新建和操作 DOM，也无法访问到主线程的 DOM Element；
*   Worker 线程和主线程内存独立，Worker 线程无法访问页面上的全局变量（window，document等）和 JS 函数；
*   Worker 线程不能调用 `alert()` 和 `confirm()` 等 UI 相关的 BOM API；
*   Worker 线程被主线程控制，主线程可以新建和销毁 Worker；
*   Worker 线程可以通过 `self.close` 自行销毁。

从差一点上看，Worker 线程无法操作 UI，并受主线程控制。

#### Worker 在不同浏览器中的差异

各家浏览器实现 Worker 规范有差异，对比主线程，部分 API 功能不完备，如：

*   IE10 发送的 ajax 请求没有 referer，请求可能会被后端拒绝响应；
*   Edge18 上字符编码 / Buffer 的实现有问题。

好家伙，都是你浓眉大眼的微软系浏览器，解决这些问题得通过 polyfil。

另一方面，一些新增的 HTML 规范 API 只在较新的浏览器中得到实现，Worker 运行环境甚至主线程上没有，使用 Worker 时需要进行判断和兼容。

#### 多线程同构代码

Worker 线程不支持 DOM，这一点和 node.js 非常像，我们在使用 node.js 做前后端 ssr 时，经常会遇到调用 BOM / DOM API 的错误。

在开发 Worker 前端项目，或迁移已有业务代码到 Worker 时，可以通过构建变量区分代码逻辑，或运行时动态判断所在线程，实现同构代码在不同线程环境下运行。

## 通信速度

Worker 多线程虽然实现了 JS 的并行运行，但是也带来了额外的 **通信开销**。如下图所示，从线程 A 调用 postMessage 发送数据到线程 B，onmessage 接收到数据有时间差，这段时间差成为 **通信消耗**。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f7110db968bf?w=2044&h=1436&f=jpeg&s=250794)

在线程计算能力的前提下，要通过多线程提升更多的性能，需要尽量 **减少通信消耗**。

而且主线程 postMessage 会占用主线程同步执行，**占用时间与数据传输方式和数据规模相关**。要避免多线程通信导致的主线程卡顿，需选择合适的传输方式，并控制每个渲染周期内的数据传输规模。

#### 数据传输方式

我们先来聊聊主线程和 Worker 线程的数据传输方式。根据计算机进程模型，主线程和 Worker 进程同属一个进程，可以访问和操作进程的内存空间，但为了降低多线程并发的逻辑复杂度，部分传输方式直接隔离了线程间的内存，相当于默认加了锁。

通信方式有三种：

*   Structured Clone
*   Transfer Memory
*   Shared Array Buffer

##### Structured Clone

Structured Clone 是 postMessage 默认的通信方式，如下图所示，复制一份线程 A 的 js object 内存给到线程 B，线程 B 能获取和操作新复制的内存。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f6f3aefe63d0?w=2064&h=872&f=jpeg&s=102781)

Structured Clone 通过复制内存的方式简单有效的隔离了不同线程的内存，避免冲突；且传输的 object 数据结构很灵活，但复制过程中，线程 A 要 **同步执行** Object Serialization，线程 B 要 **同步执行** Object Deserialization，如果 object 规模过大，会占用大量的线程时间。

##### Transfer Memory

Transfer Memory 意味着转移内存，它不需要序列化和反序列化，能大大减少传输过程占用的线程时间。如下图所示，线程 A 将制定内存的所有权和操作权转交给线程 B，但转然后线程 A 无法在访问这块内存。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f72314b8f2a4?w=2116&h=596&f=jpeg&s=77524)

Transfer Memory **以失去控制权来换取高效传输**，通过内存独占给多线程并发加锁，但只能转让 ArrayBuffer 等大小规整的二进制数据，对矩阵数据（比如 RGB图片）比较适用，实践上要考虑从 js object 生成二进制数据的运算成本。

##### Shared Array Buffers

Shared Array Buffers 是共享内存，线程 A 和线程 B 可以 **同时访问和操作** 同一块内存空间，数据都共享了，也就没什么传输的事了。

![img](https://camo.githubusercontent.com/aadeaa40a12a94c7a1da8dc1cf41f7661e5d83f8/68747470733a2f2f636e746368656e2e6769746875622e696f2f696d672f776f726b65722d7265766965772f7368617265642d61727261792d6275666665722e6a7067)

但多个并行的线程共享内存，会产生竞争问题，不像前两种传输方式默认加锁，Shared Array Buffers 把难题抛给了开发者，开发者可以用 [Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) 来维护这块共享的内存。作为较新的传输方式，浏览器兼容性可想而知，目前[只有 Chrome 68+ 支持](https://caniuse.com/#search=sharedarray)。

##### 传输方式小结

*   **全浏览器兼容的 Structured Clone 是较好的选择**，但要考虑数据传输的规模，下文我们会详细展开；
*   Transfer Memory 兼容性也不错（IE11+），但数据独占和数据类型的限制，使得它是特定场景的最优解，而不是常规解；
*   Shared Array Buffers 当下糟糕的兼容性和线程锁的开发成本，建议先暗中观察。

#### 数据传输规模

Structured Clone 的序列化和反序列化执行耗时 **主要受数据对象复杂度影响**，这很好理解，因为序列化和反序列化至少要以某种方式遍历对象。数据对象的复杂度本身难易度量，可以用序列化后的数据规模作为参考。

2015 年的 [How fast are web workers](https://hacks.mozilla.org/2015/07/how-fast-are-web-workers/) 在**中等性能手机**上进行了测试: postMessage 发送数组的通信速率为 80KB/ms，相当于理想渲染周期(16ms)内发送 1300KB。

2019 年 Surma 对 postMessage 的数据传输能力进行了更深入研究，具体见 [Is postMessage slow](https://dassur.ma/things/is-postmessage-slow/)。**高性能机器（macbook）** 上的测试结果如下图所示：

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f6f47090c2cd?w=1736&h=1722&f=jpeg&s=247745)

其中：

*   测试数据为嵌套层数 1 到 6 层（payload depth，图中纵坐标），每层节点的子节点 1 到 6 个（payload breadth，图中横坐标）的对象，**数据规模从 10B 到 10MB**
*   在 MacBook 上，10MB 的数据传递耗时 47ms，16ms 内可以传递 1MB 级别的数据

**低性能机器（nokia2）**上的测试结果如下：

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f711418eccc6?w=1710&h=1738&f=jpeg&s=797694)

其中：

*   在 nokia2 上传输 10MB 数据的耗时是 638ms，16ms 内可以传递 10KB 级别的数据
*   **高性能机器和低性能机器有超过 10 倍的传输效率差距**

综上，不管用户的机器性能如何，用户对流畅的感受是一致的：前端同学的老朋友 60ms 和 100ms。

Surma 兼顾低性能机型上 postMessage 容易造成主线程卡顿，提出的数据传输规模的建议是：

*   如果 JS 代码里面不包括动画渲染（100ms），数据传输规模应该保持在 100KB 一下；
*   如果 JS 代码里面包括动画渲染（16ms），数据传输规模应该保持在 10KB 一下。

## 兼容性

兼容性是前端最关键的一点，毕竟我们无法控制用户使用哪一款浏览器的那一个版本。对 Web Worker 更是如此，因为 Worker 的多线程能力要么业务场景根本用不上，要么就是重度依赖。

从 [caniuse](https://caniuse.com/#search=Web%20Worker) 上面可以看到，Web Worker 的兼容性做的还是挺不错的。

![img](https://user-gold-cdn.xitu.io/2020/7/21/1736f6f550d0ef6f?w=2176&h=1154&f=png&s=201089)

使用 Web Worker 并非一锤子买卖，我们不止关注浏览器 Worker 能力有无，还需要关注它是否完备可用，因此可以用以下几个指标来进行评测：

*   **是否有 Worker 能力**：通过浏览器是否有 `window.Worker` 来判断
*   **能否实例化 Worker**：通过监控 `new Worker()` 是否报错来判断；
*   **能否跨线程通信**：通过测试双向通信来验证，并设置超时；
*   **首次通信耗时**：页面开始加载 Worker 脚本到首次通讯完成的耗时，该指标与 JS 资源加载时长，同步逻辑执行耗时相关。 



# Service Worker

模仿 Web Worker，利用现代浏览器支持多线程运行的机制，实现了一个独立于主线程的子线程。

## 作用

*   **离线缓存**
*   **消息推送**
*   后台数据同步
*   响应来自其他源的资源请求
*   集中接收计算成本高的数据更新，比如地理位置和陀螺仪信息，这样多个页面就可以利用同一组数据
*   在客户端运行 CoffeeScript，Less，CJS / AMD 等模块编译和依赖管理（用于开发目的）
*   后台服务钩子
*   自定义模版用于特定 URL 模式
*   性能增强，比如预取用户可能需要的资源，比如相册中后面数张照片

## 局限性

*   **https**：Service Worker 必须运行在 HTTPS 协议上，但在本地环境中 http://localhost 或者 http://127.0.0.1 也可以

*   浏览器的兼容性

    ![img](https://user-gold-cdn.xitu.io/2018/7/28/164df156c15abc42?imageslim)

    我们可以看到 IE 完全不兼容，早期的 IOS 也不兼容。

## 调试

以 Google Chrome 为例：

1.  chrome://serviceworker-internals

    ![img](https://user-gold-cdn.xitu.io/2018/7/28/164df156c2225ed3?imageslim)

2.  开发者模式的 Application

    ![img](https://user-gold-cdn.xitu.io/2018/7/28/164df156c2302e30?imageslim)

    ![img](https://user-gold-cdn.xitu.io/2018/7/28/164df156c215702d?imageslim)

## 生命周期

Service Worker 生命周期的反应：

1.  installing
2.  installed
3.  activating
4.  activated

其中，**installed** 用来缓存文件，**activated** 用来更新缓存

![img](https://user-gold-cdn.xitu.io/2018/7/28/164df156c21b6053?imageslim)

## 用法

1.  html 中

    ```js
        if ('serviceWorker' in navigator) {
           // 开始注册service workers
           navigator.serviceWorker.register('./sw-demo-cache.js', {
               scope: './'
           }).then(function (registration) {
               console.log('注册成功');
               var serviceWorker;
               if (registration.installing) {
                   serviceWorker = registration.installing;
                   console.log('安装installing');
               } else if (registration.waiting) {
                   serviceWorker = registration.waiting;
                   console.log('等待waiting');
               } else if (registration.active) {
                   serviceWorker = registration.active;
                   console.log('激活active');
               }
               console.log('=>serviceWorker:', serviceWorker);
               if (serviceWorker) {
                   console.log(serviceWorker.state);
                   serviceWorker.addEventListener('statechange', function (e) {
                       console.log('&emsp;状态变化为', e.target.state);
                   });
                    // 创建信道
                   var channel = new MessageChannel();
                   // port1留给自己
                   channel.port1.onmessage = e => {
                       console.log('main thread receive message...');
                       console.log(e);
                   }
                   console.log('给对方', window.RES_MAP);
                   // port2给对方
                   serviceWorker.postMessage(window.RES_MAP, [channel.port1]);
                   serviceWorker.addEventListener('statechange', function (e) {
                       // logState(e.target.state);
                   });
               }
           }).catch(function (error) {
               console.log('注册没有成功');
           });
       } else {
           console.log('不支持');
       }
    ```

2.  引进 sw-demo-cache.js

    ```js
    // sw
    self.addEventListener('message', ev => {
      console.log('sw receive message..');
      console.log(ev);
      fileMap = ev.data.RES_MAP;
      var arr1 = [].slice.call(fileMap); // ['a', 'b', 'c']
      // 取main thread传来的port2
      ev.ports[0].postMessage('Hi, hello too');
    });
    
    // var fs = require('fs');
    // console.log(fs);
    // 缓存
    self.addEventListener('install', function(event) {
      event.waitUntil(
        caches.open(VERSION).then(function(cache) {
          return cache.addAll([
            './index.html',
          ]);
        })
      );
    });
    
    // 缓存更新
    self.addEventListener('activate', function(event) {
      console.log('two now ready to handle fetches!');
      event.waitUntil(
        caches.keys().then(function(cacheNames) {
          return Promise.all(
            cacheNames.map(function(cacheName) {
              console.log('cacheName:', cacheName);
              // 如果当前版本和缓存版本不一致
              if (cacheName !== VERSION) {
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });
    
    // 捕获请求并返回缓存数据
    self.addEventListener('fetch', function (event) {
      try{
        event.respondWith(
            caches.match(event.request).then(function(res){
                if(res){
                    return res;
                }
                requestBackend(event);
            })
        )
      } catch {
        console.log(event);
      }
    });
    
    function requestBackend(event){
      var url = event.request.clone();
      return fetch(url).then(function(res){
          //if not a valid response send the error
          if(!res || res.status !== 200 || res.type !== 'basic'){
              return res;
          }
          var response = res.clone();
          console.log('VERSION:', VERSION);
          caches.open(VERSION).then(function(cache){
              cache.put(event.request, response);
          });
    
          return res;
      })
    }
    ```

3.  webpack 中获取文件目录，引入第三个模块 glob，递归获取打包后的文件目录

    ```js
    exports.resMap = function () {
        var entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
        var map = {}
        entryFiles.forEach((filePath) => {
            var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
            map[filename] = filePath;
        })
        var entryFiles2 = glob.sync(PAGE_PATH2 + '/*')
        var map2 = {}
        findPath(entryFiles2, map2);
        console.log('map2', map2);
        return map2;
    };
    
    
    function findPath(entryFiles2, map2) {
        entryFiles2.forEach(filePath => {
            var filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
            if (filePath.indexOf('.') <= 0) {
                let pathRes = path.resolve(__dirname, filePath);
                let files = glob.sync(pathRes + '/*');
                findPath(files, map2);
                map2[filename] = filePath;
            }
            map2[filename] = filePath;
        });
    }
    ```

4.  **导出目录**：通过 webpack 的 DefinePlugin 插件，导出上一步获取的目录

5.  **Web 和 Service Worker 的通信**：通过 postMessage 实现 Web 和 Service Worker 间的通信

```js
// 创建信道
var channel = new MessageChannel();
	// port1留给自己
channel.port1.onmessage = e => {
	console.log('main thread receive message...');
  console.log(e);
}
console.log('给对方', window.RES_MAP);
// port2给对方
serviceWorker.postMessage(window.RES_MAP, [channel.port1]);
serviceWorker.addEventListener('statechange', function (e) {
	// logState(e.target.state);
});
```

```js
// sw
self.addEventListener('message', ev => {
  console.log('sw receive message..');
  console.log(ev);
  fileMap = ev.data.RES_MAP;
  var arr1 = [].slice.call(fileMap); // ['a', 'b', 'c']
  // 取main thread传来的port2
  ev.ports[0].postMessage('Hi, hello too');
});
```

