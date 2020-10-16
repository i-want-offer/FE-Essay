>   -   原文链接： [Angular Change Detection Explained](https://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html)
>   -   原文作者： Pascal Precht
>   -   译者: 嘉文

# 目录

*   什么是变更检查（Change Dectetion）？
*   什么引起了变更（change）？
*   发生变更后谁通知 Angular？
*   变更检查
*   性能
*   更聪明的变更检查
*   不变对象（Immutable Objects）
*   减少检测次数（number of checks）
*   Observable
*   更多



# 什么是变更检查

变更检测的基本任务是 **获取程序内部状态并使之在用户界面可见**。这个 **状态** 可以是任何对象、数组、基本数据类型，也就是说可以是任意 JavaScript 数据结构。

这个 **状态** 在用户界面上最终可能成为段落、表格、链接或者按钮，并且特别对于 web 而言，会成为 DOM。所以基本上我们将数据结构作为输入，并生成 DOM 作为输出并展示给用户。我们把这一过程称之为 **rendering（渲染）**。

![img](https://user-gold-cdn.xitu.io/2017/10/17/8149181683996a0bd363a91d92844c43?imageslim)

然而，当变更发生在 runtime 的时候，它会变得很奇怪。比如当 DOM 已经渲染完成以后，我们要如何知道 model 中什么发生了改变，以及更新 DOM 的什么位置？访问 DOM 树是十分耗时的，所以我们不仅要找到应该更新 DOM 的位置，并且尽可能地少访问它。

这个问题有许多解决方案，比如其中一个方法是简单地通过发送 http 请求并重新渲染整个页面，另一个方案是 React 提出的 Virtual DOM 的概念，即检测 DOM 的新状态与旧状态的不同并渲染其不同的地方。

Tero 写了一篇很棒的文章，是关于 [Change and its detection in JavaScript frameworks](http://teropa.info/blog/2015/03/02/change-and-its-detection-in-javascript-frameworks.html)，即不同 JavaScript 框架之间的变更检测，如果你对于这个问题感兴趣的话我建议你们去看一看。在这篇文章中我会专注于 Angular>=2.x 的版本。



# 什么引起了变更？

既然我们知道了变更检查是什么，我们可能会疑惑：到底这样的变更什么时候会发生？Angular 什么时候知道它必须更新视图？下面给一个例子：

```typescript
@Component({
  template: `
    <h1>{{firstname}} {{lastname}}</h1>
    <button (click)="changeName()">Change name</button>
  `
})
class AppComponent {
  firstname = 'Pascal';
  lastname = 'Precht';

  changeName() {
    this.firstname = 'Brad';
    this.lastname = 'Green';
  }
}
```

上面这个组件简单地展示了两个属性，并提供一个方法，在点击按钮的时候调用这个方法来改变这两个属性。这个按钮被点击的时候就是程序 **状态** 已经发生了改变的时候，因为它改变了这个组件的属性，所以我们需要在这个时候更新视图。

下面是另一个例子：

```typescript
@Component({
  template: `
		<div *ngFor="let item of contacts">{{item}}</div>
	`
})
class ContactsApp implements OnInit{
  contacts: Contact[] = [];

  constructor(private http: Http) {}

  ngOnInit() {
    this.http.get('/contacts')
      .map(res => res.json())
      .subscribe(contacts => this.contacts = contacts);
  }
}
```

这个组件存储这一个联系人的列表，并且当它初始化的时候会发起一个 http 请求，一旦这个请求完成，就会更新联系人列表。在这个时候，我们的程序状态发生了改变，因此我们需要更新视图。

通过上面两个例子，我们可以发现程序发生改变有三个主要原因：

*   **事件**：click、submit...
*   **XHR**：从服务端获取数据
*   **Timers**：setTimeout、setInterval

这三个原因都有一个共同点，那便是它们都是异步事件。从中我们可以得出一个结论，基本上只要发生了异步操作，我们的程序状态就可能发生改变，**这就是 Angular 需要更新视图的时候**。



# 谁通知 Angular

到目前为止，我们已经知道了是什么导致程序状态的改变，但在这个视图必须发生改变的时候，到底是谁通知 Angular？

如果有接触过 Angular 的应该知道这一切是 [Zone.js](https://blog.thoughtram.io/angular/2016/01/22/understanding-zones.html) 完成的。事实上，Angular 有着自己的 zone，叫 **NgZone**。[Zone.js in Angular](https://blog.thoughtram.io/angular/2016/02/01/zones-in-angular-2.html) 是一篇关于 NgZone 的文章。

简单描述一下：Angular 源码中某一个东西叫做 ApplicationRef，它监听 NgZone 的 onTurnDone 事件。只要这个事件发生，它就执行 `tick()` 函数，这个函数执行 **变更检查**。

```typescript
// 真实源码的非常简化版本。
class ApplicationRef {
  changeDetectorRefs: ChangeDetectorRef[] = [];

  constructor(private zone: NgZone) {
    this.zone.onTurnDone.subscribe(() => this.zone.run(() => this.tick());
  }

  tick() {
    this.changeDetectorRefs.forEach((ref) => ref.detectChanges());
  }
}
```



# 变更检查

我们现在已经知道什么时候变更检测会被触发（triggered），但是它如何执行呢？

我们需要注意到的第一件事情是，在 Angular 中，**每个组件都有它自己的变更检测器（change detector）**。

![img](https://user-gold-cdn.xitu.io/2017/10/17/4fab6e8405764bae95e2bc0bd3096f14?imageslim)

这是很明显的，因为这让我们可以单独控制每个组件的变更检查何时发生以及如何执行。

我们假设组件树某处发生了一个事件，此时由 zone 执行给定的 handler 并且在执行完成后通知 Angular，接着 Angular 执行变更检查。

![img](https://user-gold-cdn.xitu.io/2017/10/17/dd7592c43121bd5df44f9c4ae1973388?imageslim)

既然每个组件都有自己的变更检查器，并且一个 Angular 应用包含着一个组件树，那么逻辑上我们也有一个 **变更检测树（change detector tree）**。这棵树也可以被看成是一个有向图，该有向图的数据总是从顶端流向底端。

数据总是从顶端流向底端的原因在于，对于每一个组件，变更检测总是自顶向下执行，每次都是从根组件开始。单向的数据流相较于循环流动的数据更容易被预测，我们永远知道视图的数据从哪里来，因为它只能源于它所在的组件。

另一个有趣的观察是，在单通道中变更检查会更加稳定。这意味着如果当我们第一次运行完变更检测后，只要一个组件导致了任何的副作用，Angular 就会抛出一个错误。



# 性能

默认的，在事件发生的时候，即使我们每次都检测每个组件，Angular 仍然非常快，它会在几毫秒内执行成千上万次的检测，这主要是因为 Angular 生成了对虚拟机友好的代码。

这是什么意思？实际上，当我们说每个组件都有自己的变更检测器的时候，并不是真的说在 Angular 有这样一个普遍的东西负责每一个组件的变更检测。

这样做的原因在于，变更检测器必须被编写成动态的，这样它才能够检测所有的组件，不管这个组件的模型结构是怎样的。而 VMs 不喜欢这种动态的代码，因为它们不能优化这些动态的代码。当一个对象不总是相同的时候，它通常被称作多态的。

Angular 对于每个组件都在 runtime 生成变更检测器类，而这些变更检测器类是单态，因为它们确切地知道每个组件的模型是怎样的，VMs 可以完美地优化这些代码，从而使它执行速度变得非常快。



# 更聪明的变更检测

我们知道，一旦事件发生，Angular 必须每次都检测所有组件，因为应用的状态可能发生了改变。但是如果我们让 Angular 仅对应用中 **状态发生改变的那部分** 执行变更检测，性能可以变得更加出色。

是的，我们可以做到，只要通过下面几种数据结构：

*   Immutable
*   Observable

如果我们恰好使用了这些数据结构，并且告诉了 Angular，那么变更检查就会快很多。

## 理解易变性（Mutability）

为了理解不可变的数据结构（immutable data structures）为什么、以及如何有助于更快的变更检查，我们需要理解易变性到底是什么。举个例子：

```typescript
@Component({
  template: '<v-card [vData]="vData"></v-card>'
})
class CardComponent {
  vData = {
    name: 'Christoph Burgdorf',
    email: 'christoph@thoughtram.io'
  }

  changeData() {
    this.vData.name = 'Pascal Precht';
  }
}

```

CardComponent 使用了 v-card 作为子组件，该子组件有一个输入属性 vData，我们将 CardComponent 属性中的 vData 传入子组件。vData 是一个包含两个字段的对象。另外，在组件中还有一个方法 changeData，这个方法改变 vData 中的 name 字段。

这里的重要部分在于 changeData 通过改变 vData 的 name 属性改变了 vData，但是 **对象的引用并没有被改变**。

假设一些事件触发了 changeData，变更检测会怎样执行？首先，`vData.name` 被改变，然后它被传入了子组件 v-card。v-card 的变更检查器开始检查传进来的 vData 是否未发生改变，引用未改变所以，但是它的 name 字段发生了改变，所以 Angular 仍然会对这个对象执行变更检查。

由于 JavaScript 中的对象默认是易变的，每次触发事件执行的时候，Angular 都必须保守地对每个组件跑一次变更检查。

## 不可变对象（Immutable Object）

这种情况下，不可变对象就有发挥的空间。

不可变对象保证了这个对象是不可变的，这意味着如果我们使用者不可变对象，同时试图改变这个对象，那我们总是会得到一个新的引用，因为原来那个对象是不可变的。

## 减少检测次数

当输入属性没有发生改变的时候，Angular 会跳过整棵子树的变更检查。我们刚刚说了，**改变** 意味着新的引用，如果我们在 Angular 程序中使用不可变对象，我们只需要做的就是告诉 Angular，如果输入内容没有发生改变，这个组件就可以跳过检测。

我们通过研究 v-card 来看看它是如何工作的：

```typescript
@Component({
  template: `
    <h2>{{vData.name}}</h2>
    <span>{{vData.email}}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class VCardCmp {
  @Input() vData;
}
```

我们可以看到组件只取决于输入属性，如果输入属性没有发生改变，我们可以让 Angular 跳过对于这棵子树的变更检测，我们只需要设置变更检测策略为 **OnPush** 即可。

这就大功告成了，试想一下一棵很大的组件树，只要我们使用了不可变对象，就可以跳过整棵子树的变更检查。

![img](https://user-gold-cdn.xitu.io/2017/10/17/3c0931a9c1d74a1e7a151df55f229da1?imageslim)

## Observable

正如前文所说，当变更发生的时候，Observable 也给了我们一个保证。不想不可变数据，当变更发生的时候，Observable 不提供给我们新的引用，取而代之的是，它们触发事件，并且让我们注册监听（Subscribe），对事件作出处理。

所以，如果我们使用 Observable，并且想要使用 OnPush 来跳过对子树的变更检查时，但是这些对象的引用永远都不会发生变化，怎么办？

```typescript
@Component({
  template: '{{counter}}',
  changeDetection: ChangeDetectionStrategy.OnPush
})
class CartBadgeCmp {
  @Input() addItemStream:Observable<any>;
  counter = 0;

  ngOnInit() {
    this.addItemStream.subscribe(() => {
      this.counter++; // 程序状态改变
    })
  }
}
```

假设我们在写一个有购物车的网上商城，用户将商品放入购物车时，我们希望有一个小计时器出现在我们页面，这样一来用户可以知道购物车中的商品数目。

CartBadgeCmp 就是做这样一件事，它有一个 counter 作为输入属性，这个 counter 是一个事件流，它会在某个商品被加入购车车时被 fired。

除此之外，我们将变更策略设置为 OnPush，因此只有输入属性发生改变时才会执行变更检查。

如前文所说，addItemStream 永远不会发生改变，所以变更检测永远不会在这个子树中发生。但是这不符合我们的需求，我们希望的是当 addItemStream 被触发的时候，组件仍然可以执行变更检查。

Angular 考虑到了这一点，如前文所述，变更总是自顶向下，那么我们需要的只是一个探测（detect）**自根组件到变更发生的那个组件** 的整条路径而已，Angular 无法知道，但是我们知道，所以我们可以手动告诉 Angular 应该在何时何地执行变更检测。

我们可以通过依赖注入一个组件的 ChangeDetectorRef，通过它的一个 maskForCheck API，标记了一条当前组件到根组件的路径，当下一次变更检测发生的时候，就会检测到它们，Angular 就知道从这个组件到根组件这一路径上的组件都需要被检查：

```typescript
class AppComponent {
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
      this.addItemStream.subscribe(() => {
        this.counter++; // application state changed
        this.cd.markForCheck(); // marks path
      })
    }
  }
}
```

下图就是当 observable 事件发生之后的组件树样子：

![img](https://user-gold-cdn.xitu.io/2017/10/17/18ba93496c237cf1928efe1deffba1c4?imageslim)

当变更检测执行的时候：

![img](https://user-gold-cdn.xitu.io/2017/10/17/a17449e82c5a08e3bcbe3f16025516d3?imageslim)

一旦变更检测结束，它就会恢复回 OnPush 模式。
