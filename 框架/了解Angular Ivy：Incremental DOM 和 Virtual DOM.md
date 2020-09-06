Angular Ivy 作为 Angular 的最新渲染引擎，与我们看到的当今所有主流框架的引擎有根本的不同，因为 Angular Ivy 使用了 Incremental DOM（增量 DOM）。

# 什么是 Incremental DOM？它与 Virtual DOM 有何不同？

让我们对它们做下比较，看看为什么 Angular 要使用 Incremental DOM。

## Virtual DOM 的工作原理

React 是第一个使用 Virtual DOM 的主流框架，它的设计思想是：

>   每个组件在每次渲染是创建一个新的 Virtual DOM，React 把新的 Virtual DOM 树与现有的进行比较，找到变更的 DOM 节点进行局部更新。

![img](https://img-blog.csdnimg.cn/20190531140718407.png)

### Virtual DOM 有两个主要优点

*   我们可以使用任何语言去实现组件渲染，所以我们不需要重新编译任何东西。React 开发者主要使用 JSX，但我们使用原生的 JavaScript 一样可以做到；
*   作为渲染组件的结果，我们得到一个值，它可以用来测试、debugger 等。

## Incremental DOM

Incremental DOM 被 Google 内部使用，它的主要设计思想为：

>   每个组件都被编译成一系列指令，这些指令创建 DOM 树并在数据更改时就地更新它们。

例如下面一个组件：

```typescript
@Component({
  selector: 'todos-cmp',
  template: `
    <div *ngFor="let t of todos|async">
        {{t.description}}
    </div>
  `
})
class TodosComponent {
  todos: Observable<Todo[]> = this.store.pipe(select('todos'));
  constructor(private store: Store<AppState>) {}
}
```

会被编译成：

```js
var TodosComponent = /** @class */ (function () {
  function TodosComponent(store) {
    this.store = store;
    this.todos = this.store.pipe(select('todos'));
  }

  TodosComponent.ngComponentDef = defineComponent({
    type: TodosComponent,
    selectors: [["todos-cmp"]],
    factory: function TodosComponent_Factory(t) {
      return new (t || TodosComponent)(directiveInject(Store));
    },
    consts: 2,
    vars: 3,
    template: function TodosComponent_Template(rf, ctx) {
      if (rf & 1) { // create dom
        pipe(1, "async");
        template(0, TodosComponent_div_Template_0, 2, 1, null, _c0);
      } if (rf & 2) { // update dom
        elementProperty(0, "ngForOf", bind(pipeBind1(1, 1, ctx.todos)));
      }
    },
    encapsulation: 2
  });

  return TodosComponent;
}());
```

模版函数包含了渲染和更新 DOM 的指令，框架的渲染引擎不会解释指令，因为这些指令就是引擎。

### 为什么选择 Incremental DOM

为什么谷歌的工程师选择 Incremental DOM 来代替 Virtual DOM 呢？

一个目标在他们心中萦绕：应用必须在手机端表现良好，这就意味着要在两个方面进行优化：

*   文件大小
*   内存占用

要实现这两个目标，

*   渲染引擎自身必须是 tree shakable 的；
*   渲染引擎必须具有较低的内存开销。

### Tree Shakable

当我们使用 Incremental DOM 时，框架不会编译组件，而是组件引用指令。如果组件为使用特定指令，它就永远不会被使用。

因此，我们可以省略掉 bundle 中未使用的指令。

![img](https://img-blog.csdnimg.cn/20190531142706948.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JvY2thbjAwNw==,size_16,color_FFFFFF,t_70)

Virtual DOM 需要一个解释器，在编译时，根本无法确定编译器各个部分是否被使用，所以我们需要把所有东西都发送到浏览器。

![img](https://img-blog.csdnimg.cn/20190531143137476.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JvY2thbjAwNw==,size_16,color_FFFFFF,t_70)

### 低内存开销

每次重新渲染时，Virtual DOM 都会从头开始创建整棵树。

![img](https://img-blog.csdnimg.cn/20190531143326746.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3JvY2thbjAwNw==,size_16,color_FFFFFF,t_70)

而 Incremental DOM 在视图未改变时，是不需要任何内存的，我们只有在添加或删除 DOM 时需要分配内存，并且分配的内存大小与改变的 DOM 的大小成正比。

![img](https://img-blog.csdnimg.cn/2019053114401652.png)

由于大多数模版或渲染调用都不会改变任何东西，或改变很少，因此可以节省大量内存。

### 更多功能

具有渲染返回值可以提供更多用途，譬如测试。

另一方面能够使用 FireFox DevTools 逐行使用指令，使调试和性能分析更容易。

## Ivy 和 Incremental DOM

Angular 一直在使用 HTML 和 Template，这也是 Incremental DOM 为被 Angular 接受的原因。

鉴于此，加上 Incremental DOM 的低内存开销和 Tree Shakable，我认为使用 Incremental DOM 作为渲染引擎是正确的选择。

