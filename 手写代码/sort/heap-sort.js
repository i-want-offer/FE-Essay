function heapSort(list) {
  buildHeap(list);
  // 循环 n-1 次，每次循环后交换堆顶元素和堆底元素并重新调整堆结构
  for (var i = list.length - 1; i > 0; i--) {
    [nums[i], nums[0]] = [nums[0], nums[i]];
    adjustHeap(nums, 0, i);
  }
  return list;
}

function buildHeap(nums) {
  // 注意这里的头节点是从0开始的，所以最后一个非叶子节点结果是 parseInt(nums.length / 2) - 1
  var start = parseInt(nums.length / 2) - 1;
  var size = nums.length;
  // 从最后一个非叶子节点开始调整，直至堆顶
  for (var i = start; i >= 0; i--) {
    adjustHeap(nums, i, size);
  }
}

function adjustHeap(nums, index, size) {
  // 交换后可能会破坏堆结构，需要循环使得每一个父节点都大于左右节点
  while (true) {
    var max = index;
    var left = index * 2 + 1; // 左节点
    var right = index * 2 + 2; // 右节点
    if (left < size && nums[max] < nums[left]) max = left;
    if (right < size && nums[max] < nums[right]) max = right;
    // 如果左右节点大雨当前节点则交换，并在循环一遍判断交换后是否破坏堆结构
    if (index !== max) {
      [nums[index], nums[max]] = [nums[max], nums[index]];
      index = max;
    } else {
      break;
    }
  }
}
