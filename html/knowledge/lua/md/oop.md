# 面向对象

我们知道，对象由属性和方法组成。LUA中最基本的结构是table，所以需要用table来描述对象的属性。

lua 中的 function 可以用来表示方法。那么LUA中的类可以通过 table + function 模拟出来。

至于继承，可以通过 metetable 模拟出来（不推荐用，只模拟最基本的对象大部分时间够用了）。

## 对象

```lua
-- 元类
Rectangle = {area = 0, length = 0, breadth = 0}

-- 派生类的方法 new
function Rectangle:new (o,length,breadth)
  o = o or {}
  setmetatable(o, self)
  self.__index = self
  self.length = length or 0
  self.breadth = breadth or 0
  self.area = length*breadth;
  return o
end

-- 派生类的方法 printArea
function Rectangle:printArea ()
  print("矩形面积为 ",self.area)
end

-- 创建对象
r = Rectangle:new(nil,10,20)

-- 访问属性
print(r.length)

-- 使用冒号 : 来访问类的成员函数
r:printArea()
```

## 继承

继承是指一个对象直接使用另一对象的属性和方法。可用于扩展基础类的属性和方法。

```lua
-- Meta class
Shape = {area = 0}
-- 基础类方法 new
function Shape:new (o,side)
  o = o or {}
  setmetatable(o, self)
  self.__index = self
  side = side or 0
  self.area = side*side;
  return o
end
-- 基础类方法 printArea
function Shape:printArea ()
  print("面积为 ",self.area)
end

-- 派生类
Square = Shape:new()
-- Derived class method new
function Square:new (o,side)
  o = o or Shape:new(o,side)
  setmetatable(o, self)
  self.__index = self
  return o
end
```

## 多态

Lua 中我们可以重写基础类的函数，在派生类中定义自己的实现方式

```lua
-- 派生类方法 printArea
function Square:printArea ()
  print("正方形面积 ",self.area)
end
```