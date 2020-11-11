# JS

## js 基本数据类型

>   最新的 ECMAScript 标准定义了 8 种数据类型

*   7 种原始类型
    *   Boolean
    *   Number
    *   String
    *   BigInt
    *   Null
    *   Undefined
    *   Symbol
*   Object



## 事件循环

```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

async1()

new Promise(function(resolve) {
  console.log('promise1')
  resolve()
}).then(function() {
  console.log('promise2')
})

console.log('script end')
```

1.  输出 script start

2.  输出 async1 start

    调用了 async1 函数

3.  输出 async 2

    调用了 async2 函数

4.  输出 promise1

    为何不是输出 async1 end？

    因为 async2 函数是异步调用(async await)，因此 async2 后面的任务是属于微任务，此时检查主线程，发现还有主线程还有宏任务未调用完(new Promise 内的任务属于宏任务)，因此输出 promise 1

5.  输出 script end

    上一步 Promise 内 resove 之后，直接跳出 Promise 执行 console

6.  输出 async1 end

    检查发现当前宏任务队列中已经全部执行完毕，开始执行微任务，自上往下按顺序执行

7.  输出 promise 2

    执行到第二个微任务

8.  输出 setTimeout

    微任务队列执行完毕，开始执行第二个宏任务



## 几种判断数据类型的优缺点

### typeof

```javascript
console.log(typeof 1) // number
console.log(typeof true) // boolean
console.log(typeof 'mc') // string
console.log(typeof function(){}) // function
console.log(typeof []) // object
console.log(typeof {}) // object
console.log(typeof null) // object
console.log(typeof undefined) // undefined
console.log(typeof Symbol()) // symbol
console.log(typeof 10n) // bigint
```

>   优点：能够快速区分基本数据类型
>
>   缺点：不能判断 object，array 和 null，都返回 object

### instanceof

```javascript
console.log(1 instanceof Number) // false
console.log(true instanceof Boolean) // false
console.log(10n instanceof BigInt) // false
console.log(Symbol() instanceof Symbol) // false
console.log('str' instanceof String) // false
console.log([] instanceof Array) // true
console.log(function() {} instanceof Function) // true
console.log({} instanceof Object) // true
```

>   优点：能够区分 array，object 和 function，适用于判断自定义的类实例对象
>
>   缺点：基本类型不能判断

### Object.prototype.toString.call()

```javascript
const { toString } = Object.prototype

console.log(toString.call(1)) // [object Number]
console.log(toString.call('str')) // [object String]
console.log(toString.call(true)) // [object Boolean]
console.log(toString.call([])) // [object Array]
console.log(toString.call({})) // [object Object]
console.log(toString.call(function() {})) // [object Function]
console.log(toString.call(undefined)); //[object Undefined]
console.log(toString.call(null)); //[object Null]
console.log(toString.call(Symbol())) // [object Symbol]
console.log(toString.call(10n)) // [object BigInt]
```

>   优点：精确判断数据类型
>
>   缺点：写法繁琐，需要封装



## null 和 undefined 的区别

undefined 是访问一个未初始化的变量时返回的值，而 null 是访问一个尚未存在的对象时所返回的值

undefined 看作是空的变量，null 看作是空的对象



## 实现链式调用

>   如 (5).add(3).minus(2) 

思路：扩展 Number 对象

```javascript
(function() {
  function add(val) {
    if(typeof val !== 'number' || isNaN(val)) throw new Error('请输入数字')
    return this + val
  }
  function minus(val) {
    if(typeof val !== 'number' || isNaN(val)) throw new Error('请输入数字')
    return this - val
  }
  
  Number.prototype.add = add
  Number.prototype.minus = minus
})()

console.log((5).add(3).minus(2)) // 6
```



