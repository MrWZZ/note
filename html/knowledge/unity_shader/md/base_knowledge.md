### Unity Shader 基础知识

**个人理解：** Shader 实际上就是一套API，通过对顶点和片元的修改，达到改变画面效果的目的。实际上和html中对canvas的操作是一样的原理，只不过是shader里面需要涉及的元素更多，所以不用觉得shader很难，从战略上藐视它。

目前unity有两种着色器用的比较多：顶点片元着色器、表面着色器。

我主要使用第一种，这里对顶点片元着色器进行记录。

#### 基本语法

```c++
Shader "Shader/Base" {

	Properties
	{
		_MainTex("Texture", 2D) = "white" {}
	}

    SubShader {

        Tags { "LightMode"="ForwardBase" }

        Pass {

			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag

			sampler2D _MainTex;
            
			struct appdata
			{
				float4 vertex : POSITION;
			};

			struct v2f
			{
				float4 vertex : SV_POSITION;
				float2 uv : TEXCOORD0;
			};

			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				fixed3 col = tex2D(_MainTex, i.uv).rgb;
				return fixed4(col * shadow,1.0);
			}
			ENDCG
        }
    }
    
	Fallback "VertexLit"
}
```

### Gamma Space And Linear Space

```
unity_ColorSpaceDouble 使用unity的这个值可以保证颜色在这两种类型下有相同的效果
[NoScaleOffset] 属性添加这个标签，这禁止使用位移和缩放
```



在shader中，引用这个文件"UnityStandardBRDF.cginc"，可以使用一个点乘函数：DotClamped，他能保证得出的值在0-1之间。就不需要额外使用max()或者saturate()了，而且UnityStandardBRDF.cginc是包含UnityCG.cginc的，就不需要在重复引用了。



"UnityStandardUtils.cginc"中的一个方法：`EnergyConservationBetweenDiffuseAndSpecular` ，会返回一个纹素值，其值是经过漫反射和高光反射调整后的，保证高光反射能得到正确的效果，并且返回一个额外的数值，返回高光反射强度。

```c++
float oneMinusReflectivity;
albedo = EnergyConservationBetweenDiffuseAndSpecular(albedo, _SpecularTint.rgb, oneMinusReflectivity);
```



It would be much simpler if we could just toggle between metal and nonmetal. As metals don't have albedo, we could use that color data for their specular tint instead. And nonmetals don't have a colored specular anyway, so we don't need a separate specular tint at all.



```c++
// DiffuseAndSpecularFromMetallic 处理金属反射时的效果

float3 specularTint; 
float oneMinusReflectivity;
albedo = DiffuseAndSpecularFromMetallic(albedo, _Metallic, specularTint, oneMinusReflectivity);
```

[Gamma] 让一个值在 linear space 时，也使用 gamma 空间的变化



```c++
#include "UnityPBSLighting.cginc"
// 现在的渲染都采用了pbs渲染，而且也有一个很好的效果
```

