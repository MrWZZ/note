在Unity中打开Package Manger，下载Core RP Library包。

在"CustomRP"文件夹下新建一个"Shaders"文件夹存放我们编写的Shader。

在"Shaders"文件夹下新建"Unlit.shader"文件。

```c++
Shader "Custom RP/Unlit" {
	
	Properties {}
	
	SubShader {
		
		Pass {

            HLSLPROGRAM

			#pragma vertex UnlitPassVertex
			#pragma fragment UnlitPassFragment
			#include "./UnlitPass.hlsl"
            
			ENDHLSL
        }
	}
}
```

在"Shaders"文件夹下新建"UnlitPass.hlsl"文件。

```c++
#ifndef CUSTOM_UNLIT_PASS_INCLUDED
#define CUSTOM_UNLIT_PASS_INCLUDED

void UnlitPassVertex () {}

void UnlitPassFragment () {}

#endif
```

在"CustomRP"下新建文件夹"ShaderLibrary"，并在其文件夹下新建"UnityInput.hlsl"文件。

```c++

```

在"ShaderLibrary"文件夹下新建"Common.hlsl"文件。

```c++

```

在渲染的时候，我们可以用代码来设置每一个物体身上Shader的属性。

新建`PerObjectMaterialProperties`类，并挂载在我们需要实例化的物体上面。

```csharp
using UnityEngine;

[DisallowMultipleComponent]
public class PerObjectMaterialProperties : MonoBehaviour
{

    static int baseColorId = Shader.PropertyToID("_BaseColor");

    [SerializeField]
    Color baseColor = Color.white;
}
```



