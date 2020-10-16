# 前言

本文非深入系列，而是自己总结得出，原因是深入系列对于 this 的描述过于复杂，引用了大量的 ES 标准进行论述，不适合面试的时候吹逼。



# 隐式绑定

关于 this，一般来说谁调用了方法，该方法的 this 就指向谁，例如：

```js
function foo() {
  console.log(this)
  console.log(this.a)
}

var a = 3
var obj = {
  a:2,
  foo
}

foo() // 输出 window, 3
obj.foo() // 输出 obj, 2
```

`foo()` 输出 window，3 是因为是 window 调用了 foo 函数来；而 `obj.foo()` 输出为 obj，2 则是因为是 obj 调用了 foo，所以 this 就变为指向 obj。

如果存在多次调用，对象属性引用链只有一层或者说只有最后一层在调用位置中起作用，例如：

```js
function foo() {
  console.log(this.a)
}

var obj2 = {
  a: 42,
  foo,
}

var obj1 = {
  a: 2,
  obj2
}

obj1.obj2.foo() // 42，因为本质上是 obj2 调用了 foo
```



# 隐式丢失

一个常见的 this 绑定问题就是 **隐式丢失** 的函数会丢失绑定对象，也就是说它会应用默认绑定，从而把 this 绑定到全局对象中：

```js
function foo() {
  console.log(this.a)
}

var obj = {
  a: 2,
  foo
}

var a = 3
var bar = obj.foo
bar() // 3
```

虽然 bar 是 `obj.foo` 的一个引用，但实际上它引用的是函数的本身，因此此时 `bar()` 其实是一个不带任何修饰的函数调用，所以启用了默认绑定。更常见的是出现在传入回调函数中：

```js
function foo() {
  console.log(this.a)
}

function doFoo(fn) {
  fn()
}

var obj = {
  a: 2,
  foo
}

var a = 3 
doFoo(obj.foo)
```



# 显式绑定

简单来说就是：call，apply，bind 和 new

## 硬绑定

```js
function foo(b){
    console.log(this.a, b);
    return this.a + b;
}
var obj = {
    a: 2
};
var bar = function() {
    return foo.apply(obj, arguments);
};
var b = bar(3);// 2 3
console.log(b);//5
```

在 bar 函数中，foo 使用了显式绑定，将 this 指向了 obj。

这里也可以使用 call、bind，同理。

## new 绑定

在传统面向对象的语言中，使用 new 初始化类的时候会调用类的构造函数，但是 JS 中的 new 的机制不完全一致。实际上在 JS 调用 new 的过程中，会自动执行下面的操作：

*   创建一个全新的对象
*   这个新对象的 `__proto__` 会和原对象的原型相连接
*   这个新对象被绑定到函数调用的 this
*   如果函数没有返回对象，则返回创建的对象



# this 的优先级

new绑定 > 硬绑定 > 隐式绑定 > 默认绑定



# 箭头函数

箭头函数不适用于这四种规则，而是根据外层（函数或全局）作用域来决定 this

```js
function foo() {
  return () => {
    console.log(this.a)
  }
}

var obj1 = {
  a: 2
}

var obj2 = {
  a: 3
}

var bar = foo.call(obj1) 
bar.call(obj2) // 2
```

`foo() ` 内部创建的箭头函数会捕获调用 `foo()` 的 this。由于 `foo()` 的 this 绑定到了 obj1，所以 bar 的 this 也会绑定到 obj1，箭头函数的绑定无法被修改。

