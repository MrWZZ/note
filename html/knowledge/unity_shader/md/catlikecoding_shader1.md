### 图片采样

一个物理被渲染，基于2个组件。

+ Mesh Filter ：决定了物体的形状

+ Mesh Renderer ：决定了物体的渲染。该组件下的Materials属性，确定了渲染物体的shader脚本。




一个着色器脚本由`Shader`关键字定义，关键字后面的字符定义了着色器的名称，他能提供一个菜单，让你能够选择这个着色器。这个名称不需要和着色器脚本的文件名相同。

一个着色器中可以存在多个`SubShader `，你可以根据不同的平台或渲染等级来定义多个`SubShader `。

一个`SubShader`中可以存在多个`Pass`，如果存在多个`Pass`，Unity将不能对此着色器进行动态批处理。

在`Pass`中，我们需要编写具体的渲染代码，此代码需要被`CGPROGRAM`和`ENDCG`包裹。

着色器代码一般有两个流程：顶点流程和片元流程。

他们需要被下面这样定义，需要注意的是，在shaderlad中，每个变量的是有一个预定的名字的。

```c++
CGPROGRAM

#pragma vertex MyFragmentProgram
#pragma fragment MyFragmentProgram

ENDCG
```

片元方法接收的参数需要适配顶点方法的输出参数。

`Properties `可以定义一些参数，能显示在unity的面板中方便调整参数的值。一般脚本中使用的是带下划线开头的。在shaderlad中，在使用某个参数前，这个参数必须先被声明。

shaderlad中没有命名空间、类的定义，我们需要使用`#include`的方式引用别的文件，达到重用代码的效果。

“*UnityCG.cginc*”的包含结构如下：

![include-files](..\res\include-files.png)

“*UnityShaderVariables.cginc* ”定义渲染时所需要的必须数据。

“*HLSLSupport.cginc*”为不同平台的渲染提供了支持，使你能一份代码编译到不同的平台上。

“*UnityInstancing.cginc*”是一份优化文件，能减少渲染时的draw calls。

shaderlad是一个文本文件，没有类型的约束，为了让编译器能正确识别每一个参数的含义，需要使用**“语义”**来标识某个参数的意义。

| 语义        | 作用                                 | 类型   | 备注                |
| ----------- | ------------------------------------ | ------ | ------------------- |
| POSITION    | 顶点方法输入，代表顶点的模型空间坐标 | float4 | 齐次坐标：[x,y,z,1] |
| SV_POSITION | 顶点方法输出，代表顶点的裁剪空间坐标 | float4 |                     |
| SV_TARGET   | 片元方法输出，代表片元的最终输出颜色 | float4 | 一般使用fixed4      |

**渲染流程**

![interpolation](..\res\interpolation.png)

在顶点程序注入模型的数据，然后输出顶点阶段的处理后的数据，在经过一个插值过程，片元读取每一个插值的值，再输出最终结果。

**图片坐标**

![uv-rectangle](..\res\uv-rectangle.png)



使用一个图片需要的代码：

```c++
Properties {
	// 在属性中显示
	_MainTex ("MainTex", 2D) = "white" {}
}

Pass {
	
	CGPROGRAM
	// 声明图片
	sampler2D _MainTex;
	
	float4 MyFragmentProgram (Interpolators i) : SV_TARGET {
		// 对图片进行采样
		return tex2D(_MainTex, i.uv);
	}
	
	ENDCG
}

```

声明一个图片变量后，如果要使这个图片的偏移和缩放起作用，需要在声明一个float4类型的“变量名_ST”的值。并使用：

```c++
TRANSFORM_TEX(v.uv, _MainTex);
```

