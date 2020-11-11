function shellSort(list) {
  var n = list.length;
  var gap = parseInt(n / 2); // 初始化步数
  while (gap) {
    // 逐步缩小步数
    for (var i = gap; i < n; i++) {
      // 逐步和前面其他成员比较交换
      for (var j = i - gap; j >= 0; j -= gap) {
        if (list[j] > list[j + gap]) {
          var temp = list[j + gap];
          list[j + gap] = list[j];
          list[j] = temp;
        } else {
          break;
        }
      }
    }
    gap = parseInt(gap / 2);
  }
}
