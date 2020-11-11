function jsonStringify(data) {
  const type = typeof data;
  if (type !== "object") {
    if (/string|undefined|function/.test(type)) {
      data = `"${data}"`;
    }
    return String(data);
  } else {
    const json = [];
    const arr = Array.isArray(data);
    for (const k in data) {
      let v = data[k];
      let type = typeof v;
      if (/string|undefined|function/.test(type)) {
        v = `"${v}"`;
      } else if (type === "object") {
        v = jsonStringify(v);
      }
      json.push((arr ? "" : `"${k}"`) + String(v));
    }

    return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
  }
}
