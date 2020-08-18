function jsonParse(opt) {
  return new Function(`return ${opt}`)();
}
