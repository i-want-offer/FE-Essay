function mergeSort(list) {
  var n = list.length;
  if (n < 2) return list;

  var mid = Math.floor(n / 2);
  var left = list.slice(0, mid);
  var right = list.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  var result = [];
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  while (left.length) {
    result.push(left.shift());
  }
  while (right.length) {
    result.push(right.shift());
  }
  return result;
}
