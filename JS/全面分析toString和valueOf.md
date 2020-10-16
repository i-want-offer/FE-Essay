# 全面分析 toString 和 valueOf

在 JavaScript 中，有两个内置 API 是非常特殊的：

*   `toString()`
*   `valueOf()`

它们几乎出现在所有类型对应的内置对象的原型上（除了 null 和 undefined），它们的出现也是为了解决 JavaScript 的值运算问题，同时也给广大 jser 同胞带来了无比头痛的隐式转换的问题。

以下所有为自我总结经验，未必正确，请理性学习。

## toString

>   返回一个表示当前值的特殊字符串，当对象表示为文本值或以期望字符串的形式被引用时，toString 方法会被自动调用。

### 手动调用

我们尝试声明几种不同类型的变量，并且分别调用以下变量对应的 `toString` 方法。

```js
var a = 1
var b = 'string'
var c = [1, 2, 3]
var d = { a: 10 }
var e = function () { console.log('e') }

console.log(a.toString()) // '1'
console.log(b.toString()) // 'string'
console.log(c.toString()) // '1,2,3'
console.log(d.toString()) // '[object, Object]'
console.log(e.toString()) // 'function () { console.log('e') }'
```

我们可以看到不同类型的变量调用 `toString` 方法输出的字符串是不同的，这是因为这些变量对应的内置原型对象并没有继承来自 Object 原型上的 `toString` 方法，而是各自实现。

同时我们发现，当变量类型为对象的时候，调用 `toString` 时输出的是一个包含当前类型的字符串。

### 最精确的字符串

基于以上发现，我们可以使用这种方式来实现最精确的类型判断。

```js
var toString = Object.prototype.toString

toString.call(1) // '[object Number]'
toString.call('1') // '[object String]'
toString.call(false) // '[object Boolean]'
toString.call(() => {}) // '[object Function]'
toString.call([]) // '[object Array]'
toString.call({}) // '[object Object]'
toString.call(null) // '[object Null]'
toString.call(undefined) // '[object Undefined]'
toString.call(new Date()) // '[object Date]'
toString.call(window) // '[object Window]'
toString.call(Math) // '[object Math]'
```

### 隐式转换

当我们在进行操作符运算的时候，如果符号其中一侧为复杂类型，则会先调用 `toString` 进行隐式转换，然后在进行操作。

```js
var c = [1, 2, 3]
var d = {a:2}
Object.prototype.toString = function(){
    console.log('Object')
}
Array.prototype.toString = function(){
    console.log('Array')
    return this.join(',')   // 返回toString的默认值（下面测试）
}
Number.prototype.toString = function(){
    console.log('Number')
}
String.prototype.toString = function(){
    console.log('String')
}
console.log(2 + 1)  // 3
console.log('s')    // 's'
console.log('s' + 2)  // 's2'
console.log(c < 2)  // false        (一次 => 'Array')
console.log(c + c)  // "1,2,31,2,3" (两次 => 'Array')
console.log(d > d)  // false        (两次 => 'Object')
```

### 重写 toString

基于以上的特性，我们可以重写 toString 这个方法。

```js
class A {
  constructor(num) {
    this.num = num
  }
  
  toString() {
		return `我有好多钱：${this.num}`
  }
}

const a = new A(100)
console.log(a) // A {num: 100}
console.log(a.toString()) // '我有好多钱：100'
console.log(a + 1) // '我有好多钱：1001'
```

## valueOf

>   返回当前包装对象的原始值。

这个 API 通常是由 JavaScript 引擎内部调用，开发者一般情况下不会使用，其功能和 `toString` 大同小异。

### 二者区别

*   共同点：两者都是在值运算的时候会自动调用，从而触发隐式转换
*   不同点：**默认返回值不同，并且存在调用优先级关系**

在二者并存的情况下，**数值运算** 时优先使用 `valueOf` ，**字符运算** 时优先使用 `toString` 。

用 demo 来解释一下：

```js
class A {
  construtor(num) {
		this.num = num
  }
  
  valueOf() {
    return this.num
  }
  
  toString() {
    return `我好有钱：${this.num}`
  }
}

const a = new A(100)

console.log(String(a)) // '我好有钱：100'             -> toString
console.log(Number(a)) // 100                       -> valueOf
console.log(a + '22') // '10022'										-> valueOf
console.log(a == 100) // true 											-> valueOf
console.log(a === 100) // false，全等不触发隐式转换
```

但是问题出在 `console.log(a + '22') // 10022` ，这句话和我们解释并不相符，我们尝试去解释一下原因。

我们暂时先把 `valueOf` 方法去掉：

```js
class A {
  construtor(num) {
		this.num = num
  }
  
  toString() {
    return `我好有钱：${this.num}`
  }
}

const a = new A(100)

console.log(String(a)) // '我好有钱：100' 						-> toString
console.log(Number(a)) // NaN											 -> toString
console.log(a + '22') // '我好有钱：10022'						-> toString
console.log(a == 100) // false										 -> toString
```

然后再去掉 `toString` 方法：

```js
class A {
  construtor(num) {
		this.num = num
  }
  
  valueOf() {
    return this.num
  }
}

const a = new A(100)

console.log(String(a)) // '[objecg Object]'						-> toString 
console.log(Number(a)) // 100													-> valueOf
console.log(a + '22') // '10022'											-> valueOf
console.log(a == 100) // true													-> valueOf
```

可以看到，去掉 `toString` 之后，下面的 demo 没有上面的那么规整，原因在于对象a通过原型链继承了 `toString` 方法，所以我们再去掉这个方法。

```js
class A {
  construtor(num) {
		this.num = num
  }
  
  valueOf() {
    return this.num
  }
}

const a = new A(100)

Object.prototype.toString = null

console.log(String(a)) // 100													-> valueOf 
console.log(Number(a)) // 100													-> valueOf
console.log(a + '22') // '10022'											-> valueOf
console.log(a == 100) // true													-> valueOf
```

### 总结

总结可以发现，`valueOf` 更加偏向于运算，`toString` 更加偏向于调用。

1.  在进行对象运算时，将优先调用 `toString` 方法，如若没有重写 `toString ` 方法，则会调用 `valueOf` 方法；如果两个方法都没有重写，则会调用 Object 上面的 `toString `
2.  当进行强制类型转换时，如果转换成字符串则会调用 `toString` ，转换成数字则会调用 `valueOf`
3.  使用运算符进行运算时，`valueOf` 的优先级高于 `toString`

## 面试题分析

### 实现 `(a == 1 && a == 2 && a == 3) === true`

双等号会触发隐式转换，会调用 `valueOf` 这个方法，因此可以在此做文章。

```js
class A {
  constructor(num) {
    this.num = num
  }
  
  valueOf() {
    return this.num++
  }
}

const a = new A(1)
console.log(a == 1 && a == 2 && a == 3) // true
```

**进阶：使用全等（===）来实现以上效果。**

因为全等并不会触发隐式转换，因此上面的方法无法使用。

我们知道全局变量是会默认绑定在window对象上的，因此可以利用 `Object.defineProperty` 作劫持。

```js
let value = 1
Object.defineProperty(window, 'a', {
  get() {
    return value++
  }
})

console.log(a === 1 && a === 2 && a === 3) // true
```

### 实现无限累加器

这里有一个隐藏知识点：**当在浏览器中对函数直接调用 `console.log()` 或者 `alert()` 时，会默认触发函数的 `toString()` 方法。**

```js
function add(a) {
  function sum(b) {
    a += b
    return sum
  }
  sum.toString = function () {
    return a
  }
  return sum
}
```

### 柯里化实现多参数无限累加

是无限累加器的高阶版，实现思路类似。

```js
function add(...nums1) {
  function sum(...nums2) {
  	nums1 = [...nums1, ...nums2]
    return sum
  }
  
 	sum.toString = function () {
    return nums1.reduce((pre, cur) => pre + cur, 0)
  }
  
  return sum
}
```

