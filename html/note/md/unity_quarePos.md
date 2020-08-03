### 正方形环绕

功能：给定一个0-1的值，以正方形环绕的方式，获取这个值所在正方形上的位置。一般用于图片使用圆形裁剪时，需要将一个特效放在当前裁剪的位置。

使用：

```c#
// 用于测试的物体
public GameObject testGo;
// 用于测试的数据
[Range(0,1)]
public float surroundValue;

public SquareSurround SquareSurround;
public void Start()
{
    // 初始化，假定物体是在回绕一个宽为10，长为20的方形环绕
    SquareSurround = new SquareSurround(10, 20);
}

public void Update()
{
    if(testGo != null)
    {
        testGo.transform.localPosition = SquareSurround.GetSquareSurroundPosition(surroundValue);
    }
}
```

源码：

```c#
using System;
using UnityEngine;

public class SquareSurround
{
    private float halfWidth;
    private float halfHeight;
    private float angleValue;
    private float LeftTopValue;
    private float LeftBottomValue;
    private float RightTopValue;
    private float RightBottomValue;
    private Vector2 v;

    public SquareSurround(float width, float height)
    {
        this.halfHeight = height / 2;
        this.halfWidth = width / 2;

        var leftAngle = Math.Atan(halfWidth / halfHeight) * (180 / Math.PI);
        angleValue = (float)(leftAngle / 360f);
        //左上角
        LeftTopValue = 1 - angleValue;
        //左下角
        LeftBottomValue = 0.5f + angleValue;
        //右下角
        RightBottomValue = 1 - 0.5f - angleValue;
        //右上角
        RightTopValue = angleValue;
        v = Vector2.zero;
    }

    public Vector2 GetSquareSurroundPosition(float value)
    {
        if (value <= 1 && value > LeftTopValue)
        {
            var A = halfWidth / (1 - LeftTopValue);
            var B = -A;
            //左上
            v.y = halfHeight;
            v.x = A * value + B;
        }
        else if (value <= LeftTopValue && value > LeftBottomValue)
        {
            //左
            v.x = -halfWidth;
            if (value >= 0.75f)
            {
                var A = halfHeight / (LeftTopValue - 0.75f);
                var B = -0.75f * A;
                v.y = A * value + B;
            }
            else
            {
                var A = halfHeight / (0.75f - LeftBottomValue);
                var B = -0.75f * A;
                v.y = A * value + B;
            }
        }
        else if (value <= LeftBottomValue && value > RightBottomValue)
        {
            //下
            v.y = -halfHeight;
            if (value >= 0.5f)
            {
                var A = -halfWidth / (LeftBottomValue - 0.5f);
                var B = -0.5f * A;
                v.x = A * value + B;
            }
            else
            {
                var A = halfWidth / (RightBottomValue - 0.5f);
                var B = -0.5f * A;
                v.x = A * value + B;
            }
        }
        else if (value <= RightBottomValue && value > RightTopValue)
        {
            //右
            v.x = halfWidth;
            if (value >= 0.25f)
            {
                var A = -halfHeight / (RightBottomValue - 0.25f);
                var B = -0.25f * A;
                v.y = A * value + B;
            }
            else
            {
                var A = halfHeight / (RightTopValue - 0.25f);
                var B = -0.25f * A;
                v.y = A * value + B;
            }
        }
        else
        {
            //右上
            v.y = halfHeight;
            var A = halfWidth / (RightTopValue - 0f);
            var B = 0 * A;
            v.x = A * value + B;
        }

        return v;
    }
}
```

