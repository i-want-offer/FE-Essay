# useState / useReducer

useState 和 useReducer 都是关于状态值的提取和更新，从本质上来说没有区别，从实现上看，useState 是 useReducer 的一个简化版，其背后用的是同一套逻辑。

## React Hook 是如何保存状态

React 官方文档中提到，React Hook 保存状态的位置与类组件是一致的，但其实略有差别：

*   两者的状态值都被挂载在组件实例对象 FiberNode 的 memoizedState 属性中
*   两者保存状态值的数据结构完全不同。类组件是直接把 state 属性挂载在这个开发者自定义的对象保存到 memorizedState 属性中；而 Hook 是用链表来保存状态，memorizedState 属性保存的实际是这个链表的头指针

我们来看看这个链表节点是什么样子的：

```typescript
// react-reconciler/src/ReactFiberHooks.js
export type Hook = {
  memoizedState: any, // 最新的状态值
  baseState: any, // 初始状态值，如`useState(0)`，则初始值为0
  baseUpdate: Update<any, any> | null,
  queue: UpdateQueue<any, any> | null, // 临时保存对状态值的操作，更准确来说是一个链表数据结构中的一个指针
  next: Hook | null,  // 指向下一个链表节点
};
```

官方文档一直强调 React Hooks 的调用只能放在函数组件/自定义 Hooks 函数体的顶层，这是因为我们只能通过 Hooks 调用的顺序来与实际保存的数据结构来关联：

![](https://user-gold-cdn.xitu.io/2020/7/1/17307e7bb3014026?imageslim)

虽然上面一致都是以 useState 和 useReducer 来作为例子说明，但实际上所有 React Hooks 都是用这种链表的方式来保存的。

## React Hook 是如何更新状态

熟悉 Hook API 的话，我们都知道如何去更新状态，那么由 useState 返回的这个用来更新状态的函数（下文统称为 dispatcher）的运行原理是什么？

当我们每次调用 dispatcher 时，并不会立刻对状态值进行修改（对的，状态值的更新是异步的），而是创建一条修改操作--在对应 Hook 对象的 queue 属性挂载的链表上加一个新的节点：

![	](https://user-gold-cdn.xitu.io/2020/7/1/17307e7f74c14584?imageslim)

在下次执行函数组件，再次调用 useState 时，React 才会根据每个 Hook 上挂载的更新操作链表来计算最新的状态值。为什么需要把每次更新操作都记录下来，那是因为 Hook 支持这样的操作：

```js
const [name, setName] = useState('')
setName(name => name + 'a')
setName(name => name + 'b')
setName(name => name + 'c')

// 下次执行时就可以得到 name 的最新状态值为'abc'啦
```



# useEffect

useEffect 的保存方式和 useState / useReducer 类似，也是以链表的形式挂载在 FiberNode.updateQueue 中。

下面我们按照 mount 和 update 这两个组件的生命周期来阐述 useEffect 的执行原理：

## mount 阶段：mountEffect

1.  根据函数组件函数体中依次调用 useEffect 语句，构成一个链表并挂载在 `FiberNode.updateQueue` 中，链表节点的数据结构为：

    ```typescript
    const effect: Effect = {
        tag, // 用来标识依赖项有没有变动
        create, // 用户使用useEffect传入的函数体
        destroy, // 上述函数体执行后生成的用来清除副作用的函数
        deps, // 依赖项列表
        next: (null: any),
    };
    ```

2.  组件渲染完成后，遍历链表执行

## update 阶段：updateEffect

### 初始阶段

同样在依次调用 useEffect 语句 时，判断此时传入的依赖列表，与链表节点 `Effect.deps` 中保存的是否一致（基本数据类型的值是否相同，对象的引用是否相同），如果一致，则在 `Effect.tag` 标记上 `NoHookEffect`

### 执行阶段

在每次组件渲染完成后，就会进入 useEffect 的执行阶段 `function commitHookEffectList()`

1.  遍历链表
2.  如果遇到 `Effect.tag` 被标记上 `NoHookEffect` 的节点则跳过
3.  如果 `Effect.destroy` 为函数类型，则需要执行该清除副作用的函数
4.  执行 `Effect.create`，并将执行结果保存到 `Effect.destroy`（如果开发者没有配置 return，那么得到的自然是 undefined，也就是认为开发者对当前的 useEffect 没有需要清除的副作用）；注意由于闭包的缘故，`Effect.destory` 实际上可以访问到本次 `Effect.create` 函数作用域的变量

我们注意到的一点是：**先清除上一轮的 effect，然后再执行本轮的 effect**



