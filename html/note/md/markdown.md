## 段落

在一段连续文字前后，都有至少一个以上的空行，则被理解为段落。  
如果需要在一个段落内强制换行，需要在一行的结尾输入两个空格，再输入回车键。

## 标题

标题有两种写法：

1.使用底线的方式，其中"="和"-"可以是一个以上的任意数量。

```html
标题1
===

标题2
---
```

2.在行首使用1到6个#，对应H1到H6。

```html
# 标题1
## 标题2
...
###### 标题6
```

## 区块引用

对应html的中blockquote标签，在markdown语法中，需要在一个段落前输入一个">"加一个空格，表示后面的内容是一个引用。也可以用相同的语法表示嵌套的引用。

```html
> 引用
>
> > 嵌套引用
>
> 引用
```

## 列表

可以在一行前输入"+"加空格，表示一个无序列表。  
如果里面的内容过长，想换行的话，可以使用段落换行的写法，在后面跟两个空格加回车。

```html
+ 列表1
+ 列表2
+ 列表3，内容很长，需要换行  
  紧跟的内容
```

可以在一行前输入数字加"."跟一个空格表示一个有序列表。

```html
1. 列表1
2. 列表2
3. 列表3
```

## 代码块

使用3个"`"号加代码类型的方法，声明一个代码块。

```html
​```html

代码内容

​```
```

## 行内代码块

在一行中需要使用代码的话，可以使用一个"\`"号的方式。

```html
`行内代码`
```

## 分隔线

你可以在一行中用三个以上的星号、减号、底线来建立一个分隔线，行内不能有其他东西。

```html
***
---
```

## 超链接

可以在md中声明一个链接，在转换为html后，点击会跳转到指定网页。  
有两种写法，一种的直接跟网页网址。写法是中括号+小括号。

```html
[显示的文体描述](网站地址)
```
一种是先声明网站地址，使用中括号加冒号，后面在引用这个地址，达到复用的目的。
```html
[声明的ID]: 网站地址
[显示的文体描述][声明的ID]
```

## 图片引用

和超链接的两种写法一样，区别是需要在前面加一个"!"号，如果链接的图片位置是本地，则替换为本地地址。
```html
![图片描述](图片地址)

[声明地址ID]: 图片地址
![图片描述][声明地址ID]
```

## 文本强调

在一行中，可以使用下面的语法对文字进行加粗，或斜体。

```html
*斜体* or _斜体_
**加粗** or __加粗__
***粗斜体*** or ___粗斜体___
```

## 表格

使用"|"号来编写一个表格，最上一行代表表头，第二为对其方式，在之下为表格内容，且每一行的列数需要相等。  
其中":-"表示左对齐，":-:"表示居中对齐，"-:"表示右对齐。

```html
|表头1|表头2|表头3|
|:-|:-:|-:|
|内容1|内容2|内容3|
|内容1|内容2|内容3|
```

## 转义

对于以上用到的特殊符号，如果需要在md中原样显示的话，可以在该符号先加"\\"进行转义。

## 上标下标

md 语法是可以识别 html 标签语句的，上标是 `<sup>内容</sup>`，下标是`<sub>内容</sub>`。