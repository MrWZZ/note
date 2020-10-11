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
// 页面下有那些子分类
var pages = [
    { name : "基本类型", url:"./pages/baseType.html"}
];
```
  -- lua.html
     存放lua主页面
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="/note/script/highlight.pack.js"></script>
    <script src="/note/script/marked.js"></script>
    <script src="/note/script/config.js"></script>
    <script src="/note/script/helper.js"></script>
    <link rel="stylesheet" href="/note/css/common.css">
    <link rel="stylesheet" href="/note/css/content.css">
    <link rel="stylesheet" href="/note/css/vs2015.css">
    <script src="./pages.js"></script>
    <title>Lua</title>
</head>
<body>
</body>
<script>InitContentPage()</script>
</html>
```