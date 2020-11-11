# proxy 和 defineProperty

目前开发 Web 应用的主流框架是 React 和 Vue，这两个框架都能通过一定手段实现响应式编程，比如 Vue 本身就实现了双向绑定以及 React + Mobx 实现类似于 Vue 的操作，这个时候就是 `Object.defineProperty` 登场的时候。

但是随着 Vue3.0 以及 Mobx5 的推出，Proxy 取代了 `Object.defineProperty` 成为双向绑定的底层原理。

我们先以 `Object.defineProperty` 作为引入，之后讲解 Proxy，最后比较二者之间的优劣。

## `Object.defineProperty` 数据劫持

`Object.defineProperty` 方法会直接在对象上定义一个新的属性，或者修改一个对象的现有属性，并返回次对象。

该方法接受三个参数，第一个是要定义属性的对象，第二个是要定义或修改属性的名称，第三个参数是要定义或修改的属性描述符。

```js
const obj = {}
Object.defineProperty(obj, 'prop', {
  value: 18
})
console.log(obj.prop) // 18
```

函数的第三个参数属性描述符有两种形式：数据描述符和存取描述符。

数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。存取描述符是由 getter 和 setter 所描述的属性。这两种描述符是互斥的。

这两种同时拥有下列两种键值：

*   configurable：当且仅当该属性为 true 时，该属性的描述符才能被改变，同时该属性也能从对应的对象上被删除，默认为 false；
*   enumerable：当且仅当该属性为 true 时，该属性才会出现在对象的枚举属性中，默认为 false。

数据描述符还具有以下的可选键值：

*   value：该属性对应的值，可以是任意有效的 JS 值，默认为 undefined；
*   writable：当且仅当该属性为 true 时，当前属性对应的值（也就是上面的 value）才能被赋值运算符改变，默认为 false。

存取描述符还具有以下的可选键值：

*   get：属性的 getter 函数，当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的 this 并不一定是定义该属性的对象）。该函数的返回值被用作属性的值；
*   set：属性的 setter 函数，当属性值被修改时会调用此函数。该方法会接收一个参数（被赋予的新值），会传入赋值时的 this 对象。

## Proxy 数据拦截

`Object.defineProperty` 只能对对象中现有的键进行拦截，对于动态新增的键是无能为力的。同时 `Object.defineProperty` 只能重定义获取和设置行为。

而 Proxy 相当于一个升级，它可以进行更多的重定义。

### 概念

首先 Proxy 是一个构造函数，可以通过 new 来创建它的实例。它接受两个参数，第一个是被拦截的目标对象，第二个是 handler：一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理实例的行为。

```js
const p = new Proxy(target, handler)
```

### handler 对象的属性

handler 中的所有属性都是可选的，如果没有定义，那就会保留原对象的默认行为。

#### get

对象的 getter 函数，用于拦截对象的读取操作。

#### set

对象的 setter 函数，用于拦截设置属性值的操作行为。

#### apply

用于拦截函数的调用。当需要被代理拦截的对象是一个函数的时候，可以通过设置 apply 来进行拦截。

#### has

用于拦截 in 操作符的代理。当对目标对象使用 in 操作符时，会触发这个函数的执行。

#### construct

用于拦截 new 操作符。为了使 new 操作符在生成的 Proxy 对象上生效，用于初始化代理的目标对象本身必须具有 `[[Construct]]` 内部方法（即 `new Target` 必须是有效的）。

#### delete

用于拦截 delete 操作符。用于拦截对对象属性进行 delete 操作。

#### defineProperty

用于拦截对象属性上的 `Object.defineProperty` 。当对对象进行键代理时，会触发这个方法。

#### getOwnPropertyDescriptor

用于拦截 `Object.getOwnPropertyDescriptor` 。

#### getPrototypeOf

当访问对象的原型时，会触发这个方法。

触发这个方法的条件有五个：

*   `Object.getPrototypeOf()`
*   `Reflect.getPrototypeOf()`
*   `__proto__`
*   `Object.prototype.isPrototypeOf()`
*   `instanceof`

#### isExtensible

用于拦截对象的 `Object.isExtensible()`

#### ownKeys

用于拦截对象自身属性的读取操作。

具体拦截如下：

*   `Object.getOwnPropertyNames()`
*   `Object.getOwnPropertySymbols()`
*   `Object.keys()`
*   `for...in 循环`

该方法有几个约束条件：

*   ownKeys 结果必须是一个数组
*   数组的元素类型要么是字符串要么是 Symbol
*   结果列表必须包含目标对象的所有不可配置（non-configurable）、自由属性的 key
*   如果目标对象不可扩展，那么结果列表必须包含目标对象的所有自由属性的 key，不能有其他值

#### preventExtensions

用于设置对 `Object.perventExtensions` 的拦截。

#### setPrototypeOf

用来拦截 `Object.setPrototypeOf` 。

## Proxy 和 `Object.defineProperty` 的区别

这两个属性本身就不是在同一个领域工作的，我们通常说的区别，也仅仅是针对使用了这两个 API 的 Vue 的双向绑定机制的实现。

因此，在回答的时候，通常可以直接说出 Vue 来使用这两种机制来实现双向绑定的优劣势。

### `Object.defineProperty` 版本

```js
const obj = {}
Object.defineProperty(obj, 'prop', {
  get() {
    console.log('get val')
  },
  set(newVal) {
    console.log(newVal)
    document.getElementById('input').value = newVal
  }
})

const input = document.getElementById(input)
input.addEventListener('keyup', function(e) {
  obj.text = e.target.value
})
```

可以看出这个简单版本透露出来一个很明显的缺点，那就是只能对对象的属性进行监听，如果需要监听多个属性，则需要进行遍历。同时，这个 API 无法监听数组。

当然他的优点就是兼容性好。

### Proxy 版

```js
const input = document.getElementById(input)
const obj = {}

const newobj = new Proxy(obj, {
  get(target, key, receiver) {
    console.log(`getting ${key}`)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log(target, key, value, receiver) 
    if(key === 'text') {
      input.value = value
    }
    return Reflect.set(target, key, value, receiver)
  }
})

input.addEventListener('keyup', function(e) {
  obj.text = e.target.value
})
```

从上述可以看到，Proxy 可以对整个对象进行代理拦截，并且返回一个新的对象。除此之外还可以对数组进行拦截。

Proxy 最大的问题便是兼容性不好，并且无法通过 polyfill 磨平。

