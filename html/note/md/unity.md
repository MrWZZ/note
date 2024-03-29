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

## Awake 和 Start 区别

Awake在脚本被实例化的时候就会被调用（不管脚本是不是enable的），而且在脚本的生命周期中只会被调用一次。Awake是在所有对象实例化之后，所以我们可以放心大胆地去使用诸如GmeObject.Fine之类的方法来在Awake中给各个组件之间添加引用 关系。Awake会在所有对象的Start之前调用，但是注意不同对象之间的Awake顺序是不得而知的。

Start是在对象被第一次enable之后，在Update之前调用的，Start在脚本的生命周期中也只可能被调用一次。Start可能不会被立刻调用，比如我们之前没有让其enable，当脚本被enable时，Start才会被调用。

官方文档的建议是：尽量在Awake函数中进行初始化操作，除非有A依赖B，B必须在A实例化之前完成初始化，那么A在Start，B放在Awake中可以保证A在B之后才被初始化（不过个人感觉还是应该尽量都在Awake中进行对象间的引用，然后手动调用Init函数进行初始化，这样可以自己控制初始化的顺序）。

总结
最后总结一下Awake和Start的异同点：
相同点：
1. 两者都是对象初始化时调用的，都在Update之前，场景中的对象都生成后才会调用Awake，Awake调用完才会调用Start，所有Start调用完才会开始Update。
2. 两者在对象生命周期内都只会被调用一次，即初始化时被调用，之后即使是在被重新激活之后也不会再次被调用。

不同点：
1. Awake函数在对象初始化之后立刻就会调用，换句话说，对象初始化之后第一调用的函数就是 Awake；而Start是在对象初始化后，第一次Update之前调用的，
在Start中进行初始化不是很安全，因为它可能被其他自定义的函数抢先。
2. 如果对象（GameObject）本身没激活，那么 Awake，Start都不会调用。
