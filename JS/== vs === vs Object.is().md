# `==` vs `===` vs `Object.is()`

>   大家是否和我一样有遇到过由于运算符（`==`）而引起的程序问题，但是为什么会造成这种问题呢？



## 值对比取决于2个因素

*   所操作的值
*   值的类型，如 String，Boolean...

在值对比时还有一个起着重要的作用的机制，那就是值的类型转换。



## 什么是类型转换？

JavaScript 作为一个弱类型语言，有时候值会从一个类型转换成其他类型，这个称之为隐式转换或强制转换，这些在我们使用运算符（`==`）时会导致一些错误发生。



## 比较运算符的种类

JavaScript 提供了3种比较运算符：

*   `==`
*   `===`
*   `Object.is()`

### `==`（非严格相等）

*   其被称为**相等操作符**，只会对比两个值是否相等，相等则会返回 true
*   在这种情况下，如果对比的值类型不同，则会自动将值隐式转换成一种常见的类型

```javascript
console.log(1 == '1') // true
console.log(true == 'true') // false
console.log(NaN == 'NaN') // false
console.log(NaN == NaN) // false
console.log(-0 == 0) // true
console.log(0 == '0') // true
console.log({ name: "Tom" } == { name: "Tom" }) // false

const a = { name: "Tom" }
const b = a
console.log(a == b) // true
```

**使用`==`总结**

*   `NaN` 不等于包含它在内的任何东西
*   -0 与 0 相等
*   `null` 等于 `null` 和 `undefined`
*   操作只可以自动转换为 String、Boolean、Number
*   String 类型比较区分大小写
*   两个操作值如果引用同一个对象，返回 true，否则 false
*   请记住 6 个虚值（null，undefined，''，0，NaN，false）

### `===`【严格相等】

*   其被称为 **全等操作符**，和 `==` 很相似，区别在于 `===` 不执行隐式转换
*   当两个操作值的值和类型都相等的情况下，才会返回 true

```javascript
console.log(1 === '1') // false
console.log(true === 'true') // false
console.log(true === true) // true
console.log(NaN === NaN) // false
console.log(null === null) // true
console.log('ara' == 'Ara') //false
console.log(-0 === 0) // true
console.log(null === undefined) // false
console.log({ name: "Tom" } === { name: "Tom" }) // false
```

**使用`===`总结**

*   `NaN` 不等于包含它在内的任何东西
*   -0 等于 0
*   null 等于 null，但不等于 undefined
*   String 严格区分大小写
*   两个操作值如果引用同一个对象，返回 true，否则 false

### Object.is()

*   其被称为 **同值相等**，是比较运算符中的一份子
*   在检查两个操作值是否相等时，用到了以下规则

#### 规则1：操作值均未被定义（`undefined`）

```javascript
let a
let b
Object.is(a, b) // true
```

#### 规则2：操作都是相同长度和顺序的字符串

```javascript
Object.is('abcdefg', 'abcdefg') // true
Object.is('abcdefg', 'ABCDEFG') // false
```

#### 规则3：操作值都是 null

```javascript
Object.is(null, null) // true
Object.is(null, 'null') // false
```

#### 规则4：操作值为对象且引用地址相同

```javascript
let a = { name: "Tom" }
let b = a

Object.is(a, b) // true
Object.is({ name: "Tom" }, { name: "Tom" }) // false
Object.is(window, window) // true
```

#### 规则5：操作值均非0和非NaN

```javascript
Object.is(1, 1) // true
Object.is(1, 2) // false
```

#### 规则6：操作值都是 +0 或 -0

```javascript
Object.is(0, 0) // true
Object.is(0, -0) // false
```

#### 规则7：操作值为 `NaN`

```javascript
Object.is(NaN, NaN) // true
Object.is(NaN, 0/0) // true
```



## polyfill

>   Object.is() 不支持 IE，因此使用 polyfill 代替

```javascript
if(!Object.is) {
  Object.is = function(a, b) {
    if(a === b) {
      return a !== 0 || 1/a === 1/b
    } else{
      return a !== a && b !== b
    }
  }
}
```

