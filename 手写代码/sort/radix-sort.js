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
    nums[i] = (nums[i] + "").padStart(maxDigits, 0);
    // 先根据个位数把每一个数放到相应的桶里
    var temp = nums[i][nums[i].length - 1];
    arr[temp].push(nums[i]);
  }
  // 循环判断每个位数
  for (var i = maxDigits - 2; i >= 0; i--) {
    // 循环每一个桶
    for (var j = 0; j <= 9; j++) {
      var temp = arr[j];
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
