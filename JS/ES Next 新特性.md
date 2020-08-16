# es6（es2015）

*   类（class）

*   模块化（module）

*   箭头函数

*   函数默认值

*   模版字符串

*   解构赋值

*   延展字符串（...）

*   对象属性简写

*   let const

    let const 和 var 的对比：

    *   在同一个作用域内，var 可以重复声明变量，let、const 不能重复声明同一个变量。ES5 是函数作用域，即一个函数内就是一个作用域，ES6 是块级作用域，花括号内就是一个作用域。
    *   var 有变量提升，可以在变量声明前使用，let、const 不存在变量提升，在变量前使用会报错
    *   let、const 有暂时性死区，即父作用域中有 var 定义，在块作用域中又定义了 let、const，那再 let、const 之前使用就是死区
    *   const 必须在声明的时候赋值；const 声明的变量不能再修改



# es7（es2016）

*   `Array.prototype.includes()`
*   指数操作符 ( `**` 等价于 Math.pow())



# es8 （es2017）

*   async/await
*   Object.values
*   Object.entries
*   String padding
    *   String.prototype.padStart
    *   String.prototype.padEnd
*   函数参数列表结尾允许逗号
*   Object.getOwnPropertyDescriptors
*   SharedArrayBuffer 对象
*   Atomics 对象



# es9（es2018）

*   异步迭代（await for of）

    ```javascript
    async function process(array) {
      for await (const i of array) {
        doSomething(i)
      }
    }
    ```

*   Promise.finally()

*   rest/spread 属性

    ES6 引入了 rest 参数和扩展运算符，三个点仅用于数组。rest 参数语法允许我们讲一个不定数量的参数表示为一个数组

*   正则表达式命名捕获组

*   正则表达式反向断言

*   正则表达式 dotAll 模式

*   正则表达式 Unicode 转译

*   非转译序列的模版字符串



# es10（es2019）

*   行分隔符、段分隔符
*   更有好的 JSON.stringify()
*   新增了 Array 的 flat() 和 flatMap()
*   新增了 String 的 trimStart() 和 trimEnd()
*   Object.fromEntries()
*   Symbol.prototype.description
*   Symbol.prototype.matchAll
*   Function.prototype.toString 现在返回精确字符串，包括空格和注释
*   简化 `try {} catch {}`，修改 catch 绑定
*   Legacy RegEx
*   私有的实例方法和访问器



# es11（es2020）

*   可选调用链
*   空值合并
*   Promise.allSettled
*   String.prototype.matchAll
*   Dynamic import（动态导入）
*   新的基本数据类型 BigInt
*   globalThis

