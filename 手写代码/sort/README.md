# 10 种排序算法

![10种排序性能](https://user-gold-cdn.xitu.io/2020/1/6/16f7b3db4a239442?imageslim)

## 冒泡排序

>   通过相邻元素比较和交换，使得每一趟循环都能找到未排序的子数组。

### 实现

```js
function bubbleSort(list) {
  var n = list.length
  if(!n) return []
  
  for(var i = 0; i < n; i++) {
    for(var j = 0; j < n - i - 1; j++) {
      if(list[j] > list[j + 1]) {
        var temp = list[j + 1]
        list[j + 1] = list[j]
        list[j] = temp
      }
    }
  }
  return list
}
```

### 优化

#### 单向冒泡

>   标记在一轮比较汇总中，如果没有需要交换的数据，说明数组已经是有序的，可以减少排序循环的次数。

```js
function bubbleSort(list) {
  var n = list.length
  if(!n) return []
  
  for(var i = 0; i < n; i++) {
    let mark = true // 如果在一轮比较中没有出现需要交换的数据，说明数组已经是有序的
    for(let j = 0; j < n - i - 1; j++) {
      if(list[j] > list[j + 1]) {
        var temp = list[j + 1]
        list[j + 1] = list[j]
        list[j] = temp
        mark = false
      }
    }
    if(mark) break 
  }
  
  return list
}
```

#### 双向冒泡

>   普通冒泡排序一轮只找到最大值或最小值其中之一，双向冒泡则多一轮筛选，既可以找到最大值，也可以找到最小值。

```js
function bubbleSort(list) {
  var low = 0
  var high = list.length - 1
  while(low < high) {
    var mark = true
    // 找到最大值放在右边
    for(var i = low; i < high; i++) {
      if(list[i] > list[i + 1]) {
        var temp = list[i + 1]
        list[i + 1] = list[i]
        list[i] = temp
        mark = false
      }
    }
    high--
    // 找到最小值放在左边
    for(var j = high; j > low; j--) {
      if(list[j] < list[j - 1]) {
        var temp = list[j - 1]
        list[j - 1] = list[j]
        list[j] = temp
        mark = false
      }
    }
    low++
    if(mark) break
  }
  return list
}
```



## 选择排序

>   依次找到剩余元素的最小值或者最大值，放置末尾或者开头。

### 实现

```js
function selectSort(list) {
  var n = list.length
  var minIndex
  
  for(var i = 0; i < n - 1; i++) {
    minIndex = i
    for(var j = i + 1; j < n; j++) {
      if(list[j] < list[minIndex]) {
        minIndex = j
      }
    }
    var temp = list[i]
		list[i] = list[minIndex]
    list[minIndex] = temp
  }
  return list
}
```



## 插入排序

>   以第一个元素为有序数组，其后的元素通过在这个已有序的数组中找到合适的元素并插入。

### 实现

```js
function insertSort(list) {
  var n = list.length
  var preIndex
  var current
  
  for(var i = 1; i < n; i++) {
    preIndex = i - 1
    current = list[i]
    
    while(preIndex >=0 && list[preIndex] > current) {
      list[preIndex + 1] = list[preIndex]
      preIndex--
    }
    list[preIndex + 1] = current
  }
  return list
}
```

### 优化

#### 拆半插入

```js
function insertSort(list) {
  var low
  var high
  var j
  var temp
  for (var i = 1; i < list.length; i++) {
    if (list[i] < list[i - 1]) {
      temp = list[i]
      low = 0
      high = i - 1
      while (low <= high) {
        let mid = Math.floor((low + high) / 2)
        if (temp > list[mid]) {
          low = mid + 1
        } else {
          high = mid - 1
        }
      }
      for (j = i; j > low; --j) {
        list[j] = list[j - 1]
      }
      list[j] = temp
    }
  }
  return list
}
```



## 希尔排序

>   通过某个增量 gap，将整个序列分给若干组，从后往前进行组内成员的比较和交换，随后逐步缩小增量至 1。希尔排序类似于插入排序，只是一开始向前移动的步数从 1 变成了 gap。

```js
function shellSort(list) {
  var n = list.length
  var gap = parseInt(n / 2) // 初始化步数
  while(gap) { // 逐步缩小步数
    for(var i = gap; i < n; i++) {
      // 逐步和前面其他成员比较交换
      for(var j = i - gap; j >=0; j -= gap) {
        if(list[j] > list[j + gap]) {
          var temp = list[j + gap]
          list[j + gap] = list[j]
          list[j] = temp
        } else {
          break
        }
      }
    }
    gap = parseInt(gap / 2)
  }
}
```



## 归并排序

>   递归将数组分成两个序列，有序合并这两个序列。作为一种典型的分治法思想算法应用，归并排序的实现有两种方法：
>
>   *   自上而下的递归
>   *   自下而上的迭代

```js
function mergeSort(list) {
  var n = list.length
  if(n < 2) return list
  
  var mid = Math.floor(n / 2)
  var left = list.slice(0, mid)
  var right = list.slice(mid)
  
  return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
  var result = []
  while(left.length && right.length) {
    if(left[0] <= right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
  while(left.length) {
    result.push(left.shift())
  }
  while(right.length) {
    result.push(right.shift())
  }
  return result
}
```



## 快速排序

>   选择一个元素作为基数，把比基数小的元素放在它左边，比它大的放在右边（相当于二分），再不断递归基数左右的序列。快速排序是一种分而治之思想在排序算法上的典型应用。本质上来看，快速排序应该算是在冒泡排序基础上递归分治法。快速排序的名字起的是简单粗暴，因为一听到这个名字你就知道它存在的意义，它是处理大数据最快的排序算法之一。

### 实现一

```js
function quickSort(list) {
  var n = list.length
  if(n <= 1) return list
  
  var pivotIndex = Math.floor(n / 2)
  var pivot = list[pivotIndex]
  var left = []
  var right = []
  
  for(var i = 0; i < n; i++) {
    if(i === pivotIndex) continue
    if(list[i] < pivot) {
      left.push(list[i])
    } else {
      right.push(list[i])
    }
  }
  
  return quickSort(left).concat(quickSort(right))
}
```

### 实现二

```js
function quickSort(list, left = 0, right = list.length - 1) {
  var n = list.length
	if(left < right) {
    var index = left - 1
    for(var i = left; i <= right; i++) {
      if(list[i] <= list[right]) {
        index++
        var temp = list[index]
        list[index] = list[i]
        list[i] = temp
      }
    }
    quickSort(list, left, index - 1)
    quickSort(list, index + 1, right)
  }
  
  return list
}
```



## 堆排序

>   说到堆排序，首先需要了解一种数据结构--堆。堆是一种完全二叉树，这种结构通常可以用数组表示。在实际应用中，堆又可以分为最小堆和最大堆，两者区别如下：
>
>   *   -max-heap property：对于所有除了根节点的节点i，A[Parent(i)] >= A[i]
>   *   -min-heap property：对于除了根节点的节点i，A[Parent(i)] <= A[i]
>
>   堆排序可以说是一种利用堆的概念来排序的选择排序，分为两种方法：
>
>   *   大顶堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排序；
>   *   小顶堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排序。

### 实现

```js
function heapSort(list) {
  buildHeap(list) 
  // 循环 n-1 次，每次循环后交换堆顶元素和堆底元素并重新调整堆结构
  for(var i = list.length - 1; i > 0; i--) {
    [nums[i], nums[0]] = [nums[0], nums[i]]
    adjustHeap(nums, 0, i)
  }
  return list
}

function buildHeap(nums) {
  // 注意这里的头节点是从0开始的，所以最后一个非叶子节点结果是 parseInt(nums.length / 2) - 1
  var start = parseInt(nums.length / 2) - 1
  var size = nums.length
  // 从最后一个非叶子节点开始调整，直至堆顶
  for(var i = start; i >= 0; i--) {
    adjustHeap(nums, i, size)
  }
}

function adjustHeap(nums, index, size) {
  // 交换后可能会破坏堆结构，需要循环使得每一个父节点都大于左右节点
  while(true) {
    var max = index
    var left = index * 2 + 1 // 左节点
    var right = index * 2 + 2 // 右节点
    if(left < size && nums[max] < nums[left]) max = left
    if(right < size && nums[max] < nums[right]) max = right
    // 如果左右节点大雨当前节点则交换，并在循环一遍判断交换后是否破坏堆结构
    if(index !== max) {
      [nums[index], nums[max]] = [nums[max], nums[index]]
      index = max
    } else {
      break
    }
  }
}
```



## 计数排序

>   以数组元素值为键，出现次数为值存进一个临时数组，最后再遍历这个临时数组还原回原数组。因为 JS 的数组下标是以字符串形式存储的，所以计数排序可以用来排列负数，但是不可以排列小数。

### 实现

```js
function countingSort(nums) {
  var list = []
  var max = Math.max(...nums)
  var min = Math.min(...nums)
  
  for(var i = 0; i < nums.length; i++) {
    var temp = nums[i]
    list[temp] = list[temp] + 1 || 1
  }
  
  var index = 0
  for(var i = min; i <= max; i++) {
    while(list[i] > 0) {
      nums[index++] = i
      list[i]--
    }
  }
  
  return list
}
```



## 桶排序

>   取 n 个桶，根据数组的最大值和最小值确认每个桶存放的数的区间，将元素插入到相应的桶里，最后再合并各个桶。
>
>   桶排序是计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。 为了使桶排序更加高效，我们需要做到这两点：
>
>   -   在额外空间充足的情况下，尽量增大桶的数量。
>   -   使用的映射函数能够将输入的N个数据均匀的分配到K个桶中。

```js
function bucketSort(nums) {
  // 桶的个数，只要是正数都行
  var num = 5
  var max = Math.max(...nums)
  var min = Math.min(...nums)
  // 计算每个桶存放的数值范围，至少为 1
  var range = Math.ceil((max - min) / num) || 1
  // 创建二维数组，第一维表示第几个桶，第二维表示桶里放的数
	var arr = Array.from(Array(num)).map(() => Array().fill(0))
  nums.forEach(val => {
  	// 计算元素应该分布在哪个桶
   	let index = parseInt((val - min) / range);
    // 防止index越界，例如当[5,1,1,2,0,0]时index会出现5
    index = index >= num ? num - 1 : index;
    let temp = arr[index];
    // 插入排序，将元素有序插入到桶中
    let j = temp.length - 1;
    while (j >= 0 && val < temp[j]) {
    	temp[j + 1] = temp[j];
      j--;
    }
    temp[j + 1] = val;
	});
  // 修改回原数组
  var res = [].concat.apply([], arr);
  nums.forEach((val, i) => {
  	nums[i] = res[i];
  });
  return nums;
}
```



## 基数排序

>   使用十个桶 0-9，把每个数从低位到高位根据位数放到相应的桶里，以此循环最大值的位数次。但只能排列正整数，因为遇到负号和小数点无法进行比较。
>
>   基数排序有两种方法：
>
>   -   MSD 从高位开始进行排序
>   -   LSD 从低位开始进行排序
>
>   基数排序 vs 计数排序 vs 桶排序：
>
>   这三种排序算法都利用了桶的概念，但对桶的使用方法上有明显差异：
>
>   -   基数排序：根据键值的每位数字来分配桶
>   -   计数排序：每个桶只存储单一键值
>   -   桶排序：每个桶存储一定范围的数值

```js
function radixSort(nums) {
  // 计算位数
  function getDigits(n) {
  	var sum = 0;
    while (n) {
    	sum++;
      n = parseInt(n / 10);
    }
    return sum;
  }
  // 第一维表示位数即0-9，第二维表示里面存放的值
  var arr = Array.from(Array(10)).map(() => Array());
  var max = Math.max(...nums);
  var maxDigits = getDigits(max);
  for (var i = 0, len = nums.length; i < len; i++) {
  	// 用0把每一个数都填充成相同的位数
    nums[i] = (nums[i] + '').padStart(maxDigits, 0);
    // 先根据个位数把每一个数放到相应的桶里
    var temp = nums[i][nums[i].length - 1];
    arr[temp].push(nums[i]);
  }
  // 循环判断每个位数
  for (var i = maxDigits - 2; i >= 0; i--) {
  	// 循环每一个桶
    for (var j = 0; j <= 9; j++) {
    	var temp = arr[j]
      var len = temp.length;
      // 根据当前的位数i把桶里的数放到相应的桶里
      	while (len--) {
          var str = temp[0];
          temp.shift();
          arr[str[i]].push(str);
       	}
      }
    }
    // 修改回原数组
    var res = [].concat.apply([], arr);
    nums.forEach((val, index) => {
    	nums[index] = +res[index];
    });
    return nums;
}
```

