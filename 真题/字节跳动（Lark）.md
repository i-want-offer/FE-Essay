# 一面

## 自我介绍

## 平时怎么提升自己的前端水平

## github 上面主要写什么

## 笔试题

1.  ![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200902162726.png)

2.  ![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200902162836.png)

3.  ```js
    // 任务
    // 面试官提出的问题将出现在这里。
    
    // 写出下面这段代码打印的结果
    async function async1() {
      console.log('async1 start');
      await async2();
      console.log('async1 end');
    }
    
    async function async2() {
      console.log('async2 start');
      return new Promise((resolve, reject) => {
        resolve();
        console.log('async2 promise');
      })
    }
    
    console.log('script start');
    
    setTimeout(function() {
      console.log('setTimeout');
    }, 0);
    
    async1();
    
    new Promise(function(resolve) {
      console.log('promise1');
      resolve();
    }).then(function() {
      console.log('promise2');
    }).then(function() {
      console.log('promise3');
    });
    
    console.log('script end');
    ```

4.  ![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200902163011.png)

5.  ![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200902163024.png)



## 浏览器渲染机制的理解

## 性能优化方面的理解

