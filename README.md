### 新建内容分类

在html/knowledge目录下新建一个目录，如命名为:lua

则lua目录的结构为:

lua
  -- md
     存放md文件

  -- pages
     存放html文件

  -- res
     存放页面需要使用的图片

  -- pages.js
     配置页面
```js
// 页面的标题
var pageName = "Lua";
// 页面下有那些分类
var pages = [
    { name : "基本类型", url:"./pages/baseType.html"},
];
```
  -- lua.html
     存放lua主页面
