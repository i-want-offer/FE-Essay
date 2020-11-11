function quickSort(list) {
  var n = list.length;
  if (n <= 1) return list;

  var pivotIndex = Math.floor(n / 2);
  var pivot = list[pivotIndex];
  var left = [];
  var right = [];

  for (var i = 0; i < n; i++) {
    if (i === pivotIndex) continue;
    if (list[i] < pivot) {
      left.push(list[i]);
    } else {
      right.push(list[i]);
    }
  }

  return quickSort(left).concat(quickSort(right));
}
