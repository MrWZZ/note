# 模块和包

Lua 的模块是由变量、函数等已知元素组成的 table，因此创建一个模块很简单，就是创建一个 table，然后把需要导出的常量、函数放入其中，最后返回这个 table 就行。

```lua
-- 文件名为 module.lua
-- 定义一个名为 module 的模块
module = {}

-- 定义一个常量
module.constant = "这是一个常量"
 
-- 定义一个函数
function module.func1()
    io.write("这是一个公有函数！\n")
end

-- 外部访问模块里的这个私有函数，必须通过模块里的公有函数来调用
local function func2()
    print("这是一个私有函数！")
end

function module.func3()
    func2()
end

return module
```

## require 函数

Lua提供了一个名为require的函数用来加载模块。要加载一个模块，只需要简单地调用就可以了。  
执行 require 后会返回一个由模块常量或函数组成的 table，并且还会定义一个包含该 table 的全局变量。

```lua
-- module 模块为上文提到到 module.lua
require("module")

-- 或者给加载的模块定义一个别名变量，方便调用：
local m = require("module")
```

require使用的路径和普通我们看到的路径还有些区别，我们一般见到的路径都是一个目录列表。  
require的路径是一个模式列表，每一个模式指明一种由虚文件名（require的参数）转成实文件名的方法。  
更明确地说，每一个模式是一个包含可选的问号的文件名。  
匹配的时候Lua会首先将问号用虚文件名替换，然后看是否有这样的文件存在。如果不存在继续用同样的方法用第二个模式匹配。  
例如，路径如下：

```shell
?;?.lua;c:\windows\?;/usr/local/lua/?/?.lua
```

调用require "test"时会试着打开这些文件：

```shell
test
test.lua
c:\windows\test
/usr/local/lua/test/test.lua
```

require关注的问题只有分号（模式之间的分隔符）和问号，其他的信息（目录分隔符，文件扩展名）在路径中定义。

为了确定路径，Lua首先检查全局变量LUA_PATH是否为一个字符串，如果是则认为这个串就是路径；  
否则require检查环境变量LUA_PATH的值，如果两个都失败；  
require使用固定的路径（典型的"?;?.lua"）。

require的另一个功能是避免重复加载同一个文件两次。Lua保留一张所有已经加载的文件的列表（使用table保存）。  
如果一个加载的文件在表中存在, 则require简单的返回；表中保留加载的文件的虚名，而不是实文件名。  
所以如果你使用不同的虚文件名require同一个文件两次，将会加载两次该文件。比如require "foo"和require "foo.lua"，路径为"?;?.lua"将会加载foo.lua两次。  
我们也可以通过全局变量_LOADED访问文件名列表，这样我们就可以判断文件是否被加载过；  
同样我们也可以使用一点小技巧让require加载一个文件两次。  
比如，require "foo"之后_LOADED["foo"]将不为nil，我们可以将其赋值为nil，require "foo.lua"将会再次加载该文件。

一个路径中的模式也可以不包含问号而只是一个固定的路径，比如：

```shell
?;?.lua;/usr/local/default.lua
```

这种情况下，require没有匹配的时候就会使用这个固定的文件（当然这个固定的路径必须放在模式列表的最后才有意义）。

## dofile 函数

我们知道一个lua文件是作为一个代码块（chunk）存在的，其实质就是一个函数，那么最简单的，我在一个外部lua文件中写一段代码，然后在主lua文件中用dofile调用，外部文件的代码块就会执行了。

dofile 执行的函数中，是不会识别主程序中的局部变量的。

```lua
-- data.lua 文件中
function sayHello()
    print("Hello")
end
return sayHello

-- test.lua 文件中
func = dofile("data.lua")
func()
```