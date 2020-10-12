# 设计 ES6 中 class 实现私有属性

## 为什么会出现 class

其实学过其他面向对象语言的人应该对 class 非常熟悉，那为什么 js 里面要引入 class 呢？

在 ES6 之前，虽然 JS 和其他面向对象语言一样都是 OOP（面向对象），但是在 JS 中只有对象而没有类的概念。

ES6 中 class 的出现拉近了 JS 和传统 OOP 语言的距离，但是它仅仅是一个 **语法糖** ，不能实现传统 OOP 语言一样的功能，这其中一个比较大的痛点就是私有属性问题。

### 何为私有属性？

私有属性是面向对象编程（OOP）中一个非常常见的特性，一般满足以下特点：

*   能被 class 内部的不同方法访问，但不能在 class 外部访问；
*   子类不能继承父类的私有属性。

在 Java 中，可以使用 private 实现私有变量，但可惜 JS 中并未实现该功能。

## 私有属性提案

2015 年 6 月，ES6 发布成为标准，为了纪念这个历史性时刻，这个标准又被称为 ES2015。至此，JavaScript 的 class 从备胎转正，但是还是没有解决私有属性的问题，产生了一个新的提案 -- 在属性前加 `#` 用于表示私有属性。

```js
class Foo {
  #a; // 定义私有属性
  construtor(a, b) {
    this.#a = a;
    this.b = b;
  }
}
```

>   上述代码私有属性的声明需要先经过 Babel 编译之后才能正常使用。

至于为什么不用 private 关键字？参考大佬说法是 ES6 之后，JS 逐步开始朝 Python 靠拢。

## 如何设计私有属性

上文我们介绍了 class 出现的原因以及它没有解决私有属性这个问题，那么我们尝试自己来解决一下。

### 约定命名

目前使用最广泛的方式： **约定命名** 。通常在变量前加一个下划线，以此来表示这个变量是一个私有变量，这样只需要大家都遵循规范，就可以假装实现了私有属性。

这种方式实现最简单，也最快速，但是约定就需要人来遵守，并没有从根本上解决问题。

### 闭包

闭包的一个好处就是可以保护内部属性，做法就是将属性定义在构造器作用域内：

```js
class Foo {
  construtor(x) {
    let _x = x
    this.getX = function() {
      return _x
    }
  }
}
```

优点在于实现简单，同时代码可读性高。但是问题在于，代码看起来过于臃肿，一旦属性增多，维护起来难度加大，同时定义在构造器中的私有属性在 class 内部也变得无法访问了。

### 进阶版闭包

可以通过 IIFE（立即执行函数）建立一个闭包，在其中建立一个变量以及 class，通过 class 引用变量实现私有变量。

```js
const Class = (function () {
  let _x
  
  class InnerClass {
    construtor(x) {
      _x = x
    }
    
    getX() {
      return _x
    }
  }
  
  return InnerClass
})()
```

这种方式就有点 **模块化** 思想了。

### 闭包产生的问题

上述利用闭包生成的私有属性的最大的问题便是会引发变量共享，虽然生成了不同的几个实例，但是他们操作的都是同一个属性，这显然是不可取的。

### Symbol

利用 Symbol 变量可以作为对象 key 的特点，我们可以模拟实现更加真实的私有属性。

```js
// a.js
const _x = Symbol('x')

export class Class {
  construtor(x) {
    this[_x] = x
  }
  
  getX() {
    return this[_x]
  }
}

// b.js
import Class from './a.js'
const demo = new Class(1)
```

因为对象要使用 `.` 语法，它对应的 key 必须是字符串，而 Symbol 作为 key 则必须使用 `[]` 语法，但是我们在导出类的时候并没有导出对应的 symbol 变量，因此一定程度上可以算作是一个私有变量。

当然这也不是毫无破绽的：

```js
console.log(demo[Object.getOwnPropertySymbols(demo)[0]])
```

ES6 中新增的 API 可以获取 symbol 属性。

### WeakMap

为了解决上述问题，我们又要引入一个新的东西： **WeakMap** 。

```js
const Class = (function () {
  const _x = new WeakMap()
  
  class InnerClass {
    construtor(x) {
      _x.set(this, x)
    }
    
    getX() {
      return _x.get(this)
    }
  }
  
  return InnerClass
})()
```

