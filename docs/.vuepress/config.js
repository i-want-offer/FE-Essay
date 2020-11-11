const fs = require("fs");
const path = require("path");

const ignoreList = [".vuepress", ".DS_Store"];

function buildChildren(path) {
  const files = fs.readdirSync(path);
  return files
    .map((file) => {
      if (ignoreList.includes(file)) return;
      const current = {title: file};
      const subPath = `${path}/${file}`;
      if (fs.statSync(subPath).isDirectory()) {
        current.children = buildChildren(subPath);
      } else {
        if (file === "README.md") {
          current.path = `${path.slice(37)}/`;
        } else {
          const suffixName = file.slice(-3);
          if (suffixName !== ".md") return;
          current.path = `${path.slice(37)}/${file.slice(0, -3)}`;
        }
      }
      return current;
    })
    .filter((item) => item);
}

const sidebar = buildChildren(path.resolve(__dirname, "../"));

module.exports = {
  title: "前端随笔 FE-Essay",
  description:
    "记录前端重要知识点和遇到的好文章，同时还有前端重要算法知识，但最关键的是包含各大小厂真题。",
  themeConfig: {
    nav: [{text: "GitHub", link: "https://github.com/i-want-offer"}],
    sidebar,
  },
};
