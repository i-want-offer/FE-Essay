# ES Next

>   由于 Babel 的强大和普及，现在 ES6 + 基本上已经是现代化开发的必备。通过新的语法糖，能让代码整体更为简洁和易读

*   声明

    *   let / const：块级作用域、不存在变量提升、暂时性死区、不允许重复声明
    *   const：声明常量，无法修改

*   解构赋值

*   class / extend：类声明与继承

*   Set / Map / Symbol / BigInt：新的数据结构

*   异步解决方案

    *   Promise 的使用和实现

    *   generator（迭代器）

        *   yield：暂停代码

        *   next()：继续执行代码

            ```javascript
            function* helloWorld() {
              yield 'hello'
              yield 'world'
              return 'ending'
            }
            
            const generator = helloWorld();
            generator.next() // { value: 'hello', done: false }
            generator.next() // { value: 'world', done: false }
            generator.next() // { value: 'ending', done: true }
            generator.next() // { value: undefined, done: true }
            ```

    *   async / await：是 generator 的语法糖，babel 中是基于 promise 实现

*   扩展运算符

    ```javascript
    const list1 = [1, 2, 3]
    const list2 = [...list1, 4, 5, 6] // [1, 2, 3, 4, 5, 6]
    
    const obj1 = { a: 1, b: 2}
    const obj2 = {...obj1, c: 3} // { a: 1, b: 2, c: 3}
    ```

*   可选调用链

    ```javascript
    // 理想中的数据格式
    const obj = {
      a: 1,
      b: {
        c: 2
      }
    }
    
    // 实际数据格式
    const obj = {}
    obj.b?.c // null
    
    const list = []
    list?.[0].a.b // null
    ```

*   空值合并

    ```javascript
    const a = '' : 10 // 10
    const b = '' ?? 10 // ''
    const c = undefined ?? 10 // 10
    ```

    

