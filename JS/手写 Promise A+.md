# 手写 Promise A+

## 术语

### 解决（fulfill）

指一个 promise 成功时进行的一系列操作，如状态的改变、回调的执行。虽然规范中使用 fulfill 来表示解决，但是目前常用 resolve 来代之

### 拒绝（reject）

指一个 promise 失败时进行的操作

### 终值（eventual value）

所谓终值，是指 promise 被解决时传递给解决回调的值，由于 promise 有一次性的特征，因此当这个值被传递时，标志着 promise 等待态的结束，故称之为终值，有时也直接简称值（value）

### 据因（reason）

拒绝原因，指在 promise 被拒绝时传递给回调的值



## Promise 的状态

>   一个 Promise 的当前状态必须为以下三种状态中的一种

### 等待态（Pending）

处于等待态时，Promise 可以迁移至执行态或拒绝态

### 执行态（Fulfilled）

处于执行态时，Promise 不能迁移至其他任何状态，必须拥有一个不可变得终值

### 拒绝态（Rejected）

处于拒绝态时，Promise 不能迁移至其他任何状态，必须拥有一个不可变的据因



## Then 方法

>   一个 Promise 必须提供一个 then 方法以访问其当前值、终值和据因

**Promise 的 then 方法接受两个参数**：

```javascript
promise.then(onFullfiled, onRejected)
```

**onFullfiled 和 onRejected 都是可选参数**：

*   如果 onFullfilled 不是函数，其必须被忽略
*   如果 onRejected 不是函数，其必须被忽略

### onFulfilled 特性

如果 onFulfilled 是一个函数：

*   当 Promise 执行结束后其必须被调用，其第一个参数为 Promise 的终值
*   当 Promise执行结束前其不可被调用
*   其调用次数不可超过一次

### onRejected 特性

如果 onRejected 是一个函数：

*   当 Promise 被拒绝执行后必须被调用，其第一个参数为 Promise 的据因
*   在 Promise 被拒绝前不可被调用
*   其调用次数不可超过一次

### 多次调用

then 方法可以被同一个 Promise 调用多次：

*   当 Promise 成功执行时，所有 onFulfilled 按照其注册顺序依次回调
*   当 Promise 被拒绝执行时，所有 onRejected 按照其注册顺序依次回调

### 返回

then 方法的返回值可以是一个任意值

```typescript
type PromiseAPlusState = 'pending' | 'fulfilled' | 'rejected'
type PromiseAPlusExecutor<T> = (
	resolve: (value: T) => void
	reject: (reason: string) => void
) => void;
type PromiseAPlusOnFulfilled<T> = (value: T) => T | void | PromiseAPlus<T>;
type PromiseAPlusOnRejected = (reason: string) => void;

interface PromiseAPlus<T> {
  new (executor: PromiseAPlusExecutor)
  then<U>(
    onFulfilled: (value: T) => void, 
    onRejected: (reason: string) => void
  ): PromiseAPlus<U> | void | any
}

class Promise<T> implements PromiseAPlus<T> {
  private _value: T 
  private _reason: string
  private _state: PromiseAPlusState = 'pending'
  
  private _fulFilledCallbacks: PromiseAPlusOnFulfilled<T>[] = []
  private _rejectedCallbacks: PromiseAPlusOnRejected[] = []
  
  constructor(executor) {
    try {
      executor(this._resolve, this._reject)
    }catch(e) {
      this._reject(e)
    }
  }
  
  private _resolve = (value: T) => {
    if(this._state === 'pending') {
      this._state = 'fulfilled'
      this._value = value
      
      this._fulFilledCallbacks.forEach((fn) => {
        fn(this._value)
      })
    }
  }
  
  private _reject = (reason: string) => {
    if(this._state === 'pending') {
      this._state = 'rejected'
      this._value = value
      
      this._rejectedCallbacks.forEach((fn) => {
        fn(this._reason)
      })
    }
  }
  
  public then = <U = T>(onFulfilled, onRejected) => {
    return new PromiseAPlus<U>((resolve, reject) => {
      if(this._state === 'fulfilled') {
        try {
          resolve(onFullfilled(this._value))
        }catch(e) {
          reject(e)
        }
      }else if(this._state === 'rejected') {
        try {
          onRejected(this._reason)
        }catch(e) {
          reject(e)
        }
      }else {
        this._fulFilledCallbacks.push((value) => {
          try{
            resolve(onFulfilled(value))
          }catch(e) {
            reject(e)
          }
        })
        this._rejectedCallbacks.push((reason) => {
          try{
						onRejected(reason)
          }catch(e) {
            reject(e)
          }
        })
      }
    })
  }
}
```

