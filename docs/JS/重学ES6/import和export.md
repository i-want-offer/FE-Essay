# Import 和 Export

在前端开发刀耕火种的时代，当时开发是没有模块化的概念。但随着 js 项目（因为最初的模块化并非作用于前端领域）越来越大，并且前端的地位越来越重要，急需模块化概念引入。

在 ES6 之前，社区制定了一些模块化方案：CommonJS 和 AMD；随着 ES6 语法层面的模块化推出之后，这两个逐渐被 import 和 export 取代。

## Export

export 用于规定模块对外的接口，不管你是否定义，export 导出的模块都是处于严格模式下，不能用于嵌入式脚本中。

export 导出的语法有两种：

*   命名导出（每个模块包含任意数量）
*   默认导出（每个模块只包含一个）

### 命名导出

如果在 a.js 文件中想要导出几个变量、函数或者类，可以采用下面两种方式：

```js
// 第一种
export var a = 1
export function b() {}
export class C {}

// 第二种
var a = 1
function b() {}
class C {}

export {a, b, C}
```

以上两种形式是等价的，但是更倾向于第二种，因为合并导出更有利于阅读。

同时，导出的名称可以使用 as 关键字进行修改。

```js
var a = 1
export { a as b, a as c}
```

利用 as 关键字进行重命名，同时还可以重复导出同一个变量。

不管采用上面那种导出方式，命名导出导出的都是 **变量** 。

### 默认导出

我们可以通过 `export default` 对一个模块进行默认导出，一个模块只允许有一个默认导出。

```js
export default function () {}

export default 1

var a = 1
export default a
```

可以看到，默认导出和命名导出不同的是，默认导出是允许导出一个常量。

## Import

同 export 一样，import 也对应有两种语法形式。

### 命名导入

当导入的模块采用命名导出的方式时，此时应当采用命名导入的方式进行导入。

```js
var a = 1
var b = 2
export {a, b}

import {a, b} from 'a.js'
```

同样的，我们可以使用 as 关键字进行重命名。

### 默认导入

当导入的模块采用默认导出的方式时，此时可以使用默认导入。

```js
export default class A {}

import A from 'a.js'
```

同时，两种导入方式是可以同时使用的。

### 其他特性

import 导入的模块是 readonly 的，不允许修改导入的模块。

import 还有另一个特性是具有提升性，会自动提升到文件的最顶端首先执行。

import 不仅仅可以导入模块，可以直接运行对应模块的代码。

```js
import 'a.js'
```

## `import()`

ES2020 中新增了 `import()` ，主要为了解决无法动态导入的问题。以前为了静态分析优化，import 语句必须放在这个模块文件的顶端，不能和表达式混合使用。随着项目复杂度的加大，动态导入成为了越来越重要的需求。

```js
import('a.js').then(value => console.log(value))
```

`import()` 会返回一个 Promise 对象。