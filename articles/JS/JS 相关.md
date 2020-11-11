# JS 相关

## 创建对象的方式

```javascript
// 对象字面量
const obj = {}

// 构造函数
function Obj() {}
const obj = new Obj()

// Object.create，此时属性挂载在原型上
const obj = Object.create({name: 'name'})
```



## 原型链示意图

![原型链示意图](https://user-gold-cdn.xitu.io/2019/12/31/16f5b4923fee57ff?imageslim)



## instanceof 原理

>   用来测试一个对象是否在其原型链中是否存在一个构造函数的 prototype 属性

```javascript
function Person() {}
function Foo() {}

// 原型继承
Foo.prototype = new Person()
const foo = new Foo()

console.log(foo.__proto__ === Foo.prototype) // true
console.log(foo instanceof Foo) // true
console.log(Foo.prototype.__proto__ === Person.prototype) // true
console.log(foo instanceof Person) // true
console.log(foo instanceof Object) // true

// 更改 Foo.prototype 指向
Foo.prototype = {}
console.log(foo.__proto__ === Foo.prototype) // false
console.log(foo instanceof Foo) // false
console.log(foo instanceof Person) // true
```

```typescript
// 手写 instanceof
function _instanceof(leftObj: object, rightObj: object): boolean {
  let rightProto = right.prototype // 右值取原型
  leftObj = leftObj.__proto__ // 左值取 __proto__
  while(true) {
    if(leftObj === null) return false
    else if(leftObj === rightProto) return true
    leftObj = leftObj.__proto__
  }
}
```



## new 运算符原理

1.  创建一个空对象
2.  让空对象的 `__proto__` (IE 没有该属性) 成员指向构造函数的 prototype 成员对象
3.  使用 apply 调用构造函数，属性和方法被添加到 this 引用的对象中
4.  如果构造函数中没有返回其他对象，那么返回 this，即创建的这个新对象；否则，返回构造函数返回的对象

```typescript
function _new(fn: () => void) {
  const obj = Object.create(fn.prototype)
  const result = fn.apply(obj)
  if(result && (typeof result === 'object' || typeof result === 'function')) {
    // 如果构造函数执行的结果返回的是一个对象，那么返回这个对象
    return result
  }
  // 如果构造函数返回的不是一个对象，那么返回创建的新对象
  return obj
}
```



## JS 继承

```javascript
function Father(name) {
  // 实例属性
  this.name = name
  // 实例方法
  this.sayName = function() {
    console.log(this.name)
  }
}

// 原型属性
Father.prototype.age = 19
// 原型方法
Father.prototype.sayAge = function() {
  console.log(this.age)
}
```

1.  原型链继承

    >   将父类的实例作为子类的原型

    ```javascript
    function Son(name) {
      this.name = name
    }
    
    Son.prototype = new Father()
    
    const son = new Son('son')
    son.sayName() // son
    son.sayAge() // 19
    ```

    优点：

    1.  简单，易于实现
    2.  父类新增原型方法、原型属性，子类都能访问到

    缺点：

    1.  无法实现多继承，因为原型一次只能被一个实例更改
    2.  来自原型对象的所有属性被所有实例共享
    3.  创建子类实例时，无法向父构造函数传参

2.  构造继承

    >   复制父类的实例属性给子类

    ```javascript
    function Son(name) {
    	Father.call(this, "Son props")
      this.name = name
    }
    
    const son = new Son('son')
    son.sayName() // son
    son.sayAge() // 报错，无法继承父类原型
    console.log(son instanceof Son) // true
    console.log(son instanceof Father) // false
    ```

    优点：

    1.  解决了原型链继承中实例共享父类引用属性的问题
    2.  创建子类实例时，可以向父类传参
    3.  可以实现多继承（call 多个父类对象）

    缺点：

    1.  实例并不是父类的实例，只是子类的实例
    2.  只能继承父类实例属性和方法，不能继承原型属性和方法
    3.  无法实现函数复用，每个子类都有父类实例函数的副本，影响性能

3.  组合继承

    >   将原型链和构造函数组合一起，使用原型链实现对原型属性和方法的继承，使用构造函数实现实例属性继承

    ``` javascript
    function Son(name) {
      // 第一次调用父类构造器 子类实例增加父类实例
      Father.call(this, 'Son props')
      this.name = name
    }
    
    Son.prototype = new Father()
    
    const son = new Son('son')
    son.name // 'son'
    son.sayAge() // 19
    son.sayName() // 'son'
    son instanceof Son // true
    son instanceof Father // true
    son.constructor === Father // true
    son.constructor === Son // false
    ```

    优点：

    1.  弥补了构造继承的缺点，可以同时继承实例属性方法和原型属性方法
    2.  既是子类的实例，也是父类的实例
    3.  可以向父类传参
    4.  函数可以复用

    缺点：

    1.  调用了两次父类构造函数，生成了两份实例
    2.  构造函数（constructor）指向问题

4.  实例继承

    >   为父类实例添加新特性，作为子类实例返回

    ```javascript
    function Son(name) {
    	const father = new Father('Son Props')
      father.name = name
      return father
    }
    
    const son = new Son('son')
    son.name // son
    son.sayAge() // 19
    son.sayName // son
    son instanceof Father // true
    son instanceof Son // false
    son.constructor === Father // true
    son.constructor === Son // false
    ```

    优点：

    1.  不限制调用方式

    缺点：

    1.  实例是父类的实例，不是子类的实例
    2.  不支持多继承

5.  拷贝继承

    >   对父类实例中的方法和属性拷贝给子类的原型

    ```javascript
    function Son(name) {
      const father = new Father('Son props')
      for( let i in father) {
        Son.prototype[i] = father[i]
      }
      Son.prototype.name = name
    }
    
    const son = new Son('son')
    son.sayAge() // 19
    son.sayName() // son
    son instanceof Father // false
    son instanceof Son // true
    son.constructor === Father // false
    son.constructor === Son // true
    ```

    优点：

    1.  支持多继承

    缺点：

    1.  效率低，性能差，内存占用高（因为需要拷贝父类属性）
    2.  无法获取父类不可枚举的方法

6.  寄生组合继承

    >   通过寄生方式，砍掉父类的实例属性，避免组合继承生成两份实例的缺点

    ```javascript
    function Son(name) {
      Father.call(this)
      this.name = name
    }
    
    Son.prototype = Object.create(Father.prototype)
    Son.prototype.constructor = Son
    
    const son = new Son('son')
    son.sayAge // 19
    son.sayName // son
    son instanceof Father // true
    son instanceof Son // true
    son.constructor === Father // false
    son.constructor === Son // true
    ```

    优点：

    1.  比较完美（js 实现继承首选方式）

    缺点：

    1.  实现方式较为复杂



## 防抖与节流

### 防抖

>   动作停止后的时间超过设定的时间时执行一次函数。
>
>   注意：这里的动作停止表示你停止触发函数，从这个时间点开始计算，当间隔时间等于你设定的时间，才会执行里面的回调函数

```typescript
function debounce(fn: () => void, delay: number) {
  let timer: number | null = null
  return function() {
    if(timer) window.clearTimeout(timer)
    timer = window.setTimeout(function() {
      fn()
    }, delay)
  }
}

window.addEventListener('scroll', debounce(() => {
  console.log('scroll')
}, 1000))
```

### 节流

>   一定时间内执行的操作只会执行一次，也就是预先设定一个执行周期，当调用动作的即刻大于等于执行周期时执行该动作，然后进入下一个周期

```typescript
function throttle(fn: () => void, delay: number) {
  let flag = true
  return function() {
    if(!flag) return
    flag = false
    setTimeout(function() {
      fn()
      flag = true
    }, delay)
  }
}
```



## 运行机制

### 单线程

>   作为浏览器的脚本语言，因此 JS 注定是单线程

>   单线程同一时间只能做一件事，为了解决这个问题，JS 的设计者将所有任务分为两种：同步任务（synchronous）和异步任务（asynchronous）

### 同步任务和异步任务

>   同步任务：在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行下一个任务
>
>   异步任务：不进入主线程，而是进入任务队列（task queue），只有任务队列通知主线程，该任务才会进入主线程执行

### 任务队列

![任务队列](https://user-gold-cdn.xitu.io/2020/1/2/16f658e6fab89441?imageslim)

异步任务会先到事件列表注册函数，如果事件列表中的事件触发了，会将这个函数移入任务队列中（DOM 操作对应 DOM 事件，资源加载操作对应加载事件，定时器操作可以看作一个‘时间到了’的事件）

### 宏任务和微任务

![宏任务和微任务](https://user-gold-cdn.xitu.io/2020/1/2/16f65a5b91838425?imageslim)

*   **宏任务**

    整体代码 script，setTimeout，setInterval，setImmediate（仅在 Node 环境），I/O，requestAnimationFrame（仅在浏览器环境）

*   **微任务**

    ` Promise.then | catch | finally`，`process.nextTick`（仅在 Node 环境），MutationObserver（仅在浏览器环境）

### 事件循环（Event Loop）

![事件循环示意图](https://user-gold-cdn.xitu.io/2020/1/2/16f65ad8abbe108a?imageslim)

1.  整体 script 作为第一个***宏任务***开始执行，此时会把所有代码分为“**同步任务**”和“**异步任务**”两部分
2.  同步任务直接进入主线程依次执行
3.  异步任务再分为***宏任务***和***微任务***
4.  宏任务进入事件列表中，并在里面注册回调函数，每当指定的事件完成时，事件列表会将这个函数移到任务队列中
5.  微任务也会进入另一个事件列表，并执行第 4 步一样的操作
6.  当主线程的任务执行完毕，主线程为空，此时会检查微任务的任务队列，如果有任务，就全部执行，没有就执行下一个宏任务
7.  上述过程不断重复，这就是**事件循环（Event Loop）**



