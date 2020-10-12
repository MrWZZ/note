# 循环

## while

```lua
while(condition) do
    -- 逻辑
end
```

## for

for的三个表达式在循环开始前一次性求值，以后不再进行求值。比如上面的f(x)只会在循环开始前执行一次，其结果用在后面的循环中。

```lua
-- 数值for循环
for i=0,10,1 do
    -- 逻辑
end
-- 其中第3个数为每次变化的值

-- 这里类别于其他语言为 
-- for(int i=0; i <= 10, i++)

```

泛型 for 循环通过一个迭代器函数来遍历所有值，类似 java 中的 foreach 语句。

```lua
-- 泛型for循环
a = {"one", "two", "three"}
for k, v in ipairs(a) do
    -- 逻辑
end 
```

其中 ipairs 仅仅遍历值，按照索引升序遍历，索引中断停止遍历。即不能返回 nil,只能返回数字 0，如果遇到 nil 则退出。  
pairs 能遍历集合的所有元素。即 pairs 可以遍历集合中所有的 key，并且除了迭代器本身以及遍历表本身还可以返回 nil。

## repeat ... until 

```lua
repeat 
    -- 逻辑
until(condition)
```

如果条件判断语句（condition）为 false，循环会重新开始执行，直到条件判断语句（condition）为 true 才会停止执行。

# 分支控制

```lua
if(condition) then
    -- 逻辑
elseif(condition) then
    -- 逻辑
else
    -- 逻辑
end
```