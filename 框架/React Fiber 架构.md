# React 理念

我们可以从 [官网](https://zh-hans.reactjs.org/docs/thinking-in-react.html) 看到 React 的理念：

>   我们认为，React 是用 JavaScript **构建快速响应** 的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

那么该如何理解 **快速响应**？可以从两个角度来看：

*   速度快
*   响应自然

React 是如何实现这两点的呢？

## 理解 *速度快*

每当聊到一款前端框架，拉出来比比渲染速度成了老生常谈。

>   [这里](https://stefankrause.net/js-frameworks-benchmark8/table.html) 提供了各种框架渲染速度的对比

我们经常用的前端三大框架指 React、Vue 和 Angular。想比如使用模版语法的 Vue、Angular，使用原生js（JSX 是 js 的语法糖）开发 UI 的 React 在语法层面有更多的灵活性。

然而，高灵活性意味着高不确定性，考虑如下的 Vue 模版语句：

```vue
<template>
  <ul>
    <li>0</li>
    <li>{{name}}</li>
    <li>2</li>
    <li>3</li>
  </ul>
</template>
```

当编译的时候，由于模版语法的约束，Vue 可以明确知道在 li 中，只有 name 是变量，这可以提供一些优化线索。

而在 React 中，以上代码可以写成如下 JSX：

```jsx
function App({name}) {
  const children = []
  for(let i = 0; i < 4; i++) {
    children.push(<li>{i === 1 ? name : i}</li>)
  }
  return <ul>{children}</ul>
}
```

由于语法的灵活，在编译时无法区分可能变化的部分。所以在运行时，React 需要遍历每个 li，判断其数据是否更新。

基于以上原因，相比于 Vue、Angular，缺少编译时优化手段的 React 为了 **速度快** 需要在运行时做出更多努力。

比如：

*   使用 PureComponent 或 `React.memo` 构建组件
*   使用 shouldComponentUpdate 生命周期钩子
*   渲染列表时使用 key
*   使用 useCallback 和 useMemo 缓存函数和变量

由开发者显示告诉 React 哪些组件不需要重复计算、可以复用。

## 理解 *响应自然*

该如何理解 *响应自然*？React给出的答案是 [将人机交互研究的结果整合到真实的 UI 中](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html#putting-research-into-production) 。

设想以下场景：

![搜索框](https://react.iamkasong.com/img/searchbox.gif)

有一个地址搜索框，在输入字符时会实时显示地址匹配结果。

当用户输入过快时，在输入字符时可能会变得不是那么流畅。这是由于下拉列表的更新会阻塞线程，我们一般是通过 **防抖** 或 **节流** 来减少输入内容时触发回调的次数来解决这个问题。

但这只是治标不治本，只要组件更新操作是同步的，那么当更新开始到渲染完毕前，组件中总会有一定数量的工作占用线程，浏览器没有空闲时间绘制 UI，造成卡顿。

>   React核心团队成员Dan在介绍React为什么会异步（[Concurrent Mode](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html )）更新组件时说： 
>
>   ![Dan关于用户体验的思考](https://react.iamkasong.com/img/update.png)

让我们从 *响应自然* 的角度考虑：当输入字符时，用户是否在意下拉框能一瞬间更新？

事实是：并不在意。

如果我们能稍稍延迟下拉更新的时间，为浏览器留出时间渲染 UI，让输入不卡顿。这样的体验是 **更自然的**。

为了实现这个目标，需要将 **同步的更新** 变为 **可中断的异步更新**。

在浏览器每一帧的时间中，预留一些时间给JS线程，React 利用这部分时间更新组件（可以看到，在源码中预留的初始时间是 5ms）。

当预留时间不够用时，React 将线程控制权交还给浏览器时期有时间渲染 UI，React 则等待下一帧时间到来继续被中断的工作。

## 总结

通过以上内容，我们可以看到 React 为了践行 **构建快速响应的大型 Web 应用程序** 理念做出努力。

这些优化手段可以在现有架构上增加，而有些（如：异步可中断更新）只能重构整个架构去实现。

最后再让我们看看，Dan回答网友关于`React`发展方向的提问：

![用户向Dan提问](https://react.iamkasong.com/img/ques1.png) ![Dan回答](https://react.iamkasong.com/img/ans1.png)

相比于新增 feature，React 更在意底层抽象的表现力。结合理念，相信你已经明白这意味着什么了。



# 旧版 React 架构

React15 架构可以分成两层：

*   Reconciler（协调器）：负责找出变化的组件
*   Renderer（渲染器）：入则将变化的组件渲染到页面上

## React15架构

### Reconciler（协调器）

我们知道，在 React 中可以通过 `this.setState`、`this.forceUpdate`、`ReactDOM.render` 等 API 触发更新。

每当有更新发生时，Reconciler 会做如下工作：

1.  调用函数组件、class组件的 render 方法，将返回的 JSX 转化为虚拟DOM；
2.  将虚拟DOM和上次更新时的虚拟DOM对比；
3.  通过对比找出本次更新中变化的虚拟DOM；
4.  通知 Renderer 将变化的虚拟DOM渲染到页面上。

>   你可以在 [这里](https://zh-hans.reactjs.org/docs/codebase-overview.html#reconcilers) 看到`React`官方对**Reconciler**的解释

### Renderer（渲染器）

由于 React 支持跨平台，所以不同平台有不同的 Renderer。我们前端最熟悉的是负责在浏览器环境渲染的 Renderer -- [ReactDOM](https://www.npmjs.com/package/react-dom)

除此之外，还有：

*   ReactNative 渲染器：渲染原生 App 组件；
*   ReactTest 渲染器：渲染出纯js对象用于测试；
*   ReactArt 渲染器：渲染到 Canvas、SVG 或 VML（IE8）。

在每次更新发生时，Renderer 接到 Reconciler 通知，将变化的组件渲染在当前宿主环境。

>   你可以在 [这里](https://zh-hans.reactjs.org/docs/codebase-overview.html#renderers) 看到`React`官方对**Renderer**的解释

## React15架构的缺点

在 Reconciler 中，mount 的组件会调用 mountComponent，update 的组件会调用 updateComponent，这两个方法都会递归更新子组件。

### 递归更新的缺点

主流的浏览器刷新频率为 60HZ，即每（1000ms / 60HZ）16.6ms 浏览器刷新一次。我们知道，JS 可以操作 DOM，GUI渲染线程和 JS线程是互斥的。所以 **JS脚本执行** 和 **浏览器布局、绘制** 是不能同时执行的。

在每 16.6ms 时间内，需要完成以下工作：

```js
// JS脚本执行 ------ 样式布局 ------ 样式绘制 
```

当 JS 执行时间过长，超出了 16.6ms，这次刷新就没有时间执行 **样式布局** 和 **样式绘制** 了。

对于用户在输入框输入内容这种行为来说，就体现为按下了键盘按键但是页面上不实时显示输入。

对于 React 的更新来说，由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过 16ms，用户交互就会卡顿。

在上一节中，我们已经提出了解决方案：**用中断的异步更新代替同步更新**。那么，React15的架构支持异步更新吗？

我用红色标注了更新的步骤。

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200911221346.png)

我们可以看到，Reconciler 和 Renderer 交替工作，当第一个 li 在页面上已经变化后，第二个 li 再进入 Reconciler。

由于整个过程都是同步的，所以在用户看来所有 DOM 是同步更新的。

让我们看看在 React15 架构中如果中途中断更新会怎么样？

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200911221818.png)

当第一个 li 完成更新时中断更新，即步骤3完成后中断更新，此时后面的步骤都还未执行。

用户本来期望 123 变为 245，实际却看到的是更新不完全的 DOM（223）。

基于这个原因，React 决定重写整个架构。



# 新版 React 架构

React16架构可以分为三层：

*   Scheduler（调度器）：调度任务的优先级，高优先级先进入 Reconciler
*   Reconciler（协调器）：负责找出变化的组件
*   Renderer（渲染器）：负责将变化的组件渲染到页面上

可以看到，对比 React15，React16中新增了 **Scheduler（调度器）**。

## Scheduler（调度器）

既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间是通知我们。

其实部分浏览器已经实现了这个 API，这就是 [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback) 。但由于以下因素，React 放弃使用：

*   浏览器兼容性
*   触发频率不稳定，受很多因素影响。比如当我们浏览器切换 tab 后，之前 tab 注册的 requestIdleCallback 出发的频率会变得很低

基于以上原因，React 决定实现功能更完备的 requestIdleCallback polyfill，这就是 **Scheduler**。除了在空闲时触发回调的功能外，Scheduler 还提供了多种调度优先级供任务设置。

>   [Scheduler](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/README.md) 是独立于`React`的库

## Reconciler（协调器）

我们知道，在 React15 中 Reconciler 是递归处理虚拟DOM的，那我们看看React16的 Reconciler。

我们可以看见，更新工作从递归变成了可以中断的循环过程。每次循环都会调用 shouldYield 判断当前是否有剩余时间。

```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

那么React16是如何解决中断更新时 DOM 渲染不完全的问题呢？

在 React 中，Reconciler 和 Renderer 不再是交替工作。当 Scheduler 将任务交给 Reconciler 后，Reconciler 会将变化的虚拟DOM打上代表增 / 删 / 更新的标记，类似这样：

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

>   全部的标记见 [这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)

整个 Scheduler 与 Reconciler 的工作都在内存中进行。只有当所有组件都完成 Reconciler 的工作，才会统一交给 Renderer/

>   你可以在 [这里](https://zh-hans.reactjs.org/docs/codebase-overview.html#fiber-reconciler) 看到 React 官方对React16新**Reconciler**的解释

## Renderer（渲染器）

Renderer 根据 Reconciler 为虚拟DOM打的标记，同步执行对应的 DOM 操作。

在 React16 架构中整个更新流程为：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200912095755.png)

其中红框中的步骤随时可能由以下的原因被中断：

*   有其他更高优先级的任务需要先执行
*   当前帧每有剩余时间

由于红框中的工作都在内存中进行，不会更新页面上的 DOM，所以即使反复中断，用户也不会看见更新不完全的 DOM。

>   事实上，由于 **Scheduler** 和 **Reconciler** 都是平台无关的，所以 React 为他们单独发了一个包 [react-reconciler](https://www.npmjs.com/package/react-reconciler) 。你可以用这个包自己实现一个 ReactDOM。



# Fiber架构

## 心智模型

React 核心团队成员 [Sebastian Markbåge](https://github.com/sebmarkbage/) （React Hooks 的发明者）曾说过：“我们在 React 中做的就是践行 **代数效应（Algebraic Effects）**。”

那么，什么是代数效应？它和 React 有什么关系呢？

### 什么是代数效应

代数效应是函数式编程的一个概念，用于将副作用从函数调用中分离。

接下来我们用伪代码来解释。

假设我们有一个函数 getTotalPicNum，传入 2个用户名称后，分别查找该用户在平台保存的图片数量，最后将图片数量相加后返回。

```js
function getTotalPicNum(user1, user2) {
  const num1 = getPicNum(user1);
  const num2 = getPicNum(user2);

  return picNum1 + picNum2;
}
```

在 getTotalPicNum 中，我们不关注 getPicNum 的实现，只在乎 **获取到两个数字后将他们想家的结果的返回** 这一过程。

接下来我们来实现 getPicNum。

*用户在平台保存的图片数量* 是保存在服务器中的，所以为了获取该值，我们需要发起异步请求。

为了尽量保持 getTotalPicNum 的调用方式不变，我们首先想到使用 `async / awiat`：

```js
async function getTotalPicNum(user1, user2) {
  const num1 = await getPicNum(user1);
  const num2 = await getPicNum(user2);

  return picNum1 + picNum2;
}
```

但是 `async / await` 是有 **传染性** 的：当一个函数变为 async 后，这意味着调用它的函数也需要变为 async，这就破坏了 getTotalPicNum 的同步特性。

有没有什么办法可以保持 getTotalNum 保持现有调用方式不变的情况下实现异步请求呢？

没有，不过我们可以 **虚构** 一个。

我们虚构一个类似于 **try...catch** 的语法 **try...handle** 与两个操作符 `perform`、`resume`。

```js
function getPicNum(name) {
  const picNum = perform name;
  return picNum;
}

try {
  getTotalPicNum('kaSong', 'xiaoMing');
} handle (who) {
  switch (who) {
    case 'kaSong':
      resume with 230;
    case 'xiaoMing':
      resume with 122;
    default:
      resume with 0;
  }
}
```

当执行到 getTotalPicNum 内部的 getPicNum 方法时，会执行 `perform name`。

此时函数调用栈会从 getPicNum 方法内跳出，被最近一个 `try...handle` 捕获。类似 `throw Error` 后被最近一个 `try...catch` 捕获。

类似于 `throw Error` 后 Error 会作为 catch 的参数，`perform name` 后 name 会作为 handle 的参数。

但与 `try...catch ` 最大的不同在于：当 Error 被 catch 捕获后，之前的调用栈就被销毁了。而 handle 执行 resume 后会回到之前 perform 的调用栈。

对于 `case 'kaSong'`，执行完 `resume with 230;` 后调用栈会回到 `getPicNum`，此时`picNum === 230`

>   **注意**
>
>   再次申明，`try...handle` 的语法是虚构的，只是为了演示 `代数效应` 的思想。

总结一下：**代数效应** 能够将 **副作用**（例子中为 `请求图片数量`）从函数逻辑中分离，使函数关注点保持纯粹。

并且，从例子中可以看出，**perform resume** 不需要区分同步异步。

### 代数效应在 React 中的应用

那么 **代数效应** 与 **React** 有什么关系呢？最明显的例子就是 **Hooks**。

对于类似 `useState`、`useReducer`、`useRef` 这样的 Hook，我们不需要关注函数组件的 state 在 Hook 中是如何保存的，React 会为我们处理。

我们只需要假设 useState 返回的是我们想要的 state，并编写业务逻辑就行。

```jsx
function App() {
  const [num, updateNum] = useState(0);
  
  return (
    <button onClick={() => updateNum(num => num + 1)}>{num}</button>  
  )
}
```

如果这个例子还不够明显，可以看看官方的 [Suspense Demo](https://codesandbox.io/s/frosty-hermann-bztrp?file=/src/index.js:152-160)

在 Demo 中 `ProfileDetails` 用于展示 `用户名称`。而 `用户名称` 是 `异步请求` 的。

但是 `Demo` 中完全是 `同步` 的写法。

```jsx
function ProfileDetails() {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

### 代数效应与 Generator

从 React15 到 React16，协调器（Reconciler）重构的一大目的是：将老的同步更新的架构变为 **异步可中断更新**。

异步可中断更新可以理解为：更新在执行过程中可能会被打断（浏览器时间分片用尽或有更高优先级任务插队），当可以继续执行时恢复之前执行的中间状态。

这就是代数效应中 `try...handle` 的作用。

其实浏览器原生就支持类似的实现，这就是 Generator。

但是 Generator 的一些缺陷使 React 团队放弃了它：

*   类似 async、Generator 也是具有传染性的，使用了 Generator 则上下文的其他函数也需要做出改变，这样心智负担比较重；
*   Generator 执行的 **中间状态** 是上下文关联的。

考虑如下例子：

```js
function* doWork(A, B, C) {
  var x = doExpensiveWorkA(A);
  yield;
  var y = x + doExpensiveWorkB(B);
  yield;
  var z = y + doExpensiveWorkC(C);
  return z;
}
```

每当浏览器有空闲时间都会一次执行其中一个 doExpensiveWork，当时间用尽则会中断，当再次恢复时会从中断位置继续执行。

只考虑 *单一优先级任务的中断和继续* 情况下，Generator 可以很好的实现异步可中断更新。

但是当我们考虑到 *高优先级任务插队* 的情况，如果此时已经完成 doExpensiveWorkA 与 doExpensiveWorkB 计算出 x 与 y。

此时 B 组件接收到一个高优先级更新，由于 Generator 执行的中间状态是上下文关联的，所以计算 y 时无法复用之前已经计算出的 x，需要重新计算。

如果通过全局变量保存之前执行的中间状态，又会引入新的复杂度。

>   更详细的解释可以参考 [这个issue](https://github.com/facebook/react/issues/7942#issuecomment-254987818)

基于这些原因，React 没有采用 Generator 实现协调器。

## 实现原理

在新的架构中，我们提到的虚拟DOM在 React 中有一个正式的称呼：Fiber，所以后续文章会用 Fiber 替代 React16 虚拟DOM。

### Fiber 的含义

Fiber 的含义包含三层：

1.  作为架构来说，之前 React15 的 Reconciler 采用递归的方式执行，数据保存在递归调用栈中，所以被称为 **Stack Reconciler**。React16 的 Reconciler 基于 Fiber Node 实现，被称为 **Fiber Reconciler**。
2.  作为静态的数据结构来说，每个 Fiber 节点对应一个 React Element，保存了该组件的类型（函数组件/类组件/原生组件）、对应的 DOM 节点信息。
3.  作为动态的工作单元，每个 Fiber 节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除、被插入页面中、被更新...）。

### Fiber 的结构

我们可以从这里看到 [Fiber节点的属性定义](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117) 。虽然属性很多，但我们可以按三层含义将他们分类来看：

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

#### 作为架构来说

每个 Fiber 节点都有个对应的 React Element，多个 Fiber 节点是如何连接形成树呢？靠如下三个属性：

```js
// 指向父级Fiber节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```

举个例子，如下的组件结构：

```jsx
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  )
}
```

对应的 Fiber树 结构：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200912103815.png)

>   这里需要提一下，为什么父级指针叫 return 而不是 parent 或者 father？因为作为一个工作单元，return 指节点执行完 completeWork 后会返回的下一个节点。子 Fiber 节点以及兄弟节点完成工作后会返回其父级节点，所以用 return 指代父级节点。

#### 作为静态的数据结构

作为一种静态的数据结构，保存了组件相关的信息：

```js
// Fiber对应组件的类型 Function/Class/Host...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```

#### 作为动态的工作单元

作为动态的工作单元，Fiber 中如下参数保存了本次更新相关的信息。

```js
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```

如下两个字段保存调度优先级相关信息。

```js
// 调度优先级相关
this.lanes = NoLanes;
this.childLanes = NoLanes;
```

## 工作原理

我们了解了 Fiber 是什么，知道 Fiber 节点可以保存对应的 DOM 节点。

相应的，Fiber 节点构成的 Fiber 树就对应 DOM树。

在更新 DOM 方面，就需要用到被称为 **双缓存** 的技术。

### 什么是双缓存

当我们用 canvas 绘制动画，每一帧会之前都会调用 `ctx.clearRect` 清楚上一帧的画面。

如果当前帧画面计算量比较大，导致清楚上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。

为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换件的计算时间，不会出现从白屏到出现画面的闪烁情况。

这种 **在内存中构建并直接替换** 的技术叫做双缓存。

React 使用双缓存来完成 Fiber 树的构建和替换：对应着 DOM 树的创建与更新。

### 双缓存 Fiber 树

在 React 中最多会同时存在两棵 Fiber 树。当前屏幕上显示内容对应的 Fiber 树被称为 current Fiber 树，正在内存中构建的 Fiber 树被称为 workInProgress Fiber 树。

current Fiber 树中的 Fiber 节点被称为 current fiber，workInProgress Fiber 树中的 Fiber 节点被称为 workInProgress fiber，它们通过 alternate 属性链接。

React 应用的根节点通过 current 指针在不同 Fiber 树的 rootFiber 间切换来实现 Fiber 树的切换。

当 workInProgress Fiber 树构建完成交给 Renderer 渲染在页面上后，应用根节点的 current 指针指向 workInProgress Fiber 树，此时 workInProgress Fiber 树就变为 current Fiber 树。

每次状态更新都会产生新的 workInProgress Fiber 树，通过 current 与 workInProgress 的替换，完成 DOM 更新。

接下来我们以具体例子讲解 mount时、update时的构建 / 替换流程。

### mount 时

考虑如下例子：

```jsx
function App() {
  const [num, add] = useState(0);
  return (
    <p onClick={() => add(num + 1)}>{num}</p>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

1.  首次执行 `ReactDOM.render` 会创建 fiberRootNode（源码中叫 fiberRoot）和 rootFiber。其中 fiberRootNode 是整个应用的根节点，rootFiber 是当前 `<App/>` 所在组件树的根节点。

    之所以要区分 fiberRootNode 和 rootFiber，是因为在应用中我们可以多次调用 `ReactDOM.render` 渲染不同的组件树，他们会拥有不同的 rootFiber。但是整个应用的根节点只有一个，那就是 fiberRootNode。

    fiberRootNode 的 current 会指向当前页面上已渲染内容对应的 Fiber树，即 current Fiber 树。

    ![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200912111151.png)

    由于是首屏渲染，页面中还没有挂在任何 DOM，所以 `fiberRootNode.current` 指向的 rootFiber 没有任何子 Fiber 节点（即 current Fiber 树为空）。

2.  接下来进入 render 阶段，根据组件返回的 JSX 在内存中一次创建 Fiber 节点并连接在一起构建 Fiber 树，被称为 workInProgress Fiber 树。（下图中右侧为内存中构建的树，左侧为页面显示的树）。

    在构建 workInProgress Fiber 树时会尝试服用 current Fiber 树中已有的 Fiber 节点内的属性，在首屏渲染时只有 rootFiber 存在对应的 current fiber（即 `rootFiber.alternate`）。

    ![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200912111513.png)

3.  图中右侧已构建完的 workInProgress Fiber 树在 commit 阶段渲染到页面。

    此时 DOM 更新为右侧树对应的样子，fiberRootNode 的 current 指针指向 workInProgress Fiber 树使其变为 current Fiber 树。

    ![image-20200912111711207](../../../Library/Application Support/typora-user-images/image-20200912111711207.png)

### update 时

1.  当我们出发状态改变时，这会开启一次新的 render 阶段，并构建一棵新的 workInProgress Fiber 树。

    ![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200912115805.png)

    和 mount 时一样，workInProgress Fiber 的创建可以复用 current Fiber 对应的节点数据。

    >   这个决定是否复用的过程就是 diff 算法。

2.  workInProgress Fiber 树在 render 阶段完成构建后进入 commit 阶段渲染到页面上。渲染完毕后，workInProgress Fiber 树变为 current Fiber 树。

    ![image-20200912163912610](../../../Library/Application Support/typora-user-images/image-20200912163912610.png)

