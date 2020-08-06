*   link 是从 html 引入的，@import 是从 css 引入的
*   link 会在浏览器加载页面是同步加载 css；页面加载完成后再加载 @import 的 css
*   优先级 link > @import
*   @import 是 css2.1 加入的语法，只有 IE5+ 才可识别，link 无兼容问题

