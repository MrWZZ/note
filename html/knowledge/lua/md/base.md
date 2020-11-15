# 基础语法

"下划线 + 大写字母"（如 _VERSION）组成的标识符通常被Lua语言用作特殊用途，应该避免这样命名变量。

Lua语言是对大小写敏感的。

在Lua语法中，连续语句之间的分隔符并不是必需的，如果有需要的话可以使用分号来进行分隔。

在Lua语言中，表达式之间的换行不起任何作用。

## 注释

```lua
-- 单行注释

--[[ 多行注释 ]]

--[[
一个常见的技巧是这样写
下次启用的时候，直接在上面加一个减号就剩解开这段代码
如：---[[
--]]
```

## 变量作用域

Lua 变量有三种类型：全局变量、局部变量、表中的域。  
Lua 中的变量全是全局变量，那怕是语句块或是函数里，除非用 local 显式声明为局部变量。  
局部变量的作用域为从声明位置开始到所在语句块结束。  
变量的默认值均为 nil。

应该尽可能的使用局部变量，访问局部变量的速度比全局变量更快。

## 类型和值

Lua语言是一种动态类型语言，在这种语言中没有类型定义，每个值都带有其自身的类型信息。

Lua语言中有8中基本类型： nil、boolean、number、string、userdata、function、thread、table。

### nil

nil 是一种只有一个 nil 值的类型，它的主要作用就是与其他所有值进行区分。Lua语言使用 nil 来表示无效值的情况。

### boolean

Boolean型具有两个值，true 和 false，它们分别代表了传统布尔值。  
在Lua中，条件测试将除 false 和 nil 外的所有其他值视为真。即 0 也被是为真。

Lua 中场景的逻辑运算符，如 and 、or 和 not 。  
and 相当于短路与操作，如果它的第一个操作数为false，则返回第一个操作数，否则返回第二个操作数。  
or 相当于短路或操作，如果它的第一个操作数不为false，则返回第一个操作数，否则返回第二个操作数。
not 为对值取反，且返回的是一个Boolean类型的值。

### number

在Lua 5.2 及之前的版本中，所有的数值都以双精度浮点格式表示。  
从Lua 5.3 开始，数值提供了64位的整型和双精度浮点类型。

具有十进制小数或者指数的数值会被当作浮点型值，否则会被当作整型值。

在少数情况下，需要区分整型值和浮点型值时，可以使用函数math.type。

```lua
math.type(3)    --> integer
math.type(3.0)  --> float
```

所有的算术操作符不论操作整型值还是浮点型值，结果都应该是一样的。

Lua 5.3 针对整数除法引入了一个称为 floor 除法的新算术运算符`//`。得到的结果为向下取整的数。

```lua
3 // 2    --> 1
3.0 // 2  --> 1.0
```

Lua语言提供了下列关系运算：

```lua
< > <= >= == ~=
```

当我们在整型操作时出现比 mininteger 更小或者 maxintege 更大的数值 ，结果就会回环。

```lua
math.maxinteger + 1 == math.mininteger     --> true
math.mininteger - 1 == math.maxinteger     --> true
```

我们可以简单地通过增加 0.0 的方法将整型值强制转换为浮点型值，一个整型值总是可
以被转换成浮点型值。  
通过与0进行按位或运算，可以把浮点型值强制转换为整型值。

### string

我们可以使用一对双引号或单引号来声明字符串常量，使用双引号和单引号声明字符串是等价的。

像长多行注释一样 ，可以使用一对双方括号来声明多行字符串常量。被方括号括起来的内容可以包括很多行，并且内容中的转义序列不会被转义。此外，如果多行 字符串中的第一个字符是换行符，那么这个换行符会被忽略。

```lua
page = [[
<html>
...
...
</html>
]]

-- 有时多行字符串中可以能有意外的 ]] 组合，这个时候我们只要在多行字符串标识中加入任意相匹配的等号就可以了

page = [==[
  ...
  ...
]==]
```

可以使用长度操作符`#`来获取字符串的长度：

```lua
a = "nihao"
print(#a)    --> 5
```

我们可以使用连结操作符`..`来进行字符字符串的链接。如果操作数中存在数值，那 Lua 语言会先把数值转换成字符串。 
如果在字符串相关的操作中使用`+`操作符，Lua 会尝试将字符串转换成数值再进行加运算，如果转换失败则会报错。

### table

Lua 言中的表本质上是一种辅助数组，这种数组不仅可以使用数值作为索引，由可以使用字符串或其他任意类型的值作为索引(nil 除外)。

我们可以简单的创建一个表：

```lua
a = {}
a[1] = 10
a["1"] = 20
-- 这里是两个值，他们的key类型不同。
a["key"] = 1
print(a.key)  --> 1
-- 这里a.key和a["key"]的写法是等价的。
```

不同于其他语言，Lua 中 table 的默认初始第一个元素的索引为1。  
table 不会固定长度大小，有新数据添加时 table 长度会自动增加，没初始的 table 都是 nil。

### function

在 Lua 中，函数是被看作是"第一类值（First-Class Value）"，函数可以存在变量里。

```lua
function functionName()
    -- 方法体
end

-- 方法赋值
fun = functionName
-- 执行方法
fun()

-- 使用匿名方法方式
fun1 = function(key) 
    -- 方法体
end
```

Lua 函数可以返回多个结果值。

```lua
function getMutilValue()
    return 1,2,3    
end

a,b,c = getMutilValue()
```

Lua 可以对多个变量同时赋值，变量列表和值列表的各个元素用逗号分开，赋值语句右边的值会依次赋给左边的变量。

当变量个数和值的个数不一致时，Lua会一直以变量个数为基础采取以下策略：

1. 变量个数 > 值的个数， 按变量个数补足nil。
2. 变量个数 < 值的个数，多余的值会被忽略。

Lua 函数可以接受可变数目的参数，和 C 语言类似，在函数参数列表中使用三点 **...** 表示函数有可变的参数。

```lua
function add(...) 
    for i,v in ipairs{...} do --> {...} 表示一个由所有变长参数构成的数组  
        print(i,v)
    end
end
```

通常在遍历变长参数的时候只需要使用 **{…}**，然而变长参数可能会包含一些 **nil**，那么就可以用 **select** 函数来访问变长参数了：**select('#', …)** 或者 **select(n, …)**

### thread 

在 Lua 里，最主要的线程是协同程序（coroutine）。它跟线程（thread）差不多，拥有自己独立的栈、局部变量和指令指针，可以跟其他协同程序共享全局变量和其他大部分东西。

### userdata

userdata 是一种用户自定义数据，用于表示一种由应用程序或 C/C++ 语言库所创建的类型，可以将任意 C/C++ 的任意数据类型的数据（通常是 struct 和 指针）存储到 Lua 变量中调用。