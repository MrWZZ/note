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