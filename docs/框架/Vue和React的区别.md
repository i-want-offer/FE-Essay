# 从原理上说

Vue 的数据绑定依赖数据劫持 `Object.defineProperty()` 中的 `getter` 和 `setter`，更新视图使用的是 **发布订阅模式（eventEmitter）** 来监听值的变化，从而让 `virtual DOM` 驱动 Model 和 View 的更新，利用 `v-model` 这一语法糖能够轻易实现双向的数据绑定，这种模式被称为 `MVVM: M <=> VM <=> V`，但本质上还是 `State -> View -> Actions` 的单向数据流，只是使用了 `v-model` 不需要显式地编写 `View` 到 `Model` 的更新。

React 则需要依赖 `onChange/setState` 模式来实现数据的双向绑定，因为它在诞生之初就是设计成单向数据流的。



# 组件通信的区别

父子之间都可以通过 `props` 绑定 `data` 或 `state` 进行传值，又或者通过绑定回调函数来传值。

兄弟之间都可以通过 **发布订阅模式** 来写一个 **EventBus** 来监听值的变化。

跨层级：React 可以通过 `React.context` 来进行跨层级通信；Vue 则可以使用 `provide/inject` 来实现跨层级注入数据。



# 模版渲染方式的区别

React 在 JSX 中使用原生的 JS 语法来实现插值，条件渲染，循环等。

Vue 则需要依赖指令进行，更容易上手，但封装程度更高，调试成本更大，难以定位 Bug。



# 性能差异

在 React 中组件的更新渲染是从数据发生变化的根组件开始往子组件逐层渲染，而组件的生命周期中有 `shouldComponentUpdate` 这一钩子函数可以给开发者优化组件在不需要更新的时候不要更新。

Vue 通过 watcher 监听到数据的变化之后，通过自己的 diff 算法，在 virtualDOM 中直接以最低成本更新视图。