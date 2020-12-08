function deepClone(data) {
  if (typeof data === 'object') {
    const result = Array.isArray(data) ? [] : {};
    for (let key in result) {
      if (typeof result[key] === 'object') {
        result[key] = deepClone(data[key]);
      } else {
        result[key] = data[key];
      }
    }
    return result;
  } else {
    return data;
  }
}
