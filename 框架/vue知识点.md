# Vue 

## Vue.js

*   data 必须返回一个函数，这个函数的返回值是当前组件的 state

*   生命周期钩子函数不能使用箭头函数，因为箭头函数会导致函数的 this 指向错误

*   属性绑定 `:[key]="something"`、事件绑定`@[key]="something"`

*   计算属性
    *   计算属性约等于 mobx 中的 @computed，当观察属性发生变动的时候自动触发相应的计算属性
    *   计算属性优先于使用函数返回值，因为计算属性只有在观察值发生变动时才会触发，可以节省更多的性能
    
*   侦听器
    *   侦听器相当于 mobx 中的 reaction、autorun，当对应的观察属性发生变动时自动触发执行
    *   侦听器可以理解为一个没有返回值的特殊的计算属性
    *   可以在侦听器中做一些针对当前属性值的异步操作
    
*   class 绑定
    *   class 绑定相当于 classnames 这个库
    *   避免使用内联 class 绑定，可以使用计算属性代替
    *   当 class 用在自定义组件时，会默认绑定在自定义组件的根节点上
    
*   style 绑定同 class 绑定类似

*   `v-else-if` 和 `v-else` 必须紧跟在 `v-if` 后面

*   key

    *   通过设定唯一 key，来达到空间换时间的 diff 算法性能优化
    *   vue 的 diff 和 react 的 diff 是不一样的。利用模版，vue 的 diff 可以做到 DOM 修改而状态不修改

*   `v-if` 和 `v-for` 不建议一起使用，因为 `v-for` 的优先级更高。如果想要在同一层级使用这两个指令，可以使用 `template` 包裹一层

*   `v-for` 不仅可以遍历数组，还可以遍历对象

*   由于 `Object.defineProperty` 的原因，所以 vue 对数组中的以下几种方法做了 hack 修改

    *   `push()`
    *   `pop()`
    *   `shift()`
    *   `unshift()`
    *   `splice()`
    *   `sort()`
    *   `reverse()`

    使用以上几种方法，vue 可以做到按需变更。使用 immutable 数据的时候，虽然会触发所有列表的重新渲染，但是 vue 的 diff 会尽可能的复用组件

*   自定义组件的 props 类型检查是通过 instanceof 来进行校验的

*   自定义组件也可以实现 `v-model` ，使用 `v-model` 时，需要显式在组件中定义 `value` 的属性，也可以使用 `model` 这个对象来进行修改。

    ```js
    Vue.component('base-checkbox', {
      model: {
        prop: 'checked',
        event: 'change'
      },
      props: {
        checked: Boolean
      },
      template: `
        <input
          type="checkbox"
          v-bind:checked="checked"
          v-on:change="$emit('change', $event.target.checked)"
        >
      `
    })
    ```

*   由于 vue 的作用域只包含当前组件，所以使用插槽渲染子组件的时候是无法获取数据的，此时需要手动将子组件的数据绑定到插槽模版上

*   动态组件

    *   由于 vue 采用就地更新的策略，所以进行组件切换的时候，组件的所有状态都会被重新初始化，因此无法保存组件内部已经修改过的状态
    *   可以采用 `keep-alive` 包裹组件的方式来进行状态的保存

*   组件实例中的工具属性

    *   组件中的工具属性是以 `$` 符号开头的属性
    *   可以通过 `$root` 来访问根组件的实例，理论上说可以通过这种方式来进行全局状态管理
    *   可以通过 `$parent` 来访问父组件的实例，可以一定程度上替代数据必须以 props 的形式传入子组件
    *   可以通过 `ref` 的方式在子组件的 `$refs` 中添加一个属性作为子组件的实例，这一点表现与 React 比较相似。当 `ref` 和 `v-for` 一起使用的时候，得到的将会是一个包含对应数据源的子组件的数组
    *   不同于 React 中将所有传参，不管是值还是事件都称之为 props，vue 中只有值才会称之为 props，事件就叫事件，并且事件并不是在子组件的 props 中定义，而是需要通过工具属性 `$emit` 来进行注册
    *   

*   vue 中的依赖注入和 DI 是两个完全不同的东西，vue 中的依赖注入可以理解为 React 中的 context，为整颗组件树提供一种跨组件传值的方式

*   vue 提供了 mixin 这种组件复用的机制。当 mixin 与组件内部状态冲突时，优先采用组件内部的状态；如果是生命周期钩子函数冲突时，会合并成一个数组，mixin 的方法优先调用的方式依次调用；其他以键值对形式存在的对象选项则会进行合并，如果冲突则优先采用组件内部的数据

*   自定义指令

    *   除了核心功能默认的内置指令 `v-model` 和 `v-on` ，vue 还允许开发者注册自定义指令。

    *   全局注册可以用 

        ```js
        // 全局 v-focus 指令
        Vue.directive('focus', {
          // 当被绑定的元素插入到 DOM 时...
          inserted: function(el) {
            el.focus()
          }
        })
        ```

    *   同时，我们更多时候可能会用于组件内进行局部注册

        ```js
        new Vue({
          directives: {
            focus: {
              inserted: function(el) {
                el.focus()
              }
            }
          }
        })
        ```

*   vue 中的过滤器就是 Angular 里面的管道 pipe，使用方式也是一模一样

*   vue 响应式的原理是遍历传入组件的 data 的 property，并将所有 property 通过 `Object.defineProperty` 将他们全部转换成 getter 和 setter。每一个组件实例都有一个对应的 watcher 实例，它会在组件渲染的过程中把 **接触** 过的数据 property（即依赖项的 getter） 记录为依赖，之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。

    ![data](https://cn.vuejs.org/images/data.png)

*   由于 `Object.defineProperty` 只是对对象的 property 做监听，而不是监听对象本身，因此 vue 无法检测数组和对象的变化，所以 vue 采用了一些 hack 的手段来解决以上的问题。

    *   由于 data 是在组件初始化的时候转换成可观察着对象，因此对于动态添加上去的 property，vue 无法进行转换。

        为了解决这种问题，可以使用 `Vue.set(vm.somObj, propertyName, value)` 的方法来对动态添加的 property 进行观察者转换。你也可以使用 `vm.$set` ，这是全局 `Vue.set` 的别名

    *   某些时候可能我们需要批量动态更新多个新的 property，此时使用上述方法显然是不合适的，最佳方式是使用 immutable data，此时触发更新的时候会重新转换成观察着对象

    *   对于数组，vue 目前无法做到监听通过设置索引值以及修改数组长度的变化，所以应该避免这样操作。对于其余的情况，vue 对数组原型中的部分方法做了 polyfill

## API

