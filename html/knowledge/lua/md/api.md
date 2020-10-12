# String操作

**string.upper(argument)**  
字符串全部转为大写字母。

**string.lower(argument)**  
字符串全部转为小写字母。

**string.gsub(mainString,findString,replaceString,num)**  
在字符串中替换。  
mainString 为要操作的字符串， findString 为被替换的字符，replaceString 要替换的字符，num 替换次数（可以忽略，则全部替换）。

**string.find (mainString, findString, [init, [end]])**  
在一个指定的目标字符串中搜索指定的内容(第三个参数为索引),返回其具体位置。不存在则返回 nil。

**string.reverse(arg)**  
字符串反转。

**string.format(...)**  
返回一个类似printf的格式化字符串。

```lua
-- %c - 接受一个数字, 并将其转化为ASCII码表中对应的字符
string.format("%c", 83)                 -- 输出S
-- %d, %i - 接受一个数字并将其转化为有符号的整数格式
string.format("%+d", 17.0)              -- 输出+17
string.format("%05d", 17)               -- 输出00017
-- %o - 接受一个数字并将其转化为八进制数格式
string.format("%o", 17)                 -- 输出21
-- %u - 接受一个数字并将其转化为无符号整数格式
string.format("%u", 3.14)               -- 输出3
-- %x - 接受一个数字并将其转化为十六进制数格式, 使用小写字母
string.format("%x", 13)                 -- 输出d
-- %X - 接受一个数字并将其转化为十六进制数格式, 使用大写字母
string.format("%X", 13)                 -- 输出D
-- %e - 接受一个数字并将其转化为科学记数法格式, 使用小写字母e
string.format("%e", 1000)               -- 输出1.000000e+03
-- %E - 接受一个数字并将其转化为科学记数法格式, 使用大写字母E
string.format("%E", 1000)               -- 输出1.000000E+03
-- %f - 接受一个数字并将其转化为浮点数格式
string.format("%6.3f", 13)              -- 输出13.000
-- %q - 接受一个字符串并将其转化为可安全被Lua编译器读入的格式
string.format("%q", "One\nTwo")         -- 输出"One\
                                        -- 　　Two"
-- %s - 接受一个字符串并按照给定的参数格式化该字符串
-- 符号: 一个+号表示其后的数字转义符将让正数显示正号. 默认情况下只有负数显示符号.
-- 占位符: 一个0, 在后面指定了字串宽度时占位用. 不填时的默认占位符是空格.
-- 对齐标识: 在指定了字串宽度时, 默认为右对齐, 增加-号可以改为左对齐.
-- 宽度数值
-- 小数位数/字串裁切: 在宽度数值后增加的小数部分n, 若后接f(浮点数转义符, 如%6.3f则设定该浮点数的小数只保留n位, 若后接s(字符串转义符, 如%5.3s)则设定该字符串只显示前n位.
string.format("%s", "monkey")           -- 输出monkey
string.format("%10s", "monkey")         -- 输出    monkey
string.format("%5.3s", "monkey")        -- 输出  mon
```

**string.char(arg) 和 string.byte(arg[,int])**  
char 将整型数字转成字符并连接， byte 转换字符为整数值(可以指定某个字符，默认第一个字符)。

```lua
string.char(97,98,99,100)   --> abcd
string.byte("ABCD",4)       --> 68
string.byte("ABCD")         --> 65
```

**string.len(arg)**  
计算字符串长度。

**string.rep(string, n)**  
返回字符串string的n个拷贝。

**..**  
链接两个字符串。

**string.gmatch(str, pattern)**  
回一个迭代器函数，每一次调用这个函数，返回一个在字符串 str 找到的下一个符合 pattern 描述的子串。如果参数 pattern 描述的字符串没有找到，迭代函数返回nil。

**string.match(str, pattern, init)**  
string.match()只寻找源字串str中的第一个配对. 参数init可选, 指定搜寻过程的起点, 默认为1。
在成功配对时, 函数将返回配对表达式中的所有捕获结果; 如果没有设置捕获标记, 则返回整个配对字符串. 当没有成功的配对时, 返回nil。

**string.sub(s, i [, j])**  
字符串截取使用 sub() 方法。  
s：要截取的字符串。i：截取开始位置。j：截取结束位置，默认为 -1，最后一个字符。

# Table操作

**table.concat (table [, sep [, start [, end]]])**  
concat是concatenate(连锁, 连接)的缩写. table.concat()函数列出参数中指定table的数组部分从start位置到end位置的所有元素, 元素间以指定的分隔符(sep)隔开。

```lua
fruits = {"banana","orange","apple"}
print("连接后的字符串 ",table.concat(fruits,", "))
--> 连接后的字符串     banana, orange, apple
```

**table.insert (table, [pos,] value)**  
在table的数组部分指定位置(pos)插入值为value的一个元素. pos参数可选, 默认为数组部分末尾.

**table.remove (table [, pos])**  
返回table数组部分位于pos位置的元素. 其后的元素会被前移. pos参数可选, 默认为table长度, 即从最后一个元素删起。

**table.sort (table [, comp])**  
对给定的table进行升序排序。