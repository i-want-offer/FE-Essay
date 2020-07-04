# Web Worker

>   现代浏览器为 JavaScript 创造的 **多线程环境**。可以新建并将部分任务分配到 worker 线程并行运行，两个线程可 **独立运行，互不干扰**，可以通过自带的 **消息机制** 相互通信

## 用法

```javascript
// 创建 worker
const worker = new Worker('work.js')

// 向 worker 线程推送消息
worker.postMessage('Hello world')

// 监听 worker 线程发送过来的消息
worker.onmessage = function(event) {
  console.log('Received message' + event.data)
}
```



## 限制

*   同源限制
*   无法使用 document、window、alert、confirm
*   无法加载本地资源