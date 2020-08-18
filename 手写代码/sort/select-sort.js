function selectSort(list) {
  var n = list.length;
  var minIndex;

  for (var i = 0; i < n - 1; i++) {
    minIndex = i;
    for (var j = i + 1; j < n; j++) {
      if (list[j] < list[minIndex]) {
        minIndex = j;
      }
    }
    var temp = list[i];
    list[i] = list[minIndex];
    list[minIndex] = temp;
  }
  return list;
}
