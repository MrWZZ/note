## Shader

如果是在编译器下，物体显示有阴影，模型显示正常，而打包出APK后就没有阴影了，这可能是打包设置的问题。

1. 打开 Edit -> Project Setting -> Graphics 设置面板。  

   看看当前的质量预设等级，其中：Very Low 和 Low 是不启动Shadows的。  

   这里需要手动设置Shadows为hardshadow或者softshadow，有些硬件不支持softshadow。  

   里面的其他Shadow设置可以根据自己项目需要进行调整。  

   有些低等级的渲染设置，会导致模型的大部分移出相机后，直接整个模型都不显示了，这里可以调高等级设置解决。

2. 打开 PlayerSettings 面板，里面的OtherSettings -> Auto Graphics API 选择自动或者选择3.0以上。



### 其他

如果使用scroll rect 组件，并使用 content size fitter 组件辅助时，在代码动态添加UI元素使 content size fitter 高度变化，并在同一刻调整 scroll rect 的 verticalNormalizedPosition 位置，在同一帧会计算失败。因为这个时候，UI布局还没有进行计算。需要等待下一帧后它们的布局才会正确赋值。并且要保证scroll rect 的 gameobject 是 激活状态的。

### 游戏管理

游戏中往往会运行多个物体，多个协程。对于和协程有关的，一定要持有所有东西的控制权。

协程可以分为：协程显示过程，协程最终结果，协程取消处理。写协程的时候，需要考虑此协程被取消后的处理逻辑。



### 标签

**[CreateAssetMenu(menuName = "MySubMenue/Create MyScriptableObject ")]**

在某个类上使用，可以在右键菜单的Create选项中增加一个项目，创建这个类的一个资源



**[Space(10)]**

在脚本的某个字段上添加，可以Inspector面板上显示的时候，在字段上方增加一个空白



**[Header( "Safe Frame" )]**

在脚本的某个字段上添加，可以Inspector面板上显示的时候，在上面增加一个文字说明



**[Range( 0f, 1f )]**

在脚本的某个字段上添加，使该字段可以通过一个滑动条的形式调整数值

### 空UI接受点击

```c#
public class EmptyUIRaycast : MaskableGraphic {

    protected EmptyUIRaycast()
    {
        useLegacyMeshGeneration = false;
    }

    protected override void OnPopulateMesh(VertexHelper toFill)
    {
        toFill.Clear();
    }
    
}
```

