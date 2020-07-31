# React 中 key 的作用

key 是 React 用来追踪哪些列表元素被修改、被添加或者被移除的辅助标志。

在开发过程中，我们需要保证某个元素的 key 在其同级元素中具有唯一性。在 React diff 算法中，React 会借助元素的 Key 值来判断该元素是新近创建的还是被移动而来的元素，从而减少不必要的元素重新渲染。同时，React 还需要借助 key 来判断元素与本地状态的关联关系。



# 调用 setState 之后发生了什么

在代码中调用 setState 函数之后，React 会将传入的参数与之前的状态进行合并，然后出发所谓的调和过程（Reconciliation）。经过调和过程，React 会以相对高效的方式根据新的状态构建 React 元素树并且着手重新渲染整个 UI 界面。在 React 得到元素树之后，React 会计算出新的树和老的树之间的差异，然后根据差异对界面进行最小化重新渲染。通过 diff 算法，React 能够精确制导哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。



# React 生命周期函数

*   初始化阶段
    *   getDefaultProps：获取实例默认属性
    *   getInitialState：获取每个实例的初始化状态
    *   ~~componentWillMount：组件即将被装载、渲染到页面上~~
    *   render：组件在这里生成虚拟 DOM 的节点
    *   componentDidMount：组件在真正装载在页面上
*   运行中状态
    *   componentWillReceiveProps：组件将要接收到属性的时候调用
    *   shouldComponentUpdate：组件接收到新属性或者新状态的时候，通过返回一个布尔值来决定是否需要重新渲染，可以精细的diff
    *   ~~componentWillUpdate：组件即将更新，不能修改属性和状态~~
    *   render：组件重新渲染
    *   componentDidUpdate：组件已经更新
*   销毁阶段
    *   componentWillUnmount：组件即将销毁



# shouldComponentUpdate 的作用

shouldComponentUpdate 这个方法用来判断是否需要调用 render 方法重新描绘 DOM。因为 DOM 的描绘性能开销很大，如果可以在这个生命周期阶段做出更优化的 DOM diff 算法，可以极大地提升性能。



# React 中 ref 的作用

ref 是 React 提供的一种可以安全访问 DOM 元素或者某个组件实例的方式。

在类组件中使用 `createRef()`，在函数组件中使用 `useRef` 。





