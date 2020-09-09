# Diff 的瓶颈以及 React 的应对

由于 diff 操作本身会带来性能上的损耗，在 React 文档中提到过，即使最先进的算法中，将前后两棵树完全比对的算法复杂度为`O(n3)`，其中 n 为树中元素的数量。

如果 React 使用了该算法，那么仅仅一千个元素的页面所需要执行的计算量就是十亿的量级，这无疑是无法接受的。

为了降低算法的复杂度，React 的 diff 会预设三个限制：

1.  只对同级元素进行 diff 比对。如果一个元素节点在前后两次更新中跨越了层级，那么 React 不会尝试复用它
2.  两个不同类型的元素会产生出不同的树。如果元素由 div 变成 p，React 会销毁 div 及其子孙节点，并新建 p 及其子孙节点
3.  开发者可以通过 key 来暗示哪些子元素在不同的渲染下能保持稳定



# React 中 key 的作用

```html
<!-- 更新前 -->
<div>
  <p key="ka">ka</p>
  <h3 key="song">song</he>
</div>

<!-- 更新后 -->
<div>
  <h3 key="song">song</h3>
  <p key="ka">ka</p>
</div>
```

如果没有 key，React 会认为 div 的第一个子节点由 p 变成 h3，第二个子节点由 h3 变成 p，则会销毁这两个节点并重新构造。

但是当我们用 key 指明了节点前后对应关系后，React 知道 `key === "ka"` 的 p 更新后还在，所以可以复用该节点，只需要交换顺序。

key 是 React 用来追踪哪些列表元素被修改、被添加或者被移除的辅助标志。

在开发过程中，我们需要保证某个元素的 key 在其同级元素中具有唯一性。在 React diff 算法中，React 会借助元素的 Key 值来判断该元素是新近创建的还是被移动而来的元素，从而减少不必要的元素重新渲染。同时，React 还需要借助 key 来判断元素与本地状态的关联关系。



# 调用 setState 之后发生了什么

在代码中调用 setState 函数之后，React 会将传入的参数与之前的状态进行合并，然后出发所谓的调和过程（Reconciliation）。经过调和过程，React 会以相对高效的方式根据新的状态构建 React 元素树并且着手重新渲染整个 UI 界面。在 React 得到元素树之后，React 会计算出新的树和老的树之间的差异，然后根据差异对界面进行最小化重新渲染。通过 diff 算法，React 能够精确制导哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。



# React 的 setState 是同步的还是异步的

有时表现出同步，有时表现出异步

1.  setState 只有在 React 自身的合成事件和钩子函数中是异步的，在原生事件和 setTimeout 中都是同步的
2.  setState 的异步并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的异步。当然可以通过 setState 的第二个参数中的 callback 拿到更新后的结果
3.  setState 的批量更新优化也是建立在异步（合成事件、钩子函数）之上的，在原生事件和 setTimeout 中不会批量更新，在异步中如果对同一个值进行多次 setState，setState 的批量更新策略会对其进行覆盖，去最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新



# React 生命周期函数

## 挂载阶段

挂载阶段也可以理解为初始化阶段，也就是把我们的组件插入到 DOM 中。

*   constructor
*   getDerivedStateFromProps
*   ~~UNSAFE_componentWillMount~~
*   render
*   (React Updates DOM and refs)
*   componentDidMount

### constructor

组件的构造函数，第一个被执行。显式定义构造函数时，需要在第一行执行 `super(props)`，否则不能再构造函数中拿到 `this`。

在构造函数中，我们一般会做两件事：

*   初始化 state
*   对自定义方法进行 this 绑定

### getDerivedStateFromProps

是一个静态函数，所以不能在这里使用 this，也表明了 React 官方不希望调用方滥用这个生命周期函数。每当父组件引发当前组件的渲染过程时，getDerivedStateFromProps 都会被调用，这样我们有机会根据新的 props 和当前的 state 来调整一个新的 state。

这个函数会在收到新的 props，调用了 setState 或 forceUpdate 时被调用。

### render

React 最核心的方法，class 组件中必须实现的方法。

当 render 被调用时，它会检查 `this.props` 和 `this.state` 的变化并返回一下类型之一：

*   原生的 DOM，如 div
*   React 组件
*   数组或 Fragment
*   Portals（传送门）
*   字符串或数字，被渲染成文本节点
*   布尔值或 null，不会渲染任何东西

### componentDidMount

在组件挂载之后立即调用。依赖于 DOM 节点的初始化应该放在这里。如需通过网络请求获取数据，此处是实例化请求的好地方。这个方法比较适合添加订阅的地方，如果添加了订阅，请记得在卸载的时候取消订阅。

你可以在 componentDidMount 里面直接调用 setState，它将触发额外渲染，但此渲染会发生在浏览器更新屏幕之前，如此保证了即使 render 了两次，用户也不会看到中间状态。

## 更新阶段

更新阶段是指当组件的 props 发生了改变，或者组件内部调用了 setState 或者发生了 forceUpdate，这个阶段的过程包括：

*   UNSAFE_componentWillReceiveProps
*   getDerivedStateFromProps
*   sholdComponentUpdate
*   UNSAFE_componentWIllUpdate
*   render
*   getSnapshotBeforeUpdate
*   (React Updates DOM and refs)
*   componentDidUpdate

### shouldComponentUpdate

它有两个参数，根据此函数的返回值来判断是否重新进行渲染，首次渲染或者是当我们调用了 forceUpdate 时并不会触发此方法，此方法仅用于性能优化。

但是官方提倡我们使用内置的 PureComponent 而不是自己编写 shouldComponentUpdate。

### getSnapshotBeforeUpdate

这个生命周期函数发生在 render 之后，在更新之前，给了一个机会去获取 DOM 信息，计算得到并返回一个 snapshot，这个 snapshot 会作为 componentDidUpdate 第三个参数传入。

### componentDidUpdate

这个函数会在更新后被立即调用，首次渲染不会执行此方法。在这个函数中我们可以操作 DOM，可以发起请求，还可以 setState，但注意一定要用条件语句，否则会导致无限循环。

## 卸载阶段

### componentWillUnmount

这个生命周期函数会在组件卸载销毁之前被调用，我们可以在这里执行一些清除操作。不要在这里调用 setState，因为组件不会重新渲染。



# shouldComponentUpdate 的作用

shouldComponentUpdate 这个方法用来判断是否需要调用 render 方法重新描绘 DOM。因为 DOM 的描绘性能开销很大，如果可以在这个生命周期阶段做出更优化的 DOM diff 算法，可以极大地提升性能。



# React 中 ref 的作用

ref 是 React 提供的一种可以安全访问 DOM 元素或者某个组件实例的方式。

在类组件中使用 `createRef()`，在函数组件中使用 `useRef` 。





