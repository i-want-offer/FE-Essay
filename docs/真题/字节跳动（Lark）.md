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



# 二面

## 自我介绍

## 你觉得最有挑战的系统

## 整个系统中如何解决各个模块之间关联的问题

### 测试上线流程是怎样

### 如何保证在改动过程中不影响别的模块

## 阐述一下在系统中哪个模块比较复杂

### 了解整个模块是怎么进行设计的吗

## 场景题

### 如果一个电商的页面，有很多的商品列表，用户在加载这个页面的时候很慢，你会从哪个方面解决问题

### 假如用户明确反馈在渲染列表的时候明显卡顿，如何解决

### 你会如何分析具体的问题出现的位置

## 阐述一下重绘与重排

### 什么时候需要重排

## 有一个页面，可以在后台输入商品内容展示给用户查看，你会怎样进行设计

### 公共组件你会怎么进行设计

## 算法题

```js
/*
 给定一个整数数组，长度不定，如：[1, 2, 3, 4]，设计一个算法，要求你计算出每一项元素中，除了它以外其它元素的乘积。
 要求，算法中不能使用除法，同时时间复杂度必须控制在O(n)。
 demo：
 var list = [1, 2, 3, 4]
 return [24, 12, 8, 6]
*/

function helper(list) {
  var n = list.length
  var before = [1]
  var after = Array(list.length).fill(1)
  
  var i = 1
  
  while(i < n) {
    before[i] = before[i - 1] * list[i - 1]
    i++
  }
  
  i--
  while(i >= 0) {
		if(i === n - 1) {
      i--
      continue
    }
    after[i] = after[i + 1] * list[i + 1]
    i--
  }
  
  var result = []
  for(var j = 0; j < n; j++) {
    result.push(before[j] * after[j])
  }
  return result
}
```



