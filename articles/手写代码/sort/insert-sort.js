function insertSort(list) {
  var n = list.length;
  var preIndex;
  var current;

  for (var i = 1; i < n; i++) {
    preIndex = i - 1;
    current = list[i];

    while (preIndex >= 0 && list[preIndex] > current) {
      list[preIndex + 1] = list[preIndex];
      preIndex--;
    }
    list[preIndex + 1] = current;
  }
  return list;
}
