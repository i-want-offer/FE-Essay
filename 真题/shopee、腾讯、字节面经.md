## 算法题部分

### 字节

1.  写一个 Promise.all（功能要跟标准一样）

    [手写 Promise](https://github.com/LaamGinghong/handwritten-code/blob/master/promise/promise.js)

2.  只能通过 asyncAdd(a,b, callback) 这个异步方法去做加法，编写函数，参数为 Array<number>，返回参数数组的和

    ```js
    function add(a, b = 0, callback) {
      setTimeout(() => {
        callback(a + b);
      }, 1000);
    }

    async function asyncAdd(a, b) {
      return new Promise((resolve) => {
        add(a, b, (sum) => {
          resolve(sum);
        });
      });
    }

    function sum(nums) {
      return Promise.all(
        chunk(nums, 2).map(([a, b]) => {
          return asyncAdd(a, b);
        })
      );
    }

    function chunk(list) {
      const n = list.length;
      let index = 0;
      let resIndex = 0;
      const result = new Array(Math.ceil(length / 2));
      while (index < n) {
        result[resIndex++] = list.slice(index, (index += 2));
      }
      return result;
    }

    async function asyncSum(nums) {
      let chunkNums = await sum(nums);
      while (chunkNums.length > 1) {
        chunkNums = await sum(chunkNums);
      }
      return chunkNums.pop();
    }
    ```

3.  判断一个对象是否循环引用

    ```js
    function checkCycle(obj: object) {
      const stack = new Set<object>()
      let flag = false

      function helper(o: object) {
        if (!o) return
        if (stack.has(o)) {
          flag = true
          return
        }
        stack.add(o)
        for(const value of Object.values(obj)){
          typeof value === 'object' && helper(value)
        }
      }

      helper(obj)
      return flag
    }
    ```

4.  二叉树的最近公共祖先

    ```js
    function lowestCommonAncestor(root, p, q) {
      if (!root || root === p || root === q) return q;
      const left = lowestCommonAncestor(root.left, p, q);
      const right = lowestCommonAncestor(root.right, p, q);

      if (left && right) {
        return root;
      }

      return left || right;
    }
    ```

5.  二叉树的路径总和

    ```js
    function pathSum(root, sum) {
      if (!root) return [];

      const set = new Set();

      function dfs(node, list, isLeaf) {
        if (!node) {
          if (set.has(list)) return;
          if (isLeaf) set.add(list);
          return;
        }
        const l = list.slice();
        l.push(node.value);

        isLeaf = !(node.left || node.right);
        dfs(node.left, l, isLeaf);
        dfs(node.right, l, isLeaf);
      }

      dfs(root, [], !(node.left || node.right));

      const result = [];
      set.forEach((value) => {
        let item;
        for (const i of value) {
          item = (item || 0) + i;
        }
        if (item === sum) result.push(value);
      });
      return result;
    }
    ```

6.  手写一个 toy redux

7.  手写一个 toy Koa

8.  写一个异步任务调度器，功能就是可以并行多个限定数量的异步任务。参考 p-limit 库

9.  同花顺算法，判断一副牌中是否有同花顺。

    > 0 - 12 为 ♠，13 - 25 为 ♥，26 - 38 为 ♣，39 - 51 为 ♦，如果出现 5 张同花色，并顺序的，即为同花顺，

    > 输入： [4,2,3,1,5,6] 输出：true，输入[9,10,11,12,13,14],输出：false

    ```js
    function isStraightFlush(nums) {
      if (nums.length < 5) return false;
      nums.sort((a, b) => a - b);

      return isFlush(nums) && isStraight(nums);
    }

    function isFlush(nums) {
      const max = Math.max(...nums);
      const min = Math.min(...nums);

      let flag;
      if (min <= 12) {
        flag = max <= 12;
      } else if (min >= 13 && min <= 25) {
        flag = max >= 13 && max <= 25;
      } else if (min >= 26 && min <= 38) {
        flag = max >= 26 && max <= 38;
      } else {
        flag = max >= 39 && max <= 51;
      }

      return flag;
    }

    function isStraight(nums) {
      let flag = true;
      const n = nums.length;
      for (let i = 0; i < n - 4; i++) {
        flag = flag && nums[i + 4] - nums[i] === 4;
      }
      return flag;
    }
    ```

10. 手写一个 node.js 的 event 类，有 on, off, once, emit 等方法，注意 once 是只调用一次，这个题主要是 once，解法比较多，最好的解法参考[源码](https://github.com/nodejs/node/blob/v14.6.0/lib/events.js)

### 虾皮

1.  写一个空间复杂度为 O(1)的快速排序，现时 20 分钟（就一道，其余问项目和基础较多）

    ```js
    function quickSort(list, left = 0, right = list.length - 1) {
      var n = list.length;

      if (left < right) {
        var index = left - 1;

        for (var i = left; i <= right; i++) {
          if (list[i] <= list[right]) {
            index++;
            var temp = list[index];
            list[index] = list[i];
            list[i] = temp;
          }
        }
        quickSort(list, left, index - 1);
        quickSort(list, index + 1, right);
      }

      return list;
    }
    ```

### 腾讯

1.  进制转换问题，输入 AA，输出 27, 输入 AZ 输出 52，A -Z 分别代表，1 - 26。

    ```js
    // damon
    function _26convertTo10(str) {
      const n = str.length;
      if (!n) return 0;

      let num = 0;
      for (let i = n - 1, j = 1; i >= 0; i--, j *= 26) {
        const s = str[i].toUpperCase();
        num += (s.charCodeAt() - 64) * j;
      }

      return num;
    }
    ```

2.  判断两个对象是否相等，就是实现 lodash 的 isEqual

3.  大数加法，输入两个超过 js 最大数 2^53 - 1 范围的数，进行加法运算，如：输入：'999', '9999'，输出：'10998'

    ```typescript
    function addBigInt(str1: string, str2: string, isInt = true): string {
      const diff = str1.length - str2.length;

      if (diff >= 0) {
        str2 = isInt ? "0".repeat(diff) + str2 : str2 + "0".repeat(diff);
      } else {
        str1 = isInt ? "0".repeat(-diff) + str1 : str1 + "0".repeat(-diff);
      }

      let carry = 0;
      let res = "";

      for (let index = str1.length - 1; index >= 0; index--) {
        const s1 = str1[index];
        const s2 = str2[index];

        const num = +s1 + +s2 + carry;
        const ans = num % 10;

        res = `${ans}${res}`;

        carry = num >= 10 ? 1 : 0;
      }

      return `${carry || ""}${res}`;
    }
    ```

4.  大数加法带小数点，输入：'999.99' ， '9999.999'

    > 思路一样，拆成整数部分和小数部分

    ```typescript
    function FloatAdd(str1: string, str2: string): string {
      const [int1, decimal1 = "0"] = str1.split(".");
      const [int2, decimal2 = "0"] = str2.split(".");

      const sumInt = addBigInt(int1, int2);
      const sumDecimal = addBigInt(decimal1, decimal2, false);

      if (sumDecimal.length > Math.max(decimal1.length, decimal2.length)) {
        return addBigInt(sumInt, "1") + "." + sumDecimal.slice(1);
      } else {
        return sumInt + "." + sumDecimal;
      }
    }
    ```

5.  矩阵的最小路径和，这道题用到动态规划，没做过几乎想不到。所以我用了深搜，时间复杂度太高会超时，不过也算过了。[leetcode 地址](https://leetcode-cn.com/problems/minimum-path-sum/)

### 总结

几乎每道题做完都会问你思路，所以不要去背题。大概率问你的算法的时间复杂度和空间复杂度，做题的时候过了最好都思考下时间和空间复杂度分别是多少。难度都是简单-中等，最难的算“矩阵最小路径和”，其实题刷多了，这个也简单了。

## 基础部分

### HTTP 缓存

80%会问到，要非常清楚每个请求头，响应头，状态码，并且理清楚 HTTP 缓存从发送请求到响应请求整个流程下来发生的事情

### 性能优化

包体积，合并请求，代码压缩啥的，渲染优化等等。并且还会问如何检测性能情况，之后是怎么优化的

### 线上监控

### js 语言

闭包，作用域链，原型链等

### React 原理

### JSbridge 原理

### sentry 原理

### node

事件循环，与浏览器有啥不一样？nextTick 和 setImmdite 的区别？

cluster？

怎么重启服务器的？

Buffer 是啥?
