# new

一句话介绍：

>   new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一。

举个例子

```js
// Otaku 御宅族
function Otaku(name, age) {
  this.name = name
  this.age = age
  
  this.habit = 'Games'
}

// 因为缺乏锻炼，所以身体素质堪忧
Otaku.prototype.strength = 60
Otaku.prototype.sayName = function() {
  console.log(`I'm ${this.name}`)
}

var person = new Otaku('Tom', 24)
console.log(person.name) // 'Tom'
console.log(person.age) // 24
console.log(person.strength) // 60

person.sayName() // I'm Tom
```

从这个例子中，我们可以看到实例 person 可以：

1.  访问到 Otaku 构造函数里的属性
2.  访问到 Otaku 原型里的属性



# 初步实现

因为 new 的结果是一个新的对象，所以在模拟实现的时候，我们也要建立一个新的对象，假设这个对象叫  obj，因为 obj 具有 Otaku 构造函数里的属性，所以开始实现第一版

```js
// 第一版
function objectFactory() {
  var obj = new Object()
  var	Constructor = [].shift.call(arguments)
  obj.__proto__ = Constructor.prototype
  Constructor.apply(obj, arguments)
  return obj
}
```

在这一版中，我们：

1.  用 new Object 的方式创建了一个新对象
2.  取出第一个参数，这个就是我们要传入的构造函数，此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
3.  将 obj 的原型指向构造函数的原型，这样 obj 就可以访问到构造函数原型的属性
4.  使用 apply 修改构造函数的 this 执行到新创建的对象，这样 obj 可以访问到构造函数中的属性
5.  返回 obj



# 第二版实现

由于构造函数也可以有返回值，根据定义，如果返回的是一个对象，则创建的实例为返回的对象，否则返回创建的对象。

```js
// 第二版
function objectFactory() {
  var obj = new Object()
  var Constructor = [].shift.call(arguments)
  obj.__proto__ = Constructor.prototype
  
  var res = Constructor.apply(obj, arguments)
  return typeof res === 'object' && res ? res : obj
}
```



# ES Next 实现

```js
function objectFactory(Fn, ...args) {
  const obj = Object.create(Fn.prototype)
  const result = Fn.apply(obj, args)
	
  return result && typeof result === 'object' ? result : obj
}
```



