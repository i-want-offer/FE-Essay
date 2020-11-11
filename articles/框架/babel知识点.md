# babel 知识点

## 执行顺序

*   plugins 的执行在 presets 之前
*   plugins 会按照声明的插件列表顺序顺序执行（first to last）
*   presets 会按照声明的列表顺序倒序执行（last to first）

