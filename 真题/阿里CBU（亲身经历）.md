# 电话面

## 笔试题

```js
/**
 * 根据表达式计算字母数
 * 说明：
 *   给定一个描述字母数量的表达式，计算表达式里的每个字母实际数量
 *   表达式格式：
 *     字母紧跟表示次数的数字，如 A2B3
 *     括号可将表达式局部分组后跟上数字，(A2)2B
 *     数字为1时可缺省，如 AB3。
 * 示例：
 *   countOfLetters('A2B3'); // { A: 2, B: 3 }
 *   countOfLetters('A(A3B)2'); // { A: 7, B: 2 }
 *   countOfLetters('C4(A(A3B)2)2'); // { A: 14, B: 4, C: 4 }
 */
/**
 * 思路：由于括号后面的数字是括号内字母的倍数，所以采用倒序的方式进行遍历
 */
function countOfLetters(letters) {
	var stack = []
  for(var n = letters.length - 1, i = n; i >= 0; i--) {
    var letter = letters[i]
    if(letter !== '(') { // '(' 后的字母全入栈
      stack.push(letter)
      continue
    }
    var cur = stack.pop() // 取出栈顶元素
    var str = '' // 组装字符串
    // 接下来肯定遇到的是字母，直到遇到')'
    while(cur !== ')') {
      str += cur
      cur = stack.pop()
    }
    let num = ''
    cur = stack.pop() // 这个时候cur是')'，所以再从栈中取一个字符
    while(!isNaN(cur)) {
      num += cur // 获取倍数
      cur = stack.pop()
    }
    stack.push(cur) // 此时cur是')'，将括号入栈
    stack.push(str.repeat(num)) // 将组装之后的字符串入栈
  }
  
 	stack = stack.reverse().filter(v => v) // 由于遍历的时候是倒序，且没有处理cur为undefined的情况，所以最后统一处理
  var str = stack.join('') // 得到处理完成后的字符串
  var hashMap = {}
  for(var n = str.length, i = 0; i < n; i++) {
    var char = str[i]
    if(isNaN(char)){ // 由于当前字符串仅有字母和数字两种情况，所以可以直接判断
      var j = i + 1
      var num = 0
      while(j < n) {
        if(!isNaN(str[j])) { // 往当前字符串后循环找数字，到底一个非数字的字符终止循环
          num = num * 10 + Number(str[j])
          j++
        } else{
          break
        }
      }
      // 首先判断需不需要初始化哈希表，由于1被隐藏了，所以num为0的时候num=1
      hashMap[char] = (hashMap[char] || 0) + (num || 1)
    }else { // 如果是数字，继续
      continue
    }
  }
  return hashMap
}
```

```js
/**
 * 实现一个`Foo`方法，接受函数`func`和时间`wait`
 * 返回一个新函数，新函数即时连续多次执行，但也只限制在`wait`的时间执行一次
 */
function Foo(func, wait) {
  /* 代码实现 */
  let flag = true
  return function() {
  	if(!flag) return
    flag = false
    setTimeout(function () {
      func()
      flag = true
    }, wait)
  }
}

/*
	解题思路：这里个人理解为手写节流
*/
```

```js
/**
 * 对象扁平化
 * 说明：请实现 flatten(input) 函数，input 为一个 javascript 对象（Object 或者 Array），返回值为扁平化后的结果。
 * 示例：
 *   var input = {
 *     a: 1,
 *     b: [ 1, 2, { c: true }, [ 3 ] ],
 *     d: { e: 2, f: 3 },
 *     g: null,
 *   }
 *   var output = flatten(input);
 *   output如下
 *   {
 *     "a": 1,
 *     "b[0]": 1,
 *     "b[1]": 2,
 *     "b[2].c": true,
 *     "b[3][0]": 3,
 *     "d.e": 2,
 *     "d.f": 3,
 *     // "g": null,  值为null或者undefined，丢弃
 *  }
 */
function flatten(data) {
  /* 代码实现 */
  var hashMap = {}
  
  function helper(data, key = '') {
    for(var i in data) {
      if(data[i] === null || data[i] === undefined) continue
      var k 
      if(Array.isArray(data)) {
        k = key? `${key}[${i}]` : i
      } else {
        k = key? `${key}.${i}` : i
      }
      if(typeof data[i] === 'object') {
				helper(data[i], k)
      } else {
        hashMap[k] = data[i]
      }
    }
  }
  
  helper(data)
  
  return hashMap
}
```

