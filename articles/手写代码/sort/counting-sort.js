function countingSort(nums) {
  var list = [];
  var max = Math.max(...nums);
  var min = Math.min(...nums);

  for (var i = 0; i < nums.length; i++) {
    var temp = nums[i];
    list[temp] = list[temp] + 1 || 1;
  }

  var index = 0;
  for (var i = min; i <= max; i++) {
    while (list[i] > 0) {
      nums[index++] = i;
      list[i]--;
    }
  }

  return list;
}
