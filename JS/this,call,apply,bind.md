# this，call，apply，bind

## call 和 apply

### 共同点

*   都能够改变函数执行时的上下文，将一个对象的方法交给另一个对象来执行，并且是立即执行的
*   调用 call 和 apply 的对象，必须是一个函数 Function
*   第一个参数是一个对象。Function 的调用者将会指向这个对象。如果不传，则默认为全局对象 window

### 区别

区别主要体现在参数上

*   **call 的写法**

    `Function.call(obj, param1, param2, param3, ...)`

    >   第二个参数开始，可以接收任意个参数

    ```javascript
    function func(a,b,c) {}
    func.call(obj, 1, 2, 3)
    // func 实际接收到参数是 1，2，3
    func.call(obj, [1, 2, 3])
    // func 实际接收到的参数是 [1, 2, 3], undefined, undefined
    ```

*   **apply 的写法**

    `Function.apply(obj, [param1, param2, param3, ...])`

    >   第二个参数必须是数组或者类数组，他们都会转换成类数组

    ```javascript
    func.apply(obj, [1, 2, 3])
    // func 实际接收到的参数是 1，2，3
    func.apply(obj, {
      0: 1,
      1: 2,
      2: 3,
      length: 3
    })
    // func 实际接收到的参数是 1，2，3
    ```

### 用途

#### call 使用场景

1.  **对象的继承**

    ```javascript
    function Parent() {
      this.a = 1
      this.print = function() {
        console.log(this.a)
      }
    }
    
    function Son() {
      Parent.call(this)
      this.print()
    }
    
    Son() // 1
    ```

2.  **借用方法**

    ```javascript
    const domNodes = Array.prototype.slice.call(document.getElementByTagName('*'))
    ```

    这样，domNodes 就可以应用 Array 下所有的方法

#### apply 使用技巧

1.  **Math.max**：用来获取数组中最大的一项

    ```javascript
    const max = Math.max.apply(null, array)
    ```

    同理可以获得数组中最小的一项

2.  **数组的合并**：在 ES6 扩展运算符出现之前，可以使用 Array.prototype.push 来实现

    ```javascript
    const arr1 = [1, 2, 3]
    const arr2 = [4, 5, 6]
    Array.prototype.push.apply(arr1, arr2)
    console.log(arr1) // [1, 2, 3, 4, 5, 6]
    ```



## bind

>   bind 在 MDN 上的解释：bind() 方法创建以新的函数，在调用时设置 this 关键字为提供的值。并在调用新函数时，将给定参数列表作为原函数的参数序列的前若干项：
>
>   ```javascript
>   Functino.bind(thisArg, param1, param2, ...)
>   ```

bind 方法与 apply 和 call 类似，也能改变函数体内的 this 指向。

不同的是，**bind 方法的返回值是函数，并且需要稍后调用才会执行**。而 apply 和 call 是立即调用。

```javascript
function add(a, b) {
  return a + b
}

function sub(a, b) {
  return a - b
}

add.bind(sub, 5, 3) // 这是不会返回8
add.bind(sub, 5, 3)() // 调用后返回8
```

和 call、apply 一样，如果 bind 的第一个参数是 null 或者 undefined，this 就指向全局对象 window



## 总结

call 和 apply 的主要作用是改变对象执行上下文，并且是立即执行。他们在参数上的写法略有区别

bind 也能改变对象的执行上下文，与 call 和 apply 不同的是，它返回的是一个函数，需要调用才会执行