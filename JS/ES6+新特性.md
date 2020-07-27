# es6（es2015）

*   类（class）
*   模块化（module）
*   箭头函数
*   函数默认值
*   模版字符串
*   解构赋值
*   延展字符串（...)
*   对象属性简写
*   let const



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

*   可选调用连
*   空值合并
*   Promise.allSettled
*   String.prototype.matchAll
*   Dynamic import（动态导入）
*   新的基本数据类型 BigInt
*   globalThis

