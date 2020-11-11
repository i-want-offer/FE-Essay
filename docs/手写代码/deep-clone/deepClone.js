function deepClone(data) {
  if (typeof data === "object") {
    var result = Array.isArray(data) ? [] : {};
    for (var key in result) {
      if (typeof result[key] === "object") {
        result[key] = deepClone(data[key]);
      } else {
        result[key] = data[key];
      }
    }
  } else {
    return data;
  }
}
